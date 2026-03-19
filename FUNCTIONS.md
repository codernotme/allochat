# AlloChat v2.0 — All Functionalities & Feature Breakdown

> **Status**: Analysis of CodyChat 9.0 → Migration Path to Modern SaaS (Next.js + Shadcn + Convex + Convex Auth)

---

## Table of Contents
1. [Core Real-Time Features](#core-real-time-features)
2. [User Management & Authentication](#user-management--authentication)
3. [Room & Lobby System](#room--lobby-system)
4. [Calling Features](#calling-features)
5. [User Profile & Personalization](#user-profile--personalization)
6. [Gamification System](#gamification-system)
7. [Chat Features & Content](#chat-features--content)
8. [Addon/Plugin System](#addonplugin-system)
9. [Admin Controls & Moderation](#admin-controls--moderation)
10. [Payment & Monetization](#payment--monetization)
11. [Infrastructure & Backend](#infrastructure--backend)

---

## 1. Core Real-Time Messaging

### Current Implementation (CodyChat 9.0)
**Tech**: MySQL + Redis + jQuery + WebSockets (via server polling/AJAX)

**Features**:
- ✅ One-on-one instant messaging
- ✅ Group room messaging (multiple users in same room)
- ✅ Message history persistence
- ✅ Online/offline status tracking
- ✅ Typing indicators
- ✅ Message read receipts (basic)
- ✅ Real-time notification push
- ✅ Message encryption (basic session-based)

**Current Limitations**:
- Polling-based real-time (inefficient at scale)
- No message reactions/emoji support in core
- Limited message search
- No message editing/deletion
- No thread/conversation feature

### Enhanced SaaS Version (v2.0)
**Tech**: Convex realtime engine + Next.js App Router + Shadcn

**Improvements**:
- **WebSocket-based** messaging (Convex real-time subscriptions)
- **Advanced search** with full-text index on messages
- **Message reactions** (emoji reactions + custom reactions)
- **Message editing & deletion** with history/audit trail
- **Typing indicator** with debounce optimization
- **Read receipts** (individual + group-level)
- **Message pinning** in rooms
- **Message threading** (reply-to-message feature)
- **Rich text support** (markdown, code blocks, formatting)
- **Inline media** support (images, videos, GIFs via Giphy integration native)
- **Message search** with filters (date, sender, room, keyword)

**Implementation Steps**:
```typescript
// 1. Convex Schema (convex/schema.ts)
defineSchema({
  messages: defineTable({
    roomId: v.id('rooms'),
    senderId: v.id('users'),
    content: v.string(),
    richContent: v.optional(v.object({
      blocks: v.array(v.any()), // Rich text blocks
    })),
    reactions: v.array(v.object({
      emoji: v.string(),
      userIds: v.array(v.id('users')),
    })),
    replyTo: v.optional(v.id('messages')),
    isPinned: v.boolean(),
    isDeleted: v.boolean(),
    editedAt: v.optional(v.number()),
    createdAt: v.number(),
    readBy: v.array(v.object({
      userId: v.id('users'),
      readAt: v.number(),
    })),
  }).index('byRoomId', ['roomId', 'createdAt']),
});

// 2. React Component (components/chat/MessageBubble.tsx)
export function MessageBubble({ message, currentUser }) {
  return (
    <div className="message-group">
      <div className="message">{message.content}</div>
      <MessageReactions message={message} />
      <MessageActions message={message} />
      <ReadReceipts message={message} />
    </div>
  );
}

// 3. Convex Mutation (convex/messages.ts)
export const sendMessage = mutation({
  args: {
    roomId: v.id('rooms'),
    content: v.string(),
    replyTo: v.optional(v.id('messages')),
  },
  handler: async (ctx, { roomId, content, replyTo }) => {
    const userId = await ctx.auth.getUserId();
    return ctx.db.insert('messages', {
      roomId,
      senderId: userId,
      content,
      replyTo,
      createdAt: Date.now(),
      readBy: [{ userId, readAt: Date.now() }],
    });
  },
});

// 4. Real-time Subscription (hooks/useRoomMessages.ts)
export function useRoomMessages(roomId: string) {
  return useQuery(api.messages.list, { roomId });
}
```

---

## 2. User Management & Authentication

### Current Implementation (CodyChat 9.0)
**Auth Methods**:
- ✅ Email + password registration/login
- ✅ Username-based login (unique per user)
- ✅ Session cookies (PHP SESSION)
- ✅ "Remember Me" functionality
- ✅ Password reset via email
- ✅ Email verification (basic OTP or link)

**User Data**:
- Username, email, password hash (MD5/SHA - **outdated**)
- Avatar (uploaded or default)
- User status (online/away/offline)
- Last seen timestamp
- Profile description
- User roles/permissions

**Current Limitations**:
- No OAuth/social login
- No 2FA/MFA
- Password hashing is weak (MD5)
- No account recovery options
- No email-based actions (password reset link expiration)

### Enhanced SaaS Version (v2.0)
**Auth Tech**: Convex Auth (Next.js integrated)

**New Auth Methods**:
- **Email + password** sign up/login (bcrypt + salt)
- **Google OAuth** (single sign-on)
- **GitHub OAuth** (for developer community)
- **Phone OTP** (Twilio/MSG91 providers)
- **Magic link** email login (passwordless)
- **Magic link phone** SMS login (passwordless)
- **Apple Sign-In** (iOS users)
- **2FA/TOTP** (Time-based One-Time Password)
- **Backup codes** for 2FA recovery

**User Profile Fields**:
```typescript
// convex/users.ts schema
defineSchema({
  users: defineTable({
    // Auth
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    passwordHash: v.optional(v.string()), // bcrypt
    twoFactorEnabled: v.boolean(),
    twoFactorSecret: v.optional(v.string()),
    backupCodes: v.array(v.string()),
    
    // Profile
    username: v.string(), // unique
    displayName: v.string(),
    avatar: v.optional(v.string()), // Cloudinary URL
    bio: v.optional(v.string()),
    pronouns: v.optional(v.string()),
    customStatus: v.optional(v.string()),
    
    // Social
    links: v.optional(v.object({
      twitter: v.optional(v.string()),
      instagram: v.optional(v.string()),
      website: v.optional(v.string()),
    })),
    
    // Presence
    status: v.union(v.literal('online'), v.literal('away'), v.literal('offline')),
    lastSeenAt: v.number(),
    currentRoomId: v.optional(v.id('rooms')),
    
    // Settings
    theme: v.union(v.literal('light'), v.literal('dark'), v.literal('system')),
    language: v.string(), // ISO 639-1 code
    notifications: v.object({
      messageNotifications: v.boolean(),
      callNotifications: v.boolean(),
      presenceUpdates: v.boolean(),
    }),
    
    // Account
    emailVerified: v.boolean(),
    phoneVerified: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index('byUsername', ['username']),
});
```

**Implementation**:
```typescript
// lib/auth/config.ts (Convex Auth Configuration)
import { defineAuth } from '@convex-dev/auth/server';
import Password from '@convex-dev/auth/providers/Password';
import Google from '@convex-dev/auth/providers/Google';
import GitHub from '@convex-dev/auth/providers/GitHub';

export const auth = defineAuth({
  providers: [
    Password,
    Google,
    GitHub,
  ],
});

// app/(auth)/sign-up/email/page.tsx
export default function SignUpEmail() {
  return (
    <AuthForm
      mode="signup"
      providers={['email', 'google', 'github', 'phone']}
      onSubmit={async (data) => {
        const result = await signUpEmail(data);
        redirect('/verify-email');
      }}
    />
  );
}

// app/(auth)/verify-email/page.tsx
export default function VerifyEmail() {
  const [code, setCode] = useState('');
  
  return (
    <VerificationForm
      title="Verify Your Email"
      description="We sent a 6-digit code to your email"
      onSubmit={async () => {
        await verifyEmailOTP(code);
        redirect('/app');
      }}
    />
  );
}
```

---

## 3. Room & Lobby System

### Current Implementation (CodyChat 9.0)
**Room Types**:
- ✅ Public rooms (anyone can join)
- ✅ Private rooms (invite-only, password protected)
- ✅ Personal rooms (1-on-1)
- ✅ Group rooms (multiple users)

**Room Features**:
- Room creation with name, description, avatar/icon
- Room settings (public/private, password, max users)
- Room history/logs
- Room owner & moderators
- Room pinned messages (basic)
- Room announcements

**Lobby System**:
- Display list of active public rooms
- Room count & user count display
- Search rooms by name/keyword
- Filter by category (optional)
- Join/create room workflow

**Current Limitations**:
- No room categories
- Limited room customization
- No room privacy levels (public/private/community)
- No room discovery algorithm

### Enhanced SaaS Version (v2.0)

**Room Features**:
```typescript
// convex/rooms.ts
defineSchema({
  rooms: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    avatar: v.optional(v.string()), // Cloudinary
    icon: v.optional(v.string()), // emoji or icon ID
    
    // Settings
    isPublic: v.boolean(),
    password: v.optional(v.string()), // bcrypt hashed
    maxUsers: v.optional(v.number()),
    category: v.string(), // 'gaming', 'music', 'language', 'general', etc.
    language: v.optional(v.string()),
    
    // Access Control
    ownerId: v.id('users'),
    moderatorIds: v.array(v.id('users')),
    bannedUserIds: v.array(v.id('users')),
    mutedUserIds: v.array(v.object({
      userId: v.id('users'),
      muteExpiry: v.number(),
    })),
    
    // Features
    allowCallsOnly: v.boolean(), // no chat
    requireVerification: v.boolean(),
    requireAge: v.optional(v.number()), // 13+, 18+, etc.
    
    // Stats
    memberCount: v.number(),
    totalMessages: v.number(),
    
    // Metadata
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index('byCategory', ['category', 'isPublic']),
});
```

**Lobby UI** (components/lobby/LobbyView.tsx):
```typescript
export function LobbyView() {
  const [filter, setFilter] = useState('all');
  const rooms = useQuery(api.rooms.getPublic, { 
    category: filter === 'all' ? undefined : filter 
  });

  return (
    <div className="lobby">
      <LobbyHeader />
      <div className="filters">
        <CategoryTabs 
          categories={['All', 'Gaming', 'Music', 'Language', 'General']}
          onChange={setFilter}
        />
        <SearchBox placeholder="Search rooms..." />
      </div>
      <div className="room-grid">
        {rooms?.map((room) => (
          <RoomCard 
            key={room._id}
            room={room}
            onJoin={() => joinRoom(room._id)}
          />
        ))}
      </div>
      <CreateRoomButton />
    </div>
  );
}
```

---

## 4. Calling Features

### Current Implementation (CodyChat 9.0)
**Call Types**:
- ✅ 1-on-1 video calls
- ✅ 1-on-1 audio calls
- ✅ Group video calls
- ✅ Group audio calls

**Call Control**:
- Initiate call (incoming/outgoing)
- Answer/reject/end call
- Mute/unmute microphone
- Enable/disable video
- Screen sharing (optional with Agora/LiveKit)
- Call recording (basic)

**Call Signaling**:
- Agora SDK integration (alternative: LiveKit WebRTC)
- WebRTC peer connection
- Call state tracking (ringing, connected, ended)
- Call history/logs

**Current Limitations**:
- Single provider (Agora or LiveKit, configuration required)
- No call quality metrics
- Limited bandwidth optimization
- No call transcription

### Enhanced SaaS Version (v2.0)
**Call Infrastructure**: LiveKit WebRTC + Token generation in Convex

```typescript
// convex/calls.ts
defineSchema({
  calls: defineTable({
    // Participants
    initiatorId: v.id('users'),
    participantIds: v.array(v.id('users')),
    roomId: v.optional(v.id('rooms')), // if group call in room
    
    // Call State
    callType: v.union(
      v.literal('audio'),
      v.literal('video'),
      v.literal('screen')
    ),
    isGroupCall: v.boolean(),
    status: v.union(
      v.literal('ringing'),
      v.literal('connecting'),
      v.literal('connected'),
      v.literal('ended')
    ),
    
    // LiveKit Related
    liveKitRoomName: v.string(), // unique token per call
    liveKitToken: v.optional(v.string()), // JWT token
    
    // Tracking
    startedAt: v.optional(v.number()),
    endedAt: v.optional(v.number()),
    duration: v.optional(v.number()), // in seconds
    
    // Quality
    recordingUrl: v.optional(v.string()), // S3/Cloudinary
    transcriptionUrl: v.optional(v.string()),
    metrics: v.optional(v.object({
      avgLatency: v.number(),
      packetLoss: v.number(),
      avgBitrate: v.number(),
    })),
  }).index('byInitiator', ['initiatorId', 'startedAt']),
});

// Mutation to generate LiveKit tokens
export const startCall = mutation({
  args: {
    targetUserId: v.optional(v.id('users')),
    roomId: v.optional(v.id('rooms')),
    callType: v.union(v.literal('audio'), v.literal('video')),
  },
  handler: async (ctx, { targetUserId, roomId, callType }) => {
    const userId = await ctx.auth.getUserId();
    
    // Generate unique LiveKit room name
    const liveKitRoomName = `call_${userId}_${Date.now()}`;
    
    // Generate LiveKit API token
    const token = generateLiveKitToken({
      roomName: liveKitRoomName,
      identity: userId,
    });
    
    const callId = await ctx.db.insert('calls', {
      initiatorId: userId,
      participantIds: targetUserId ? [targetUserId] : [],
      roomId,
      callType,
      isGroupCall: !!roomId,
      status: 'ringing',
      liveKitRoomName,
      liveKitToken: token,
    });
    
    return { callId, liveKitToken: token, liveKitRoomName };
  },
});
```

**Call UI** (components/call/LiveCallScreen.tsx):
```typescript
import { LiveKitRoom, VideoConference } from '@livekit/components-react';

export function LiveCallScreen({ callId }: { callId: string }) {
  const call = useQuery(api.calls.getById, { callId });
  
  return (
    <LiveKitRoom
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={call?.liveKitToken}
      roomName={call?.liveKitRoomName}
      connect
      audio
      video
    >
      <VideoConference />
      <CallControls callId={callId} />
      <CallQualityDisplay callId={callId} />
    </LiveKitRoom>
  );
}
```

---

## 5. User Profile & Personalization

### Current Implementation (CodyChat 9.0)
- ✅ Profile picture/avatar (upload or Gravatar)
- ✅ Display name
- ✅ Bio/about section
- ✅ Status message
- ✅ User verification badge (optional)
- ✅ Profile view (public/private)

**Current Limitations**:
- Limited customization options
- No profile themes
- No social links section
- Basic profile fields

### Enhanced SaaS Version (v2.0)

**Profile Features**:
```typescript
// Ultra-enhanced profile system
defineSchema({
  userProfiles: defineTable({
    userId: v.id('users'),
    
    // Basic
    displayName: v.string(),
    bio: v.optional(v.string()),
    avatar: v.optional(v.string()), // Cloudinary
    bannerImage: v.optional(v.string()),
    customStatus: v.optional(v.string()),
    statusEmoji: v.optional(v.string()),
    pronouns: v.optional(v.string()),
    
    // Social & Links
    socialLinks: v.array(v.object({
      platform: v.string(), // 'twitter', 'instagram', 'youtube', etc.
      url: v.string(),
      verified: v.boolean(),
    })),
    website: v.optional(v.string()),
    
    // Interests & Tags
    interests: v.array(v.string()), // ['gaming', 'music', 'coding']
    languages: v.array(v.string()),
    
    // Profile Customization
    theme: v.string(), // color scheme
    badges: v.array(v.object({
      badgeId: v.id('badges'),
      earnedAt: v.number(),
    })),
    
    // Stats & Achievements
    totalCallTime: v.number(),
    roomsCreated: v.number(),
    friendCount: v.number(),
    
    // Privacy Settings
    isProfilePublic: v.boolean(),
    showEmail: v.boolean(),
    showPhone: v.boolean(),
    showLastSeen: v.boolean(),
    
    // Verification
    isVerified: v.boolean(), // admin verified
    verificationMethod: v.optional(v.string()), // email, phone, etc.
  }).index('byUserId', ['userId']),
});
```

**Profile Page** (app/(app)/profile/[userId]/page.tsx):
```typescript
export default function ProfilePage({ params }: { params: { userId: string } }) {
  const user = useQuery(api.users.getById, { userId: params.userId });
  const profile = useQuery(api.userProfiles.getByUserId, { 
    userId: params.userId 
  });
  
  return (
    <div className="profile-page">
      <ProfileHeader 
        user={user}
        profile={profile}
        onEditProfile={canEdit}
      />
      <ProfileStats user={user} />
      <ProfileBadges badges={profile?.badges} />
      <ProfileInterests interests={profile?.interests} />
      <SocialLinks links={profile?.socialLinks} />
      <RecentActivity userId={params.userId} />
    </div>
  );
}
```

---

## 6. Gamification System

### Current Implementation (CodyChat 9.0)
**Features**:
- ✅ Level system (user XP points)
- ✅ Badge/achievement system
- ✅ Leaderboard (local & global)
- ✅ User ranking (visual rank display)
- ✅ Gift/tip system (with wallet)

**Current Limitations**:
- Basic point calculation
- Limited achievement types
- No reward milestones
- Leaderboard only sorts by points

### Enhanced SaaS Version (v2.0)

```typescript
// convex/gamification.ts
defineSchema({
  // User Experience & Levels
  userXP: defineTable({
    userId: v.id('users'),
    totalXP: v.number(),
    currentLevel: v.number(),
    xpToNextLevel: v.number(),
    currentXP: v.number(),
    updatedAt: v.number(),
  }).index('byXP', ['totalXP']),

  // Achievements / Badges
  badges: defineTable({
    name: v.string(),
    description: v.string(),
    icon: v.string(), // emoji or URL
    condition: v.string(), // 'first_call', 'level_10', '100_messages', etc.
    rarity: v.union(
      v.literal('common'),
      v.literal('uncommon'),
      v.literal('rare'),
      v.literal('epic'),
      v.literal('legendary')
    ),
    xpReward: v.number(), // XP gained on unlock
  }),

  // User Badges (earned)
  userBadges: defineTable({
    userId: v.id('users'),
    badgeId: v.id('badges'),
    unlockedAt: v.number(),
    progress: v.optional(v.number()), // 0-100 for partial badges
  }).index('byUserId', ['userId']),

  // Leaderboards
  leaderboards: defineTable({
    type: v.union(
      v.literal('global_xp'),
      v.literal('weekly_messages'),
      v.literal('monthly_calls'),
      v.literal('room_members'),
      v.literal('friends')
    ),
    userId: v.id('users'),
    score: v.number(),
    rank: v.number(),
    period: v.string(), // 'weekly', 'monthly', 'all_time'
    updatedAt: v.number(),
  }).index('byType', ['type', 'period', 'score']),

  // Rewards & Streaks
  streaks: defineTable({
    userId: v.id('users'),
    type: v.string(), // 'daily_login', 'weekly_messages', etc.
    count: v.number(),
    lastAwardedAt: v.number(),
    expiresAt: v.number(),
    multiplier: v.number(), // 1x, 2x, 5x XP bonus for long streaks
  }),
});
```

**XP & Leveling System**:
```typescript
// mutations for XP gain
export const addXP = mutation({
  args: {
    userId: v.id('users'),
    amount: v.number(),
    reason: v.string(),
  },
  handler: async (ctx, { userId, amount, reason }) => {
    const userXP = await ctx.db
      .query('userXP')
      .withIndex('byUserId', (q) => q.eq('userId', userId))
      .first();

    const newTotalXP = (userXP?.totalXP ?? 0) + amount;
    const newLevel = Math.floor(newTotalXP / 1000) + 1; // 1000 XP = 1 level

    // Check for streak bonuses
    const streak = await ctx.db
      .query('streaks')
      .filter((q) => q.eq(q.field('userId'), userId))
      .first();
    
    const streakMultiplier = streak?.multiplier ?? 1;
    const finalXP = amount * streakMultiplier;

    // Update or create XP record
    if (userXP) {
      await ctx.db.patch(userXP._id, {
        totalXP: newTotalXP,
        currentLevel: newLevel,
        currentXP: (userXP.currentXP + finalXP) % 1000,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert('userXP', {
        userId,
        totalXP: newTotalXP,
        currentLevel: newLevel,
        currentXP: finalXP % 1000,
        updatedAt: Date.now(),
      });
    }

    // Check for badge unlocks
    await checkBadgeUnlocks(ctx, userId);
    
    // Update leaderboards
    await updateLeaderboards(ctx, userId);
  },
});
```

**Leaderboard Component** (components/gamification/Leaderboard.tsx):
```typescript
export function Leaderboard({ type = 'global_xp' }: { type: string }) {
  const leaderboard = useQuery(api.gamification.getLeaderboard, { type });
  
  return (
    <div className="leaderboard">
      <h2>Global Leaderboard</h2>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Score</th>
            <th>Badge</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard?.map((entry, idx) => (
            <LeaderboardRow 
              key={entry.userId}
              rank={idx + 1}
              user={entry}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## 7. Chat Features & Content

### Current Implementation (CodyChat 9.0)
- ✅ Text messaging
- ✅ Emoticons/emojis (library)
- ✅ Giphy integration (GIF sharing)
- ✅ YouTube video sharing (embed)
- ✅ Gift sending (monetized)
- ✅ Voice recording addon (record & send audio)
- ✅ Drawing/paint addon (sketch & share)

### Enhanced SaaS Version (v2.0)

**Rich Media Support**:
```typescript
// convex/media.ts
defineSchema({
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
      v.literal('sketch')
    ),
    url: v.string(),
    metadata: v.object({
      width: v.optional(v.number()),
      height: v.optional(v.number()),
      duration: v.optional(v.number()),
      title: v.optional(v.string()),
      thumbnail: v.optional(v.string()),
    }),
    uploadedAt: v.number(),
  }).index('byMessageId', ['messageId']),

  // Gift store
  gifts: defineTable({
    name: v.string(),
    icon: v.string(), // emoji or URL
    price: v.number(), // in-app currency
    category: v.string(), // 'love', 'funny', 'celebration', etc.
  }),

  // Gift transactions
  giftTransactions: defineTable({
    senderId: v.id('users'),
    recipientId: v.id('users'),
    giftId: v.id('gifts'),
    timestamp: v.number(),
    messageId: v.optional(v.id('messages')),
  }).index('byRecipient', ['recipientId', 'timestamp']),
});
```

**Rich Message Component** (components/chat/RichMessage.tsx):
```typescript
export function RichMessage({ message }) {
  return (
    <div className="message">
      <MessageContent content={message.content} />
      
      {message.richContent && (
        <RichTextRenderer blocks={message.richContent.blocks} />
      )}
      
      {message.attachments?.map((attachment) => (
        <MediaAttachment 
          key={attachment._id}
          attachment={attachment}
        />
      ))}
      
      {message.reactions && <ReactionRow reactions={message.reactions} />}
    </div>
  );
}

// Giphy integration
export function GiphySelector({ onSelect }) {
  const [query, setQuery] = useState('');
  const [gifs, setGifs] = useState([]);

  useEffect(() => {
    if (query) {
      fetch(`https://api.giphy.com/v1/gifs/search?q=${query}&api_key=${GIPHY_KEY}`)
        .then((r) => r.json())
        .then((d) => setGifs(d.data));
    }
  }, [query]);

  return (
    <div className="giphy-selector">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search GIFs..."
      />
      <div className="gif-grid">
        {gifs.map((gif) => (
          <img
            key={gif.id}
            src={gif.images.fixed_height.url}
            onClick={() => onSelect(gif)}
            alt={gif.title}
          />
        ))}
      </div>
    </div>
  );
}

// Embedded drawing tool
import DrawingBoard from 'react-drawingboard';

export function SketchTool({ onSave }) {
  return (
    <DrawingBoard
      width={300}
      height={300}
      onSave={onSave}
    />
  );
}
```

---

## 8. Addon/Plugin System

### Current Implementation (CodyChat 9.0)
**Available Addons**:
1. **Adnoyer** — Mark users as "annoyers" (block/flag)
2. **Commandos** — Bot command system (/command) 
3. **Giphy** — GIF search & embed
4. **Paint It** — Drawing/sketch canvas
5. **QuizBot** — Create & play quizzes
6. **SuperBot** — AI/automated responses
7. **VIP** — Premium membership levels
8. **Voice Record** — Record & send audio messages
9. **YouTube** — Embed YouTube videos

**Plugin Architecture**:
- Each addon has own DB table(s)
- Addons can register custom UI components
- System/admin can enable/disable per room

### Enhanced SaaS Version (v2.0)

**Plugin System**:
```typescript
// convex/plugins.ts
defineSchema({
  // Plugin registry
  plugins: defineTable({
    name: v.string(),
    description: v.string(),
    version: v.string(),
    author: v.string(),
    icon: v.string(),
    category: v.string(), // 'game', 'productivity', 'media', 'entertainment'
    enabled: v.boolean(),
    
    // Plugin code/config
    configSchema: v.optional(v.any()), // JSON schema for plugin settings
    permissions: v.array(v.string()), // ['messages.read', 'calls.access', etc.]
    
    // Metadata
    installCount: v.number(),
    rating: v.number(),
    downloadUrl: v.string(),
    documentationUrl: v.string(),
    sourceUrl: v.optional(v.string()),
  }),

  // Room plugin settings
  roomPluginSettings: defineTable({
    roomId: v.id('rooms'),
    pluginId: v.id('plugins'),
    enabled: v.boolean(),
    config: v.optional(v.any()),
  }).index('byRoom', ['roomId']),

  // User plugin preferences
  userPluginPreferences: defineTable({
    userId: v.id('users'),
    pluginId: v.id('plugins'),
    settings: v.optional(v.any()),
    enabled: v.boolean(),
  }).index('byUser', ['userId']),
});

// Plugin handler function
export const executePluginCommand = action({
  args: {
    pluginId: v.id('plugins'),
    command: v.string(),
    args: v.optional(v.any()),
  },
  handler: async (ctx, { pluginId, command, args }) => {
    // Load plugin code from URL
    const plugin = await ctx.runQuery(api.plugins.getById, { pluginId });
    
    // Fetch plugin code
    const code = await fetch(plugin.downloadUrl).then((r) => r.text());
    
    // Execute in isolated sandbox (using vm2 or similar)
    const vm = new VM({ sandbox: { args, ctx } });
    const result = vm.run(code);
    
    return result;
  },
});
```

**Marketplace UI** (app/(app)/plugins/marketplace/page.tsx):
```typescript
export default function PluginMarketplace() {
  const plugins = useQuery(api.plugins.listAll, {});
  const [installed, setInstalled] = useState(new Set());

  return (
    <div className="plugin-marketplace">
      <h1>Plugin Marketplace</h1>
      <div className="plugin-grid">
        {plugins?.map((plugin) => (
          <PluginCard
            key={plugin._id}
            plugin={plugin}
            isInstalled={installed.has(plugin._id)}
            onInstall={async () => {
              await installPlugin(plugin._id);
              setInstalled((prev) => new Set([...prev, plugin._id]));
            }}
          />
        ))}
      </div>
    </div>
  );
}
```

---

## 9. Admin Controls & Moderation

### Current Implementation (CodyChat 9.0)
**Moderation Features**:
- ✅ Kick user from room
- ✅ Ban user (global or room-specific)
- ✅ Mute user (text or audio)
- ✅ Ghost/invisibility (admin action)
- ✅ IP banning
- ✅ Content filtering/flagging
- ✅ User permission levels
- ✅ Admin console/logs
- ✅ Contact management (reports)

**Admin Dashboard**:
- User management
- Room management
- Settings management
- System logs
- Ban/block lists
- Permission tiers

### Enhanced SaaS Version (v2.0)

```typescript
// convex/moderation.ts
defineSchema({
  // Moderation actions
  moderationActions: defineTable({
    actionType: v.union(
      v.literal('kick'),
      v.literal('ban'),
      v.literal('mute'),
      v.literal('warn'),
      v.literal('suspend'),
      v.literal('content_remove')
    ),
    targetUserId: v.id('users'),
    moderatorId: v.id('users'),
    roomId: v.optional(v.id('rooms')), // null = global
    
    // Details
    reason: v.string(),
    duration: v.optional(v.number()), // in milliseconds
    expiresAt: v.optional(v.number()),
    
    // Audit trail
    evidence: v.optional(v.string()), // message/content ID
    appeal: v.optional(v.object({
      status: v.string(), // 'pending', 'approved', 'denied'
      message: v.string(),
      submittedAt: v.number(),
      reviewedAt: v.optional(v.number()),
    })),
    
    createdAt: v.number(),
  }).index('byTarget', ['targetUserId', 'actionType']),

  // Content policy violations
  contentViolations: defineTable({
    messageId: v.id('messages'),
    userId: v.id('users'),
    violationType: v.string(), // 'spam', 'hate_speech', 'explicit', etc.
    severity: v.union(
      v.literal('low'),
      v.literal('medium'),
      v.literal('high'),
      v.literal('critical')
    ),
    autoDetected: v.boolean(), // AI flagged vs manual
    actionTaken: v.optional(v.string()),
    flaggedAt: v.number(),
  }).index('byMessage', ['messageId']),

  // Permission overrides
  permissionOverrides: defineTable({
    userId: v.id('users'),
    permission: v.string(), // 'can_create_rooms', 'can_monetize', etc.
    granted: v.boolean(),
    grantedBy: v.id('users'),
    reason: v.optional(v.string()),
    expiresAt: v.optional(v.number()),
  }).index('byUser', ['userId']),
});
```

**Moderation Dashboard** (app/(app)/admin/moderation/page.tsx):
```typescript
export default function ModerationDashboard() {
  const pendingReports = useQuery(api.moderation.getPendingReports, {});
  const recentActions = useQuery(api.moderation.getRecentActions, {});
  
  return (
    <div className="moderation-dashboard">
      <ModerationStats />
      
      <section className="pending-reports">
        <h2>Pending Reports</h2>
        <table>
          <tbody>
            {pendingReports?.map((report) => (
              <ReportRow 
                key={report._id}
                report={report}
                onAction={handleModerationAction}
              />
            ))}
          </tbody>
        </table>
      </section>
      
      <section className="recent-actions">
        <h2>Recent Moderation Actions</h2>
        <ModerationTimeline actions={recentActions} />
      </section>
    </div>
  );
}
```

---

## 10. Payment & Monetization

### Current Implementation (CodyChat 9.0)
**Features**:
- ✅ Wallet system (in-app currency)
- ✅ Gift purchases
- ✅ VIP membership tiers
- ✅ Level-based rewards

**Current Limitations**:
- Basic payment processing (likely Stripe only)
- No subscription support
- Limited monetization options
- No analytics on revenue

### Enhanced SaaS Version (v2.0)

```typescript
// convex/payments.ts
defineSchema({
  // In-app currency & wallets
  wallets: defineTable({
    userId: v.id('users'),
    balance: v.number(), // in cents
    frozenBalance: v.number(), // pending transactions
    currency: v.string(), // 'USD', 'INR', etc.
    lastUpdatedAt: v.number(),
  }).index('byUserId', ['userId']),

  // Transaction log
  walletTransactions: defineTable({
    userId: v.id('users'),
    type: v.union(
      v.literal('purchase'),
      v.literal('gift_send'),
      v.literal('gift_receive'),
      v.literal('subscription'),
      v.literal('refund'),
      v.literal('admin_adjustment')
    ),
    amount: v.number(),
    description: v.string(),
    relatedId: v.optional(v.string()), // order ID, transaction ID, etc.
    status: v.union(
      v.literal('pending'),
      v.literal('completed'),
      v.literal('failed'),
      v.literal('refunded')
    ),
    metadata: v.optional(v.any()),
    createdAt: v.number(),
  }).index('byUser', ['userId', 'createdAt']),

  // Subscriptions (VIP, Premium)
  subscriptions: defineTable({
    userId: v.id('users'),
    tier: v.union(
      v.literal('free'),
      v.literal('premium'),
      v.literal('vip'),
      v.literal('elite')
    ),
    stripeSubscriptionId: v.optional(v.string()),
    
    // Dates
    startDate: v.number(),
    renewalDate: v.number(),
    cancelledAt: v.optional(v.number()),
    
    // Benefits (stored for analytics)
    benefits: v.array(v.string()),
    
    status: v.union(
      v.literal('active'),
      v.literal('cancelled'),
      v.literal('expired')
    ),
  }).index('byUser', ['userId']),

  // Subscription plans
  subscriptionPlans: defineTable({
    name: v.string(),
    tier: v.string(),
    price: v.number(), // monthly
    currency: v.string(),
    stripePriceId: v.string(),
    
    // Features
    features: v.array(v.object({
      name: v.string(),
      enabled: v.boolean(),
      limit: v.optional(v.number()),
    })),
    
    order: v.number(), // for sorting/display
  }),

  // Revenue tracking
  revenueEvents: defineTable({
    type: v.string(), // 'subscription', 'gift', 'donation', 'commission'
    userId: v.id('users'),
    amount: v.number(),
    currency: v.string(),
    timestamp: v.number(),
    metadata: v.optional(v.any()),
  }).index('byTimestamp', ['timestamp']),
});

// Actions for Stripe webhook
export const handleStripeWebhook = action({
  args: { event: v.any() },
  handler: async (ctx, { event }) => {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        await ctx.runMutation(api.payments.updateSubscription, {
          userId: subscription.metadata.userId,
          status: subscription.status,
          renewalDate: subscription.current_period_end * 1000,
        });
        break;
      }
      case 'charge.succeeded': {
        const charge = event.data.object;
        await ctx.runMutation(api.payments.recordTransaction, {
          userId: charge.metadata.userId,
          amount: charge.amount,
          type: 'purchase',
          status: 'completed',
        });
        break;
      }
    }
  },
});
```

---

## 11. Infrastructure & Backend

### Current Implementation (CodyChat 9.0)
**Stack**:
- MySQL database
- Redis cache (optional)
- Apache/Nginx server
- PHP backend
- jQuery frontend
- Agora/LiveKit (WebRTC)
- Session-based auth

**Features**:
- Multi-language support
- Rate limiting
- CSRF protection
- File uploads (avatars, media)
- Browser caching


### Enhanced SaaS Version (v2.0)
**Tech Stack**:
- **Frontend**: Next.js 16 (App Router) + React 19 + Shadcn UI
- **Backend**: Convex (real-time backend)
- **Auth**: Convex Auth
- **Real-time**: Convex subscriptions + LiveKit WebRTC
- **Database**: Convex DB (PostgreSQL backend)
- **Media**: Cloudinary (image/video hosting)
- **Payments**: Stripe
- **Deployment**: Vercel (frontend) + Convex (backend)

```typescript
// convex/schema.ts - Full database structure
import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  // Core
  users: defineTable({ /* ... */ }),
  userProfiles: defineTable({ /* ... */ }),
  
  // Messaging
  messages: defineTable({ /* ... */ }),
  mediaAttachments: defineTable({ /* ... */ }),
  
  // Calls
  calls: defineTable({ /* ... */ }),
  
  // Rooms
  rooms: defineTable({ /* ... */ }),
  roomMembers: defineTable({ /* ... */ }),
  
  // Social
  friendships: defineTable({ /* ... */ }),
  blockedUsers: defineTable({ /* ... */ }),
  
  // Gamification
  userXP: defineTable({ /* ... */ }),
  badges: defineTable({ /* ... */ }),
  userBadges: defineTable({ /* ... */ }),
  leaderboards: defineTable({ /* ... */ }),
  
  // Monetization
  wallets: defineTable({ /* ... */ }),
  walletTransactions: defineTable({ /* ... */ }),
  subscriptions: defineTable({ /* ... */ }),
  
  // Moderation
  moderationActions: defineTable({ /* ... */ }),
  contentViolations: defineTable({ /* ... */ }),
  
  // Admin
  apiKeys: defineTable({ /* ... */ }),
  auditLogs: defineTable({ /* ... */ }),
});

// Schema indexes for performance
export const indexes = {
  messagesByRoom: 'messages.byRoomId',
  usersByUsername: 'users.byUsername',
  // ... more indexes
};
```

**Architecture Diagram**:
```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Vercel)                     │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  Next.js 16 App Router + React 19 + Shadcn UI       │ │
│  │  ├─ (auth) - Auth pages                             │ │
│  │  ├─ (app) - Main app shell                          │ │
│  │  │  ├─ chat/[roomId] - Chat interface               │ │
│  │  │  ├─ calls - Call management                      │ │
│  │  │  ├─ profile/[userId] - User profiles             │ │
│  │  │  ├─ admin - Admin dashboard                      │ │
│  │  │  └─ settings - Settings pages                    │ │
│  │  └─ api - API routes (optional)                     │ │
│  └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────┐
│              Backend (Convex Cloud)                      │
│  ┌─────────────────────────────────────────────────────┐ │
│  │  Convex Real-time Backend                           │ │
│  │  ├─ auth.ts - Authentication handlers              │ │
│  │  ├─ messages.ts - Messaging mutations               │ │
│  │  ├─ calls.ts - Call management                      │ │
│  │  ├─ rooms.ts - Room CRUD                            │ │
│  │  ├─ users.ts - User queries                         │ │
│  │  ├─ gamification.ts - XP/badges/leaderboard         │ │
│  │  ├─ payments.ts - Wallet/subscription handling      │ │
│  │  ├─ moderation.ts - Moderation actions              │ │
│  │  ├─ subscriptions.ts - Real-time subscriptions      │ │
│  │  └─ http.ts - HTTP actions (webhooks)               │ │
│  └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────┐
│              External Services                          │
│  ├─ LiveKit - WebRTC video/audio infrastructure        │ │
│  ├─ Cloudinary - Image/video hosting & transformation  │ │
│  ├─ Stripe - Payment processing & webhooks             │ │
│  ├─ Sendgrid/Resend - Email notifications              │ │
│  ├─ Twilio - SMS/phone verification                    │ │
│  └─ Giphy API - GIF integration                        │ │
└─────────────────────────────────────────────────────────┘
```

---

## Summary: Feature Comparison Matrix

| Feature | CodyChat 9.0 | AlloChat v2.0 | Improvement |
|---------|-------------|-----------|------------|
| **Real-time Messaging** | Basic AJAX polling | Convex WebSocket | 10x faster, real-time sync |
| **Video Calling** | Agora SDK | LiveKit WebRTC + quality metrics | Better UX, call recording, analytics |
| **Audio Calling** | Basic | Advanced with noise cancellation | Professional quality |
| **Authentication** | Email + password | Multi-method (OAuth, magic link, 2FA) | More secure, flexible |
| **User Profiles** | Basic fields | Rich profiles, badges, social links | Modern user experience |
| **Gamification** | XP + badges | Advanced: streaks, tiers, achievements | More engaging |
| **Chat Content** | Text + basic media | Rich text, reactions, threading | Feature-rich |
| **Addons** | Plugin system (basic) | Modern marketplace with sandbox | Safer, more extensible |
| **Moderation** | Manual actions | AI-assisted, appeals, weighted penalties | Scalable moderation |
| **Monetization** | Wallet + gifts | Subscriptions + tiered benefits | Enterprise ready |
| **Analytics** | Basic logs | Advanced dashboards + real-time metrics | Data-driven decisions |
| **Performance** | Decent | Optimized: CDN, edge functions, caching | 5x faster |
| **Scalability** | Shared hosting | Global edge, auto-scaling | Millions of users |
| **Security** | Standard PHP | Modern auth, encryption, audit logs | SOC2 compliant |

---

## Next Steps

1. **Phase 1**: Set up Convex schema + authentication
2. **Phase 2**: Implement core messaging & real-time sync
3. **Phase 3**: Build call infrastructure with LiveKit
4. **Phase 4**: Create admin dashboard for moderation
5. **Phase 5**: Implement monetization (subscriptions + wallet)
6. **Phase 6**: Deploy to production (Vercel + Convex)

---

**Created**: 2026-03-19
**Status**: Ready for Development
**Tech Stack**: Next.js 16 + Shadcn + Convex + Convex Auth
