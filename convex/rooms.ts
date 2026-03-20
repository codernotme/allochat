import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { api } from './_generated/api';
import { getAuthUserId } from '@convex-dev/auth/server';
import { paginationOptsValidator } from 'convex/server';

// ─── Queries ──────────────────────────────────────────────────────────────────

export const listPublicRooms = query({
  args: {
    category: v.optional(v.string()),
    paginationOpts: v.optional(paginationOptsValidator),
  },
  returns: v.array(v.any()),
  handler: async (ctx, args) => {
    let q = ctx.db.query('rooms').withIndex('byCategory');
    const rooms = await q.collect();
    return rooms
      .filter((r) => r.type === 'public' || r.type === 'community')
      .filter((r) => !args.category || r.category === args.category)
      .sort((a, b) => b.onlineCount - a.onlineCount)
      .slice(0, 50);
  },
});

export const getFeaturedRooms = query({
  args: {},
  returns: v.array(v.any()),
  handler: async (ctx) => {
    return await ctx.db
      .query('rooms')
      .withIndex('byFeatured', (q) => q.eq('isFeatured', true))
      .order('desc')
      .take(6);
  },
});

export const getRoom = query({
  args: { roomId: v.id('rooms') },
  returns: v.union(v.any(), v.null()),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.roomId);
  },
});

export const getRoomMembers = query({
  args: { roomId: v.id('rooms') },
  returns: v.array(v.any()),
  handler: async (ctx, args) => {
    const memberships = await ctx.db
      .query('roomMembers')
      .withIndex('byRoom', (q) => q.eq('roomId', args.roomId))
      .collect();

    const membersWithUsers = await Promise.all(
      memberships.map(async (m) => {
        const user = await ctx.db.get(m.userId);
        return {
          ...m,
          user: user ? {
            name: user.displayName || user.username,
            username: user.username,
            image: user.avatar,
            level: user.level || 1,
            xp: user.xp || 0,
            isOnline: user.presenceStatus === 'online',
          } : null,
        };
      })
    );

    return membersWithUsers;
  },
});

export const listMyRooms = query({
  args: {},
  returns: v.array(v.any()),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const memberships = await ctx.db
      .query('roomMembers')
      .withIndex('byUser', (q) => q.eq('userId', userId))
      .collect();
    const rooms = await Promise.all(
      memberships.map((m) => ctx.db.get(m.roomId))
    );
    return rooms.filter(Boolean);
  },
});

export const searchRooms = query({
  args: { query: v.string(), category: v.optional(v.string()) },
  returns: v.array(v.any()),
  handler: async (ctx, args) => {
    if (!args.query) return [];
    const results = await ctx.db
      .query('rooms')
      .withSearchIndex('searchRooms', (q) => {
        const s = q.search('name', args.query);
        return args.category ? s.eq('category', args.category) : s;
      })
      .take(20);
    return results.filter((r) => r.type !== 'secret');
  },
});

// ─── Mutations ────────────────────────────────────────────────────────────────

export const createRoom = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    type: v.union(
      v.literal('public'), v.literal('private'),
      v.literal('secret'), v.literal('community')
    ),
    category: v.string(),
    allowCalls: v.optional(v.boolean()),
    allowMedia: v.optional(v.boolean()),
  },
  returns: v.id('rooms'),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    const slug = args.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const now = Date.now();
    const roomId = await ctx.db.insert('rooms', {
      name: args.name,
      slug,
      description: args.description,
      type: args.type,
      category: args.category,
      tags: [],
      allowCalls: args.allowCalls ?? true,
      allowMedia: args.allowMedia ?? true,
      requireVerification: false,
      enabledAddons: [],
      ownerId: userId,
      isVerified: false,
      isFeatured: false,
      memberCount: 1,
      onlineCount: 1,
      totalMessages: 0,
      createdAt: now,
      updatedAt: now,
    });

    // Add owner as member
    await ctx.db.insert('roomMembers', {
      roomId,
      userId,
      role: 'owner',
      joinedAt: now,
      isBanned: false,
    });

    // Award XP
    await ctx.runMutation((api as any).gamification.addXP, {
      userId,
      actionSlug: 'create_room',
    });

    // Check badges
    await ctx.runMutation((api as any).badges.checkAndAwardBadges, {
      userId,
      type: 'room_creator',
    });

    return roomId;
  },
});

export const joinRoom = mutation({
  args: { roomId: v.id('rooms'), password: v.optional(v.string()) },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error('Room not found');

    const user = await ctx.db.get(userId);
    const isStaff = user?.role && ['owner', 'admin', 'moderator', 'staff'].includes(user.role);

    if (room.password && !isStaff) {
      if (args.password !== room.password) {
        throw new Error('Incorrect room password');
      }
    }

    // Check if already a member
    const existing = await ctx.db
      .query('roomMembers')
      .withIndex('byRoomAndUser', (q) =>
        q.eq('roomId', args.roomId).eq('userId', userId)
      )
      .unique();
    if (existing) return null;

    const now = Date.now();
    await ctx.db.insert('roomMembers', {
      roomId: args.roomId,
      userId,
      role: 'member',
      joinedAt: now,
      isBanned: false,
    });

    // Update member count
    await ctx.db.patch(args.roomId, {
      memberCount: room.memberCount + 1,
      onlineCount: room.onlineCount + 1,
      updatedAt: now,
    });

    return null;
  },
});

export const leaveRoom = mutation({
  args: { roomId: v.id('rooms') },
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

    if (membership) {
      await ctx.db.delete(membership._id);
      const room = await ctx.db.get(args.roomId);
      if (room) {
        await ctx.db.patch(args.roomId, {
          memberCount: Math.max(0, room.memberCount - 1),
          onlineCount: Math.max(0, room.onlineCount - 1),
          updatedAt: Date.now(),
        });
      }
    }
    return null;
  },
});

export const updateRoom = mutation({
  args: {
    roomId: v.id('rooms'),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    topic: v.optional(v.string()),
    announcement: v.optional(v.string()),
    type: v.optional(v.union(
      v.literal('public'), v.literal('private'),
      v.literal('secret'), v.literal('community')
    )),
    allowCalls: v.optional(v.boolean()),
    allowMedia: v.optional(v.boolean()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error('Room not found');
    if (room.ownerId !== userId) throw new Error('Not authorized');

    const { roomId, ...updates } = args;
    await ctx.db.patch(args.roomId, { ...updates, updatedAt: Date.now() });
    return null;
  },
});
