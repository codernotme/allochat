import { v } from 'convex/values';
import { mutation, query, internalMutation } from './_generated/server';
import { api } from './_generated/api';
import { XP_ACTIONS, getLevelFromXP } from '../lib/data/xp-actions';

// ─── Mutations ────────────────────────────────────────────────────────────────

export const addXP = internalMutation({
  args: { 
    userId: v.id('users'), 
    actionSlug: v.string(),
    metadata: v.optional(v.any())
  },
  returns: v.object({
    xpGained: v.number(),
    leveledUp: v.boolean(),
    newLevel: v.number(),
  }),
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      return { xpGained: 0, leveledUp: false, newLevel: 1 };
    }

    const action = XP_ACTIONS.find((a) => a.key === args.actionSlug);
    if (!action) {
      return { xpGained: 0, leveledUp: false, newLevel: user.level || 1 };
    }

    // Check caps (simplified for now)
    // In a real app, we'd check against a 'dailyXPTasks' table
    
    const newXP = (user.xp || 0) + action.amount;
    const { level: newLevel } = getLevelFromXP(newXP);
    const leveledUp = newLevel > (user.level || 1);

    await ctx.db.patch(args.userId, {
      xp: newXP,
      level: newLevel,
      updatedAt: Date.now(),
    });

    if (leveledUp) {
      await ctx.db.insert('notifications', {
        userId: args.userId,
        type: 'level_up',
        title: 'Level Up!',
        body: `Congratulations! You've reached Level ${newLevel}!`,
        icon: '🎉',
        isRead: false,
        createdAt: Date.now(),
      });
      
      // Potential badge check here
    }

    return { xpGained: action.amount, leveledUp, newLevel };
  },
});

export const awardBadge = internalMutation({
  args: { userId: v.id('users'), badgeSlug: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const badge = await ctx.db
      .query('badges')
      .withIndex('bySlug', (q) => q.eq('slug', args.badgeSlug))
      .unique();
    if (!badge) return;

    const existingCandidates = await ctx.db
      .query('userBadges')
      .withIndex('byUser', (q) => q.eq('userId', args.userId).eq('isUnlocked', true))
      .collect();
    const existing = existingCandidates.find((ub) => ub.badgeId === badge._id);
      
    if (existing) return null;

    await ctx.db.insert('userBadges', {
      userId: args.userId,
      badgeId: badge._id,
      isUnlocked: true,
      unlockedAt: Date.now(),
    });

    await ctx.db.insert('notifications', {
      userId: args.userId,
      type: 'badge_unlocked',
      title: 'New Badge Unlocked!',
      body: `You've earned the "${badge.name}" badge!`,
      icon: badge.icon,
      isRead: false,
      createdAt: Date.now(),
    });

    return null;
  },
});

// ─── Queries ──────────────────────────────────────────────────────────────────

export const getLeaderboard = query({
  args: { limit: v.optional(v.number()) },
  returns: v.array(v.any()),
  handler: async (ctx, args) => {
    return await ctx.db
      .query('users')
      .withIndex('byUsername') // Temporarily using byUsername until I have a clear XP index or filter
      .order('desc')
      .take(args.limit || 10);
  },
});
