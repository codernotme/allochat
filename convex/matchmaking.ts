import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getAuthUserId } from '@convex-dev/auth/server';

export const joinQueue = mutation({
  args: { type: v.union(v.literal('video'), v.literal('audio'), v.literal('text')) },
  returns: v.object({
    matched: v.boolean(),
    roomId: v.optional(v.id('rooms')),
  }),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    // 1. Remove user from any existing queue entry
    const existing = await ctx.db
      .query('matchmakingQueue')
      .withIndex('byUser', (q) => q.eq('userId', userId))
      .collect();
    for (const req of existing) {
      await ctx.db.delete(req._id);
    }

    // 2. Look for a match
    const waiting = await ctx.db
      .query('matchmakingQueue')
      .withIndex('byTypeAndTime', (q) => q.eq('type', args.type))
      .first();

    if (waiting && waiting.userId !== userId) {
      const peerId = waiting.userId;

      // Remove peer from queue
      await ctx.db.delete(waiting._id);

      // Create a private random room
      const now = Date.now();
      const roomId = await ctx.db.insert('rooms', {
        name: `Random ${args.type} Match`,
        slug: `random-${now}`,
        type: 'private',
        category: 'random',
        tags: ['random', args.type],
        allowCalls: args.type !== 'text',
        allowMedia: true,
        requireVerification: false,
        enabledAddons: [],
        ownerId: userId,
        isVerified: false,
        isFeatured: false,
        memberCount: 2,
        onlineCount: 2,
        totalMessages: 0,
        createdAt: now,
        updatedAt: now,
      });

      // Add both users
      await ctx.db.insert('roomMembers', {
        roomId,
        userId: userId,
        role: 'member',
        joinedAt: now,
        isBanned: false,
      });
      await ctx.db.insert('roomMembers', {
        roomId,
        userId: peerId,
        role: 'member',
        joinedAt: now,
        isBanned: false,
      });

      return { matched: true, roomId };
    } else {
      // 3. Join queue
      await ctx.db.insert('matchmakingQueue', {
        userId,
        type: args.type,
        joinedAt: Date.now(),
      });
      return { matched: false };
    }
  },
});

export const leaveQueue = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const existing = await ctx.db
      .query('matchmakingQueue')
      .withIndex('byUser', (q) => q.eq('userId', userId))
      .collect();
    
    for (const req of existing) {
      await ctx.db.delete(req._id);
    }
    return null;
  },
});

export const checkMatchStatus = query({
  args: {},
  returns: v.union(v.object({ matched: v.boolean(), roomId: v.optional(v.id('rooms')) }), v.null()),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    // Check if user is still in queue
    const inQueue = await ctx.db
      .query('matchmakingQueue')
      .withIndex('byUser', (q) => q.eq('userId', userId))
      .first();
    
    if (inQueue) {
      return { matched: false };
    }

    // User is NOT in queue. Did they just get matched?
    // Let's find the most recent 'random' category room they are a member of
    const memberships = await ctx.db
      .query('roomMembers')
      .withIndex('byUser', (q) => q.eq('userId', userId))
      .order('desc')
      .take(5);

    for (const m of memberships) {
      const room = await ctx.db.get(m.roomId);
      if (room && room.category === 'random') {
        // Found a recent random match room
        return { matched: true, roomId: room._id };
      }
    }

    return null; // Not in queue, no match found
  },
});
