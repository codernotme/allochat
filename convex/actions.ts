"use node";

import { v } from 'convex/values';
import { action, internalAction } from './_generated/server';
import { api, internal } from './_generated/api';
import { getAuthUserId } from '@convex-dev/auth/server';
import { AccessToken } from 'livekit-server-sdk';

export const generateToken = action({
  args: {
    roomId: v.id('rooms'),
    roomName: v.string(),
  },
  returns: v.string(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    const user: any = await ctx.runQuery(api.users.getUserProfile, { userId });
    if (!user) throw new Error('User not found');

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

    if (!apiKey || !apiSecret || !wsUrl) {
      throw new Error('LiveKit environment variables not configured');
    }

    const at: AccessToken = new AccessToken(apiKey, apiSecret, {
      identity: userId,
      name: user.displayName || user.username || 'User',
    });

    at.addGrant({
      roomJoin: true,
      room: args.roomId,
      canPublish: true,
      canSubscribe: true,
    });

    return await at.toJwt();
  },
});

export const seedAll = internalAction({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    // Seed badges
    await ctx.runMutation(internal.badges.seedBadges, {});
    return null;
  },
});
