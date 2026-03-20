import { internalMutation, mutation } from './_generated/server';
import { v } from 'convex/values';

const VALID_MOVES = ['rock', 'paper', 'scissors'];

export const playRPS = internalMutation({
  args: {
    roomId: v.id('rooms'),
    senderId: v.id('users'),
    targetUsername: v.string(),
    move: v.string(),
  },
  handler: async (ctx, args) => {
    const move = args.move.toLowerCase();
    if (!VALID_MOVES.includes(move)) {
      throw new Error(`Invalid move. Use rock, paper, or scissors.`);
    }

    const targetUser = await ctx.db
      .query('users')
      .withIndex('byUsername', (q) => q.eq('username', args.targetUsername))
      .unique();

    if (!targetUser) {
      throw new Error(`Target user @${args.targetUsername} not found`);
    }

    if (targetUser._id === args.senderId) {
      throw new Error(`You cannot play RPS against yourself.`);
    }

    // See if there's a pending game where sender is player 2
    const pendingGame = await ctx.db
      .query('minigames')
      .withIndex('byRoomAndStatus', (q) => q.eq('roomId', args.roomId).eq('status', 'pending'))
      .filter((q) =>
        q.and(
          q.eq(q.field('gameType'), 'rps'),
          q.eq(q.field('player1Id'), targetUser._id),
          q.eq(q.field('player2Id'), args.senderId)
        )
      )
      .first();

    const sender = await ctx.db.get(args.senderId);
    let systemMessage = '';

    if (pendingGame) {
      // Resolve the game
      const p1Move = pendingGame.state.p1Move;
      const p2Move = move;

      let winnerId = undefined;
      let resultText = '';

      if (p1Move === p2Move) {
        resultText = 'It is a **TIE**! 🤝';
      } else if (
        (p1Move === 'rock' && p2Move === 'scissors') ||
        (p1Move === 'paper' && p2Move === 'rock') ||
        (p1Move === 'scissors' && p2Move === 'paper')
      ) {
        winnerId = targetUser._id;
        resultText = `@${targetUser.username} wins! 🏆`;
      } else {
        winnerId = args.senderId;
        resultText = `@${sender?.username} wins! 🏆`;
      }

      await ctx.db.patch(pendingGame._id, {
        state: { p1Move, p2Move },
        status: 'completed',
        winnerId,
      });

      systemMessage = `🎮 **Rock Paper Scissors**\n\n@${targetUser.username} chose **${p1Move}**\n@${sender?.username} chose **${p2Move}**\n\n${resultText}`;

      // Update leaderboards
      if (winnerId) {
        // Increment winner stats
        let lb = await ctx.db
          .query('leaderboards')
          .withIndex('byTypeAndPeriod', (q) => q.eq('type', 'rps_wins').eq('period', 'all_time'))
          .filter((q) => q.eq(q.field('userId'), winnerId))
          .first();

        if (lb) {
          await ctx.db.patch(lb._id, { score: lb.score + 1, updatedAt: Date.now() });
        } else {
          await ctx.db.insert('leaderboards', {
            type: 'rps_wins',
            period: 'all_time',
            userId: winnerId as any,
            score: 1,
            rank: 0,
            updatedAt: Date.now(),
          });
        }
      }

    } else {
      // Create a new pending challenge
      await ctx.db.insert('minigames', {
        gameType: 'rps',
        roomId: args.roomId,
        player1Id: args.senderId as any,
        player2Id: targetUser._id as any,
        state: { p1Move: move },
        status: 'pending',
        createdAt: Date.now(),
      });

      systemMessage = `🎮 **Rock Paper Scissors**\n\n@${sender?.username} has challenged @${targetUser.username} to RPS!\n\nReply with \`/rps @${sender?.username} [rock|paper|scissors]\` to play!`;
    }

    // Find Bot to post message
    let bot = await ctx.db
      .query('users')
      .withIndex('byUsername', (q) => q.eq('username', 'GameBot'))
      .unique();

    if (!bot) {
      const botId = await ctx.db.insert('users', {
        username: 'GameBot',
        displayName: 'Arcade Bot',
        isBot: true,
        role: 'user',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=GameBot',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      bot = await ctx.db.get(botId);
    }

    if (bot) {
      await ctx.db.insert('messages', {
        roomId: args.roomId as any,
        senderId: bot._id as any,
        content: systemMessage,
        type: 'text',
        isPinned: false,
        isDeleted: false,
        reactions: [],
        createdAt: Date.now(),
      });
    }
  },
});

export const resetLeaderboard = mutation({
  args: { type: v.string(), period: v.string() },
  handler: async (ctx, args) => {
    // Only admins/owners
    const user = await ctx.db.get(await requireAuth(ctx));
    if (!['admin', 'owner'].includes(user?.role || '')) {
      throw new Error('Unauthorized');
    }

    const entries = await ctx.db
      .query('leaderboards')
      .withIndex('byTypeAndPeriod', (q) => q.eq('type', args.type).eq('period', args.period))
      .collect();

    for (const entry of entries) {
      await ctx.db.delete(entry._id);
    }
  },
});

async function requireAuth(ctx: any) {
  const { getAuthUserId } = await import('@convex-dev/auth/server');
  const userId = await getAuthUserId(ctx);
  if (!userId) throw new Error('Unauthenticated');
  return userId;
}
