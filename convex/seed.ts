import { v } from 'convex/values';
import { internalAction } from './_generated/server';
import { internal } from './_generated/api';

export const seedAll = internalAction({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    // Seed badges
    await ctx.runMutation(internal.badges.seedBadges, {});
    
    // Potential other seeds (rooms, etc.)
    return null;
  },
});
