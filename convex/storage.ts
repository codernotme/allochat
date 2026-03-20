import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getAuthUserId } from '@convex-dev/auth/server';

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');
    
    // Optional: Check if user is banned or restricted
    const user = await ctx.db.get(userId);
    if (user?.isBanned) throw new Error('User is banned');

    return await ctx.storage.generateUploadUrl();
  },
});

export const getUrl = query({
  args: { storageId: v.id('_storage') },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

export const deleteFile = mutation({
  args: { storageId: v.id('_storage') },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    const user = await ctx.db.get(userId);
    const isAdmin = user?.role === 'admin' || user?.role === 'owner';

    // Only allow deletion if admin (or implement ownership check if files are tracked)
    if (!isAdmin) throw new Error('Not authorized');

    await ctx.storage.delete(args.storageId);
  },
});

export const getStorageUrl = mutation({
  args: { storageId: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    try {
      // Try to resolve as storage ID
      const url = await ctx.storage.getUrl(args.storageId as any);
      return url;
    } catch {
      // If it fails, return as-is (might be a direct URL)
      return args.storageId;
    }
  },
});
