import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { api } from './_generated/api';
import { getAuthUserId } from '@convex-dev/auth/server';
import { paginationOptsValidator } from 'convex/server';
import { applyContentFilters } from './moderation';

// ─── Queries ──────────────────────────────────────────────────────────────────

export const listMessages = query({
  args: {
    roomId: v.id('rooms'),
    paginationOpts: paginationOptsValidator,
  },
  returns: v.any(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    const page = await ctx.db
      .query('messages')
      .withIndex('byRoom', (q) => q.eq('roomId', args.roomId))
      .order('desc')
      .filter((q) => 
        q.and(
          q.eq(q.field('isDeleted'), false),
          q.or(
             q.eq(q.field('whisperTo'), undefined),
             userId ? q.eq(q.field('whisperTo'), userId) : false as any,
             userId ? q.eq(q.field('senderId'), userId) : false as any
          )
        )
      )
      .paginate(args.paginationOpts);

    const resultsWithUsers = await Promise.all(
      page.page.map(async (msg) => {
        const user = await ctx.db.get(msg.senderId);
        return {
          ...msg,
          sender: user ? {
            name: user.displayName || user.username,
            image: user.avatar,
            level: user.level || 1,
          } : null,
        };
      })
    );

    return { ...page, page: resultsWithUsers };
  },
});

export const getPinnedMessages = query({
  args: { roomId: v.id('rooms') },
  returns: v.array(v.any()),
  handler: async (ctx, args) => {
    return await ctx.db
      .query('messages')
      .withIndex('byPinned', (q) =>
        q.eq('roomId', args.roomId).eq('isPinned', true)
      )
      .order('desc')
      .take(5);
  },
});

export const searchMessages = query({
  args: { query: v.string(), roomId: v.optional(v.id('rooms')) },
  returns: v.array(v.any()),
  handler: async (ctx, args) => {
    if (!args.query) return [];
    return await ctx.db
      .query('messages')
      .withSearchIndex('searchMessages', (q) => {
        const s = q.search('content', args.query);
        return args.roomId ? s.eq('roomId', args.roomId) : s;
      })
      .take(20);
  },
});

export const getConversations = query({
  args: {},
  returns: v.array(v.any()),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const all = await ctx.db.query('conversations').collect();
    return all.filter((c) => c.participantIds.includes(userId));
  },
});

export const getDirectMessages = query({
  args: {
    conversationId: v.id('conversations'),
    paginationOpts: paginationOptsValidator,
  },
  returns: v.any(),
  handler: async (ctx, args) => {
    return await ctx.db
      .query('directMessages')
      .withIndex('byConversation', (q) =>
        q.eq('conversationId', args.conversationId)
      )
      .order('desc')
      .paginate(args.paginationOpts);
  },
});

// ─── Mutations ────────────────────────────────────────────────────────────────

export const sendMessage = mutation({
  args: {
    roomId: v.id('rooms'),
    content: v.string(),
    type: v.optional(
      v.union(
        v.literal('text'), v.literal('media'), v.literal('voice'), v.literal('sketch'), v.literal('poll')
      )
    ),
    replyTo: v.optional(v.id('messages')),
    whisperTo: v.optional(v.id('users')),
  },
  returns: v.id('messages'),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    // Check room membership
    const membership = await ctx.db
      .query('roomMembers')
      .withIndex('byRoomAndUser', (q) =>
        q.eq('roomId', args.roomId).eq('userId', userId)
      )
      .unique();
    if (!membership) throw new Error('Not a member of this room');
    if (membership.mutedUntil && membership.mutedUntil > Date.now()) {
      throw new Error('You are muted in this room');
    }

    // Flood control: max 6 messages in 5 seconds
    const recent = await ctx.db
      .query('messages')
      .withIndex('byRoom', (q) => q.eq('roomId', args.roomId))
      .order('desc')
      .take(10);
    const window = Date.now() - 5000;
    const recentFromUser = recent.filter(
      (m) => m.senderId === userId && m.createdAt > window
    );
    if (recentFromUser.length >= 6) throw new Error('FLOOD_LIMIT_REACHED');

    const now = Date.now();
    let actualContent = args.content.trim();
    let whisperToId = args.whisperTo;

    const whisperMatch = actualContent.match(/^\/w\s+@([a-zA-Z0-9_]+)\s+(.+)/i);
    if (whisperMatch) {
      const targetUsername = whisperMatch[1];
      const targetUser = await ctx.db
        .query('users')
        .withIndex('byUsername', (q) => q.eq('username', targetUsername))
        .unique();
      
      if (!targetUser) {
        throw new Error(`User @${targetUsername} not found for whisper`);
      }
      whisperToId = targetUser._id;
      actualContent = whisperMatch[2];
    }

    const filteredContent = await applyContentFilters(ctx, actualContent);

    const messageId = await ctx.db.insert('messages', {
      roomId: args.roomId,
      senderId: userId,
      content: filteredContent,
      type: args.type ?? 'text',
      replyTo: args.replyTo,
      whisperTo: whisperToId,
      isPinned: false,
      isDeleted: false,
      reactions: [],
      createdAt: now,
    });

    // 4. Update room stats
    const room = await ctx.db.get(args.roomId);
    if (!room) {
      throw new Error('Room not found');
    }
    
    await ctx.db.patch(args.roomId, {
      totalMessages: (room.totalMessages || 0) + 1,
      updatedAt: now,
    });

    // 4.5 Check Trivia
    if ((args.type === 'text' || args.type === undefined) && room.activeTrivia) {
      const isCorrect = room.activeTrivia.answers.some((a: string) =>
        actualContent.toLowerCase().includes(a.toLowerCase())
      );
      if (isCorrect) {
        await ctx.runMutation((api as any).trivia.awardTriviaWin, {
          roomId: args.roomId,
          winnerId: userId,
          answer: actualContent,
        });
      }
    }

    // 4.6 Check RPS Minigames
    if (args.type === 'text' || args.type === undefined) {
      const rpsMatch = actualContent.match(/^\/rps\s+@([a-zA-Z0-9_]+)\s+(rock|paper|scissors)/i);
      if (rpsMatch) {
        try {
          await ctx.runMutation((api as any).minigames.playRPS, {
            roomId: args.roomId,
            senderId: userId,
            targetUsername: rpsMatch[1],
            move: rpsMatch[2],
          });
        } catch (e) {
          // Ignore invalid targets silently or allow the user message to just be text
        }
      }
    }

    // 5. Award XP
    await ctx.runMutation((api as any).gamification.addXP, {
      userId,
      actionSlug: 'send_message',
    });

    // 6. Check badges
    await ctx.runMutation((api as any).badges.checkAndAwardBadges, {
      userId,
      type: 'first_message',
    });

    return messageId;
  },
});

export const editMessage = mutation({
  args: { messageId: v.id('messages'), newContent: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    const message = await ctx.db.get(args.messageId);
    if (!message) throw new Error('Message not found');
    if (message.senderId !== userId) throw new Error('Cannot edit others\' messages');
    if (message.isDeleted) throw new Error('Message is deleted');

    const now = Date.now();
    const history = message.editHistory ?? [];
    await ctx.db.patch(args.messageId, {
      content: args.newContent,
      editedAt: now,
      editHistory: [...history, { content: message.content, editedAt: now }],
    });
    return null;
  },
});

export const deleteMessage = mutation({
  args: { messageId: v.id('messages') },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    const message = await ctx.db.get(args.messageId);
    if (!message) throw new Error('Message not found');

    // Allow sender or room moderator/admin/owner to delete
    if (message.senderId !== userId) {
      const membership = await ctx.db
        .query('roomMembers')
        .withIndex('byRoomAndUser', (q) =>
          q.eq('roomId', message.roomId).eq('userId', userId)
        )
        .unique();
      if (!membership || !['owner', 'admin', 'moderator'].includes(membership.role)) {
        throw new Error('Not authorized');
      }
    }

    await ctx.db.patch(args.messageId, {
      isDeleted: true,
      deletedAt: Date.now(),
      content: '[Message deleted]',
    });
    return null;
  },
});

export const addReaction = mutation({
  args: { messageId: v.id('messages'), emoji: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    const message = await ctx.db.get(args.messageId);
    if (!message || message.isDeleted) throw new Error('Message not found');

    const reactions = [...message.reactions];
    const existing = reactions.find((r) => r.emoji === args.emoji);
    if (existing) {
      if (!existing.userIds.includes(userId)) {
        existing.userIds.push(userId);
      }
    } else {
      reactions.push({ emoji: args.emoji, userIds: [userId] });
    }
    await ctx.db.patch(args.messageId, { reactions });
    return null;
  },
});

export const removeReaction = mutation({
  args: { messageId: v.id('messages'), emoji: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    const message = await ctx.db.get(args.messageId);
    if (!message) throw new Error('Message not found');

    const reactions = message.reactions
      .map((r) => ({
        emoji: r.emoji,
        userIds: r.userIds.filter((id) => id !== userId),
      }))
      .filter((r) => r.userIds.length > 0);

    await ctx.db.patch(args.messageId, { reactions });
    return null;
  },
});

export const pinMessage = mutation({
  args: { messageId: v.id('messages'), roomId: v.id('rooms') },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    const membership = await ctx.db
      .query('roomMembers')
      .withIndex('byRoomAndUser', (q) =>
        q.eq('roomId', args.roomId).eq('userId', userId)
      )
      .unique();
    if (!membership || !['owner', 'admin', 'moderator'].includes(membership.role)) {
      throw new Error('Not authorized to pin messages');
    }

    await ctx.db.patch(args.messageId, { isPinned: true });
    return null;
  },
});

export const unpinMessage = mutation({
  args: { messageId: v.id('messages') },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');
    await ctx.db.patch(args.messageId, { isPinned: false });
    return null;
  },
});

export const sendDirectMessage = mutation({
  args: { recipientId: v.id('users'), content: v.string() },
  returns: v.id('directMessages'),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');
    if (userId === args.recipientId) throw new Error('Cannot DM yourself');

    // Find or create conversation
    const all = await ctx.db.query('conversations').collect();
    const participantIds: string[] = [userId, args.recipientId].sort();
    let conversation = all.find(
      (c) =>
        c.participantIds.length === 2 &&
        c.participantIds.every((id: string) => participantIds.includes(id))
    );

    const now = Date.now();
    if (!conversation) {
      const convId = await ctx.db.insert('conversations', {
        participantIds: participantIds as any,
        lastMessageAt: now,
        lastMessagePreview: args.content.slice(0, 100),
      });
      const dmId = await ctx.db.insert('directMessages', {
        conversationId: convId,
        senderId: userId,
        content: args.content,
        isDeleted: false,
        createdAt: now,
      });
      // 4. Award XP
      await ctx.runMutation((api as any).gamification.addXP, {
        userId,
        actionSlug: 'send_message',
      });
      // 5. Check badges
      await ctx.runMutation((api as any).badges.checkAndAwardBadges, {
        userId,
        type: 'first_message',
      });
      return dmId;
    }

    // 3. Update conversation
    await ctx.db.patch(conversation._id, {
      lastMessageAt: now,
      lastMessagePreview: args.content.slice(0, 100),
    });

    const filteredContent = await applyContentFilters(ctx, args.content);

    const dmId = await ctx.db.insert('directMessages', {
      conversationId: conversation._id,
      senderId: userId,
      content: filteredContent,
      isDeleted: false,
      createdAt: now,
    });
    return dmId;
  },
});
