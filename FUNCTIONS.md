# AlloChat v2.0 — Complete Feature & Function Breakdown

> **Platform**: AlloChat v2.0 (rebranded from CodyChat 9.0)
> **Stack**: Next.js + Shadcn + Convex + Convex Auth
> **Status**: Analysis Complete → Active Development

---

## Table of Contents
1. [Naming & Nomenclature](#1-naming--nomenclature)
2. [Real-Time Messaging](#2-real-time-messaging)
3. [Authentication & User Management](#3-authentication--user-management)
4. [Room & Lobby System](#4-room--lobby-system)
5. [Voice & Video Calling](#5-voice--video-calling)
6. [User Profiles & Presence](#6-user-profiles--presence)
7. [Gamification System](#7-gamification-system)
8. [Rich Chat Features](#8-rich-chat-features)
9. [Addon & Plugin System](#9-addon--plugin-system)
10. [Moderation & Safety](#10-moderation--safety)
11. [Payment & Monetization](#11-payment--monetization)
12. [Notifications System](#12-notifications-system)
13. [Admin Dashboard](#13-admin-dashboard)
14. [Infrastructure & Architecture](#14-infrastructure--architecture)
15. [Custom New Features (v2.0 Only)](#15-custom-new-features-v20-only)
16. [Feature Comparison Matrix](#16-feature-comparison-matrix)

---

## 1. Naming & Nomenclature

### Product Name
| Old (CodyChat 9.0) | New (AlloChat v2.0) |
|--------------------|---------------------|
| CodyChat | **AlloChat** |
| Boom (internal prefix) | **allo** (internal prefix) |
| `boom_users` table | `users` (Convex table) |
| `boom_setting` | `settings` (Convex config) |
| `boom_conversation` | `directMessages` |
| `boom_private` | `directMessages` |
| `boom_rooms` | `rooms` |
| `boom_banned` | `moderationActions` |
| `boom_upload` | `mediaAttachments` |
| `boom_radio_stream` | `radioStreams` |
| VIP addon | **Premium+ / Elite tier** |
| Adnoyer addon | **Block & Report** system |
| Commandos addon | **SlashCommand** bot engine |
| SuperBot addon | **AlloBot** AI system |
| QuizBot addon | **QuizRoom** game mode |
| PaintIt addon | **SketchBoard** addon |
| Voice Record addon | **VoiceNote** feature |

### URL Structure
| Old PHP | New Next.js |
|---------|-------------|
| `/` (root lobby) | `/lobby` or `/app` |
| `/?room=123` | `/room/[roomId]` |
| `/admin.php` | `/admin/dashboard` |
| `/call.php` | `/call/[callId]` |
| `/recovery.php` | `/auth/forgot-password` |
| `/?page=profile` | `/profile/[userId]` |

### Permission Rank System
| Old Rank Value | New Role Name |
|----------------|---------------|
| 999 (superadmin) | `owner` |
| 100 (admin) | `admin` |
| 70 (operator) | `moderator` |
| 50 (staff) | `staff` |
| 6 (room admin) | `roomAdmin` |
| 5 (room mod) | `roomModerator` |
| 1 (VIP) | `premium` |
| 0 (user) | `user` |
| -1 (guest) | `guest` |

---

## 2. Real-Time Messaging

### CodyChat 9.0 — What It Had
- **Tech**: MySQL polling queries + Redis cache + jQuery AJAX
- Polling interval configured via `$setting['speed']` (default 3000ms = 3s)
- One-on-one private messaging (`boom_private` + `boom_conversation` tables)
- Group room messaging (`boom_main` table)
- Message history persistence (configurable by admin)
- Online/offline status tracked via `user_last` + `user_roomid` fields
- Typing indicators (polling-based)
- Basic read receipts via conversation table
- Real-time via Redis pub/sub (if enabled)
- Message encryption: session-based (basic)
- No message editing
- No message threading
- No emoji reactions
- Full-text search via MySQL LIKE

### AlloChat v2.0 — Enhanced
**Tech**: Convex real-time subscriptions (WebSocket-native, <100ms latency)

#### Key Improvements
| Feature | CodyChat | AlloChat v2.0 |
|---------|---------|---------------|
| Real-time transport | 3s AJAX polling | WebSocket (<100ms) |
| Message editing | ❌ | ✅ With edit history |
| Message deletion | ❌ | ✅ Soft-delete + audit |
| Emoji reactions | ❌ | ✅ Custom + standard |
| Threading | ❌ | ✅ Reply threads |
| Rich text | ❌ | ✅ Markdown + code blocks |
| Search | LIKE query | ✅ Convex full-text index |
| Message pinning | Basic | ✅ Per-room, ordered |
| DM conversations | Simple table | ✅ Full conversation view |

#### Convex Schema
```typescript
// convex/schema.ts
messages: defineTable({
  roomId: v.id('rooms'),
  senderId: v.id('users'),
  content: v.string(),
  richContent: v.optional(v.object({ blocks: v.array(v.any()) })),
  replyTo: v.optional(v.id('messages')),
  isPinned: v.boolean(),
  isDeleted: v.boolean(),
  editedAt: v.optional(v.number()),
  createdAt: v.number(),
  type: v.union(
    v.literal('text'),
    v.literal('media'),
    v.literal('system'),
    v.literal('gift'),
    v.literal('voice')
  ),
  readBy: v.array(v.object({ userId: v.id('users'), readAt: v.number() })),
}).index('byRoom', ['roomId', 'createdAt'])
  .searchIndex('searchMessages', { searchField: 'content', filterFields: ['roomId'] }),

directMessages: defineTable({
  conversationId: v.id('conversations'),
  senderId: v.id('users'),
  content: v.string(),
  isDeleted: v.boolean(),
  createdAt: v.number(),
  readAt: v.optional(v.number()),
}).index('byConversation', ['conversationId', 'createdAt']),

conversations: defineTable({
  participantIds: v.array(v.id('users')),
  lastMessageAt: v.number(),
  lastMessage: v.optional(v.string()),
}).index('byParticipant', ['participantIds']),
```

#### Convex Functions
```typescript
// convex/messages.ts
sendMessage(roomId, content, replyTo?)        // Send to room
editMessage(messageId, newContent)            // Edit with history
deleteMessage(messageId)                      // Soft-delete
addReaction(messageId, emoji)                 // Add emoji reaction
removeReaction(messageId, emoji)              // Remove reaction
pinMessage(messageId, roomId)                 // Pin in room
unpinMessage(messageId)                       // Unpin
listMessages(roomId, paginationOpts)          // Paginated room messages
searchMessages(query, roomId?)               // Full-text search
sendDirectMessage(recipientId, content)       // DM
markAsRead(conversationId)                    // Mark DM read
// Real-time
watchRoomMessages(roomId) → subscription     // Live message stream
watchDirectMessages(conversationId)          // Live DM stream
```

#### Components
```
components/chat/
├── MessageBubble.tsx       # Single message display (text/media/system)
├── MessageList.tsx         # Virtualized infinite scroll list
├── MessageInput.tsx        # Rich input with toolbar
├── RichTextEditor.tsx      # Tiptap/Plate editor integration
├── ReactionPicker.tsx      # Emoji reaction selector
├── TypingIndicator.tsx     # "X is typing..." (debounced)
├── ReadReceipts.tsx        # Per-message read status
├── PinnedMessages.tsx      # Pinned message bar at top
├── ThreadView.tsx          # Threaded reply view
└── GiphyPicker.tsx         # GIF search (Giphy API)
```

---

## 3. Authentication & User Management

### CodyChat 9.0 — What It Had
- Email + password only (MD5/SHA hash — insecure)
- Session via PHP `$_COOKIE` (BOOM_PREFIX + userid/utk)
- Username-based login with "remember me"
- Password reset via email (basic)
- Email verification OTP
- Guest accounts (configurable)
- User ranks: 0 (user), 6 (room admin), 50 (staff), 70 (op), 100 (admin), 999 (owner)
- IP-based ban/block system
- Registration limits: max accounts per IP per day
- COPPA age check (14+ minimum)
- Country/language detection
- VPN detection (via external API)
- Captcha support (reCAPTCHA)

### AlloChat v2.0 — Enhanced

#### Auth Methods
| Method | CodyChat | AlloChat v2.0 |
|--------|---------|---------------|
| Email + password | ✅ (MD5 — weak) | ✅ bcrypt + Convex Auth |
| Google OAuth | ❌ | ✅ |
| GitHub OAuth | ❌ | ✅ |
| Apple Sign-In | ❌ | ✅ |
| Phone OTP | ❌ | ✅ (Twilio) |
| Magic link | ❌ | ✅ (email + SMS) |
| Two-Factor (TOTP) | ❌ | ✅ + backup codes |
| Guest accounts | ✅ | ✅ |
| Passkeys (WebAuthn) | ❌ | ✅ (future) |

#### Convex Auth Config
```typescript
// convex/auth.ts
import { convexAuth } from '@convex-dev/auth/server';
import { Password } from '@convex-dev/auth/providers/Password';
import Google from '@auth/core/providers/google';
import GitHub from '@auth/core/providers/github';
import { ResendOTP } from '@convex-dev/auth/providers/ResendOTP';
import { TwilioVerify } from '@convex-dev/auth/providers/TwilioVerify';

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [
    Password({ profile(params) { return { email: params.email, name: params.name }; }}),
    Google,
    GitHub,
    ResendOTP,      // Email OTP + magic link
    TwilioVerify,   // Phone OTP
  ],
});
```

#### User Schema
```typescript
users: defineTable({
  // Auth
  email: v.optional(v.string()),
  phone: v.optional(v.string()),
  emailVerified: v.boolean(),
  phoneVerified: v.boolean(),
  
  // Profile
  username: v.string(),                          // unique handle
  displayName: v.string(),
  avatar: v.optional(v.string()),                // Cloudinary URL
  bannerImage: v.optional(v.string()),
  bio: v.optional(v.string()),
  pronouns: v.optional(v.string()),
  customStatus: v.optional(v.string()),
  statusEmoji: v.optional(v.string()),
  
  // Social
  socialLinks: v.optional(v.array(v.object({
    platform: v.string(),
    url: v.string(),
    verified: v.boolean(),
  }))),
  
  // Presence
  presenceStatus: v.union(
    v.literal('online'), v.literal('away'),
    v.literal('busy'), v.literal('offline')
  ),
  lastSeenAt: v.number(),
  currentRoomId: v.optional(v.id('rooms')),
  
  // Settings
  theme: v.union(v.literal('light'), v.literal('dark'), v.literal('system')),
  language: v.string(),
  notifications: v.object({
    messages: v.boolean(),
    calls: v.boolean(),
    mentions: v.boolean(),
    presence: v.boolean(),
  }),
  
  // Roles & Plan
  role: v.union(
    v.literal('owner'), v.literal('admin'), v.literal('moderator'),
    v.literal('staff'), v.literal('user'), v.literal('guest')
  ),
  subscriptionTier: v.union(
    v.literal('free'), v.literal('premium'), v.literal('pro'), v.literal('elite')
  ),
  
  // Stats
  xp: v.number(),
  level: v.number(),
  
  // GDPR & Compliance
  consentGiven: v.boolean(),
  consentAt: v.optional(v.number()),
  minAge: v.optional(v.number()),
  
  // System
  isBot: v.boolean(),
  isBanned: v.boolean(),
  banExpiry: v.optional(v.number()),
  createdAt: v.number(),
  updatedAt: v.number(),
}).index('byUsername', ['username'])
  .index('byEmail', ['email'])
  .searchIndex('searchUsers', { searchField: 'username', filterFields: ['role'] }),
```

#### Auth Pages
```
app/(auth)/
├── layout.tsx              # Centered card layout, AlloChat branding
├── sign-in/page.tsx        # Method selector (email/phone/OAuth)
├── sign-in/email/page.tsx  # Email + password login
├── sign-in/phone/page.tsx  # Phone + OTP login
├── sign-up/page.tsx        # Registration method selector
├── sign-up/email/page.tsx  # Email registration form
├── sign-up/phone/page.tsx  # Phone registration
├── verify-email/page.tsx   # OTP input (6-digit)
├── forgot-password/page.tsx # Reset flow step 1
├── reset-password/page.tsx  # New password entry
├── magic-link/page.tsx     # Auto-login from email link
└── onboarding/page.tsx     # Post-signup multi-step wizard
```

---

## 4. Room & Lobby System

### CodyChat 9.0 — What It Had
- Public + private rooms
- Room owner, moderators
- Password-protected rooms
- Room icons/avatars
- Room announcements (`room_news` field)
- Room topic
- Max user limit per room
- Room history (configurable)
- Lobby listing (optional, `use_lobby` setting)
- Basic filtering
- Kick, ban, mute within rooms
- Room-level addon enable/disable
- Bridge mode (connect two servers)

### AlloChat v2.0 — Enhanced

#### Room Types
| Type | Description |
|------|-------------|
| `public` | Anyone can browse and join |
| `private` | Invite-only |
| `secret` | Not listed, link-only |
| `community` | Verified community with moderation team |

#### Room Schema
```typescript
rooms: defineTable({
  name: v.string(),
  slug: v.string(),                              // URL-friendly name
  description: v.optional(v.string()),
  avatar: v.optional(v.string()),
  bannerImage: v.optional(v.string()),
  icon: v.optional(v.string()),                  // emoji
  
  // Settings
  type: v.union(v.literal('public'), v.literal('private'),
    v.literal('secret'), v.literal('community')),
  password: v.optional(v.string()),
  maxUsers: v.optional(v.number()),
  category: v.string(),                          // from room-categories.ts
  language: v.optional(v.string()),
  
  // Features
  allowCalls: v.boolean(),
  allowMedia: v.boolean(),
  requireVerification: v.boolean(),
  minAge: v.optional(v.number()),
  enabledAddons: v.array(v.string()),            // addon IDs
  
  // Ownership
  ownerId: v.id('users'),
  
  // Discovery
  tags: v.array(v.string()),
  isVerified: v.boolean(),
  isFeatured: v.boolean(),
  
  // Stats  
  memberCount: v.number(),
  onlineCount: v.number(),
  totalMessages: v.number(),
  
  // System
  topic: v.optional(v.string()),
  announcement: v.optional(v.string()),
  createdAt: v.number(),
  updatedAt: v.number(),
}).index('byCategory', ['category', 'type'])
  .index('byOwner', ['ownerId'])
  .searchIndex('searchRooms', { searchField: 'name', filterFields: ['category', 'type'] }),

roomMembers: defineTable({
  roomId: v.id('rooms'),
  userId: v.id('users'),
  role: v.union(
    v.literal('owner'), v.literal('admin'), v.literal('moderator'), v.literal('member')
  ),
  joinedAt: v.number(),
  mutedUntil: v.optional(v.number()),
  isBanned: v.boolean(),
}).index('byRoom', ['roomId', 'role'])
  .index('byUser', ['userId']),
```

#### Lobby & Discovery
- Category grid (Gaming, Music, Language, Coding, General, Study...)
- Real-time member count via Convex subscription
- "Trending Now" section (rooms with fastest growth)
- "Staff Picks" featured rooms
- Advanced search with filters (category, language, members, age restriction)
- Room previews (peek last 5 messages before joining)
- Invite link generation with expiry

#### Room Pages
```
app/(app)/
├── lobby/page.tsx                  # Room discovery grid
├── room/[roomId]/page.tsx          # Main chat view
├── room/[roomId]/settings/page.tsx # Room admin panel
└── room/[roomId]/members/page.tsx  # Member management
```

---

## 5. Voice & Video Calling

### CodyChat 9.0 — What It Had
- Agora SDK (legacy) OR LiveKit integration
- 1-on-1 video calls (`call.php`, `video_call.php`)
- 1-on-1 audio calls (`call.php`, `audio_call.php`)
- Group video calls (`group_call.php`, `group_video_call.php`)
- Group audio calls (`group_audio_call.php`)
- Call settings: max duration, cost in currency
- Call end page (`call_end.php`, `end_call.php`)
- No call quality metrics
- No recording
- No transcription
- No screen sharing UI

### AlloChat v2.0 — Enhanced

#### Call Infrastructure: LiveKit WebRTC
```typescript
// convex/calls.ts
calls: defineTable({
  initiatorId: v.id('users'),
  participantIds: v.array(v.id('users')),
  roomId: v.optional(v.id('rooms')),
  
  type: v.union(v.literal('audio'), v.literal('video'), v.literal('screen')),
  isGroup: v.boolean(),
  status: v.union(
    v.literal('ringing'), v.literal('connecting'),
    v.literal('active'), v.literal('ended'), v.literal('missed')
  ),
  
  // LiveKit
  liveKitRoom: v.string(),
  
  // Timing
  startedAt: v.optional(v.number()),
  endedAt: v.optional(v.number()),
  duration: v.optional(v.number()),
  
  // Quality
  recordingEnabled: v.boolean(),
  recordingUrl: v.optional(v.string()),
  transcriptionUrl: v.optional(v.string()),
  
  // Monetization
  costPerMinute: v.optional(v.number()),
  totalCost: v.optional(v.number()),
}).index('byInitiator', ['initiatorId'])
  .index('byStatus', ['status']),
```

#### Call Features
| Feature | CodyChat | AlloChat v2.0 |
|---------|---------|---------------|
| 1-on-1 video | ✅ | ✅ HD 720p+ |
| 1-on-1 audio | ✅ | ✅ |
| Group video | ✅ | ✅ Unlimited (plan-based) |
| Group audio | ✅ | ✅ |
| Screen sharing | ❌ | ✅ |
| Recording | ❌ | ✅ Consent-based |
| Transcription | ❌ | ✅ AI-powered |
| Virtual backgrounds | ❌ | ✅ Blur + custom |
| Noise cancellation | ❌ | ✅ AI-based |
| Call quality metrics | ❌ | ✅ Latency, bitrate, loss |
| Picture-in-picture | ❌ | ✅ |
| Active speaker focus | ❌ | ✅ |
| Reactions in call | ❌ | ✅ (emoji overlay) |

#### Call Components
```
components/calls/
├── IncomingCallDialog.tsx   # "User is calling..." with accept/reject
├── LiveCallScreen.tsx       # Main call UI (LiveKit)
├── CallControls.tsx         # Mute, camera, share, end
├── ParticipantGrid.tsx      # Video layout modes (grid/spotlight)
├── ParticipantTile.tsx      # Individual participant tile
├── CallQualityBadge.tsx     # Signal strength display
├── RecordingIndicator.tsx   # Visible recording status
└── CallSummaryCard.tsx      # Post-call summary (duration, cost)
```

---

## 6. User Profiles & Presence

### CodyChat 9.0 — What It Had
- Avatar upload (local server storage)
- Cover photo / banner
- Display name (changeable, with rank restrictions)
- User bio/about text
- User mood status
- Custom name colors (solid, gradient, neon effects)
- VIP badge system (via addon)
- Custom fonts for usernames
- Location info (country flag via geo detection)
- User level (if enabled)
- User wall (public post board)

### AlloChat v2.0 — Enhanced

```typescript
userProfiles: defineTable({
  userId: v.id('users'),
  
  // Appearance
  avatarStyle: v.string(),                       // custom avatar frame ID
  nameColor: v.optional(v.string()),             // hex or gradient
  nameEffect: v.optional(v.string()),            // 'solid'|'gradient'|'neon'|'animated'
  profileTheme: v.optional(v.string()),          // color scheme ID
  
  // Bio
  bio: v.optional(v.string()),
  interests: v.array(v.string()),
  languages: v.array(v.string()),
  website: v.optional(v.string()),
  
  // Socials
  socialLinks: v.array(v.object({
    platform: v.string(),
    url: v.string(),
  })),
  
  // Achievements
  showcasedBadges: v.array(v.id('badges')),      // up to 5 featured
  
  // Stats (denormalized for perf)
  totalMessages: v.number(),
  totalCallMinutes: v.number(),
  friendCount: v.number(),
  roomsOwned: v.number(),
  
  // Privacy
  showLastSeen: v.boolean(),
  showStats: v.boolean(),
  allowFriendRequests: v.boolean(),
  
  // Verification
  isVerified: v.boolean(),
  verifiedBadge: v.optional(v.string()),         // 'creator'|'business'|'notable'
}).index('byUserId', ['userId']),
```

#### Presence System
```typescript
presences: defineTable({
  userId: v.id('users'),
  status: v.union(v.literal('online'), v.literal('away'), v.literal('busy'), v.literal('offline')),
  customMessage: v.optional(v.string()),
  currentRoomId: v.optional(v.id('rooms')),
  lastHeartbeat: v.number(),
}).index('byUserId', ['userId'])
  .index('byRoom', ['currentRoomId']),
```

---

## 7. Gamification System

### CodyChat 9.0 — What It Had
- Level/XP system (via `use_level` setting)
- XP earned from: chat messages, private messages, gifts, wall posts
- Level modes: configurable thresholds
- Badge system (`use_badge` setting)
- Badge thresholds: chat count, gift count, likes, friend count
- Badges: Ruby (100 chats), Gold (5000 chats), Legendary (1000 chats)
- Basic leaderboard (rank by level)
- Currency: Ruby + Gold coins
- Ruby/Gold earning delays

### AlloChat v2.0 — Enhanced

```typescript
userXP: defineTable({
  userId: v.id('users'),
  totalXP: v.number(),
  level: v.number(),
  xpToNext: v.number(),
  updatedAt: v.number(),
}).index('byXP', ['totalXP']),

badges: defineTable({
  slug: v.string(),
  name: v.string(),
  description: v.string(),
  icon: v.string(),
  rarity: v.union(
    v.literal('common'), v.literal('uncommon'), v.literal('rare'),
    v.literal('epic'), v.literal('legendary'), v.literal('limited')
  ),
  category: v.string(),                         // 'chat'|'call'|'social'|'event'|'staff'
  condition: v.string(),                        // machine-readable unlock condition
  xpReward: v.number(),
  isSecret: v.boolean(),
  isLimited: v.boolean(),
  availableUntil: v.optional(v.number()),
}).index('byRarity', ['rarity']),

userBadges: defineTable({
  userId: v.id('users'),
  badgeId: v.id('badges'),
  unlockedAt: v.number(),
  progress: v.optional(v.number()),
}).index('byUser', ['userId']),

streaks: defineTable({
  userId: v.id('users'),
  type: v.string(),
  count: v.number(),
  multiplier: v.number(),
  lastAt: v.number(),
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
```

#### XP Actions & Rewards
| Action | XP Earned | Notes |
|--------|-----------|-------|
| Send room message | +1 XP | Capped at 100/day |
| Send voice note | +3 XP | |
| Complete call (1min) | +5 XP | Per minute |
| Make a new friend | +10 XP | |
| Send a gift | +5 XP | |
| Daily login | +20 XP | Streak multiplier applies |
| Week streak (7 days) | +200 XP | Bonus |
| Create a room | +50 XP | Once |
| Get room verified | +500 XP | Staff action |
| Participate in event | Varies | Event-specific |

#### Leaderboard Categories
- Global XP (all-time, monthly, weekly)
- Message count (weekly)
- Call minutes (monthly)
- Gift sending (all-time)
- Most friends
- Room owner popularity (by room members)

---

## 8. Rich Chat Features

### CodyChat 9.0 — What It Had
- Text messaging with `nl2br` line breaks
- Emoticons: 100+ custom emoticons (png/svg/gif/webp)
- Giphy integration (addon)
- YouTube video embed (addon)
- Gift sending (with currency)
- Voice recording (addon)
- Drawing/sketch canvas (PaintIt addon)
- Quote/reply (basic, via `allow_quote` setting)
- URL preview embedding
- Flood protection (configurable)
- Word filter
- Emoji shortcodes (`:smile:`, `:tongue:`, etc.)
- OpenAI image moderation (v9.0 new feature)
- File uploads: image, video, audio, zip
- Color text formatting

### AlloChat v2.0 — Enhanced

#### Extended Media Support
```typescript
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
  metadata: v.object({
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    duration: v.optional(v.number()),
    title: v.optional(v.string()),
    size: v.optional(v.number()),
  }),
  uploadedAt: v.number(),
}).index('byMessage', ['messageId']),
```

#### New Chat Features
- **Slash commands**: `/gif`, `/giphy`, `/youtube`, `/poll`, `/quiz`, `/clear`
- **Polls**: Create embedded polls in chat
- **Sticker packs**: Purchasable sticker collections
- **AI suggestions**: "Smart replies" powered by AI
- **Link previews**: Open Graph metadata preview cards
- **Code blocks**: Syntax-highlighted code sharing
- **LaTeX rendering**: Math formula support
- **Invisible ink**: Messages revealed on hover (fun feature)
- **Timed messages**: Auto-delete after N seconds
- **Language auto-translate**: Inline translation button per message

---

## 9. Addon & Plugin System

### CodyChat 9.0 — 9 Built-In Addons
| Addon | Function |
|-------|---------|
| **Adnoyer** | Flag users as "annoyers" — block + report |
| **Commandos** | Bot command system (`/command` syntax) |
| **Giphy** | GIF search and embed |
| **PaintIt** | Canvas drawing tool, save & share sketch |
| **QuizBot** | Create & host quizzes in room |
| **SuperBot** | AI/automated response bot |
| **VIP** | Premium membership tiers with badge |
| **Voice Record** | Record & send audio messages |
| **YouTube** | Embed YouTube videos inline |

Each addon has: own DB tables, admin UI, room-level toggle, custom PHP components

### AlloChat v2.0 — Plugin Architecture

```typescript
plugins: defineTable({
  slug: v.string(),
  name: v.string(),
  description: v.string(),
  version: v.string(),
  author: v.string(),
  authorId: v.optional(v.id('users')),
  icon: v.string(),
  category: v.string(),              // 'game'|'media'|'utility'|'social'|'bot'
  
  // Distribution
  isFree: v.boolean(),
  price: v.optional(v.number()),
  downloadUrl: v.string(),
  
  // Permissions
  requiredPermissions: v.array(v.string()),
  
  // Stats
  installCount: v.number(),
  rating: v.number(),
  reviewCount: v.number(),
  
  // Status
  isApproved: v.boolean(),
  isFeatured: v.boolean(),
}).index('byCategory', ['category', 'isApproved']),

roomPlugins: defineTable({
  roomId: v.id('rooms'),
  pluginId: v.id('plugins'),
  enabled: v.boolean(),
  config: v.optional(v.any()),
}).index('byRoom', ['roomId']),
```

#### Built-In AlloChat Plugins (v2.0)
| Plugin | Enhanced Description |
|--------|---------------------|
| **AlloBot** | AI-powered smart bot (GPT-4/Claude), natural language commands |
| **QuizRoom** | Full quiz game mode: timed, leaderboard, multiple choice |
| **SketchBoard** | Collaborative whiteboard (multiple users draw together) |
| **VoiceNote** | Voice messages with waveform visualization |
| **GifSearch** | Giphy + Tenor integration with trending section |
| **VideoClip** | YouTube + Vimeo + TikTok embed with auto-preview |
| **MusicSync** | Spotify/Apple Music listening party (play in sync) |
| **Polls** | Create polls with multiple options, real-time results |
| **Trivia** | Daily trivia game, automatic scoring |

---

## 10. Moderation & Safety

### CodyChat 9.0 — What It Had
- Kick user from room (temp kick with page)
- Ban user (global or IP ban)
- Mute: text mute, room mute, microphone mute
- Ghost mode (admin invisibility)
- IP banning table (`boom_banned`)
- Content filtering: word filter table (`boom_filter`)
- Captcha (reCAPTCHA)
- Flood protection (max messages per window)
- Email filter
- VPN detection
- OpenAI image moderation (v9.0)
- Admin console with logs

### AlloChat v2.0 — Enhanced

```typescript
moderationActions: defineTable({
  type: v.union(
    v.literal('warn'), v.literal('mute'), v.literal('kick'),
    v.literal('ban'), v.literal('suspend'), v.literal('contentRemove'),
    v.literal('ipBan')
  ),
  targetId: v.id('users'),
  moderatorId: v.id('users'),
  roomId: v.optional(v.id('rooms')),
  
  reason: v.string(),
  evidence: v.optional(v.string()),
  duration: v.optional(v.number()),
  expiresAt: v.optional(v.number()),
  
  appeal: v.optional(v.object({
    status: v.string(),
    message: v.string(),
    submittedAt: v.number(),
    reviewedAt: v.optional(v.number()),
    reviewedBy: v.optional(v.id('users')),
  })),
  
  isActive: v.boolean(),
  createdAt: v.number(),
}).index('byTarget', ['targetId', 'type', 'isActive']),

reports: defineTable({
  reporterId: v.id('users'),
  targetId: v.id('users'),
  contentId: v.optional(v.id('messages')),
  reason: v.string(),
  category: v.string(),              // 'spam'|'harassment'|'explicit'|'hate'|'impersonation'
  status: v.union(
    v.literal('pending'), v.literal('reviewing'), v.literal('resolved'), v.literal('dismissed')
  ),
  evidence: v.optional(v.string()),
  assignedTo: v.optional(v.id('users')),
  resolvedAt: v.optional(v.number()),
  createdAt: v.number(),
}).index('byStatus', ['status', 'createdAt']),

contentFilters: defineTable({
  pattern: v.string(),
  type: v.string(),               // 'word'|'regex'|'domain'
  action: v.string(),             // 'block'|'flag'|'replace'
  replacement: v.optional(v.string()),
  severity: v.string(),
}).index('byType', ['type']),
```

#### New Moderation Features
- AI content moderation (OpenAI Moderation API extended)  
- Real-time spam detection via message rate analysis
- User trust score (community-based)
- Auto-escalation for severe violations
- Shadow ban (user doesn't know they're muted)
- Community reporting with voting
- GDPR deletion request handling
- Appeal review workflow

---

## 11. Payment & Monetization

### CodyChat 9.0 — What It Had
- Wallet system: Ruby coins + Gold coins
- Gift system (animated gifts, purchasable)
- VIP membership (via addon, basic tiers)
- Currency earn via time delay (Ruby delay, Gold delay)
- Call cost (deduct from wallet per call)
- Currency purchases (no built-in Stripe — basic)

### AlloChat v2.0 — Full Monetization Stack

```typescript
wallets: defineTable({
  userId: v.id('users'),
  alloCoins: v.number(),             // main in-app currency (purchased)
  starDust: v.number(),               // earned currency (activity-based)
  frozenBalance: v.number(),
  currency: v.string(),
  updatedAt: v.number(),
}).index('byUser', ['userId']),

subscriptions: defineTable({
  userId: v.id('users'),
  tier: v.union(
    v.literal('free'), v.literal('premium'), v.literal('pro'), v.literal('elite')
  ),
  stripeSubscriptionId: v.optional(v.string()),
  stripeCustomerId: v.optional(v.string()),
  status: v.union(v.literal('active'), v.literal('cancelled'), v.literal('expired'), v.literal('trialing')),
  startDate: v.number(),
  renewalDate: v.number(),
  cancelAt: v.optional(v.number()),
  benefits: v.array(v.string()),
}).index('byUser', ['userId']),

gifts: defineTable({
  slug: v.string(),
  name: v.string(),
  icon: v.string(),
  animationType: v.string(),          // 'static'|'animated'|'3d'|'ai'
  category: v.string(),
  coinPrice: v.number(),
  isLimited: v.boolean(),
  availableUntil: v.optional(v.number()),
}).index('byCategory', ['category']),

giftTransactions: defineTable({
  senderId: v.id('users'),
  recipientId: v.id('users'),
  giftId: v.id('gifts'),
  messageId: v.optional(v.id('messages')),
  personalMessage: v.optional(v.string()),
  coinAmount: v.number(),
  createdAt: v.number(),
}).index('byRecipient', ['recipientId', 'createdAt']),
```

#### Subscription Tier Features
| Feature | Free | Premium ($4.99) | Pro ($9.99) | Elite ($24.99) |
|---------|------|-----------------|-------------|----------------|
| Ad-free | ❌ | ✅ | ✅ | ✅ |
| Message history | 6 months | 2 years | 5 years | Unlimited |
| Rooms own | 1 | 10 | 50 | Unlimited |
| Group call limit | 10 | 50 | 100 | Unlimited |
| Custom status | Static | ✅ Animated | ✅ | ✅ + emoji |
| AlloCoins bonus | 0 | +10%/purchase | +25% | +50% |
| Priority support | ❌ | Email 48h | Email 24h | Live chat |
| Custom domain | ❌ | ❌ | ❌ | ✅ |
| API access | ❌ | ❌ | Limited | Full |

---

## 12. Notifications System

### CodyChat 9.0 — What It Had
- Real-time notifications via Redis pub/sub (if enabled)
- Notification types: messages, calls, room actions
- Email notifications via PHPMailer/SMTP
- Browser notification bell (polling-based count)

### AlloChat v2.0 — Enhanced

```typescript
notifications: defineTable({
  userId: v.id('users'),
  type: v.string(),                  // 'message'|'mention'|'call'|'friend'|'gift'|'system'|'achievement'
  title: v.string(),
  body: v.string(),
  icon: v.optional(v.string()),
  link: v.optional(v.string()),
  isRead: v.boolean(),
  createdAt: v.number(),
}).index('byUser', ['userId', 'isRead', 'createdAt']),
```

#### Notification Channels
| Channel | Method |
|---------|--------|
| In-app bell | Convex real-time subscription |
| Push (web) | Web Push API + Service Worker |
| Push (mobile) | Expo Push Notifications (future) |
| Email | Resend (transactional) |
| SMS | Twilio (opt-in) |

---

## 13. Admin Dashboard

### CodyChat 9.0 — What It Had
- Admin panel (`admin.php`)
- User management (list, search, edit)
- Room management
- Settings management (all `$setting` values)
- System logs
- Ban/IP ban management
- Word filter management
- Addon management
- Contact/report management
- Rank management
- Radio stream management

### AlloChat v2.0 — Enhanced Admin

```
app/(app)/admin/
├── dashboard/page.tsx         # KPI overview (DAU, revenue, calls)
├── users/page.tsx             # User list + search + bulk actions
├── users/[userId]/page.tsx    # User detail + actions
├── rooms/page.tsx             # Room list management
├── moderation/page.tsx        # Report queue + actions
├── moderation/logs/page.tsx   # Full audit trail
├── analytics/page.tsx         # Charts: retention, engagement, revenue
├── billing/page.tsx           # Revenue dashboard
├── plugins/page.tsx           # Marketplace management
├── settings/page.tsx          # Global app settings
├── content-filters/page.tsx   # Word/domain/regex filters
└── announcements/page.tsx     # Global announcements
```

#### Admin Convex Functions
```typescript
// convex/admin.ts
getAdminStats()
  → { dau, mau, totalMessages, activeCalls, revenue }
listUsers(filters, pagination)
  → paginated user list with subscription info
suspendUser(userId, reason, duration?)
  → creates moderationAction + notifies user
deleteUserData(userId)
  → GDPR deletion (anonymize, remove personal data)
configureSettings(settings)
  → update global app config
generateApiKey(label, permissions)
  → create admin API key
getAuditLogs(filters, pagination)
  → full audit trail
```

---

## 14. Infrastructure & Architecture

### CodyChat 9.0 — Stack
| Layer | Technology |
|-------|-----------|
| Language | PHP 8 |
| Database | MySQL + Redis |
| Auth | PHP Sessions + Cookies |
| Real-time | Redis pub/sub + AJAX polling |
| WebRTC | Agora SDK or LiveKit |
| File storage | Local server |
| Email | PHPMailer/SMTP |
| Frontend | jQuery + vanilla CSS |
| Deployment | Shared hosting / VPS |

### AlloChat v2.0 — Stack
| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | Next.js 15 (App Router) + React 19 | SSR, streaming, RSC |
| UI | Shadcn/ui + Tailwind CSS | Accessible, themeable |
| Backend | Convex | Real-time, serverless, zero DevOps |
| Auth | Convex Auth | Multi-provider, secure sessions |
| Real-time | Convex subscriptions (WebSocket) | <100ms latency |
| WebRTC | LiveKit | Enterprise calling |
| Media | Cloudinary | CDN + transforms |
| Payments | Stripe | Global processing |
| Email | Resend | Reliable transactional |
| SMS | Twilio | Verification + notifications |
| Search | Convex full-text | Integrated, zero setup |
| State | Zustand | Client app state |
| Validation | Zod | Type-safe schemas |
| Deployment | Vercel (FE) + Convex (BE) | Edge, global scale |

---

## 15. Custom New Features (v2.0 Only)

These features don't exist in CodyChat 9.0 at all:

### 🆕 Social Graph
- Friend system (send/accept/decline requests)
- Follow system (public profiles)
- Mutual friends display
- Block list management
- "Find friends by contacts" (phone contacts sync)

### 🆕 Discover Feed
- Personalized room recommendations (based on interests)
- Trending content feed
- "For You" algorithm (activity-based)

### 🆕 Events System
```typescript
events: defineTable({
  title: v.string(),
  description: v.string(),
  hostId: v.id('users'),
  roomId: v.optional(v.id('rooms')),
  type: v.string(),           // 'live'|'game'|'quiz'|'watch_party'
  startsAt: v.number(),
  endsAt: v.number(),
  maxAttendees: v.optional(v.number()),
  registrantIds: v.array(v.id('users')),
  isPublic: v.boolean(),
  xpReward: v.number(),
}).index('byStart', ['startsAt']),
```

### 🆕 Watch Party
- Sync YouTube/video playback across all room members
- Real-time reaction overlays during video
- Group playlist management

### 🆕 Voice Rooms (Stage Mode)
- Listen-only audience mode
- Raise hand to speak
- Moderator controls speaker rotation
- Recording with auto-transcript

### 🆕 AI Features (AlloAI)
- Smart message summaries ("Catch up" when rejoining room)
- Auto-moderation suggestions
- Translation assistance
- Chatbot companion per room
- Smart reply suggestions

### 🆕 Mobile PWA
- Full offline mode (cached messages)
- Push notifications via service worker
- Install prompt for home screen
- Camera/mic direct from mobile

### 🆕 Command Palette (⌘K)
- Global search: rooms, users, messages
- Quick actions: create room, start call, DM user
- Navigate to any page instantly
- Recent history

---

## 16. Feature Comparison Matrix

| Feature / System | CodyChat 9.0 | AlloChat v2.0 | Improvement |
|-----------------|-------------|---------------|-------------|
| Real-time transport | AJAX polling (3s) | WebSocket (<100ms) | 30x faster |
| Auth methods | Email only | 7+ methods (OAuth, OTP, magic link) | Secure + flexible |
| Password security | MD5 | bcrypt + Convex Auth | Industry standard |
| Video calling | Agora SDK | LiveKit HD WebRTC | Recording, metrics, noise cancel |
| Message editing | ❌ | ✅ | Standard messaging UX |
| Emoji reactions | ❌ | ✅ | Engagement boost |
| Message search | MySQL LIKE | Convex full-text index | 100x faster |
| Rich text | ❌ | ✅ Markdown + code | Developer-friendly |
| Gamification | Basic XP/badges | Advanced: streaks, tiers, events | More engaging |
| Moderation | Manual | AI-assisted + appeals | Scalable |
| Monetization | Wallet + gifts | Subscriptions + gifts + API | Enterprise-ready |
| Addons | 9 built-in | Marketplace (open ecosystem) | Extensible |
| Notifications | Polling | Real-time + push + email + SMS | Complete |
| Analytics | Basic logs | Full dashboard + metrics | Data-driven |
| Internationalization | Multi-language files | i18next + 10+ languages | Global reach |
| Mobile | Responsive HTML | PWA + native (planned) | Mobile-first |
| Deployment | Shared hosting | Vercel + Convex edge | 99.99% uptime |
| Security | MD5, PHP sessions | bcrypt, Convex Auth, RBAC, audit logs | SOC2 level |
| Social features | Basic friends | Full social graph + events | Community platform |
| AI features | Image moderation | SmartChat + translation + AI bot | Next-gen |

---

*Last Updated: March 19, 2026 | AlloChat v2.0 | Stack: Next.js + Shadcn + Convex + Convex Auth*
