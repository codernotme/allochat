import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';
import { authTables } from '@convex-dev/auth/server';

export default defineSchema({
  // ══════════════════════════════════════════
  //  AUTH (managed by Convex Auth)
  // ══════════════════════════════════════════
  ...authTables,

  // ══════════════════════════════════════════
  //  USERS
  // ══════════════════════════════════════════
  users: defineTable({
    // Identity
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    username: v.string(),
    displayName: v.string(),

    // Avatar & Appearance
    avatar: v.optional(v.string()),
    bannerImage: v.optional(v.string()),
    nameColor: v.optional(v.string()),
    nameEffect: v.optional(v.string()),
    profileTheme: v.optional(v.string()),

    // Bio
    bio: v.optional(v.string()),
    pronouns: v.optional(v.string()),
    customStatus: v.optional(v.string()),
    statusEmoji: v.optional(v.string()),
    interests: v.optional(v.array(v.string())),
    languages: v.optional(v.array(v.string())),
    website: v.optional(v.string()),
    socialLinks: v.optional(
      v.array(
        v.object({
          platform: v.string(),
          url: v.string(),
        })
      )
    ),

    // Presence
    presenceStatus: v.optional(v.union(
      v.literal('online'),
      v.literal('away'),
      v.literal('busy'),
      v.literal('offline')
    )),
    lastSeenAt: v.optional(v.number()),
    currentRoomId: v.optional(v.id('rooms')),

    // Account Settings
    theme: v.optional(v.union(v.literal('light'), v.literal('dark'), v.literal('system'))),
    language: v.optional(v.string()),

    // Notification Prefs
    notifMessages: v.optional(v.boolean()),
    notifCalls: v.optional(v.boolean()),
    notifMentions: v.optional(v.boolean()),
    notifFriends: v.optional(v.boolean()),
    notifEmail: v.optional(v.boolean()),
    notifSMS: v.optional(v.boolean()),

    // RBAC
    role: v.optional(v.union(
      v.literal('owner'),
      v.literal('admin'),
      v.literal('moderator'),
      v.literal('staff'),
      v.literal('user'),
      v.literal('guest')
    )),
    subscriptionTier: v.optional(v.union(
      v.literal('free'),
      v.literal('premium'),
      v.literal('pro'),
      v.literal('elite')
    )),

    // Gamification (denormalized)
    xp: v.optional(v.number()),
    level: v.optional(v.number()),
    
    // Verification
    emailVerified: v.optional(v.boolean()),
    phoneVerified: v.optional(v.boolean()),
    isVerified: v.optional(v.boolean()),
    verifiedType: v.optional(v.string()),

    // Moderation state
    isBanned: v.optional(v.boolean()),
    banExpiry: v.optional(v.number()),
    isMuted: v.optional(v.boolean()),
    muteExpiry: v.optional(v.number()),

    // Status flags
    isBot: v.optional(v.boolean()),
    isDeleted: v.optional(v.boolean()),
    isGuest: v.optional(v.boolean()),
    minAge: v.optional(v.number()),
    consentGiven: v.optional(v.boolean()),

    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  })
    .index('byUsername', ['username'])
    .index('email', ['email'])
    .index('byPresence', ['presenceStatus'])
    .index('byRole', ['role'])
    .searchIndex('searchUsers', {
      searchField: 'username',
      filterFields: ['role', 'presenceStatus'],
    }),

  // ══════════════════════════════════════════
  //  ROOMS
  // ══════════════════════════════════════════
  rooms: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    avatar: v.optional(v.string()),
    bannerImage: v.optional(v.string()),
    icon: v.optional(v.string()),

    type: v.union(
      v.literal('public'),
      v.literal('private'),
      v.literal('secret'),
      v.literal('community')
    ),
    password: v.optional(v.string()),
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
      v.literal('owner'),
      v.literal('admin'),
      v.literal('moderator'),
      v.literal('member')
    ),
    joinedAt: v.number(),
    mutedUntil: v.optional(v.number()),
    isBanned: v.boolean(),
  })
    .index('byRoom', ['roomId', 'role'])
    .index('byUser', ['userId'])
    .index('byRoomAndUser', ['roomId', 'userId']),

  // ══════════════════════════════════════════
  //  MESSAGES
  // ══════════════════════════════════════════
  messages: defineTable({
    roomId: v.id('rooms'),
    senderId: v.id('users'),
    content: v.string(),
    richContent: v.optional(
      v.object({
        blocks: v.array(v.any()),
      })
    ),
    type: v.union(
      v.literal('text'),
      v.literal('media'),
      v.literal('system'),
      v.literal('gift'),
      v.literal('voice'),
      v.literal('poll')
    ),
    replyTo: v.optional(v.id('messages')),
    isPinned: v.boolean(),
    isDeleted: v.boolean(),
    deletedAt: v.optional(v.number()),
    editedAt: v.optional(v.number()),
    editHistory: v.optional(
      v.array(
        v.object({
          content: v.string(),
          editedAt: v.number(),
        })
      )
    ),
    reactions: v.array(
      v.object({
        emoji: v.string(),
        userIds: v.array(v.id('users')),
      })
    ),
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
      v.literal('image'),
      v.literal('video'),
      v.literal('audio'),
      v.literal('file'),
      v.literal('giphy'),
      v.literal('youtube'),
      v.literal('spotify'),
      v.literal('sketch'),
      v.literal('voiceNote'),
      v.literal('sticker'),
      v.literal('poll')
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

  // ══════════════════════════════════════════
  //  CALLS
  // ══════════════════════════════════════════
  calls: defineTable({
    initiatorId: v.id('users'),
    participantIds: v.array(v.id('users')),
    roomId: v.optional(v.id('rooms')),
    type: v.union(v.literal('audio'), v.literal('video'), v.literal('screen')),
    isGroup: v.boolean(),
    status: v.union(
      v.literal('ringing'),
      v.literal('connecting'),
      v.literal('active'),
      v.literal('ended'),
      v.literal('missed'),
      v.literal('rejected')
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
    .index('byParticipant', ['participantIds'])
    .index('byRoom', ['roomId', 'status']),

  // ══════════════════════════════════════════
  //  SOCIAL
  // ══════════════════════════════════════════
  friendships: defineTable({
    requesterId: v.id('users'),
    targetId: v.id('users'),
    status: v.union(
      v.literal('pending'),
      v.literal('accepted'),
      v.literal('declined')
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

  // ══════════════════════════════════════════
  //  GAMIFICATION
  // ══════════════════════════════════════════
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
      v.literal('common'),
      v.literal('uncommon'),
      v.literal('rare'),
      v.literal('epic'),
      v.literal('legendary'),
      v.literal('limited')
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

  // ══════════════════════════════════════════
  //  MONETIZATION
  // ══════════════════════════════════════════
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
      v.literal('purchase'),
      v.literal('gift_send'),
      v.literal('gift_receive'),
      v.literal('subscription'),
      v.literal('refund'),
      v.literal('earned'),
      v.literal('admin_adjustment')
    ),
    alloCoins: v.number(),
    starDust: v.optional(v.number()),
    description: v.string(),
    relatedId: v.optional(v.string()),
    status: v.union(
      v.literal('pending'),
      v.literal('completed'),
      v.literal('failed'),
      v.literal('refunded')
    ),
    createdAt: v.number(),
  }).index('byUser', ['userId', 'createdAt']),

  subscriptions: defineTable({
    userId: v.id('users'),
    tier: v.union(
      v.literal('free'),
      v.literal('premium'),
      v.literal('pro'),
      v.literal('elite')
    ),
    stripeSubscriptionId: v.optional(v.string()),
    stripeCustomerId: v.optional(v.string()),
    status: v.union(
      v.literal('active'),
      v.literal('cancelled'),
      v.literal('expired'),
      v.literal('trialing')
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

  // ══════════════════════════════════════════
  //  MODERATION
  // ══════════════════════════════════════════
  moderationActions: defineTable({
    type: v.union(
      v.literal('warn'),
      v.literal('mute'),
      v.literal('kick'),
      v.literal('ban'),
      v.literal('suspend'),
      v.literal('contentRemove'),
      v.literal('ipBan')
    ),
    targetId: v.id('users'),
    moderatorId: v.id('users'),
    roomId: v.optional(v.id('rooms')),
    reason: v.string(),
    evidence: v.optional(v.string()),
    duration: v.optional(v.number()),
    expiresAt: v.optional(v.number()),
    isActive: v.boolean(),
    appeal: v.optional(
      v.object({
        status: v.string(),
        message: v.string(),
        submittedAt: v.number(),
        reviewedAt: v.optional(v.number()),
        reviewedBy: v.optional(v.id('users')),
      })
    ),
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
      v.literal('pending'),
      v.literal('reviewing'),
      v.literal('resolved'),
      v.literal('dismissed')
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

  // ══════════════════════════════════════════
  //  PLUGINS
  // ══════════════════════════════════════════
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

  // ══════════════════════════════════════════
  //  NOTIFICATIONS
  // ══════════════════════════════════════════
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

  // ══════════════════════════════════════════
  //  EVENTS
  // ══════════════════════════════════════════
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
    status: v.union(
      v.literal('upcoming'),
      v.literal('live'),
      v.literal('ended'),
      v.literal('cancelled')
    ),
    createdAt: v.number(),
  })
    .index('byStart', ['startsAt', 'status'])
    .index('byHost', ['hostId']),

  // ══════════════════════════════════════════
  //  ADMIN
  // ══════════════════════════════════════════
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
