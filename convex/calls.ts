import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getAuthUserId } from '@convex-dev/auth/server';

// ─── Queries ──────────────────────────────────────────────────────────────────

export const getActiveCall = query({
  args: { roomId: v.id('rooms') },
  returns: v.union(v.any(), v.null()),
  handler: async (ctx, args) => {
    return await ctx.db
      .query('calls')
      .withIndex('byRoom', (q) =>
        q.eq('roomId', args.roomId).eq('status', 'active')
      )
      .unique();
  },
});

// ─── Mutations ────────────────────────────────────────────────────────────────

export const startCall = mutation({
  args: { roomId: v.id('rooms'), type: v.union(v.literal('audio'), v.literal('video')) },
  returns: v.id('calls'),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error('Room not found');
    if (room.allowCalls === false) throw new Error('Calls are disabled for this room');

    // Check if call already exists
    const existing = await ctx.db
      .query('calls')
      .withIndex('byRoom', (q) =>
        q.eq('roomId', args.roomId).eq('status', 'active')
      )
      .unique();
    if (existing) return existing._id;

    const now = Date.now();
    const callId = await ctx.db.insert('calls', {
      roomId: args.roomId,
      type: args.type,
      status: 'active',
      startedAt: now,
      isGroup: true,
      initiatorId: userId,
      participantIds: [userId],
      liveKitRoom: args.roomId,
      recordingEnabled: false,
      createdAt: now,
    });

    // Notify room members
    const members = await ctx.db
      .query('roomMembers')
      .withIndex('byRoom', (q) => q.eq('roomId', args.roomId))
      .collect();

    for (const member of members) {
      if (member.userId !== userId) {
        await ctx.db.insert('notifications', {
          userId: member.userId,
          type: 'call_started',
          title: 'Incoming Call',
          body: `A ${args.type} call has started in ${room.name || 'a room'}.`,
          icon: '📞',
          link: `/room/${args.roomId}`,
          isRead: false,
          createdAt: now,
        });
      }
    }

    return callId;
  },
});

export const endCall = mutation({
  args: { callId: v.id('calls') },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    const call = await ctx.db.get(args.callId);
    if (!call) throw new Error('Call not found');

    // Only the initiator can end the call for now.
    if (call.initiatorId !== userId) {
      throw new Error('Not authorized');
    }

    await ctx.db.patch(args.callId, {
      status: 'ended',
      endedAt: Date.now(),
    });
    return null;
  },
});
