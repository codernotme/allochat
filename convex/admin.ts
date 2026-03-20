import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getAuthUserId } from '@convex-dev/auth/server';

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function checkAdmin(ctx: any) {
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error('Not authenticated');
  const user = await ctx.db.get(userId);
  if (user?.role !== 'admin' && user?.role !== 'owner') {
    throw new Error('Not authorized: Admin only');
  }
  return user;
}

// ─── Site Settings ────────────────────────────────────────────────────────────

export const getSiteSettings = query({
  args: {},
  handler: async (ctx) => {
    const settings = await ctx.db.query('siteSettings').first();
    if (!settings) {
      // Default settings
      return {
        maxFileUploadSize: 5 * 1024 * 1024, // 5MB default
        allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        maintenanceMode: false,
        registrationEnabled: true,
      };
    }
    return settings;
  },
});

export const updateSiteSettings = mutation({
  args: {
    maxFileUploadSize: v.optional(v.number()),
    allowedFileTypes: v.optional(v.array(v.string())),
    maintenanceMode: v.optional(v.boolean()),
    registrationEnabled: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const admin = await checkAdmin(ctx);
    const settings = await ctx.db.query('siteSettings').first();

    if (settings) {
      await ctx.db.patch(settings._id, {
        ...args,
        updatedAt: Date.now(),
        updatedBy: admin._id,
      });
    } else {
      await ctx.db.insert('siteSettings', {
        maxFileUploadSize: args.maxFileUploadSize ?? 5 * 1024 * 1024,
        allowedFileTypes: args.allowedFileTypes ?? ['image/jpeg', 'image/png', 'image/gif'],
        maintenanceMode: args.maintenanceMode ?? false,
        registrationEnabled: args.registrationEnabled ?? true,
        updatedAt: Date.now(),
        updatedBy: admin._id,
      });
    }
  },
});

// ─── User Management ──────────────────────────────────────────────────────────

export const getAllUsers = query({
  args: { 
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await checkAdmin(ctx);
    return await ctx.db.query('users').order('desc').take(args.limit ?? 50);
  },
});

export const updateUserRole = mutation({
  args: { userId: v.id('users'), role: v.string() },
  handler: async (ctx, args) => {
    await checkAdmin(ctx);
    await ctx.db.patch(args.userId, { 
      role: args.role as any,
      updatedAt: Date.now() 
    });
  },
});

export const setUserBanStatus = mutation({
  args: { userId: v.id('users'), isBanned: v.boolean(), reason: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const admin = await checkAdmin(ctx);
    await ctx.db.patch(args.userId, { 
        isBanned: args.isBanned,
        updatedAt: Date.now() 
    });
    
    if (args.isBanned) {
      await ctx.db.insert('moderationActions', {
        type: 'ban',
        targetId: args.userId,
        moderatorId: admin._id,
        reason: args.reason || 'No reason provided',
        isActive: true,
        createdAt: Date.now(),
      });
    }
  },
});

// ─── Room Management ──────────────────────────────────────────────────────────

export const getAllRooms = query({
  args: {},
  handler: async (ctx) => {
    await checkAdmin(ctx);
    return await ctx.db.query('rooms').order('desc').collect();
  },
});

export const setRoomVerification = mutation({
  args: { roomId: v.id('rooms'), isVerified: v.boolean() },
  handler: async (ctx, args) => {
    await checkAdmin(ctx);
    await ctx.db.patch(args.roomId, { isVerified: args.isVerified });
  },
});

export const deleteRoom = mutation({
  args: { roomId: v.id('rooms') },
  handler: async (ctx, args) => {
    await checkAdmin(ctx);
    // In a real app, we'd also delete members and messages
    await ctx.db.delete(args.roomId);
  },
});

// ─── Stats ────────────────────────────────────────────────────────────────────

export const getSiteStats = query({
  args: {},
  handler: async (ctx) => {
    await checkAdmin(ctx);
    const users = await ctx.db.query('users').collect();
    const rooms = await ctx.db.query('rooms').collect();
    const messages = await ctx.db.query('messages').collect();
    return {
      totalUsers: users.length,
      totalRooms: rooms.length,
      totalMessages: messages.length,
      onlineUsers: users.filter(u => u.presenceStatus === 'online').length,
    };
  },
});
// ─── User Management (Expanded) ───────────────────────────────────────────────

export const muteUser = mutation({
  args: { userId: v.id('users'), durationMinutes: v.number(), reason: v.string() },
  handler: async (ctx, args) => {
    const admin = await checkAdmin(ctx);
    const muteExpiry = Date.now() + args.durationMinutes * 60 * 1000;
    
    await ctx.db.patch(args.userId, { 
      isMuted: true,
      muteExpiry: muteExpiry,
    });

    await ctx.db.insert('moderationActions', {
      type: 'mute',
      targetId: args.userId,
      moderatorId: admin._id,
      reason: args.reason,
      duration: args.durationMinutes,
      expiresAt: muteExpiry,
      isActive: true,
      createdAt: Date.now(),
    });

    await ctx.db.insert('auditLogs', {
      actorId: admin._id,
      action: 'mute_user',
      targetType: 'user',
      targetId: args.userId,
      details: { duration: args.durationMinutes, reason: args.reason },
      createdAt: Date.now(),
    });
  },
});

// ─── Reports ──────────────────────────────────────────────────────────────────

export const getReports = query({
  args: { status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await checkAdmin(ctx);
    if (args.status) {
      return await ctx.db
        .query('reports')
        .withIndex('byStatus', (q: any) => q.eq('status', args.status))
        .order('desc')
        .collect();
    }
    return await ctx.db.query('reports').order('desc').collect();
  },
});

export const resolveReport = mutation({
  args: { reportId: v.id('reports'), status: v.union(v.literal('resolved'), v.literal('dismissed')) },
  handler: async (ctx, args) => {
    const admin = await checkAdmin(ctx);
    await ctx.db.patch(args.reportId, { 
      status: args.status,
      resolvedAt: Date.now(),
    });

    await ctx.db.insert('auditLogs', {
      actorId: admin._id,
      action: 'resolve_report',
      targetType: 'report',
      targetId: args.reportId,
      details: { status: args.status },
      createdAt: Date.now(),
    });
  },
});

// ─── Content Filters ──────────────────────────────────────────────────────────

export const getFilters = query({
  args: {},
  handler: async (ctx) => {
    await checkAdmin(ctx);
    return await ctx.db.query('contentFilters').order('desc').collect();
  },
});

export const addFilter = mutation({
  args: { pattern: v.string(), type: v.string(), action: v.string(), severity: v.string() },
  handler: async (ctx, args) => {
    const admin = await checkAdmin(ctx);
    await ctx.db.insert('contentFilters', {
      ...args,
      createdBy: admin._id,
      createdAt: Date.now(),
    });
  },
});

export const deleteFilter = mutation({
  args: { filterId: v.id('contentFilters') },
  handler: async (ctx, args) => {
    await checkAdmin(ctx);
    await ctx.db.delete(args.filterId);
  },
});

// ─── Gifts ────────────────────────────────────────────────────────────────────

export const getGifts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('gifts').collect();
  },
});

export const createGift = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    icon: v.string(),
    coinPrice: v.number(),
    category: v.string(),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    await checkAdmin(ctx);
    await ctx.db.insert('gifts', {
      ...args,
      animationType: 'default',
      isLimited: false,
    });
  },
});

export const updateGift = mutation({
  args: { id: v.id('gifts'), isActive: v.boolean(), coinPrice: v.optional(v.number()) },
  handler: async (ctx, args) => {
    await checkAdmin(ctx);
    const { id, ...rest } = args;
    await ctx.db.patch(id, rest);
  },
});

// ─── Economy ──────────────────────────────────────────────────────────────────

export const adjustWallet = mutation({
  args: { userId: v.id('users'), amount: v.number(), description: v.string() },
  handler: async (ctx, args) => {
    const admin = await checkAdmin(ctx);
    const wallet = await ctx.db.query('wallets').withIndex('byUser', q => q.eq('userId', args.userId)).unique();
    
    if (wallet) {
      await ctx.db.patch(wallet._id, {
        alloCoins: wallet.alloCoins + args.amount,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert('wallets', {
        userId: args.userId,
        alloCoins: Math.max(0, args.amount),
        starDust: 0,
        frozenBalance: 0,
        currency: 'USD',
        updatedAt: Date.now(),
      });
    }

    await ctx.db.insert('walletTransactions', {
      userId: args.userId,
      type: 'admin_adjustment',
      alloCoins: args.amount,
      description: args.description,
      status: 'completed',
      createdAt: Date.now(),
    });

    await ctx.db.insert('auditLogs', {
      actorId: admin._id,
      action: 'wallet_adjustment',
      targetType: 'user',
      targetId: args.userId,
      details: { amount: args.amount, description: args.description },
      createdAt: Date.now(),
    });
  },
});

// ─── Badges ───────────────────────────────────────────────────────────────────

export const getBadges = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('badges').collect();
  },
});

export const createBadge = mutation({
  args: {
    slug: v.string(),
    name: v.string(),
    description: v.string(),
    icon: v.string(),
    rarity: v.union(
      v.literal('common'), v.literal('uncommon'), v.literal('rare'),
      v.literal('epic'), v.literal('legendary'), v.literal('limited')
    ),
    category: v.string(),
    condition: v.string(),
    xpReward: v.number(),
  },
  handler: async (ctx, args) => {
    await checkAdmin(ctx);
    await ctx.db.insert('badges', {
      ...args,
      isSecret: false,
      isLimited: args.rarity === 'limited',
    });
  },
});

// ─── Audit Logs ───────────────────────────────────────────────────────────────

export const getAuditLogs = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    await checkAdmin(ctx);
    return await ctx.db.query('auditLogs').order('desc').take(args.limit ?? 100);
  },
});
