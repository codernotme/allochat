import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getAuthUserId } from '@convex-dev/auth/server';
import type { Id } from './_generated/dataModel';
import type { MutationCtx, QueryCtx } from './_generated/server';

function makeParticipantKey(a: string, b: string) {
  return [a, b].sort().join('::');
}

const STALE_CALL_MS = 30_000;

type WebRtcCallRecord = {
  _id: Id<'webrtcCalls'>;
  callerId: Id<'users'>;
  calleeId: Id<'users'>;
  status: 'ringing' | 'connecting' | 'active' | 'ended';
  startedAt?: number;
};

async function assertParticipant(
  ctx: QueryCtx | MutationCtx,
  callId: Id<'webrtcCalls'>,
  userId: Id<'users'>
) {
  const call = await ctx.db.get(callId);
  if (!call) throw new Error('Call session not found');
  if (call.callerId !== userId && call.calleeId !== userId) {
    throw new Error('Not authorized for this call session');
  }
  return call as WebRtcCallRecord;
}

export const getSessionWithPeer = query({
  args: { peerId: v.id('users') },
  returns: v.union(v.any(), v.null()),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const key = makeParticipantKey(userId, args.peerId);
    const sessions = await ctx.db
      .query('webrtcCalls')
      .withIndex('byParticipantKey', (q) => q.eq('participantKey', key))
      .order('desc')
      .take(5);

    const active = sessions.find((s) => s.status !== 'ended');
    return active ?? null;
  },
});

export const createSession = mutation({
  args: { peerId: v.id('users') },
  returns: v.id('webrtcCalls'),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');
    if (userId === args.peerId) throw new Error('Cannot call yourself');

    const key = makeParticipantKey(userId, args.peerId);
    const sessions = await ctx.db
      .query('webrtcCalls')
      .withIndex('byParticipantKey', (q) => q.eq('participantKey', key))
      .order('desc')
      .take(5);

    const existing = sessions.find((s) => s.status !== 'ended');
    if (existing) return existing._id;

    const now = Date.now();
    return await ctx.db.insert('webrtcCalls', {
      participantKey: key,
      callerId: userId,
      calleeId: args.peerId,
      status: 'ringing',
      createdAt: now,
      updatedAt: now,
      lastSeenCaller: now,
    });
  },
});

export const setOffer = mutation({
  args: {
    callId: v.id('webrtcCalls'),
    sdp: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    const call = await assertParticipant(ctx, args.callId, userId);
    if (call.callerId !== userId) throw new Error('Only caller can set offer');

    await ctx.db.patch(args.callId, {
      offerSdp: args.sdp,
      status: 'connecting',
      updatedAt: Date.now(),
      lastSeenCaller: Date.now(),
    });

    return null;
  },
});

export const setAnswer = mutation({
  args: {
    callId: v.id('webrtcCalls'),
    sdp: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    const call = await assertParticipant(ctx, args.callId, userId);
    if (call.calleeId !== userId) throw new Error('Only callee can set answer');

    const now = Date.now();
    await ctx.db.patch(args.callId, {
      answerSdp: args.sdp,
      status: 'active',
      startedAt: call.startedAt ?? now,
      updatedAt: now,
      lastSeenCallee: now,
    });

    return null;
  },
});

export const addIceCandidate = mutation({
  args: {
    callId: v.id('webrtcCalls'),
    candidate: v.string(),
    sdpMid: v.optional(v.string()),
    sdpMLineIndex: v.optional(v.number()),
  },
  returns: v.id('webrtcIceCandidates'),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    await assertParticipant(ctx, args.callId, userId);

    return await ctx.db.insert('webrtcIceCandidates', {
      callId: args.callId,
      senderId: userId,
      candidate: args.candidate,
      sdpMid: args.sdpMid,
      sdpMLineIndex: args.sdpMLineIndex,
      createdAt: Date.now(),
    });
  },
});

export const listIceCandidates = query({
  args: { callId: v.id('webrtcCalls') },
  returns: v.array(v.any()),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    await assertParticipant(ctx, args.callId, userId);

    return await ctx.db
      .query('webrtcIceCandidates')
      .withIndex('byCall', (q) => q.eq('callId', args.callId))
      .order('asc')
      .take(200);
  },
});

export const heartbeat = mutation({
  args: { callId: v.id('webrtcCalls') },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    const call = await assertParticipant(ctx, args.callId, userId);
    const now = Date.now();
    if (call.callerId === userId) {
      await ctx.db.patch(args.callId, { lastSeenCaller: now, updatedAt: now });
    } else {
      await ctx.db.patch(args.callId, { lastSeenCallee: now, updatedAt: now });
    }

    return null;
  },
});

export const endSession = mutation({
  args: {
    callId: v.id('webrtcCalls'),
    reason: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    await assertParticipant(ctx, args.callId, userId);

    await ctx.db.patch(args.callId, {
      status: 'ended',
      disconnectReason: args.reason,
      endedAt: Date.now(),
      updatedAt: Date.now(),
    });

    return null;
  },
});

export const cleanupStaleSessions = mutation({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error('Not authenticated');

    const now = Date.now();
    const endedIds = new Set<Id<'webrtcCalls'>>();

    const callerSessions = await ctx.db
      .query('webrtcCalls')
      .withIndex('byCaller', (q) => q.eq('callerId', userId))
      .order('desc')
      .take(20);

    const calleeSessions = await ctx.db
      .query('webrtcCalls')
      .withIndex('byCallee', (q) => q.eq('calleeId', userId))
      .order('desc')
      .take(20);

    const sessions = [...callerSessions, ...calleeSessions].filter((call) => call.status !== 'ended');

    for (const call of sessions) {
      if (endedIds.has(call._id)) continue;

      const isCaller = call.callerId === userId;
      const peerLastSeen = isCaller
        ? call.lastSeenCallee ?? call.createdAt
        : call.lastSeenCaller ?? call.createdAt;

      if (now - peerLastSeen > STALE_CALL_MS) {
        await ctx.db.patch(call._id, {
          status: 'ended',
          disconnectReason: 'heartbeat_timeout',
          endedAt: now,
          updatedAt: now,
        });
        endedIds.add(call._id);
      }
    }

    return endedIds.size;
  },
});
