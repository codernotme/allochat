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
