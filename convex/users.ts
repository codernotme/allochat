import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getAuthUserId } from '@convex-dev/auth/server';

// ─── Queries ──────────────────────────────────────────────────────────────────

export const getCurrentUser = query({
  args: {},
  returns: v.union(v.any(), v.null()),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    return await ctx.db.get(userId);
  },
});

export const getUserProfile = query({
  args: { userId: v.id('users') },
  returns: v.union(v.any(), v.null()),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

export const getUserByUsername = query({
  args: { username: v.string() },
  returns: v.union(v.any(), v.null()),
  handler: async (ctx, args) => {
    return await ctx.db
      .query('users')
      .withIndex('byUsername', (q) => q.eq('username', args.username))
      .unique();
  },
});

export const searchUsers = query({
  args: { query: v.string() },
  returns: v.array(v.any()),
  handler: async (ctx, args) => {
    if (!args.query) return [];
    return await ctx.db
      .query('users')
      .withSearchIndex('searchUsers', (q) => q.search('username', args.query))
      .take(20);
  },
});

export const getFriends = query({
  args: {},
  returns: v.array(v.any()),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    const friendships = await ctx.db
      .query('friendships')
      .withIndex('byRequester', (q) =>
        q.eq('requesterId', userId).eq('status', 'accepted')
      )
      .collect();
    return friendships;
  },
});

export const getFriendRequests = query({
  args: {},
  returns: v.array(v.any()),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query('friendships')
      .withIndex('byTarget', (q) =>
        q.eq('targetId', userId).eq('status', 'pending')
      )
      .collect();
  },
});

// ─── Mutations ────────────────────────────────────────────────────────────────

export const updateProfile = mutation({
  args: {
    displayName: v.optional(v.string()),
    username: v.optional(v.string()),
    bio: v.optional(v.string()),
    pronouns: v.optional(v.string()),
    customStatus: v.optional(v.string()),
    statusEmoji: v.optional(v.string()),
    theme: v.optional(v.union(v.literal('light'), v.literal('dark'), v.literal('system'))),
    language: v.optional(v.string()),
    interests: v.optional(v.array(v.string())),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    await ctx.db.patch(userId, { ...args, updatedAt: Date.now() });
    return null;
  },
});

export const setPresenceStatus = mutation({
  args: {
    status: v.union(
      v.literal('online'), v.literal('away'),
      v.literal('busy'), v.literal('offline')
    ),
    customMessage: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    await ctx.db.patch(userId, {
      presenceStatus: args.status,
      lastSeenAt: Date.now(),
      updatedAt: Date.now(),
    });
    return null;
  },
});

export const sendFriendRequest = mutation({
  args: { targetId: v.id('users') },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');
    if (userId === args.targetId) throw new Error('Cannot friend yourself');

    const now = Date.now();
    await ctx.db.insert('friendships', {
      requesterId: userId,
      targetId: args.targetId,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    });
    return null;
  },
});

export const acceptFriendRequest = mutation({
  args: { requestId: v.id('friendships') },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    const req = await ctx.db.get(args.requestId);
    if (!req || req.targetId !== userId) throw new Error('Not authorized');

    await ctx.db.patch(args.requestId, {
      status: 'accepted',
      updatedAt: Date.now(),
    });
    return null;
  },
});

export const declineFriendRequest = mutation({
  args: { requestId: v.id('friendships') },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    const req = await ctx.db.get(args.requestId);
    if (!req || req.targetId !== userId) throw new Error('Not authorized');

    await ctx.db.delete(args.requestId);
    return null;
  },
});

export const blockUser = mutation({
  args: { targetId: v.id('users') },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    await ctx.db.insert('blockedUsers', {
      blockerId: userId,
      targetId: args.targetId,
      createdAt: Date.now(),
    });
    return null;
  },
});

export const checkUsernameAvailability = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('users')
      .withIndex('byUsername', (q) => q.eq('username', args.username.toLowerCase()))
      .unique();
    return !existing;
  },
});

export const generateUniqueUsername = mutation({
  args: { base: v.string() },
  handler: async (ctx, args) => {
    let base = args.base.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (base.length < 3) base = 'user' + base;
    if (base.length === 0) base = 'user';

    let isAvailable = false;
    let finalUsername = base;
    let counter = 1;

    while (!isAvailable) {
      const existing = await ctx.db
        .query('users')
        .withIndex('byUsername', (q) => q.eq('username', finalUsername))
        .unique();

      if (!existing) {
        isAvailable = true;
      } else {
        finalUsername = `${base}${counter}`;
        counter++;
      }
    }

    return finalUsername;
  },
});
