import { v } from 'convex/values';
import { mutation, query, internalMutation, internalAction } from './_generated/server';
import { internal } from './_generated/api';
import { BADGE_DEFINITIONS } from '../lib/data/badge-definitions';

// ─── Mutations ────────────────────────────────────────────────────────────────

export const seedBadges = internalMutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    for (const badge of BADGE_DEFINITIONS) {
      const existing = await ctx.db
        .query('badges')
        .withIndex('bySlug', (q) => q.eq('slug', badge.slug))
        .unique();

      if (!existing) {
        await ctx.db.insert('badges', {
          ...badge,
          isSecret: badge.isSecret ?? false,
          isLimited: badge.isLimited ?? false,
        });
      } else {
        await ctx.db.patch(existing._id, {
          ...badge,
          isSecret: badge.isSecret ?? false,
          isLimited: badge.isLimited ?? false,
        });
      }
    }
    return null;
  },
});

export const checkAndAwardBadges = internalMutation({
  args: { userId: v.id('users'), type: v.string(), value: v.optional(v.number()) },
  returns: v.null(),
  handler: async (ctx, args) => {
    // Basic logic for awarding badges based on certain triggers
    // This would be expanded as more complex conditions are added
    
    if (args.type === 'first_message') {
      await ctx.runMutation(internal.gamification.awardBadge, {
        userId: args.userId,
        badgeSlug: 'first_steps',
      });
    }

    if (args.type === 'room_creator') {
      await ctx.runMutation(internal.gamification.awardBadge, {
        userId: args.userId,
        badgeSlug: 'architect',
      });
    }

    return null;
  },
});

// ─── Queries ──────────────────────────────────────────────────────────────────

export const getBadgeDefinitions = query({
  args: {},
  returns: v.array(v.any()),
  handler: async (ctx) => {
    return await ctx.db.query('badges').collect();
  },
});

export const getUserBadges = query({
  args: { userId: v.id('users') },
  returns: v.array(v.any()),
  handler: async (ctx, args) => {
    const userBadges = await ctx.db
      .query('userBadges')
      .withIndex('byUser', (q) => q.eq('userId', args.userId).eq('isUnlocked', true))
      .collect();

    const results = [];
    for (const ub of userBadges) {
      const badge = await ctx.db.get(ub.badgeId);
      if (badge) {
        results.push({
          ...badge,
          unlockedAt: ub.unlockedAt,
        });
      }
    }
    return results;
  },
});
