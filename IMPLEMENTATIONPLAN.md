# AlloChat v2.0 — Full Implementation Plan

## Background

AlloChat v2.0 is a complete, modern rebuild of **CodyChat 9.0** (legacy PHP + MySQL platform) as a **SaaS global chat and calling platform**. The tech stack is **Next.js 15** (App Router) + **Shadcn UI** + **Convex** (real-time backend) + **Convex Auth**.

**Key design principles:**
- Real-time-first: Convex subscriptions power all live features (messaging, presence, calls)
- All configurable strings live in `.ts` data files — i18n-ready from day one
- Zero hardcoded secrets — only env variables; API keys via Admin UI
- Full RBAC (Role-Based Access Control) with feature toggles configurable by Owner/Admin
- Multi-tenant SaaS-ready architecture (organization-scoped from day one)
- Premium UX: sub-100ms messaging, HD video, smooth animations

---

## User Review Required

> [!IMPORTANT]
> **Real-Time Transport** — The entire app uses **Convex real-time subscriptions** (WebSocket-based). This replaces the PHP AJAX polling model. Benefits: <100ms latency, automatic sync, zero DevOps. Old 3-second polling is eliminated.

> [!IMPORTANT]
> **LiveKit for WebRTC** — Video/audio calling runs on **LiveKit** (third-party managed service). Token generation happens server-side in Convex actions. Pricing: ~$0.007/min video. Alternative: self-hosted Jitsi (higher ops complexity). Confirm LiveKit is acceptable.

> [!IMPORTANT]
> **Cloudinary for Media** — All user-uploaded images and videos stored on **Cloudinary** (CDN + transform engine). Free tier: 25GB/month. Alternatives: S3 + CloudFront (more setup, more control). Confirm Cloudinary.

> [!IMPORTANT]
> **Convex Auth** — Replaces PHP session/cookie auth. Handles all auth flows (email/password, OAuth, OTP, magic link) with built-in security. Sessions managed by Convex, tokens stored securely. Confirm approach.

> [!WARNING]
> **Data Migration** — User data (MySQL → Convex) requires a one-time migration script. Passwords cannot be migrated (users must reset). Rooms, message history, and profiles can be bulk-imported. Confirm migration window.

> [!NOTE]
> **Build Order** — Build phase by phase. Run `npx convex dev` + `npm run dev` and smoke-test each phase before advancing. Production build only at end.

---

## Proposed Changes

### Phase 1 — Foundation & Infrastructure

---

#### [MODIFY] [package.json](package.json)
Add all required packages:
- `convex` + `@convex-dev/auth` — real-time backend + auth
- `livekit-client` + `@livekit/components-react` — WebRTC calls
- `next-cloudinary` + `cloudinary` — media hosting
- `@stripe/stripe-js` + `stripe` — payments
- `zod` — runtime validation
- `zustand` — client state management
- `date-fns` — date formatting
- `nanoid` — ID generation
- `react-hook-form` — form management
- `i18next` + `react-i18next` — internationalization
- `resend` — transactional email
- `twilio` — SMS/phone OTP

#### [NEW] [convex/schema.ts](convex/schema.ts)
Full Convex database schema (see FLOWS_AND_APIS.md for complete schema):
- **Auth**: `users`, `sessions`, `oauthAccounts`
- **Profiles**: `userProfiles`, `presences`
- **Messaging**: `messages`, `directMessages`, `conversations`, `mediaAttachments`
- **Rooms**: `rooms`, `roomMembers`
- **Calls**: `calls`
- **Social**: `friendships`, `blockedUsers`
- **Gamification**: `userXP`, `badges`, `userBadges`, `streaks`, `leaderboards`
- **Monetization**: `wallets`, `walletTransactions`, `subscriptions`, `gifts`, `giftTransactions`
- **Moderation**: `moderationActions`, `reports`, `contentFilters`
- **Plugins**: `plugins`, `roomPlugins`
- **Notifications**: `notifications`
- **Admin**: `auditLogs`, `apiKeys`
- **Events**: `events`

#### [NEW] [convex/auth.ts](convex/auth.ts)
Convex Auth configuration:
- Email + password (bcrypt)
- Google OAuth
- GitHub OAuth  
- Apple Sign-In
- Phone OTP (Twilio)
- Email OTP + magic link (Resend)
- Session management
- 2FA/TOTP support

#### [NEW] [lib/i18n/](lib/i18n/)
i18n setup:
- `config.ts` — i18next initialization
- `en.ts`, `ar.ts`, `es.ts`, `fr.ts`, `de.ts`, `pt.ts`, `ru.ts`, `zh.ts`, `hi.ts`, `tr.ts`
- `keys.ts` — type-safe key constants

#### [NEW] [lib/data/](lib/data/)
All constants as editable `.ts` files:
- `room-categories.ts` — Room categories with icons and colors
- `subscription-plans.ts` — Free/Premium/Pro/Elite feature lists
- `permissions.ts` — Permission matrix (resource × action × role)
- `roles.ts` — Role hierarchy definitions
- `badge-definitions.ts` — All badge types and unlock conditions
- `xp-actions.ts` — XP reward amounts per action
- `gift-catalog.ts` — Gift catalog data
- `nav-items.ts` — Sidebar navigation filtered by permissions

#### [NEW] [lib/convex.ts](lib/convex.ts)
Convex client singleton + utilities

#### [NEW] [middleware.ts](middleware.ts)
Next.js edge middleware:
- Session cookie validation via Convex Auth
- Redirect unauthenticated → `/auth/sign-in`
- Admin route protection
- Rate limiting on auth endpoints

---

### Phase 2 — Authentication System

All auth pages live under `app/(auth)/` with centered card layout.

---

#### [NEW] `app/(auth)/layout.tsx`
Full-screen auth layout with:
- AlloChat logo + branding
- Centered glassmorphism card
- Background gradient animation
- Dark/light mode support

#### [NEW] `app/(auth)/sign-in/page.tsx`
Method selector with animated cards for:
- Email/password
- Phone OTP
- Google OAuth
- GitHub OAuth

#### [NEW] `app/(auth)/sign-in/email/page.tsx`
- Email + password fields (with show/hide toggle)
- "Remember me" checkbox
- Forgot password link
- Error states

#### [NEW] `app/(auth)/sign-up/email/page.tsx`
- Name, email, password (strength indicator bar)
- Age verification checkbox (COPPA)
- Terms + privacy acceptance
- reCAPTCHA optional

#### [NEW] `app/(auth)/sign-up/phone/page.tsx`
- Country code selector (with flag + dial code)
- Phone number input with E.164 formatting
- Send OTP button with cooldown timer
- 6-digit OTP input (auto-advance)

#### [NEW] `app/(auth)/verify-email/page.tsx`
- Shadcn `InputOTP` component (6 digits)
- Resend code with 60s cooldown
- Auto-submit on completion

#### [NEW] `app/(auth)/onboarding/page.tsx`
Multi-step wizard (5 steps):
1. **Profile** — Display name, avatar upload, bio
2. **Interests** — Tag multi-select (gaming, music, coding...)
3. **Room** — Create first room OR browse & join
4. **Notifications** — Permission opt-in  
5. **Done** → redirect to `/app`

#### [NEW] `convex/auth.ts` (mutations)
- `signUp(email, password, name)` — Create user account
- `signIn(email, password)` — Auth session
- `signOut()` — Invalidate session
- `sendOTP(phone)` — Trigger Twilio OTP
- `verifyOTP(phone, code)` — Verify phone
- `sendMagicLink(email)` — Send passwordless link
- `resetPassword(token, newPassword)` — Password reset
- `setupTOTP()` — Generate TOTP secret + QR code
- `verifyTOTP(code)` — Verify 2FA code
- `getCurrentUser()` — Current auth user query

---

### Phase 3 — Core Layout & Navigation

---

#### [NEW] `app/(app)/layout.tsx`
Main app shell:
- Collapsible Shadcn Sidebar (desktop)
- Bottom nav (mobile)
- Top bar: breadcrumb, search, notifications bell, user menu
- Theme toggle (light/dark/system)
- Real-time presence heartbeat (every 30s)
- Command palette ⌘K listener

#### [NEW] `components/layout/AppSidebar.tsx`
- Reads nav items from `lib/data/nav-items.ts`
- Filters by user role + subscription tier
- Shows active room in sidebar
- Collapsible on mobile
- Shows online friend count

#### [NEW] `components/layout/CommandPalette.tsx`
- ⌘K trigger
- Search: rooms, users, messages, pages
- Recent results history
- Keyboard navigation

---

### Phase 4 — Real-Time Messaging Core

---

#### [NEW] `convex/messages.ts`
All message mutations + queries:

```typescript
// Mutations
sendMessage(roomId, content, replyTo?, attachments?)
editMessage(messageId, newContent)
deleteMessage(messageId)
addReaction(messageId, emoji)
removeReaction(messageId, emoji)
pinMessage(messageId, roomId)  
unpinMessage(messageId)
markMessagesRead(roomId)
sendDirectMessage(recipientId, content)

// Queries
listMessages(roomId, paginationOpts)        → paginated messages
getPinnedMessages(roomId)                   → pinned messages
searchMessages(query, roomId?)              → search results
getDirectMessages(conversationId, opts)     → DM history
getConversations()                          → all DM threads

// Subscriptions (useQuery)
watchMessages(roomId)                       → live message stream
watchDMs(conversationId)                    → live DM stream
```

#### [NEW] `app/(app)/room/[roomId]/page.tsx`
Main chat view layout:
- Left: room message list (infinite scroll)
- Right: member panel (collapsible)
- Bottom: message input with toolbar
- Top: room header (name, member count, call button)

#### [NEW] `components/chat/MessageInput.tsx`
Rich input with:
- Emoji picker button
- GIF search (Giphy)
- File attachment button (Cloudinary upload)
- Slash command autocomplete (`/gif`, `/poll`, `/quiz`...)
- @mention autocomplete
- Formatting toolbar (bold, code, italic)
- Voice message record button

#### [NEW] `components/chat/MessageBubble.tsx`
Single message rendering:
- Text + rich text (markdown rendered)
- Media attachments (lightbox for images/videos)
- Giphy embed
- YouTube embed card
- Reaction row + add reaction button
- Hover: edit/delete/reply/report actions
- Reply-to reference card
- System messages (join/leave/kick)
- Gift notification display

---

### Phase 5 — Rooms & Lobby

---

#### [NEW] `convex/rooms.ts`
```typescript
// Mutations
createRoom(name, type, category, settings?)
updateRoom(roomId, updates)
deleteRoom(roomId)
joinRoom(roomId, password?)
leaveRoom(roomId)
kickMember(roomId, targetId, reason)
banMember(roomId, targetId, reason, duration?)
muteMember(roomId, targetId, duration)
promoteToModerator(roomId, targetId)
inviteUser(roomId, userId)
updateTopic(roomId, topic)
postAnnouncement(roomId, text)

// Queries
getRoom(roomId)
listPublicRooms(category?, sort?)           → paginated
listMyRooms()
searchRooms(query, filters)
getFeaturedRooms()
getRoomMembers(roomId)
getRoomStats(roomId)

// Subscriptions
watchRoomPresence(roomId)                   → live member count + who's online
```

#### [NEW] `app/(app)/lobby/page.tsx`
Discovery interface with:
- Category filter tabs (scrollable on mobile)
- Sort: Popular, New, Active, Trending
- Search with instant results
- Room cards: avatar, name, member count, online count, category badge
- Featured rooms carousel at top
- Create Room FAB button

#### [NEW] `app/(app)/room/[roomId]/settings/page.tsx`
Room admin panel:
- Basic info (name, description, avatar, banner)
- Privacy settings (type, password, max users)
- Feature toggles (calls, media, pins)
- Addons management
- Member management table (promote, mute, ban, remove)
- Danger zone (delete room)

---

### Phase 6 — User Profiles & Social

---

#### [NEW] `convex/users.ts`
```typescript
updateProfile(updates)
getUserProfile(userId)
getUserByUsername(username)
setPresenceStatus(status, customMessage?)
searchUsers(query)
sendFriendRequest(targetId)
acceptFriendRequest(requestId)
declineFriendRequest(requestId)
blockUser(targetId)
unblockUser(targetId)
getFriends()
getFriendRequests()
```

#### [NEW] `app/(app)/profile/[userId]/page.tsx`
Public profile:
- Avatar + banner header
- Display name, pronouns, status
- Level badge + XP bar
- Showcased badges (up to 5)
- Bio + interests + social links
- Stats (messages, call minutes, friends)
- Joined date, "last seen"
- Friend/block/message action buttons
- Recent rooms activity

#### [NEW] `app/(app)/settings/` pages:
- `profile/page.tsx` — Edit name, avatar, bio, pronouns
- `social/page.tsx` — Social links, website
- `privacy/page.tsx` — Profile visibility, last seen, friends
- `notifications/page.tsx` — Channel preferences
- `security/page.tsx` — Password, 2FA, sessions
- `billing/page.tsx` — Subscription plan, invoices
- `appearance/page.tsx` — Theme, language

---

### Phase 7 — Voice & Video Calling

---

#### [NEW] `convex/calls.ts`
```typescript
startCall(targetUserId?, roomId?, type)     → { callId, liveKitToken }
answerCall(callId)                          → { liveKitToken }
rejectCall(callId)
endCall(callId)
generateToken(callId, userId)               → LiveKit JWT
updateCallStatus(callId, status)
getCallHistory(userId, opts)
enableRecording(callId)

// Subscription
watchCallStatus(callId)                     → live call state
watchIncomingCalls()                        → notify when called
```

#### [NEW] `app/(app)/call/[callId]/page.tsx`
Live call UI powered by LiveKit:
```typescript
import { LiveKitRoom, VideoConference } from '@livekit/components-react';

// Modes: grid (all equal), spotlight (active speaker large), sidebar (chat alongside)
```

#### [NEW] `components/calls/`
- `IncomingCallDialog.tsx` — Modal with caller avatar + accept/reject
- `CallControls.tsx` — Microphone, Camera, Screen share, End call
- `ParticipantGrid.tsx` — Dynamic layout (grid/spotlight/strip)
- `CallQualityBadge.tsx` — Signal quality display
- `RecordingBadge.tsx` — Visible "Recording" indicator
- `PictureInPicture.tsx` — Floating mini video while chatting

---

### Phase 8 — Gamification

---

#### [NEW] `convex/gamification.ts`
```typescript
awardXP(userId, amount, reason)             → level up check
checkBadgeUnlocks(userId)                   → unlock eligible badges
getLeaderboard(type, period, limit)
getUserStats(userId)
getStreak(userId)
updateStreak(userId)
claimStreakReward(userId)
```

All XP actions integrated via Convex mutations:
- Every `sendMessage` calls `awardXP(+1)`
- Every `startCall` tracks duration → `awardXP(+5/min)`
- Daily login via `updateStreak()`

#### [NEW] `components/gamification/`
- `XPProgressBar.tsx` — Animated level progress bar
- `LevelBadge.tsx` — Level number display
- `BadgeShowcase.tsx` — Up to 5 displayed badges
- `StreakDisplay.tsx` — Flame icon + current streak count
- `LeaderboardTable.tsx` — Ranked list with rank movement
- `AchievementToast.tsx` — "Achievement unlocked!" popup

---

### Phase 9 — Monetization & Payments

---

#### [NEW] `convex/payments.ts`
```typescript
createCheckoutSession(planId, successUrl)   → Stripe URL
handleStripeWebhook(event)                  → update subscriptions
getWalletBalance()
purchaseCoins(amount)
sendGift(recipientId, giftId, message?)
getGiftHistory(userId)
getSubscriptionStatus()
cancelSubscription()
```

#### [NEW] `convex/http.ts`
```typescript
// HTTP action for Stripe webhook
export const httpRouter = httpRouter();
httpRouter.route({
  path: '/stripe-webhook',
  method: 'POST',
  handler: handleStripeWebhook,
});
```

#### [NEW] `app/(app)/shop/page.tsx`
Gift & cosmetics store:
- Coin bundles (100, 500, 1000, 5000 AlloCoins)
- Gift catalog (animated, 3D, seasonal limited)
- Sticker packs
- Name color effects
- Avatar frames

#### [NEW] `app/(app)/subscription/page.tsx`
Plan upgrade:
- Feature comparison table (Free vs Premium vs Pro vs Elite)
- "Most Popular" badge on Pro
- Stripe checkout integration
- Trial period display

---

### Phase 10 — Plugin/Addon System

---

#### [NEW] `convex/plugins.ts`
```typescript
listPlugins(category?, installed?)
getPlugin(pluginId)
installPlugin(roomId, pluginId, config?)
uninstallPlugin(roomId, pluginId)
updatePluginConfig(roomId, pluginId, config)
ratePlugin(pluginId, rating, review?)
executePluginCommand(roomId, pluginId, cmd, args)
```

#### [NEW] `app/(app)/plugins/marketplace/page.tsx`
- Search + category filter
- Plugin cards: icon, rating, installs
- Preview modal with screenshots
- Install/uninstall with permission review

---

### Phase 11 — Moderation & Admin

---

#### [NEW] `convex/moderation.ts`
```typescript
reportContent(targetId, contentId?, reason, category)
getModerationQueue(status?, assignedTo?)
takeAction(reportId, action, reason, duration?)
resolveReport(reportId, outcome)
submitAppeal(actionId, message)
reviewAppeal(appealId, outcome)
banUser(userId, reason, duration?, isGlobal?)
unbanUser(userId)
updateContentFilter(pattern, action)
testContentFilter(text)
```

#### [NEW] `app/(app)/admin/` pages
Complete admin dashboard suite (see Phase 13 in FUNCTIONS.md)

---

### Phase 12 — Notifications

---

#### [NEW] `convex/notifications.ts`
```typescript
createNotification(userId, type, title, body, link?)
markAsRead(notificationId)
markAllRead()
getUnread(userId)                           → for bell badge count
deleteNotification(notificationId)
updateNotificationSettings(settings)

// Subscription
watchNotifications()                        → live bell updates
```

#### [NEW] `components/notifications/`
- `NotificationBell.tsx` — Icon, unread badge count, dropdown list
- `NotificationItem.tsx` — Type icon, title, time, action button
- `NotificationCenter.tsx` — Full page `/notifications`

---

### Phase 13 — Events System (New in v2.0)

---

#### [NEW] `convex/events.ts`
```typescript
createEvent(title, description, type, startsAt, endsAt, settings)
updateEvent(eventId, updates)
cancelEvent(eventId, reason)
registerForEvent(eventId)
cancelRegistration(eventId)
getUpcomingEvents(filters)
getEventAttendees(eventId)
startEvent(eventId)
endEvent(eventId, xpAward?)
```

---

### Phase 14 — Security & Compliance

---

#### [NEW] `.env.local` (not committed)
```bash
# Convex
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
CONVEX_DEPLOY_KEY=prod:xxxx

# Auth
AUTH_SECRET=random-secret-32-chars

# LiveKit
NEXT_PUBLIC_LIVEKIT_URL=wss://your-app.livekit.cloud
LIVEKIT_API_KEY=API...
LIVEKIT_API_SECRET=...

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=allochat
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (Resend)
RESEND_API_KEY=re_...
AUTH_EMAIL_FROM=noreply@allochat.app

# SMS (Twilio)
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_VERIFY_SID=VA...

# AI
OPENAI_API_KEY=sk-...
GIPHY_API_KEY=...
```

---

## Complete Directory Structure

```
allochat/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx
│   │   ├── sign-in/
│   │   │   ├── page.tsx
│   │   │   ├── email/page.tsx
│   │   │   └── phone/page.tsx
│   │   ├── sign-up/
│   │   │   ├── page.tsx
│   │   │   ├── email/page.tsx
│   │   │   └── phone/page.tsx
│   │   ├── verify-email/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   ├── reset-password/page.tsx
│   │   ├── magic-link/page.tsx
│   │   └── onboarding/page.tsx
│   ├── (app)/
│   │   ├── layout.tsx
│   │   ├── page.tsx                    → redirect to /lobby
│   │   ├── lobby/page.tsx
│   │   ├── room/
│   │   │   └── [roomId]/
│   │   │       ├── page.tsx
│   │   │       ├── settings/page.tsx
│   │   │       └── members/page.tsx
│   │   ├── call/[callId]/page.tsx
│   │   ├── messages/
│   │   │   ├── page.tsx               → DM list
│   │   │   └── [userId]/page.tsx      → DM conversation
│   │   ├── profile/[userId]/page.tsx
│   │   ├── leaderboard/page.tsx
│   │   ├── shop/page.tsx
│   │   ├── subscription/page.tsx
│   │   ├── events/page.tsx
│   │   ├── plugins/
│   │   │   ├── marketplace/page.tsx
│   │   │   └── my-plugins/page.tsx
│   │   ├── notifications/page.tsx
│   │   ├── settings/
│   │   │   ├── profile/page.tsx
│   │   │   ├── social/page.tsx
│   │   │   ├── privacy/page.tsx
│   │   │   ├── notifications/page.tsx
│   │   │   ├── security/page.tsx
│   │   │   ├── billing/page.tsx
│   │   │   └── appearance/page.tsx
│   │   └── admin/
│   │       ├── dashboard/page.tsx
│   │       ├── users/page.tsx
│   │       ├── users/[userId]/page.tsx
│   │       ├── rooms/page.tsx
│   │       ├── moderation/page.tsx
│   │       ├── analytics/page.tsx
│   │       ├── billing/page.tsx
│   │       ├── plugins/page.tsx
│   │       ├── settings/page.tsx
│   │       └── announcements/page.tsx
│   └── api/
│       └── webhooks/
│           ├── stripe/route.ts
│           └── livekit/route.ts
├── components/
│   ├── layout/
│   │   ├── AppSidebar.tsx
│   │   ├── TopBar.tsx
│   │   ├── CommandPalette.tsx
│   │   ├── ThemeToggle.tsx
│   │   ├── NotificationBell.tsx
│   │   └── UserMenu.tsx
│   ├── chat/
│   │   ├── MessageBubble.tsx
│   │   ├── MessageList.tsx
│   │   ├── MessageInput.tsx
│   │   ├── RichTextEditor.tsx
│   │   ├── ReactionPicker.tsx
│   │   ├── TypingIndicator.tsx
│   │   ├── ReadReceipts.tsx
│   │   ├── PinnedMessages.tsx
│   │   ├── GiphyPicker.tsx
│   │   └── MediaAttachment.tsx
│   ├── calls/
│   │   ├── IncomingCallDialog.tsx
│   │   ├── LiveCallScreen.tsx
│   │   ├── CallControls.tsx
│   │   ├── ParticipantGrid.tsx
│   │   └── CallQualityBadge.tsx
│   ├── room/
│   │   ├── RoomCard.tsx
│   │   ├── RoomHeader.tsx
│   │   ├── MemberPanel.tsx
│   │   └── RoomSettingsForm.tsx
│   ├── gamification/
│   │   ├── XPProgressBar.tsx
│   │   ├── LevelBadge.tsx
│   │   ├── BadgeShowcase.tsx
│   │   ├── StreakDisplay.tsx
│   │   └── LeaderboardTable.tsx
│   ├── notifications/
│   │   ├── NotificationBell.tsx
│   │   └── NotificationItem.tsx
│   ├── profile/
│   │   ├── ProfileHeader.tsx
│   │   ├── ProfileStats.tsx
│   │   └── SocialLinks.tsx
│   └── ui/                             ← Shadcn components
├── convex/
│   ├── _generated/                     ← auto-generated by Convex
│   ├── schema.ts
│   ├── auth.ts
│   ├── http.ts
│   ├── messages.ts
│   ├── rooms.ts
│   ├── users.ts
│   ├── calls.ts
│   ├── gamification.ts
│   ├── payments.ts
│   ├── moderation.ts
│   ├── plugins.ts
│   ├── notifications.ts
│   └── events.ts
├── hooks/
│   ├── useCurrentUser.ts
│   ├── usePresence.ts
│   ├── useRoomMessages.ts
│   ├── useCall.ts
│   ├── useNotifications.ts
│   └── useCommandPalette.ts
├── lib/
│   ├── convex.ts
│   ├── auth/
│   │   ├── session.ts
│   │   └── permissions.ts
│   ├── i18n/
│   │   ├── config.ts
│   │   └── en.ts
│   ├── data/
│   │   ├── room-categories.ts
│   │   ├── subscription-plans.ts
│   │   ├── permissions.ts
│   │   ├── roles.ts
│   │   ├── badge-definitions.ts
│   │   ├── xp-actions.ts
│   │   └── nav-items.ts
│   ├── livekit.ts
│   ├── cloudinary.ts
│   ├── stripe.ts
│   └── utils.ts
├── middleware.ts
├── .env.local
└── package.json
```

---

## Verification Plan

### Automated Tests
```bash
npm run test           # Unit tests
npm run test:e2e       # Playwright end-to-end
npx convex dev         # Convex type checking
```

**Test coverage**:
- Auth signup/login/reset flows
- Message send/edit/delete/react
- Room create/join/leave
- Call initiate/accept/end
- XP + badge unlock logic
- Stripe webhook handling
- Permission checks for all roles

### Manual Browser Verification

After `npm run dev` at each phase:

1. **Auth** — Sign up with email, verify OTP, complete onboarding
2. **Messaging** — Open 2 browsers, send message, verify <100ms sync
3. **DMs** — Send DM, check conversation list updates
4. **Rooms** — Create room, join from second browser, see presence
5. **Calls** — Start 1:1 call, verify video stream, check end call
6. **Reactions** — Add emoji reaction, verify real-time update in both browsers
7. **Gamification** — Check XP earned, trigger badge unlock toast
8. **Shop** — Purchase gift, send to user, verify deduction
9. **Admin** — Submit report, check moderation queue, take action
10. **Dark mode** — Toggle theme, verify all pages switch smoothly

---

## Performance Targets

| Metric | Target |
|--------|--------|
| Time to Interactive (desktop) | <1s |
| Time to Interactive (mobile) | <2s |
| Message delivery (P99) | <100ms |
| Call setup | <3s |
| Convex query (P95) | <50ms |
| Lighthouse score | >90 |
| Uptime SLA | 99.99% |

---

## Timeline Estimate

| Phase | Feature | Complexity | Est. Time |
|-------|---------|-----------|-----------|
| 1 | Foundation + Schema | High | 1 week |
| 2 | Auth System | Medium | 1 week |
| 3 | Layout + Navigation | Low | 3 days |
| 4 | Real-Time Messaging | High | 1.5 weeks |
| 5 | Rooms + Lobby | Medium | 1 week |
| 6 | User Profiles + Social | Medium | 1 week |
| 7 | Video + Audio Calling | High | 1.5 weeks |
| 8 | Gamification | Medium | 1 week |
| 9 | Payments + Shop | Medium | 1.5 weeks |
| 10 | Plugin System | High | 1.5 weeks |
| 11 | Moderation + Admin | Medium | 1 week |
| 12 | Notifications | Low | 3 days |
| 13 | Events System | Medium | 1 week |
| 14 | Security + Polish | Medium | 1 week |

**Total**: ~17–18 weeks (~4.5 months) for full production-ready platform.

---

## Key Success Metrics (KPIs)

| Metric | Target (3 months post-launch) |
|--------|-------------------------------|
| Registered users | 100,000+ |
| DAU/MAU ratio | 40%+ |
| 30-day retention | >50% |
| Free → paid conversion | 5%+ |
| Average session length | >20 min |
| Message latency (P99) | <100ms |
| Uptime | 99.99% |
| NPS score | >50 |

---

**Last Updated**: March 19, 2026
**Version**: 2.0-plan
**Status**: Ready for Development 🚀
