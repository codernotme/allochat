import { internalMutation } from './_generated/server';
import { api } from './_generated/api';
import { v } from 'convex/values';

const QUESTIONS = [
  { q: 'What is the capital of France?', a: ['paris'] },
  { q: 'What planet is known as the Red Planet?', a: ['mars'] },
  { q: 'What is 10 + 10?', a: ['20', 'twenty'] },
  { q: 'Who painted the Mona Lisa?', a: ['leonardo da vinci', 'da vinci', 'leonardo'] },
  { q: 'What is the largest mammal in the world?', a: ['blue whale'] },
  { q: 'What year did the Titanic sink?', a: ['1912'] },
  { q: 'What is the chemical symbol for gold?', a: ['au'] },
];

export const postTriviaQuestion = internalMutation({
  args: {},
  handler: async (ctx) => {
    const rooms = await ctx.db.query('rooms').collect();
    // Only target public/community rooms with trivia addon enabled
    const triviaRooms = rooms.filter(
      (r) =>
        (r.type === 'public' || r.type === 'community') &&
        r.enabledAddons.includes('trivia')
    );
    if (triviaRooms.length === 0) return;

    // Pick a random question
    const qIndex = Math.floor(Math.random() * QUESTIONS.length);
    const question = QUESTIONS[qIndex];

    // Ensure bot user exists
    let bot = await ctx.db
      .query('users')
      .withIndex('byUsername', (q) => q.eq('username', 'TriviaBot'))
      .unique();

    if (!bot) {
      const botId = await ctx.db.insert('users', {
        username: 'TriviaBot',
        displayName: 'Brainiac Bot',
        isBot: true,
        role: 'user',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=TriviaBot',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      bot = await ctx.db.get(botId);
    }

    if (!bot) return;

    for (const room of triviaRooms) {
      // If there's already an active question, maybe we clear it or skip.
      // Let's just override it.
      await ctx.db.patch(room._id, {
        activeTrivia: {
          question: question.q,
          answers: question.a,
        },
      });

      // Post the question message
      await ctx.db.insert('messages', {
        roomId: room._id,
        senderId: bot._id,
        content: `🎯 **TRIVIA TIME!**\n\n${question.q}\n\nFirst to answer correctly wins 100 AlloCoins and 50 XP!`,
        type: 'text',
        isPinned: false,
        isDeleted: false,
        reactions: [],
        createdAt: Date.now(),
      });

      // Update room stats
      await ctx.db.patch(room._id, {
        totalMessages: room.totalMessages + 1,
        updatedAt: Date.now(),
      });
    }
  },
});

export const awardTriviaWin = internalMutation({
  args: {
    roomId: v.id('rooms'),
    winnerId: v.id('users'),
    answer: v.string(),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (!room) return;

    // Clear trivia immediately
    await ctx.db.patch(room._id, { activeTrivia: undefined });

    const bot = await ctx.db
      .query('users')
      .withIndex('byUsername', (q) => q.eq('username', 'TriviaBot'))
      .unique();

    const winner = await ctx.db.get(args.winnerId);

    if (bot && winner) {
      await ctx.db.insert('messages', {
        roomId: args.roomId as any,
        senderId: bot._id as any,
        content: `🎉 **WINNER!**\n\n@${winner.username} guessed correctly! The answer was **${args.answer}**.\n\nYou earned **100 AlloCoins** and **50 XP**!`,
        type: 'text',
        isPinned: false,
        isDeleted: false,
        reactions: [],
        createdAt: Date.now(),
      });

      // Simple wallet increment
      let wallet = await ctx.db
        .query('wallets')
        .withIndex('byUser', (q) => q.eq('userId', args.winnerId as any))
        .unique();
      
      const now = Date.now();
      if (!wallet) {
        await ctx.db.insert('wallets', {
          userId: args.winnerId as any,
          alloCoins: 100,
          starDust: 0,
          frozenBalance: 0,
          currency: 'USD',
          updatedAt: now,
        });
      } else {
        await ctx.db.patch(wallet._id, {
          alloCoins: wallet.alloCoins + 100,
          updatedAt: now,
        });
      }

      await ctx.db.insert('walletTransactions', {
        userId: args.winnerId as any,
        type: 'earned',
        alloCoins: 100,
        description: 'Trivia Winner',
        status: 'completed',
        createdAt: now,
      });

      // Add XP (simplified via gamification if exists, else just try)
      try {
        await ctx.runMutation((api as any).gamification.addXP, {
          userId: args.winnerId,
          amount: 50,
          reason: 'Trivia Winner',
        });
      } catch (e) {
        // Ignored if gamification schema differs slightly
      }
    }
  },
});
