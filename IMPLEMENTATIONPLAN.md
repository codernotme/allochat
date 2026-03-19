# AlloChat v2.0 — Full Implementation Plan

## Background

AlloChat v2.0 is a modern rebuild of CodyChat 9.0 (legacy PHP application) as a **SaaS global chat and calling platform**. The tech stack is **Next.js 16** (App Router) + **Shadcn UI** + **Convex** (real-time backend) + **Convex Auth**.

The codebase currently has only the bare Next.js skeleton with Shadcn components installed. Everything below is net-new work migrating from the legacy PHP backend to a modern serverless architecture.

**Key design principles:**
- All configurable strings/labels live in `.ts` data files — ready for i18n and region updates.
- Zero hardcoded secret keys — only `CONVEX_DEPLOYMENT` in env; API keys configured via Admin UI.
- Full RBAC (Role-Based Access Control) with feature-visibility toggles configurable by Owner/Admin.
- Architecture is multi-tenant SaaS-ready (organization-scoped from day one).
- Real-time-first: Convex subscriptions power all live features (messaging, presence, calls).
- Modern security: Convex Auth handles all authentication, bcrypt passwords, session management.

---

## User Review Required

> [!IMPORTANT]
> **Real-Time Transport** — The entire app uses **Convex real-time subscriptions** (WebSocket-based). This replaces the old polling model. Benefits: <100ms latency, automatic sync, zero DevOps. Confirm this is acceptable.

> [!IMPORTANT]
> **LiveKit for WebRTC** — Video/audio calling runs on **LiveKit** (third-party managed service). Token generation happens server-side in Convex mutations. Pricing: $0.007 per min of video. Alternative: self-hosted Jitsi (higher ops complexity). Confirm LiveKit is acceptable.

> [!IMPORTANT]
> **Cloudinary for Media** — All images and videos uploaded by users are stored on **Cloudinary** (CDN + transform engine). Free tier covers 25GB/month. Alternatives: S3 + CloudFront (more setup). Confirm Cloudinary is acceptable.

> [!IMPORTANT]
> **Multi-Language Support** — All UI strings are stored in `lib/i18n/` folder as `.ts` data files. i18next integration covers 10+ languages. Admin can translate via Settings UI or manually edit `.ts` files. Confirm this approach.

> [!WARNING]
> **Convex Environment Variables** — The `CONVEX_DEPLOYMENT` URL and API keys must be set in `.env.local` for local dev and `.env.production` for production. These should NOT be committed to version control.

> [!NOTE]
> **Build Order** — We'll build phase by phase and run `npm run dev` to smoke-test each major feature before moving on. Production build only at the end.

> [!NOTE]
> **Data Migration from CodyChat 9.0** — A separate migration script (`scripts/migrate-from-codychat.ts`) will export users, rooms, and messages from MySQL, then import into Convex via bulk import tool.

---

## Proposed Changes

### Phase 1 — Foundation & Infrastructure

#### [MODIFY] [package.json](package.json)
Add all required packages:
- **Auth**: `@convex-dev/auth`, `bcryptjs`, `@types/bcryptjs`, `jsonwebtoken`
- **Real-time**: `convex`, `@convex-dev/react` (zero-setup real-time hooks)
- **Validation**: `zod`, `zod-form-data`
- **UI**: Already installed (Shadcn, Tailwind)
- **WebRTC**: `livekit-client`, `@livekit/components-react`
- **Media**: `next-cloudinary`, `cloudinary`
- **HTTP**: `axios`
- **Notifications**: `react-toastify`
- **Payments**: `@stripe/react-js`, `@stripe/js`
- **i18n**: `i18next`, `react-i18next`, `i18next-browser-languagedetector`
- **Utils**: `nanoid`, `date-fns`, `clsx`, `zustand` (state management)

#### [NEW] [convex/schema.ts](convex/)
Full Convex database schema covering:
- **Auth tables**: `users`, `sessions`, `oauth_accounts`, `password_resets`
- **User tables**: `user_profiles`, `presences`
- **Messaging**: `messages`, `reactions`, `media_attachments`, `message_threads`
- **Rooms**: `rooms`, `room_members`, `room_roles`, `room_settings`
- **Calls**: `calls`, `call_participants`, `call_recordings`
- **Social**: `friendships`, `blocked_users`, `follow_requests`
- **Gamification**: `user_xp`, `badges`, `user_badges`, `leaderboards`, `streaks`
- **Monetization**: `wallets`, `wallet_transactions`, `subscriptions`, `gifts`, `gift_transactions`
- **Moderation**: `moderation_actions`, `content_violations`, `appeal_submissions`
- **Addons**: `plugins`, `room_plugin_settings`, `user_plugin_preferences`
- **Admin**: `audit_logs`, `analytics_events`, `api_keys`

#### [NEW] [convex/auth.ts](convex/)
Convex Auth configuration:
- Email + password sign-up/login
- Google OAuth
- GitHub OAuth
- Phone OTP (via Twilio)
- Magic link (passwordless email)
- Session management helpers
- 2FA/TOTP setup & verification
- Password reset flow

#### [NEW] [lib/i18n/](lib/)
i18n configuration:
- `config.ts` — i18next initialization
- `en.ts` — English language strings
- `es.ts`, `fr.ts`, `de.ts`, etc. — Other languages
- `keys.ts` — Type-safe i18n key constants

#### [NEW] [lib/data/](lib/)
Constants files — all editable `.ts` files, no hardcoding:
- `room-categories.ts` — Room categories (gaming, music, language, etc.)
- `subscription-plans.ts` — FREE / PREMIUM / PRO / ENTERPRISE features
- `permissions.ts` — Resource × action permission matrix
- `roles.ts` — Role definitions (Owner, Admin, Moderator, User, Guest)
- `badge-definitions.ts` — Badge types & unlock conditions
- `error-messages.ts` — Localized error strings
- `nav-items.ts` — Sidebar navigation with permissions

#### [NEW] [lib/convex.ts](lib/)
Convex client singleton + hooks:
```typescript
export const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
export function useConvex() { return useContext(ConvexContext); }
```

#### [NEW] [lib/auth/](lib/auth/)
Auth helpers:
- `session.ts` — Current user query, session validation
- `permissions.ts` — Role-based permission checks
- `oauth.ts` — OAuth configuration (client IDs, redirects)
- `password.ts` — bcrypt helpers (hash, compare, validate strength)

#### [NEW] [middleware.ts](middleware.ts)
Next.js edge middleware:
- Session cookie validation
- Redirect unauthenticated users to `/auth/sign-in`
- Route-level RBAC check using permission data
- Tenant isolation (if multi-tenant later)

---

### Phase 2 — Authentication System

All auth lives under `app/(auth)/` with its own layout (no sidebar).

#### [NEW] `app/(auth)/layout.tsx`
Centered card layout for auth pages with AlloChat branding.

#### [NEW] `app/(auth)/sign-up/page.tsx`
Method selector — Email / Phone / Google / GitHub cards.

#### [NEW] `app/(auth)/sign-up/email/page.tsx`
Full email + password signup form. Validates with Zod client-side via `react-hook-form`.
- Name, email, password (strength indicator)
- CAPTCHA integration (optional)
- Terms & privacy acceptance checkbox
- Error handling & retry

#### [NEW] `app/(auth)/sign-up/phone/page.tsx`
Phone entry → OTP screen.
- Country code selector
- Phone number input
- OTP input (6 digits)
- Resend link (with cooldown)

#### [NEW] `app/(auth)/sign-in/page.tsx` + `email/` + `phone/`
Login flows mirror signup.

#### [NEW] `app/(auth)/verify-email/page.tsx`
6-digit or 8-character code input using Shadcn `InputOTP` component.

#### [NEW] `app/(auth)/forgot-password/page.tsx` + `reset-password/`
Password reset flow:
1. Email input
2. OTP verification
3. New password entry
4. Confirmation

#### [NEW] `app/(auth)/auth/magic-link/page.tsx`
Magic link auto-login landing — extracts token from URL, logs in user, redirects to app.

#### [NEW] `app/(auth)/onboarding/page.tsx`
Multi-step wizard (post-signup):
1. Profile setup (avatar, display name, bio)
2. Interests selection
3. Create or join room (optional)
4. Notification preferences
5. Done → redirect to `/app`

#### [NEW] `convex/auth.ts`
All auth mutations & queries:
- `signUpEmail()` — Create user with email + password
- `signUpPhone()` — Create user with phone + OTP
- `signInEmail()` — Login with email + password
- `signInPhone()` — Login with phone + OTP
- `signInMagicLink()` — Generate & verify magic link
- `signInOAuth()` — Handle OAuth callback
- `requestPasswordReset()` — Send reset email
- `resetPassword()` — Validate token + set new password
- `getCurrentUser()` — Query current authenticated user
- `setupTwoFactor()` — Generate TOTP secret
- `verifyTwoFactor()` — Verify TOTP code

---

### Phase 3 — Core Layout & Navigation

#### [NEW] `app/(app)/layout.tsx`
Main dashboard layout:
- Shadcn `Sidebar` component (collapsible on mobile)
- Top bar with breadcrumbs, search, notification bell, user menu, theme toggle
- RBAC: only render nav items the user has `read` permission for

#### [NEW] `components/layout/`
- `app-sidebar.tsx` — Sidebar sourcing nav from `lib/data/nav-items.ts` filtered by user's permissions
- `top-bar.tsx` — Breadcrumb + search + bell + avatar
- `theme-toggle.tsx` — Light/dark/system toggle button
- `notification-bell.tsx` — Unread count badge + popover list
- `command-palette.tsx` — ⌘K global search (users, rooms, messages)
- `user-menu.tsx` — Profile, settings, logout

---

### Phase 4 — Real-Time Messaging Core

#### [NEW] `convex/messages.ts`
Queries & mutations:
- `sendMessage()` — Send text or rich message
- `editMessage()` — Edit message content
- `deleteMessage()` — Soft-delete message
- `addReaction()` — Add emoji reaction
- `removeReaction()` — Remove emoji reaction
- `pinMessage()` — Pin message in room
- `unpinMessage()` — Unpin message
- `replyToMessage()` — Send threaded reply
- `getAllMessages()` — Query all messages for a room (paginated)
- `searchMessages()` — Full-text search across rooms
- Subscription: `watchRoomMessages()` — Real-time message stream

#### [NEW] `app/(app)/chat/[roomId]/page.tsx`
Main chat interface:
- Message list (infinite scroll, latest at bottom)
- Message input box (with rich text toolbar)
- Room header (name, member count, call button)
- Member sidebar (list of online users)
- Typing indicator
- Message reactions UI

#### [NEW] `components/chat/`
- `MessageBubble.tsx` — Single message display (text, media, reactions, actions)
- `MessageList.tsx` — Scrollable message list with pagination
- `MessageInput.tsx` — Text input + slash commands + emoji picker
- `RichTextEditor.tsx` — Markdown/formatting toolbar
- `ReactionPicker.tsx` — Emoji reaction selector
- `TypingIndicator.tsx` — "User is typing..." animation
- `ReadReceipts.tsx` — Show read status per user

#### [NEW] `hooks/useRoomMessages.ts`
Custom hook for real-time message subscription:
```typescript
export function useRoomMessages(roomId: string) {
  return useQuery(api.messages.getAllMessages, { roomId });
}

export function useRoomMessagesSubscription(roomId: string) {
  return useSubscription(api.messages.watchRoomMessages, { roomId });
}
```

---

### Phase 5 — Rooms & Lobby

#### [NEW] `convex/rooms.ts`
Room CRUD + permissions:
- `createRoom()` — Create public/private room
- `updateRoom()` — Update settings
- `deleteRoom()` — Soft-delete
- `joinRoom()` — Add user to room
- `leaveRoom()` — Remove user
- `inviteUser()` — Send invite
- `listPublicRooms()` — Browse lobby
- `listMyRooms()` — Current user's rooms
- `searchRooms()` — Full-text search
- `kickUser()` — Moderator action
- `banUser()` — Ban from room
- Subscription: `watchRoomMembers()` — Online member count

#### [NEW] `app/(app)/lobby/page.tsx`
Lobby/discovery interface:
- Room grid with filters (category, sort by activity)
- Search bar
- Create room button
- Join room flow (password protected rooms)

#### [NEW] `app/(app)/rooms/[roomId]/settings/page.tsx`
Room admin panel (owner only):
- Room name, description, avatar
- Public/private toggle + password
- Member management (list, remove, promote to mod)
- Role management (custom roles in room)
- Addon settings

---

### Phase 6 — User Profiles

#### [NEW] `convex/users.ts` & `convex/userProfiles.ts`
User management:
- `updateProfile()` — Update display name, bio, avatar, links
- `getUserProfile()` — Query user by ID
- `getUserByUsername()` — Query user by username
- `getPublicProfile()` — Publicly visible fields only
- `getPresence()` — Current online status
- `setPresence()` — Update online status
- Subscription: `watchPresence()` — Real-time presence

#### [NEW] `app/(app)/profile/[userId]/page.tsx`
Public user profile:
- Avatar, name, level, badges
- Bio, interests, social links
- Statistics (total calls, messages, friend count)
- Recent activity (last seen, active rooms)
- Friend/block actions
- Message button (start 1-on-1 chat)

#### [NEW] `app/(app)/settings/profile/page.tsx`
Edit own profile:
- Avatar upload (Cloudinary)
- Display name, bio, pronouns
- Social links (Twitter, Instagram, etc.)
- Interests multi-select
- Language preference
- Theme preference

---

### Phase 7 — Video & Audio Calling

#### [NEW] `convex/calls.ts`
Call management:
- `initiateCall()` — Start 1-on-1 or group call
- `answerCall()` — Accept incoming call
- `rejectCall()` — Reject call
- `endCall()` — Terminate call
- `getCallDetails()` — Query call info
- `recordCall()` — Enable recording (if opted in)
- Subscription: `watchCallStatus()` — Real-time call state

#### [NEW] `lib/livekit.ts`
LiveKit helpers:
- `generateLiveKitToken()` — Create access token for user
- `getMetrics()` — Query call quality metrics
- `startRecording()` — Server-side recording webhook

#### [NEW] `app/(app)/calls/[callId]/page.tsx`
Live call screen using LiveKit:
```typescript
import { LiveKitRoom, VideoConference } from '@livekit/components-react';

export function LiveCallScreen({ callId }: { callId: string }) {
  const call = useQuery(api.calls.getCallDetails, { callId });
  
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
    </LiveKitRoom>
  );
}
```

#### [NEW] `components/calls/`
- `IncomingCallDialog.tsx` — "User is calling..." popup with accept/reject
- `CallControls.tsx` — Mute, camera, end call buttons
- `ParticipantGrid.tsx` — Video layout (grid, spotlight, sidebar)
- `CallQualityIndicator.tsx` — Signal strength, latency badge

---

### Phase 8 — Gamification System

#### [NEW] `convex/gamification.ts`
XP, badges, leaderboards:
- `addXP()` — Award XP for actions (message, call, etc.)
- `unlockBadge()` — Check & award badges
- `getLeaderboard()` — Query global/regional leaderboard
- `getUserStats()` — XP, level, badges for user
- `getStreak()` — Current activity streak
- Subscription: `watchLeaderboard()` — Real-time rank updates

#### [NEW] `app/(app)/gamification/leaderboard/page.tsx`
Global leaderboard:
- Top 100 users by XP
- Filter by period (weekly, monthly, all-time)
- Current user's rank highlighted
- Streak multiplier display

#### [NEW] `components/gamification/`
- `UserLevel.tsx` — Display XP bar + level
- `BadgeShowcase.tsx` — User's unlocked badges
- `StreakBadge.tsx` — Current streak display
- `LeaderboardTable.tsx` — Ranked user list

---

### Phase 9 — In-App Purchases & Monetization

#### [NEW] `convex/payments.ts`
Stripe + wallet system:
- `createCheckoutSession()` — Generate Stripe link
- `handleStripeWebhook()` — Process payment completion
- `getWalletBalance()` — Current currency balance
- `purchaseGift()` — Deduct balance, send gift
- `getSubscriptionStatus()` — Check active subscription
- `cancelSubscription()` — Unsubscribe from tier

#### [NEW] `app/(app)/shop/page.tsx`
Gift & cosmetics store:
- Gift catalog (animated gifts, prices)
- Cosmetics store (name colors, avatar frames)
- Pass/battle pass (seasonal cosmetics)
- Currency balance display
- Purchase flow (Stripe modal)

#### [NEW] `app/(app)/settings/billing/page.tsx`
Subscription management:
- Current plan display
- Upgrade/downgrade options
- Billing history
- Invoice download
- Cancellation button

---

### Phase 10 — Moderation & Admin Dashboard

#### [NEW] `convex/moderation.ts`
Moderation actions:
- `kickUser()` — Remove from room
- `banUser()` — Ban from room (or global)
- `muteUser()` — Prevent chat/voice
- `reportContent()` — User report submission
- `resolveReport()` — Moderator action on report
- `appealAction()` — User appeal for mod action
- `getAdminStats()` — Reports pending, actions today, etc.

#### [NEW] `app/(app)/admin/moderation/page.tsx`
Moderation queue:
- Pending reports table (reporter, reported, reason, date)
- Quick actions (dismiss, warn, mute, ban)
- Report detail view with context
- Appeal submissions (approve/deny)
- Statistics (actions this week, etc.)

#### [NEW] `app/(app)/admin/users/page.tsx`
User management:
- List all users (search, filter by plan)
- User detail view (profile, activity, moderation history)
- Bulk actions (export, send announcement)
- Suspension/termination

#### [NEW] `app/(app)/admin/analytics/page.tsx`
Analytics dashboard:
- DAU/MAU (daily/monthly active users)
- Total messages & calls (with trends)
- Revenue (MRR, subscriptions, purchases)
- User retention curve
- Most active rooms

---

### Phase 11 — Plugin/Addon Marketplace

#### [NEW] `convex/plugins.ts`
Plugin system:
- `listPlugins()` — Browse marketplace
- `installPlugin()` — Add to room or personal use
- `uninstallPlugin()` — Remove
- `getPluginConfig()` — Fetch settings
- `executePluginAction()` — Run plugin command (sandboxed)
- `ratePlugin()` — Leave review

#### [NEW] `app/(app)/plugins/marketplace/page.tsx`
Plugin marketplace UI:
- Plugin cards (name, icon, rating, price)
- Install/uninstall buttons
- Filter by category

#### [NEW] `app/(app)/plugins/my-plugins/page.tsx`
Installed plugins management.

---

### Phase 12 — Notifications

#### [NEW] `convex/notifications.ts`
Notification system:
- `sendNotification()` — Create notification
- `getUnreadNotifications()` — Query bell count
- `markAsRead()` — Clear unread
- `getNotificationSettings()` — User preferences
- Subscription: `watchNotifications()` — Real-time bell updates

#### [NEW] `components/notifications/`
- `NotificationBell.tsx` — Icon + unread badge + dropdown
- `NotificationItem.tsx` — Single notification (action button)
- `NotificationCenter.tsx` — Full notification list page

---

### Phase 13 — Security & Compliance

#### [NEW] `.env.local` (not committed)
Secrets file with:
- `NEXT_PUBLIC_CONVEX_URL` — Convex deployment URL
- `CONVEX_DEPLOY_KEY` — Server-side Convex auth
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — Stripe public key
- `STRIPE_SECRET_KEY` — Stripe secret (server only)
- `NEXT_PUBLIC_LIVEKIT_URL` — LiveKit room URL
- `LIVEKIT_API_KEY` — LiveKit server auth
- `LIVEKIT_API_SECRET` — LiveKit JWT signing
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` — Cloudinary account
- `CLOUDINARY_API_KEY` — Cloudinary uploads
- `NEXT_PUBLIC_GIPHY_API_KEY` — Giphy integration
- `SENDGRID_API_KEY` — Email notifications

#### [NEW] `middleware.ts`
Security middleware:
- CSRF token validation on mutations
- Rate limiting on auth endpoints
- Session validation
- Request signing/verification

#### [NEW] `.gitignore` (update)
Ensure no secrets are ever committed.

---

## Core Directory Structure

```
allochat/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx
│   │   ├── sign-up/
│   │   ├── sign-in/
│   │   ├── verify-email/
│   │   ├── forgot-password/
│   │   └── onboarding/
│   ├── (app)/
│   │   ├── layout.tsx
│   │   ├── chat/
│   │   │   ├── [roomId]/
│   │   │   └── layout.tsx
│   │   ├── lobby/
│   │   ├── calls/
│   │   ├── profile/
│   │   ├── rooms/
│   │   ├── shop/
│   │   ├── settings/
│   │   ├── admin/
│   │   │   ├── moderation/
│   │   │   ├── users/
│   │   │   └── analytics/
│   │   ├── gamification/
│   │   ├── plugins/
│   │   └── notifications/
│   └── api/ (if Convex Actions needed)
├── components/
│   ├── layout/
│   ├── chat/
│   ├── calls/
│   ├── gamification/
│   ├── notifications/
│   └── ui/ (Shadcn components)
├── convex/
│   ├── schema.ts
│   ├── auth.ts
│   ├── messages.ts
│   ├── rooms.ts
│   ├── users.ts
│   ├── calls.ts
│   ├── gamification.ts
│   ├── payments.ts
│   ├── moderation.ts
│   ├── plugins.ts
│   ├── notifications.ts
│   └── _generated/ (auto-generated)
├── lib/
│   ├── convex.ts
│   ├── auth/
│   ├── i18n/
│   ├── data/
│   ├── utils.ts
│   └── hooks/
├── hooks/
│   ├── useRoomMessages.ts
│   ├── usePresence.ts
│   ├── useCall.ts
│   └── ...
├── middleware.ts
├── .env.local (not committed)
├── convex.json (deployment config)
└── package.json
```

---

## Verification Plan

### Automated Tests
Run with `npm run test` after setup.

**Auth smoke tests**:
- `tests/auth/signup-email.test.ts` — POST signup, expect session
- `tests/auth/login-otp.test.ts` — OTP flow end-to-end
- `tests/auth/oauth.test.ts` — Google OAuth callback

**Real-time tests**:
- `tests/realtime/messaging.test.ts` — Send message, verify real-time sync
- `tests/realtime/presence.test.ts` — User online status updates

**RBAC tests**:
- `tests/rbac/permissions.test.ts` — Permission check functions

### Manual Verification (Browser)

After `npm run dev` at each phase:

1. **Auth flows** — visit `http://localhost:3000/auth/sign-up`, complete email signup, verify email, check onboarding redirect.

2. **Chat** — Create room, send message, verify real-time delivery (open two browsers), check message reactions.

3. **Calling** — Start 1-on-1 call, verify video/audio streams, check call recording button.

4. **Gamification** — Earn XP, check level up notification, view leaderboard.

5. **Shop** — Purchase gift, verify currency deduct, send gift to user.

6. **Admin** — Submit report, check moderation queue, take action (ban/warn).

7. **Dark/Light theme** — Toggle theme, verify all pages switch.

---

## Quality Standards

### Performance Targets
- **Time to Interactive**: <2s (mobile), <1s (desktop)
- **Message Latency**: <100ms (P99)
- **Call Setup**: <3s
- **API Response**: <50ms (P95)
- **Uptime**: 99.99% SLA

### Code Quality
- TypeScript strict mode (no `any`)
- Zod validation on all API inputs
- Shadcn accessible components (WCAG 2.1 AA)
- Unit tests for critical business logic
- Integration tests for user flows

### Security Checklist
- ✅ No hardcoded secrets
- ✅ All inputs validated (Zod)
- ✅ XSS, CSRF, SQL injection prevention
- ✅ Rate limiting on auth endpoints
- ✅ Encrypted sensitive data in DB
- ✅ Audit logs for admin actions
- ✅ HTTPS everywhere (enforced by framework)

---

## Deployment Pipeline

### Staging (Optional)
1. Create `staging` branch
2. Deploy to staging URL (Vercel preview)
3. QA testing
4. Merge to `main`

### Production
1. Merge to `main`
2. GitHub Actions trigger deployment
3. Convex schema deployed automatically
4. Vercel deploys frontend
5. Smoke tests run
6. Alert on-call if deployment fails

---

## Timeline Estimate

| Phase | Feature | Complexity | Time |
|-------|---------|-----------|------|
| 1 | Foundation | High | 1 week |
| 2 | Auth | Medium | 1 week |
| 3 | Layout | Low | 3 days |
| 4 | Messaging | High | 1.5 weeks |
| 5 | Rooms | Medium | 1 week |
| 6 | Profiles | Low | 3 days |
| 7 | Calling | High | 1.5 weeks |
| 8 | Gamification | Medium | 1 week |
| 9 | Monetization | Medium | 1.5 weeks |
| 10 | Moderation | Medium | 1 week |
| 11 | Plugins | High | 1.5 weeks |
| 12 | Notifications | Low | 3 days |
| 13 | Deployment | Medium | 1 week |

**Total**: ~16 weeks (4 months) for full production-ready platform.

---

## Key Success Metrics

1. **User Acquisition**: 100K users in first 3 months post-launch
2. **Engagement**: 40% DAU/MAU ratio (healthy for social platform)
3. **Retention**: 30-day retention >50%
4. **Conversion**: 5% free → paid conversion (PRO/enterprise)
5. **Performance**: <100ms message latency (P99)
6. **Reliability**: 99.99% uptime SLA
7. **Support**: <2hr response time for critical issues

---

**Last Updated**: March 19, 2026
**Version**: 1.0-draft
**Status**: Pending User Review ⏳
