# AlloChat v2.0 — Flows, Algorithms & API Layouts

> Complete technical specification for all user flows, Convex APIs, data flows, page routing, and algorithms.

---

## Table of Contents
1. [Complete Convex Schema](#1-complete-convex-schema)
2. [Authentication Flows](#2-authentication-flows)
3. [Messaging Flow & Algorithms](#3-messaging-flow--algorithms)
4. [Room Join & Presence Flow](#4-room-join--presence-flow)
5. [Calling Flow](#5-calling-flow)
6. [XP & Leveling Algorithm](#6-xp--leveling-algorithm)
7. [Notification Flow](#7-notification-flow)
8. [Payment & Subscription Flow](#8-payment--subscription-flow)
9. [Moderation Flow](#9-moderation-flow)
10. [Full API Reference (Convex)](#10-full-api-reference-convex)
11. [Page Routes & Navigation Map](#11-page-routes--navigation-map)
12. [Real-Time Subscriptions Map](#12-real-time-subscriptions-map)
13. [Permission Matrix (RBAC)](#13-permission-matrix-rbac)
14. [Data Flow Diagrams](#14-data-flow-diagrams)
15. [Performance & Caching Strategy](#15-performance--caching-strategy)

---

## 1. Complete Convex Schema

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';
import { authTables } from '@convex-dev/auth/server';

export default defineSchema({
  // ═══════════════════════════════════════════
  //  AUTH (managed by Convex Auth)
  // ═══════════════════════════════════════════
  ...authTables,

  // ═══════════════════════════════════════════
  //  USERS
  // ═══════════════════════════════════════════
  users: defineTable({
    // Identity
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    username: v.string(),
    displayName: v.string(),
    
    // Avatar & Appearance
    avatar: v.optional(v.string()),            // Cloudinary URL
    bannerImage: v.optional(v.string()),
    nameColor: v.optional(v.string()),
    nameEffect: v.optional(v.string()),        // 'solid'|'gradient'|'neon'
    profileTheme: v.optional(v.string()),
    
    // Bio
    bio: v.optional(v.string()),
    pronouns: v.optional(v.string()),
    customStatus: v.optional(v.string()),
    statusEmoji: v.optional(v.string()),
    interests: v.optional(v.array(v.string())),
    languages: v.optional(v.array(v.string())),
    website: v.optional(v.string()),
    socialLinks: v.optional(v.array(v.object({
      platform: v.string(),
      url: v.string(),
    }))),
    
    // Presence
    presenceStatus: v.union(
      v.literal('online'), v.literal('away'),
      v.literal('busy'), v.literal('offline')
    ),
    lastSeenAt: v.number(),
    currentRoomId: v.optional(v.id('rooms')),
    
    // Account Settings
    theme: v.union(v.literal('light'), v.literal('dark'), v.literal('system')),
    language: v.string(),
    
    // Notifications Prefs
    notifMessages: v.boolean(),
    notifCalls: v.boolean(),
    notifMentions: v.boolean(),
    notifFriends: v.boolean(),
    notifEmail: v.boolean(),
    notifSMS: v.boolean(),
    
    // RBAC
    role: v.union(
      v.literal('owner'), v.literal('admin'), v.literal('moderator'),
      v.literal('staff'), v.literal('user'), v.literal('guest')
    ),
    subscriptionTier: v.union(
      v.literal('free'), v.literal('premium'), v.literal('pro'), v.literal('elite')
    ),
    
    // Gamification (denormalized)
    xp: v.number(),
    level: v.number(),
    
    // Verification
    emailVerified: v.boolean(),
    phoneVerified: v.boolean(),
    isVerified: v.boolean(),                   // staff-verified badge
    verifiedType: v.optional(v.string()),       // 'creator'|'notable'|'business'
    
    // Moderation state (denormalized for fast checks)
    isBanned: v.boolean(),
    banExpiry: v.optional(v.number()),
    isMuted: v.boolean(),
    muteExpiry: v.optional(v.number()),
    
    // Status flags
    isBot: v.boolean(),
    isDeleted: v.boolean(),
    isGuest: v.boolean(),
    minAge: v.optional(v.number()),
    consentGiven: v.boolean(),
    
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('byUsername', ['username'])
    .index('byEmail', ['email'])
    .index('byPresence', ['presenceStatus'])
    .index('byRole', ['role'])
    .searchIndex('searchUsers', {
      searchField: 'username',
      filterFields: ['role', 'presenceStatus'],
    }),

  // ═══════════════════════════════════════════
  //  ROOMS
  // ═══════════════════════════════════════════
  rooms: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    avatar: v.optional(v.string()),
    bannerImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    
    type: v.union(
      v.literal('public'), v.literal('private'),
      v.literal('secret'), v.literal('community')
    ),
    password: v.optional(v.string()),          // bcrypt hashed
    maxUsers: v.optional(v.number()),
    category: v.string(),
    language: v.optional(v.string()),
    tags: v.array(v.string()),
    
    allowCalls: v.boolean(),
    allowMedia: v.boolean(),
    requireVerification: v.boolean(),
    minAge: v.optional(v.number()),
    enabledAddons: v.array(v.string()),
    
    ownerId: v.id('users'),
    topic: v.optional(v.string()),
    announcement: v.optional(v.string()),
    announcementUpdatedAt: v.optional(v.number()),
    
    isVerified: v.boolean(),
    isFeatured: v.boolean(),
    
    memberCount: v.number(),
    onlineCount: v.number(),
    totalMessages: v.number(),
    
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('byCategory', ['category', 'type'])
    .index('byOwner', ['ownerId'])
    .index('bySlug', ['slug'])
    .index('byFeatured', ['isFeatured', 'onlineCount'])
    .searchIndex('searchRooms', {
      searchField: 'name',
      filterFields: ['category', 'type'],
    }),

  roomMembers: defineTable({
    roomId: v.id('rooms'),
    userId: v.id('users'),
    role: v.union(
      v.literal('owner'), v.literal('admin'),
      v.literal('moderator'), v.literal('member')
    ),
    joinedAt: v.number(),
    mutedUntil: v.optional(v.number()),
    isBanned: v.boolean(),
  })
    .index('byRoom', ['roomId', 'role'])
    .index('byUser', ['userId'])
    .index('byRoomAndUser', ['roomId', 'userId']),

  // ═══════════════════════════════════════════
  //  MESSAGES
  // ═══════════════════════════════════════════
  messages: defineTable({
    roomId: v.id('rooms'),
    senderId: v.id('users'),
    content: v.string(),
    richContent: v.optional(v.object({
      blocks: v.array(v.any()),
    })),
    type: v.union(
      v.literal('text'), v.literal('media'), v.literal('system'),
      v.literal('gift'), v.literal('voice'), v.literal('poll')
    ),
    replyTo: v.optional(v.id('messages')),
    isPinned: v.boolean(),
    isDeleted: v.boolean(),
    deletedAt: v.optional(v.number()),
    editedAt: v.optional(v.number()),
    editHistory: v.optional(v.array(v.object({
      content: v.string(),
      editedAt: v.number(),
    }))),
    reactions: v.array(v.object({
      emoji: v.string(),
      userIds: v.array(v.id('users')),
    })),
    createdAt: v.number(),
  })
    .index('byRoom', ['roomId', 'createdAt'])
    .index('bySender', ['senderId', 'createdAt'])
    .index('byPinned', ['roomId', 'isPinned'])
    .searchIndex('searchMessages', {
      searchField: 'content',
      filterFields: ['roomId'],
    }),

  mediaAttachments: defineTable({
    messageId: v.id('messages'),
    type: v.union(
      v.literal('image'), v.literal('video'), v.literal('audio'),
      v.literal('file'), v.literal('giphy'), v.literal('youtube'),
      v.literal('spotify'), v.literal('sketch'), v.literal('voiceNote'),
      v.literal('sticker'), v.literal('poll')
    ),
    url: v.string(),
    thumbnailUrl: v.optional(v.string()),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    duration: v.optional(v.number()),
    title: v.optional(v.string()),
    fileSize: v.optional(v.number()),
    uploadedAt: v.number(),
  }).index('byMessage', ['messageId']),

  conversations: defineTable({
    participantIds: v.array(v.id('users')),
    lastMessageAt: v.number(),
    lastMessagePreview: v.optional(v.string()),
  }).index('byParticipant', ['participantIds']),

  directMessages: defineTable({
    conversationId: v.id('conversations'),
    senderId: v.id('users'),
    content: v.string(),
    isDeleted: v.boolean(),
    readAt: v.optional(v.number()),
    createdAt: v.number(),
  }).index('byConversation', ['conversationId', 'createdAt']),

  // ═══════════════════════════════════════════
  //  CALLS
  // ═══════════════════════════════════════════
  calls: defineTable({
    initiatorId: v.id('users'),
    participantIds: v.array(v.id('users')),
    roomId: v.optional(v.id('rooms')),
    type: v.union(v.literal('audio'), v.literal('video'), v.literal('screen')),
    isGroup: v.boolean(),
    status: v.union(
      v.literal('ringing'), v.literal('connecting'),
      v.literal('active'), v.literal('ended'), v.literal('missed'), v.literal('rejected')
    ),
    liveKitRoom: v.string(),
    startedAt: v.optional(v.number()),
    endedAt: v.optional(v.number()),
    duration: v.optional(v.number()),
    recordingEnabled: v.boolean(),
    recordingUrl: v.optional(v.string()),
    transcriptionUrl: v.optional(v.string()),
    costPerMinute: v.optional(v.number()),
    totalCost: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index('byInitiator', ['initiatorId'])
    .index('byStatus', ['status'])
    .index('byParticipant', ['participantIds']),

  // ═══════════════════════════════════════════
  //  SOCIAL
  // ═══════════════════════════════════════════
  friendships: defineTable({
    requesterId: v.id('users'),
    targetId: v.id('users'),
    status: v.union(
      v.literal('pending'), v.literal('accepted'), v.literal('declined')
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('byRequester', ['requesterId', 'status'])
    .index('byTarget', ['targetId', 'status']),

  blockedUsers: defineTable({
    blockerId: v.id('users'),
    targetId: v.id('users'),
    createdAt: v.number(),
  }).index('byBlocker', ['blockerId']),

  // ═══════════════════════════════════════════
  //  GAMIFICATION
  // ═══════════════════════════════════════════
  userXP: defineTable({
    userId: v.id('users'),
    totalXP: v.number(),
    level: v.number(),
    xpInCurrentLevel: v.number(),
    xpToNextLevel: v.number(),
    updatedAt: v.number(),
  })
    .index('byUser', ['userId'])
    .index('byXP', ['totalXP']),

  badges: defineTable({
    slug: v.string(),
    name: v.string(),
    description: v.string(),
    icon: v.string(),
    rarity: v.union(
      v.literal('common'), v.literal('uncommon'), v.literal('rare'),
      v.literal('epic'), v.literal('legendary'), v.literal('limited')
    ),
    category: v.string(),
    condition: v.string(),
    conditionValue: v.optional(v.number()),
    xpReward: v.number(),
    isSecret: v.boolean(),
    isLimited: v.boolean(),
    availableUntil: v.optional(v.number()),
  }).index('bySlug', ['slug']),

  userBadges: defineTable({
    userId: v.id('users'),
    badgeId: v.id('badges'),
    progress: v.optional(v.number()),
    unlockedAt: v.optional(v.number()),
    isUnlocked: v.boolean(),
  })
    .index('byUser', ['userId', 'isUnlocked'])
    .index('byBadge', ['badgeId']),

  streaks: defineTable({
    userId: v.id('users'),
    type: v.string(),
    count: v.number(),
    multiplier: v.number(),
    lastActivityAt: v.number(),
    expiresAt: v.number(),
  }).index('byUser', ['userId']),

  leaderboards: defineTable({
    type: v.string(),
    period: v.string(),
    userId: v.id('users'),
    score: v.number(),
    rank: v.number(),
    updatedAt: v.number(),
  }).index('byTypeAndPeriod', ['type', 'period', 'score']),

  // ═══════════════════════════════════════════
  //  MONETIZATION
  // ═══════════════════════════════════════════
  wallets: defineTable({
    userId: v.id('users'),
    alloCoins: v.number(),
    starDust: v.number(),
    frozenBalance: v.number(),
    currency: v.string(),
    updatedAt: v.number(),
  }).index('byUser', ['userId']),

  walletTransactions: defineTable({
    userId: v.id('users'),
    type: v.union(
      v.literal('purchase'), v.literal('gift_send'), v.literal('gift_receive'),
      v.literal('subscription'), v.literal('refund'), v.literal('earned'),
      v.literal('admin_adjustment')
    ),
    alloCoins: v.number(),
    starDust: v.optional(v.number()),
    description: v.string(),
    relatedId: v.optional(v.string()),
    status: v.union(v.literal('pending'), v.literal('completed'), v.literal('failed'), v.literal('refunded')),
    createdAt: v.number(),
  }).index('byUser', ['userId', 'createdAt']),

  subscriptions: defineTable({
    userId: v.id('users'),
    tier: v.union(
      v.literal('free'), v.literal('premium'), v.literal('pro'), v.literal('elite')
    ),
    stripeSubscriptionId: v.optional(v.string()),
    stripeCustomerId: v.optional(v.string()),
    status: v.union(
      v.literal('active'), v.literal('cancelled'), v.literal('expired'), v.literal('trialing')
    ),
    startDate: v.number(),
    renewalDate: v.number(),
    cancelAt: v.optional(v.number()),
    benefits: v.array(v.string()),
  }).index('byUser', ['userId']),

  gifts: defineTable({
    slug: v.string(),
    name: v.string(),
    icon: v.string(),
    animationType: v.string(),
    category: v.string(),
    coinPrice: v.number(),
    isLimited: v.boolean(),
    availableUntil: v.optional(v.number()),
    isActive: v.boolean(),
  }).index('byCategory', ['category', 'isActive']),

  giftTransactions: defineTable({
    senderId: v.id('users'),
    recipientId: v.id('users'),
    giftId: v.id('gifts'),
    messageId: v.optional(v.id('messages')),
    personalMessage: v.optional(v.string()),
    coinAmount: v.number(),
    createdAt: v.number(),
  })
    .index('byRecipient', ['recipientId', 'createdAt'])
    .index('bySender', ['senderId', 'createdAt']),

  // ═══════════════════════════════════════════
  //  MODERATION
  // ═══════════════════════════════════════════
  moderationActions: defineTable({
    type: v.union(
      v.literal('warn'), v.literal('mute'), v.literal('kick'),
      v.literal('ban'), v.literal('suspend'), v.literal('contentRemove'), v.literal('ipBan')
    ),
    targetId: v.id('users'),
    moderatorId: v.id('users'),
    roomId: v.optional(v.id('rooms')),
    reason: v.string(),
    evidence: v.optional(v.string()),
    duration: v.optional(v.number()),
    expiresAt: v.optional(v.number()),
    isActive: v.boolean(),
    appeal: v.optional(v.object({
      status: v.string(),
      message: v.string(),
      submittedAt: v.number(),
      reviewedAt: v.optional(v.number()),
      reviewedBy: v.optional(v.id('users')),
    })),
    createdAt: v.number(),
  })
    .index('byTarget', ['targetId', 'type', 'isActive'])
    .index('byModerator', ['moderatorId', 'createdAt']),

  reports: defineTable({
    reporterId: v.id('users'),
    targetId: v.id('users'),
    contentId: v.optional(v.id('messages')),
    reason: v.string(),
    category: v.string(),
    status: v.union(
      v.literal('pending'), v.literal('reviewing'), v.literal('resolved'), v.literal('dismissed')
    ),
    assignedTo: v.optional(v.id('users')),
    resolvedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index('byStatus', ['status', 'createdAt'])
    .index('byTarget', ['targetId']),

  contentFilters: defineTable({
    pattern: v.string(),
    type: v.string(),
    action: v.string(),
    replacement: v.optional(v.string()),
    severity: v.string(),
    createdBy: v.id('users'),
    createdAt: v.number(),
  }).index('byType', ['type']),

  // ═══════════════════════════════════════════
  //  PLUGINS
  // ═══════════════════════════════════════════
  plugins: defineTable({
    slug: v.string(),
    name: v.string(),
    description: v.string(),
    version: v.string(),
    author: v.string(),
    authorId: v.optional(v.id('users')),
    icon: v.string(),
    category: v.string(),
    isFree: v.boolean(),
    price: v.optional(v.number()),
    downloadUrl: v.string(),
    requiredPermissions: v.array(v.string()),
    installCount: v.number(),
    rating: v.number(),
    reviewCount: v.number(),
    isApproved: v.boolean(),
    isFeatured: v.boolean(),
    isBuiltIn: v.boolean(),
    createdAt: v.number(),
  }).index('byCategory', ['category', 'isApproved']),

  roomPlugins: defineTable({
    roomId: v.id('rooms'),
    pluginId: v.id('plugins'),
    enabled: v.boolean(),
    config: v.optional(v.any()),
  }).index('byRoom', ['roomId']),

  // ═══════════════════════════════════════════
  //  NOTIFICATIONS
  // ═══════════════════════════════════════════
  notifications: defineTable({
    userId: v.id('users'),
    type: v.string(),
    title: v.string(),
    body: v.string(),
    icon: v.optional(v.string()),
    link: v.optional(v.string()),
    isRead: v.boolean(),
    createdAt: v.number(),
  }).index('byUser', ['userId', 'isRead', 'createdAt']),

  // ═══════════════════════════════════════════
  //  EVENTS
  // ═══════════════════════════════════════════
  events: defineTable({
    title: v.string(),
    description: v.string(),
    hostId: v.id('users'),
    roomId: v.optional(v.id('rooms')),
    type: v.string(),
    startsAt: v.number(),
    endsAt: v.number(),
    maxAttendees: v.optional(v.number()),
    registrantIds: v.array(v.id('users')),
    isPublic: v.boolean(),
    xpReward: v.number(),
    status: v.union(v.literal('upcoming'), v.literal('live'), v.literal('ended'), v.literal('cancelled')),
    createdAt: v.number(),
  })
    .index('byStart', ['startsAt', 'status'])
    .index('byHost', ['hostId']),

  // ═══════════════════════════════════════════
  //  ADMIN
  // ═══════════════════════════════════════════
  auditLogs: defineTable({
    actorId: v.id('users'),
    action: v.string(),
    targetType: v.string(),
    targetId: v.string(),
    details: v.optional(v.any()),
    ipAddress: v.optional(v.string()),
    createdAt: v.number(),
  }).index('byActor', ['actorId', 'createdAt']),

  apiKeys: defineTable({
    label: v.string(),
    keyHash: v.string(),
    createdBy: v.id('users'),
    permissions: v.array(v.string()),
    lastUsedAt: v.optional(v.number()),
    expiresAt: v.optional(v.number()),
    isActive: v.boolean(),
    createdAt: v.number(),
  }).index('byCreator', ['createdBy']),
});
```

---

## 2. Authentication Flows

### Flow A: Email Sign-Up
```
1. User fills sign-up form (name, email, password)
2. Client validates: Zod schema, password strength
3. → POST signUp() Convex mutation
4. Convex Auth: bcrypt hash password, create user record
5. Send OTP email via Resend
6. → Redirect to /auth/verify-email
7. User enters 6-digit OTP
8. → verifyOTP() mutation validates code (10 min expiry)
9. Mark emailVerified = true
10. Create default wallet + userXP record
11. → Redirect to /auth/onboarding
```

### Flow B: Google OAuth
```
1. Click "Continue with Google"
2. → Redirect to Google OAuth consent
3. Google returns authorization code
4. Convex Auth handles callback → creates/links user
5. Check if username is set → redirect to /auth/onboarding if not
6. → Redirect to /app/lobby
```

### Flow C: Phone OTP
```
1. User enters phone number + country code
2. → sendOTP() Convex action → Twilio Verify API
3. Twilio sends SMS with 6-digit code
4. User enters code → verifyOTP() mutation
5. Twilio Verify checks code server-side
6. Create session → redirect to app
```

### Flow D: Password Reset
```
1. User enters email on /auth/forgot-password
2. → requestPasswordReset() mutation
3. Generate secure token (32 bytes random, 15 min expiry)
4. Send reset link via Resend email
5. User clicks link → /auth/reset-password?token=xxx
6. → resetPassword(token, newPassword) mutation
7. Validate token expiry + hash match
8. bcrypt new password + clear all sessions
9. Redirect to sign-in
```

---

## 3. Messaging Flow & Algorithms

### Message Send Flow
```
User types → MessageInput component
     ↓
Slash command check (/gif, /poll, etc.)
     ↓
Content filter check (client-side word filter)
     ↓
Rich text parse → extract mentions (@user), links
     ↓
sendMessage() Convex mutation:
  1. Auth check: is user in room + not muted?
  2. Flood check: last N messages in 5s window?
  3. Content filter: regex match against contentFilters table
  4. OpenAI Moderation API check (if enabled)
  5. Insert to messages table
  6. If has attachments → insert to mediaAttachments
  7. Update rooms.totalMessages counter
  8. Award XP: awardXP(userId, 1, 'sendMessage')
  9. Check badge unlocks
  10. Notify mentioned users
  11. Convex auto-broadcasts to all subscribers
     ↓
All clients watching watchMessages(roomId) receive update <100ms
```

### Typing Indicator Algorithm
```typescript
// Client-side debounce
const TYPING_TIMEOUT = 2000; // 2 seconds

function onInputChange() {
  sendTypingIndicator(roomId, true);
  clearTimeout(typingTimer);
  typingTimer = setTimeout(() => {
    sendTypingIndicator(roomId, false);
  }, TYPING_TIMEOUT);
}

// Convex: store in presences table (not messages)
// Subscribe to typing state per room
```

### Flood Control Algorithm
```typescript
// convex/messages.ts
async function checkFloodControl(ctx, userId, roomId) {
  const window = 5000; // 5 seconds
  const maxMessages = 6; // from settings
  
  const recent = await ctx.db
    .query('messages')
    .withIndex('byRoom', (q) => q.eq('roomId', roomId))
    .filter((q) => q.gte(q.field('createdAt'), Date.now() - window))
    .filter((q) => q.eq(q.field('senderId'), userId))
    .collect();
  
  if (recent.length >= maxMessages) {
    throw new ConvexError('FLOOD_LIMIT_REACHED');
  }
}
```

---

## 4. Room Join & Presence Flow

### Room Join Flow
```
User clicks "Join Room"
     ↓
joinRoom(roomId, password?) mutation:
  1. Check room exists + not banned
  2. Check capacity (maxUsers)
  3. If password-protected → verify bcrypt hash
  4. Check age restriction (minAge vs user.minAge)
  5. Check verification requirement
  6. Insert roomMembers record (role: 'member')
  7. Update rooms.memberCount counter
  8. Update user.currentRoomId
  9. Set presence: online + currentRoomId
  10. Broadcast join system message to room
     ↓
Client receives room data + starts message subscription
```

### Presence Heartbeat
```
// Client-side heartbeat (every 30 seconds)
useEffect(() => {
  const heartbeat = setInterval(() => {
    updatePresence({ status: 'online', lastHeartbeat: Date.now() });
  }, 30_000);
  
  // On tab visibility change
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      updatePresence({ status: 'away' });
    } else {
      updatePresence({ status: 'online' });
    }
  });
  
  return () => clearInterval(heartbeat);
}, []);

// Convex function marks users offline if lastHeartbeat > 60s
// Cron job: every 1 minute, check stale presences
```

---

## 5. Calling Flow

### 1-on-1 Call Flow
```
User A clicks "Call" on User B's profile
     ↓
startCall(targetUserId, type: 'video') mutation:
  1. Generate unique liveKitRoom name: `call_${nanoid()}`
  2. Create call record (status: 'ringing')
  3. Generate LiveKit JWT token for User A
  4. Return { callId, liveKitToken, liveKitRoom }
     ↓
Client A: → /call/[callId] page
     ↓
User B receives notification via watchIncomingCalls()
User B sees IncomingCallDialog
     ↓
If User B accepts → answerCall(callId) mutation:
  1. Generate LiveKit JWT token for User B
  2. Update call status: 'connecting'
  3. User B joins LiveKit room
     ↓
Both clients connect to LiveKit room
LiveKit handles WebRTC peer negotiation
Call status → 'active'
     ↓
Either user ends call → endCall(callId) mutation:
  1. Update status: 'ended'
  2. Record duration, cost
  3. Award XP for call duration
  4. Store call in history
  5. Disconnect LiveKit room
```

---

## 6. XP & Leveling Algorithm

### XP Thresholds (Exponential)
```typescript
// lib/data/xp-actions.ts
export function xpForLevel(level: number): number {
  // Level 1→2: 100 XP, Level 2→3: 200 XP, doubles every 10 levels
  return Math.floor(100 * Math.pow(1.15, level - 1));
}

export function levelFromTotalXP(totalXP: number): number {
  let level = 1;
  let accumulated = 0;
  while (accumulated + xpForLevel(level) <= totalXP) {
    accumulated += xpForLevel(level);
    level++;
  }
  return level;
}
```

### XP Action Table
```typescript
export const XP_ACTIONS = {
  SEND_MESSAGE:        { xp: 1,   dailyCap: 100 },
  SEND_VOICE_NOTE:     { xp: 3,   dailyCap: 30  },
  CALL_PER_MINUTE:     { xp: 5,   dailyCap: null },
  SEND_GIFT:           { xp: 5,   dailyCap: 50  },
  RECEIVE_GIFT:        { xp: 2,   dailyCap: null },
  FRIEND_ACCEPTED:     { xp: 10,  dailyCap: null },
  DAILY_LOGIN:         { xp: 20,  dailyCap: 1   },
  CREATE_ROOM:         { xp: 50,  dailyCap: null },
  REACH_LEVEL_10:      { xp: 500, dailyCap: null },
  WIN_QUIZ:            { xp: 50,  dailyCap: null },
  PARTICIPATE_EVENT:   { xp: 100, dailyCap: 1   },
} as const;
```

### Streak Multiplier
```typescript
function getStreakMultiplier(streakCount: number): number {
  if (streakCount >= 30) return 2.0;  // 2x XP
  if (streakCount >= 14) return 1.5;  // 1.5x XP
  if (streakCount >= 7)  return 1.25; // 1.25x XP
  return 1.0;
}
```

---

## 7. Notification Flow

### In-App Notification Flow
```
Event triggers (message, call, gift, badge, friend request)
     ↓
Convex mutation calls createNotification(userId, type, data)
     ↓
Insert to notifications table
     ↓
Client subscribed to watchNotifications() receives update
     ↓
NotificationBell badge count updates
User opens bell → dropdown shows latest 10
Click → navigate to link
```

### Push Notification Flow
```
Service Worker registered on page load
     ↓
User grants push permission
     ↓
Subscribe to Web Push API with VAPID keys
Store push subscription in user record
     ↓
When createNotification() fires:
  Convex action → Web Push API → Service Worker
  Service Worker shows OS notification
     ↓
Click notification → navigate to app
```

---

## 8. Payment & Subscription Flow

### Subscription Upgrade Flow
```
User clicks "Upgrade to Pro"
     ↓
createCheckoutSession(planId) Convex action:
  1. Create/get Stripe customer for user
  2. Create Stripe Checkout Session with:
     - price: stripePriceId from plan
     - metadata: { userId, planId }
     - success_url: /subscription/success
     - cancel_url: /subscription
  3. Return session URL
     ↓
Client → redirect to Stripe Checkout
User enters card details on Stripe page
     ↓
Stripe processes payment → fires webhook to:
  POST /api/webhooks/stripe
     ↓
handleStripeWebhook Convex HTTP action:
  switch(event.type):
    'checkout.session.completed' →
      updateSubscription(userId, tier, stripeSubscriptionId)
    'customer.subscription.cancelled' →
      cancelSubscription(userId)
    'customer.subscription.updated' →
      syncSubscriptionStatus(userId, newStatus)
     ↓
User shows as Pro immediately via Convex real-time
```

### Gift Purchase Flow
```
User selects gift from shop
     ↓
sendGift(recipientId, giftId, message?) mutation:
  1. Check sender wallet balance >= gift.coinPrice
  2. Deduct coins from sender wallet
  3. Create giftTransaction record
  4. Insert gift system message to current room
  5. Award XP to sender (+5) and receiver (+2)
  6. Create notification for recipient
  7. Play gift animation on all room clients
```

---

## 9. Moderation Flow

### User Report Flow
```
User clicks "Report" on message/user
     ↓
Report dialog: select category + add details
     ↓
reportContent(targetId, contentId?, reason, category) mutation:
  1. Check reporter is not blocked by target
  2. Insert report (status: 'pending')
  3. Check auto-escalation rules:
     - If target has 3+ reports this week → auto-assign to moderator
     - If category is 'critical' → ping admin notification
     ↓
Moderator queue updates in real-time
```

### Automated Content Filter Flow
```
Message sent → applyContentFilter(content) function:
  1. Exact word match against contentFilters table
  2. Regex pattern matching
  3. Domain block list check for links
  4. If match found:
     - action: 'block' → throw error, message not sent
     - action: 'flag' → send message + create auto-report
     - action: 'replace' → replace matched text with ***
  5. Optional: OpenAI Moderation API for hate speech / explicit content
```

---

## 10. Full API Reference (Convex)

> All functions are TypeScript with full Zod validation on args.

### Messages API
```typescript
// convex/messages.ts
export const sendMessage = mutation({
  args: {
    roomId: v.id('rooms'),
    content: v.string(),
    type: v.optional(v.string()),
    replyTo: v.optional(v.id('messages')),
  },
  handler: async (ctx, args) => { /* ... */ },
});

export const editMessage = mutation({
  args: { messageId: v.id('messages'), newContent: v.string() },
  handler: async (ctx, args) => { /* ... */ },
});

export const deleteMessage = mutation({
  args: { messageId: v.id('messages') },
  handler: async (ctx, args) => { /* ... */ },
});

export const addReaction = mutation({
  args: { messageId: v.id('messages'), emoji: v.string() },
  handler: async (ctx, args) => { /* ... */ },
});

export const pinMessage = mutation({
  args: { messageId: v.id('messages') },
  handler: async (ctx, args) => { /* ... */ },
});

export const listMessages = query({
  args: { roomId: v.id('rooms'), paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => { /* ... */ },
});

export const searchMessages = query({
  args: { query: v.string(), roomId: v.optional(v.id('rooms')) },
  handler: async (ctx, args) => { /* ... */ },
});
```

### Rooms API
```typescript
// convex/rooms.ts
export const createRoom = mutation({ args: { name, type, category, description?, password? } });
export const updateRoom = mutation({ args: { roomId, updates } });
export const deleteRoom = mutation({ args: { roomId } });
export const joinRoom = mutation({ args: { roomId, password? } });
export const leaveRoom = mutation({ args: { roomId } });
export const listPublicRooms = query({ args: { category?, sort?, paginationOpts } });
export const listMyRooms = query({ args: {} });
export const searchRooms = query({ args: { query, filters? } });
export const getFeaturedRooms = query({ args: {} });
export const getRoomMembers = query({ args: { roomId } });
```

### Users / Social API
```typescript
// convex/users.ts
export const updateProfile = mutation({ args: { displayName?, bio?, avatar?, ... } });
export const getUserProfile = query({ args: { userId } });
export const searchUsers = query({ args: { query } });
export const sendFriendRequest = mutation({ args: { targetId } });
export const acceptFriendRequest = mutation({ args: { requestId } });
export const getFriends = query({ args: {} });
export const blockUser = mutation({ args: { targetId } });
export const setPresence = mutation({ args: { status, customMessage? } });
```

### Calls API
```typescript
// convex/calls.ts
export const startCall = mutation({ args: { targetUserId?, roomId?, type } });
export const answerCall = mutation({ args: { callId } });
export const rejectCall = mutation({ args: { callId } });
export const endCall = mutation({ args: { callId } });
export const generateToken = action({ args: { callId } });   // Returns LiveKit JWT
export const getCallHistory = query({ args: { paginationOpts } });
```

### Gamification API
```typescript
// convex/gamification.ts
export const awardXP = internalMutation({ args: { userId, amount, reason } });
export const getLeaderboard = query({ args: { type, period, limit? } });
export const getUserStats = query({ args: { userId } });
export const getStreak = query({ args: { userId } });
export const updateStreak = internalMutation({ args: { userId } });
```

### Payments API
```typescript
// convex/payments.ts
export const createCheckoutSession = action({ args: { planId, successUrl, cancelUrl } });
export const getWalletBalance = query({ args: {} });
export const sendGift = mutation({ args: { recipientId, giftId, message? } });
export const getGiftHistory = query({ args: { paginationOpts } });
export const getSubscriptionStatus = query({ args: {} });
export const cancelSubscription = mutation({ args: {} });

// HTTP action for Stripe webhook
export const stripeWebhook = httpAction(async (ctx, request) => { /* ... */ });
```

---

## 11. Page Routes & Navigation Map

```
/ (root)                        → redirect to /lobby (if logged in) or /auth/sign-in

/auth/
  sign-in                       → Auth method selector
  sign-in/email                 → Email + password
  sign-in/phone                 → Phone OTP
  sign-up                       → Registration method selector
  sign-up/email                 → Email registration
  sign-up/phone                 → Phone registration
  verify-email                  → OTP verification
  forgot-password               → Password reset request
  reset-password                → New password form
  magic-link                    → Auto-login from link
  onboarding                    → Post-signup wizard

/lobby                          → Room discovery grid
/room/[roomId]                  → Chat view (with real-time messages)
/room/[roomId]/settings         → Room settings (owner/admin only)
/room/[roomId]/members          → Member management
/messages                       → DM conversation list
/messages/[userId]              → DM conversation view
/call/[callId]                  → Live call screen
/profile/[userId]               → Public profile
/profile/me                     → Own profile (redirect)
/search                         → Global search results
/leaderboard                    → Global leaderboard
/events                         → Event calendar
/events/[eventId]               → Event detail
/shop                           → Gift & cosmetics store
/subscription                   → Plan management
/notifications                  → Notification history
/plugins/marketplace            → Plugin browser
/plugins/my-plugins             → Installed plugins

/settings/
  profile                       → Edit profile
  social                        → Social links
  privacy                       → Visibility settings
  notifications                 → Notification prefs
  security                      → Password, 2FA
  billing                       → Subscription + invoices
  appearance                    → Theme, language

/admin/
  dashboard                     → KPI overview (admin+)
  users                         → User management (admin+)
  users/[userId]                → User detail (admin+)
  rooms                         → Room management (mod+)
  moderation                    → Report queue (mod+)
  moderation/logs               → Audit trail (admin+)
  analytics                     → Charts (admin+)
  billing                       → Revenue (admin+)
  plugins                       → Marketplace mgmt (admin+)
  settings                      → App settings (admin+)
  announcements                 → Global announcements (admin+)
```

---

## 12. Real-Time Subscriptions Map

| Page | Subscription | Data |
|------|-------------|------|
| Any page | `watchNotifications()` | Unread count + new notifications |
| Any page | `watchIncomingCalls()` | Incoming call trigger |
| Lobby | `watchFeaturedRooms()` | Live room online counts |
| Room chat | `watchMessages(roomId)` | New/edited/deleted messages |
| Room chat | `watchPresence(roomId)` | Who's online in room |
| Room chat | `watchTyping(roomId)` | Typing indicators |
| DM conversation | `watchDMs(conversationId)` | New DM messages |
| Call screen | `watchCallStatus(callId)` | Call state changes |
| Leaderboard | `watchLeaderboard(type)` | Rank updates |
| Admin dashboard | `watchAdminStats()` | Live KPI counters |
| Moderation | `watchReportQueue()` | New reports |

---

## 13. Permission Matrix (RBAC)

| Action | guest | user | staff | moderator | admin | owner |
|--------|-------|------|-------|-----------|-------|-------|
| Send message | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Edit own message | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Delete own message | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Delete any message | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Create public room | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create private room | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Join room | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Start call | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Kick room member | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Ban room member | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Global ban | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| View admin panel | ❌ | ❌ | Partial | ✅ | ✅ | ✅ |
| Manage users | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Manage settings | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Access billing | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Award XP (manual) | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Send gifts | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Install plugins | ❌ | ❌ | ❌ | ✅ (own room) | ✅ | ✅ |

---

## 14. Data Flow Diagrams

### Message Flow
```
[User Client]
     │
     ├─ types message
     │
     ▼
[MessageInput Component]
     │
     ├─ slash command? → plugin dispatch
     ├─ @mention? → extract mentions list  
     ├─ flood check (client)
     │
     ▼
[Convex sendMessage() mutation]
     │
     ├─ auth check (is member?)
     ├─ mute check (is muted?)
     ├─ flood rate limit check
     ├─ content filter scan
     ├─ OpenAI moderation (async)
     │
     ▼
[Convex DB: messages table]
     │
     ├─ → increment rooms.totalMessages
     ├─ → awardXP() internal mutation
     ├─ → notify mentions
     │
     ▼
[Convex Real-time]
     │
     ▼
[All Subscribed Clients] ← receive <100ms
```

### Auth Flow (Simplified)
```
[Browser] → [Convex Auth] → [Convex DB users] → [Session Cookie]
```

### Payment Flow
```
[Client] → [Stripe Checkout] → [Stripe API]
                                     │
                                 webhook POST
                                     │
                                     ▼
[Convex HTTP Action] → [Convex DB: subscriptions, wallets] → [Real-time update to client]
```

---

## 15. Performance & Caching Strategy

### Next.js Caching
```typescript
// Static pages (revalidate)
export const revalidate = 60; // Lobby page revalidates every 60s

// Dynamic pages (no cache)
// chat/[roomId] — always server-rendered / client-side

// Static generation
// /leaderboard — ISR every 60s
// /events — ISR every 300s
```

### Convex Query Optimization
- **Indexes**: Every table has indexes for primary access patterns
- **Pagination**: All list queries use `paginationOptsValidator`
- **Denormalization**: `rooms.onlineCount`, `rooms.memberCount`, `users.xp` stored directly for fast reads
- **Batch queries**: Use `Promise.all()` for parallel Convex queries

### Cloudinary Transforms
```typescript
// Avatars: 80x80 webp, auto-quality
getAvatarUrl(publicId) → `https://res.cloudinary.com/${cloud}/image/upload/w_80,h_80,c_fill,f_webp,q_auto/${publicId}`

// Room avatars: 200x200
// Banners: 1200x300
// Thumbnails: 400x300 for media
```

### Client-Side Performance
- **Virtualized messaging**: `react-virtual` for 10,000+ messages
- **Image lazy loading**: `next/image` with blur placeholder
- **Code splitting**: Dynamic imports for heavy components (VideoConference, CodeEditor)
- **State management**: Zustand for UI state, Convex for server state
- **Debounce**: Search inputs (300ms), typing indicators (2000ms)
- **Optimistic updates**: Reactions + message send show immediately before server confirmation

---

*Last Updated: March 19, 2026 | AlloChat v2.0 | Stack: Next.js + Shadcn + Convex + Convex Auth*
