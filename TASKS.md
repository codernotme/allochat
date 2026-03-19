# AlloChat — Master Task Checklist

## Phase 0 — Planning & Architecture ✅
- [x] Analyze CodyChat 9.0 legacy codebase
- [x] Document all existing features
- [x] Create technology stack proposal
- [x] Design Convex schema
- [x] Get user approval on implementation plan
- [x] Create detailed feature requirements

---

## Phase 1 — Foundation & Infrastructure

### Dependencies & Setup
- [x] Install all npm packages (auth, convex, ui, etc.)
- [x] Initialize Convex project (`convex init`)
- [x] Set up `.env.local` with Convex URL
- [x] Configure Convex Auth providers (email, OAuth)
- [ ] Set up Cloudinary account + API keys
- [ ] Set up LiveKit account + tokens
- [ ] Set up Stripe account (test mode)
- [ ] Configure SendGrid for email

### Database Schema
- [ ] Create `convex/schema.ts` with all tables
- [ ] Define `users` table (auth fields + profile)
- [ ] Define `messages` table (with reactions, threads)
- [ ] Define `rooms` table (with settings, members)
- [ ] Define `calls` table (with LiveKit integration)
- [ ] Define `gamification` tables (XP, badges, leaderboards)
- [ ] Define `payments` tables (wallets, subscriptions)
- [ ] Define `moderation` tables (actions, reports, appeals)
- [ ] Define `notifications` table (event log)
- [ ] Define `audit_logs` table (admin tracking)
- [ ] Create appropriate indexes for performance
- [ ] Test schema deployment to Convex

### Configuration Files
- [x] Create `lib/data/room-categories.ts`
- [x] Create `lib/data/subscription-plans.ts`
- [x] Create `lib/data/permissions.ts`
- [x] Create `lib/data/roles.ts`
- [x] Create `lib/data/badge-definitions.ts`
- [x] Create `lib/data/nav-items.ts`
- [ ] Create `lib/i18n/config.ts` + language files
- [x] Create `convex.json`
- [x] Create `.gitignore` (exclude `.env.local`, etc.)

### Infrastructure Helpers
- [x] Create `lib/convex.ts` (client + hooks)
- [ ] Create `lib/auth/` folder with helpers
- [x] Create `middleware.ts` (session validation, RBAC)
- [x] Set up TypeScript strict mode
- [x] Configure ESLint + Prettier
- [ ] Set up GitHub Actions for CI/CD

**Status**: 🔄 In Progress
**Estimated Time**: 1 week

---

## Phase 2 — Authentication System

> Scope note: Phone-based auth/OTP is intentionally out of scope for now. Email + OAuth only.

### Auth Pages & Flows
- [x] Create `app/(auth)/layout.tsx` (centered layout)
- [x] Create `app/(auth)/sign-up/page.tsx` (method selector)
- [x] Create `app/(auth)/sign-up/email/page.tsx` (form)
- [x] Create `app/(auth)/sign-in/page.tsx` (method selector)
- [x] Create `app/(auth)/sign-in/email/page.tsx` (form)
- [x] Create `app/(auth)/verify-email/page.tsx` (OTP input)
- [x] Create `app/(auth)/forgot-password/page.tsx`
- [ ] Create `app/(auth)/reset-password/page.tsx`
- [ ] Create `app/(auth)/magic-link/page.tsx`
- [x] Create `app/(auth)/onboarding/page.tsx` (multi-step)

### Auth Mutations & Queries
- [x] Create `convex/auth.ts` with all mutation handlers
- [ ] Implement `signUpEmail()` mutation
- [ ] Implement `signInEmail()` mutation
- [ ] Implement `signInMagicLink()` mutation
- [ ] Implement `signInOAuth()` mutation
- [ ] Implement `requestPasswordReset()` mutation
- [ ] Implement `resetPassword()` mutation
- [ ] Implement `getCurrentUser()` query
- [ ] Implement `setupTwoFactor()` mutation
- [ ] Implement `verifyTwoFactor()` mutation
- [ ] Implement `setupBackupCodes()` mutation
- [ ] Implement `verifyBackupCode()` mutation

### Auth Components
- [ ] Create `components/auth/AuthForm.tsx` (base form)
- [ ] Create `components/auth/EmailInput.tsx`
- [ ] Create `components/auth/PasswordInput.tsx` (with strength meter)
- [ ] Create `components/auth/OTPInput.tsx`
- [ ] Create `components/auth/OAuthButtons.tsx`
- [ ] Create `components/auth/TermsCheckbox.tsx`

### Session Management
- [ ] Implement session cookie storage
- [ ] Implement CSRF token validation
- [ ] Implement logout functionality
- [ ] Implement session refresh (before expiry)
- [ ] Test auth flow end-to-end

**Status**: 🔄 In Progress
**Estimated Time**: 1 week

---

## Phase 3 — Core Layout & Navigation

### Main App Layout
- [x] Create `app/(app)/layout.tsx` (shell)
- [x] Create `components/layout/app-sidebar.tsx`
- [x] Create `components/layout/top-bar.tsx`
- [ ] Create `components/layout/breadcrumbs.tsx`
- [x] Create `components/layout/theme-toggle.tsx`
- [ ] Create `components/layout/user-menu.tsx`
- [x] Create `components/layout/notification-bell.tsx`

### Navigation & Search
- [ ] Implement sidebar collapse/expand
- [ ] Implement breadcrumb navigation
- [ ] Implement global search (`⌘K` command palette)
- [ ] Create `components/CommandPalette.tsx`
- [ ] Filter nav items by user permissions
- [ ] Mobile responsive navigation (hamburger menu)
- [x] Replace secondary-screen emoji-only system labels with `@iconify/react` icons

### Theming
- [ ] Set up dark mode toggle
- [ ] Test light/dark theme on all components
- [ ] Persist theme preference to localStorage
- [ ] System preference detection

**Status**: 🔄 In Progress
**Estimated Time**: 3 days

---

## Phase 4 — Real-Time Messaging Core

### Convex Messaging System
- [x] Create `convex/messages.ts` with all mutations
- [ ] Implement `sendMessage()` mutation
- [ ] Implement `editMessage()` mutation
- [ ] Implement `deleteMessage()` mutation (soft-delete + audit)
- [ ] Implement `addReaction()` mutation
- [ ] Implement `removeReaction()` mutation
- [ ] Implement `pinMessage()` mutation
- [ ] Implement `replyToMessage()` (threading)
- [ ] Implement `getAllMessages()` query (paginated)
- [ ] Implement `searchMessages()` query (full-text)
- [ ] Implement `watchRoomMessages()` subscription (real-time)
- [ ] Add rate limiting to mutations
- [ ] Add validation with Zod

### Chat UI Components
- [x] Create `app/(app)/room/[roomId]/page.tsx` (main page)
- [x] Create `components/chat/MessageBubble.tsx`
- [x] Create `components/chat/MessageList.tsx` (scrollable)
- [x] Create `components/chat/MessageInput.tsx`
- [ ] Create `components/chat/RichTextEditor.tsx`
- [ ] Create `components/chat/ReactionPicker.tsx`
- [ ] Create `components/chat/TypingIndicator.tsx`
- [ ] Create `components/chat/ReadReceipts.tsx`
- [ ] Create `components/chat/MessageActions.tsx` (edit, delete, etc.)

### Features
- [ ] Message sending (text + media)
- [ ] Message editing
- [ ] Message deletion with hard-delete after 30 days
- [ ] Emoji reactions (click to add, remove)
- [ ] Message threads (reply-to-message)
- [ ] Typing indicator (with debounce)
- [ ] Read receipts per user
- [ ] Message pinning (up to 5 per room)
- [ ] Message search with filters
- [ ] Infinite scroll message history
- [ ] Real-time sync via Convex subscriptions
- [ ] Auto-scroll to latest message
- [ ] Keyboard shortcuts (Ctrl+Enter to send, etc.)

### Testing
- [ ] Smoke test message sending
- [ ] Verify real-time sync (2 browsers)
- [ ] Test message editing
- [ ] Test message deletion
- [ ] Test emoji reactions
- [ ] Test rich text formatting

**Status**: 🔄 In Progress
**Estimated Time**: 1.5 weeks

---

## Phase 5 — Rooms & Lobby System

### Convex Room System
- [x] Create `convex/rooms.ts` with CRUD
- [ ] Implement `createRoom()` mutation
- [ ] Implement `updateRoom()` mutation
- [ ] Implement `deleteRoom()` mutation (soft-delete)
- [ ] Implement `joinRoom()` mutation
- [ ] Implement `leaveRoom()` mutation
- [ ] Implement `inviteUser()` mutation
- [ ] Implement `listPublicRooms()` query
- [ ] Implement `listMyRooms()` query
- [ ] Implement `searchRooms()` query
- [ ] Implement `watchRoomMembers()` subscription
- [ ] Implement moderation actions (kick, ban, mute)
- [ ] Add permission-based access control

### Room UI Pages
- [x] Create `app/(app)/lobby/page.tsx` (main lobby)
- [x] Create `app/(app)/room/[roomId]/page.tsx`
- [ ] Create `app/(app)/rooms/[roomId]/settings/page.tsx` (admin only)
- [ ] Create `app/(app)/rooms/create/page.tsx` (creation wizard)

### Lobby Features
- [ ] Room grid display (with avatar, description, member count)
- [ ] Category filtering (gaming, music, language, etc.)
- [ ] Sort by activity, member count, newest
- [ ] Search rooms by name/keyword
- [ ] Join room flow (instant for public, password prompt for private)
- [ ] Create room button
- [ ] Room sorting algorithm (trending rooms first)
- [ ] Room recommendations for you

### Room Management
- [ ] Display room name, avatar, description in header
- [ ] Show member list (with online indicators)
- [ ] Call button (initiate group call)
- [ ] Settings button (admin only)
- [ ] Leave room button
- [ ] Invite link sharing
- [ ] Room settings (name, avatar, description, public/private)
- [ ] Member management (list, promote, kick, ban)
- [ ] Role management (custom roles - optional)
- [ ] Addon management (enable/disable in room)

**Status**: 🔄 In Progress
**Estimated Time**: 1 week

---

## Phase 6 — User Profiles

### Convex User System
- [x] Create `convex/users.ts` with queries
- [x] Create `convex/userProfiles.ts` with mutations
- [ ] Implement `getUserProfile()` query
- [ ] Implement `getUserByUsername()` query
- [ ] Implement `getPublicProfile()` query (limited fields)
- [ ] Implement `updateProfile()` mutation
- [ ] Implement `setPresence()` mutation (online/away/offline)
- [ ] Implement `watchPresence()` subscription
- [ ] Implement friendship CRUD

### Profile Pages
- [x] Create `app/(app)/profile/[userId]/page.tsx` (public)
- [x] Create `app/(app)/settings/profile/page.tsx` (edit own)

### Profile Features
- **Public Profile**:
  - Avatar, display name, level, badges
  - Bio, interests, social links
  - Statistics (total calls, friends, badge count)
  - Recent activity (last seen, active rooms)
  - Friend/block buttons
  - Message button (start 1-on-1 DM)

- **Edit Profile**:
  - Avatar upload (Cloudinary)
  - Display name, pronouns
  - Bio (max 500 chars)
  - Interests multi-select
  - Social links (Twitter, Instagram, YouTube, etc.)
  - Language preference dropdown
  - Theme preference (light/dark/system)
  - Notification preferences

### Components
- [ ] Create `components/profile/ProfileHeader.tsx`
- [ ] Create `components/profile/ProfileStats.tsx`
- [ ] Create `components/profile/BadgeShowcase.tsx`
- [ ] Create `components/profile/SocialLinks.tsx`
- [ ] Create `components/profile/ActivityFeed.tsx`
- [ ] Create `components/profile/EditProfileForm.tsx`

**Status**: 🔄 In Progress
**Estimated Time**: 3 days

---

## Phase 7 — Video & Audio Calling

### Convex Call System
- [x] Create `convex/calls.ts` with mutations
- [ ] Implement `initiateCall()` mutation
- [ ] Implement `answerCall()` mutation
- [ ] Implement `rejectCall()` mutation
- [ ] Implement `endCall()` mutation
- [ ] Implement `getCallDetails()` query
- [ ] Implement `recordCall()` mutation
- [ ] Implement `watchCallStatus()` subscription
- [ ] Create `lib/livekit.ts` helpers
- [ ] Implement `generateLiveKitToken()` function
- [ ] Implement recording webhook handler
- [ ] Implement call quality metrics logging

### Call UI
- [ ] Create `app/(app)/calls/[callId]/page.tsx` (live call screen)
- [ ] Create `components/calls/IncomingCallDialog.tsx`
- [ ] Create `components/calls/CallControls.tsx`
- [x] Create `components/room/CallRoom.tsx`
- [ ] Create `components/calls/CallQualityIndicator.tsx`
- [ ] Create `components/calls/ScreenShareToggle.tsx`
- [ ] Create `components/calls/RecordingIndicator.tsx`

### Call Features
- [ ] 1-on-1 video calls
- [ ] 1-on-1 audio calls
- [ ] Group video calls (via room)
- [ ] Group audio calls (via room)
- [ ] Incoming call notification (dialog with accept/reject)
- [ ] Mute/unmute microphone toggle
- [ ] Enable/disable video toggle
- [ ] Speaker/participant view toggle
- [ ] Screen sharing (presenter + annotation)
- [ ] Virtual backgrounds (blur or image)
- [ ] Noise cancellation (audio processing)
- [ ] Call recording (with consent modal)
- [ ] Call transcription (AI-powered)
- [ ] Call quality indicator (signal strength, latency)
- [ ] Call history (past calls, duration, participants)
- [ ] End call button
- [ ] Picture-in-picture (continue chat during call)

### Testing
- [ ] Test 1-on-1 video call (quality check)
- [ ] Test group video call (multiple browsers)
- [ ] Test audio-only calls (bandwidth test)
- [ ] Test screen sharing
- [ ] Test recording start/stop
- [ ] Test call quality metrics
- [ ] Test incoming call dialog

**Status**: 🔄 In Progress
**Estimated Time**: 1.5 weeks

---

## Phase 8 — Gamification System

### Convex Gamification
- [x] Create `convex/gamification.ts` with all mutations
- [ ] Implement `addXP()` mutation (with streak multiplier)
- [x] Implement `unlockBadge()` mutation
- [ ] Implement `getLeaderboard()` query
- [ ] Implement `getUserStats()` query
- [ ] Implement `getStreak()` query
- [ ] Implement `watchLeaderboard()` subscription
- [ ] Define XP gain rules (message = 1 XP, call = 10 XP, etc.)
- [ ] Define badge unlock conditions
- [ ] Define level progression (1000 XP = 1 level)
- [ ] Implement streak logic (daily login, weekly activity)

### Leaderboard Pages
- [ ] Create `app/(app)/gamification/leaderboard/page.tsx` (global)
- [ ] Create `app/(app)/gamification/achievements/page.tsx` (badge showcase)

### Gamification UI
- [ ] Create `components/gamification/UserLevel.tsx` (XP bar + level)
- [ ] Create `components/gamification/BadgeShowcase.tsx`
- [ ] Create `components/gamification/StreakBadge.tsx`
- [ ] Create `components/gamification/LeaderboardTable.tsx`
- [ ] Create `components/gamification/XPNotification.tsx` (toast)

### Features
- [ ] XP system (earn for activity: messaging, calling, etc.)
- [ ] Leveling (auto-calculate from total XP)
- [ ] Badges (unlock via conditions)
- [ ] Streaks (daily login, weekly activity multiplier)
- [ ] Global leaderboard (top 100 by XP)
- [ ] Period leaderboards (weekly, monthly, all-time)
- [ ] User rank badge (displayed in chat)
- [ ] Achievement notifications
- [ ] Personal stats page (XP, level, badges, rank)
- [ ] Seasonal challenges (limited-time events)

**Status**: 🔄 In Progress
**Estimated Time**: 1 week

---

## Phase 9 — In-App Purchases & Monetization

### Stripe Integration
- [ ] Set up Stripe account (test mode)
- [ ] Create Stripe price objects (PRO, VIP plans)
- [ ] Implement Stripe webhook handler
- [ ] Create `lib/stripe.ts` helpers
- [ ] Implement checkout session creation

### Convex Payment System
- [ ] Create `convex/payments.ts` with mutations
- [ ] Implement `createCheckoutSession()` mutation
- [ ] Implement `handleStripeWebhook()` action
- [ ] Implement `getWalletBalance()` query
- [ ] Implement `purchaseGift()` mutation
- [ ] Implement `getSubscriptionStatus()` query
- [ ] Implement `cancelSubscription()` mutation
- [ ] Implement `getTransactionHistory()` query

### Shop Pages
- [ ] Create `app/(app)/shop/page.tsx` (gift store)
- [ ] Create `app/(app)/shop/cosmetics/page.tsx` (cosmetics)
- [ ] Create `app/(app)/shop/pass/page.tsx` (battle pass)
- [ ] Create `app/(app)/settings/billing/page.tsx` (subscription)

### Shop Features
- [ ] Gift catalog (100+ animated gifts)
- [ ] Cosmetics store (avatar frames, name colors, etc.)
- [ ] Seasonal battle pass
- [ ] Currency balance display + top-up
- [ ] Purchase flow (Stripe modal)
- [ ] Receipt/order history
- **Subscription Plans**:
  - Free tier (ads, limited features)
  - Premium tier ($4.99/mo - ad-free, custom status)
  - Pro tier ($9.99/mo - unlimited rooms, analytics)
  - Elite tier (custom - white-label, API)

### Gift System
- [ ] Create `convex/gifts.ts` mutations
- [ ] Implement `sendGift()` mutation
- [ ] Implement `getGiftHistory()` query
- [ ] Create gift sending UI with message
- [ ] Create `components/gifts/GiftCard.tsx`
- [ ] Gift notification on receive
- [ ] Gift collection/showcase in profile

**Status**: Not Started
**Estimated Time**: 1.5 weeks

---

## Phase 10 — Moderation & Admin Dashboard

### Convex Moderation
- [ ] Create `convex/moderation.ts` mutations
- [ ] Implement `kickUser()` mutation
- [ ] Implement `banUser()` mutation (room or global)
- [ ] Implement `muteUser()` mutation
- [ ] Implement `reportContent()` mutation
- [ ] Implement `resolveReport()` mutation
- [ ] Implement `appealAction()` mutation
- [ ] Implement `getAdminStats()` query
- [ ] Implement weighted moderation scores
- [ ] Add audit trail for all actions

### Admin Dashboard
- [ ] Create `app/(app)/admin/moderation/page.tsx`
- [ ] Create `app/(app)/admin/users/page.tsx`
- [ ] Create `app/(app)/admin/analytics/page.tsx`
- [ ] Create `app/(app)/admin/content/page.tsx`

### Moderation Features
- [ ] Report submission (with category, evidence)
- [ ] Moderation queue (pending reports)
- [ ] Quick actions (dismiss, warn, mute, ban)
- [ ] Report detail view (context, history with user)
- [ ] Appeal submissions (users can appeal)
- [ ] Appeal review (approve/deny with reason)
- [ ] Moderation action history (audit log)
- [ ] Statistics (actions this week, average resolution time)
- [ ] Ban list (IP + device fingerprint)
- [ ] Content filter (spam, hate speech detection - AI assisted)

### User Management
- [ ] List all users (search, filter by plan)
- [ ] User detail view (profile, activity, moderation history)
- [ ] Bulk actions (export, send announcement)
- [ ] Suspension/termination
- [ ] Permission overrides (manually grant/revoke features)
- [ ] Account deletion (compliance)

### Analytics Dashboard
- [ ] DAU/MAU metrics
- [ ] Total messages & calls (with trends)
- [ ] Revenue (MRR, subscription count, purchases)
- [ ] User retention curve (30/60/90 day)
- [ ] Most active rooms (by message count)
- [ ] Feature usage stats
- [ ] Support ticket volume

**Status**: Not Started
**Estimated Time**: 1 week

---

## Phase 11 — Plugin/Addon Marketplace

### Convex Plugin System
- [ ] Create `convex/plugins.ts` mutations
- [ ] Implement `listPlugins()` query
- [ ] Implement `installPlugin()` mutation
- [ ] Implement `uninstallPlugin()` mutation
- [ ] Implement `executePluginAction()` action (sandboxed)
- [ ] Implement `ratePlugin()` mutation
- [ ] Set up sandbox execution environment (vm2 or similar)
- [ ] Implement permission system for plugins

### Plugin Marketplace
- [ ] Create `app/(app)/plugins/marketplace/page.tsx`
- [ ] Create `app/(app)/plugins/my-plugins/page.tsx`
- [ ] Create `components/plugins/PluginCard.tsx`
- [ ] Create `components/plugins/PluginDetail.tsx`

### Marketplace Features
- [ ] Browse plugins (rate, views, downloads)
- [ ] Filter by category (games, bots, media, etc.)
- [ ] Search plugins
- [ ] Install/uninstall flows
- [ ] Rating system (stars + reviews)
- [ ] Plugin permissions display (what data accessed)
- [ ] Revenue share display (70% to developers)
- [ ] My plugins management
- [ ] Plugin settings per room

### Example Addons to Create
- [ ] **QuizBot** — Create & play quizzes in room
- [ ] **MusicBot** — Spotify playlist sharing
- [ ] **GiphyBot** — GIF search integration (already in schema)
- [ ] **DrawBot** — Sketch/draw together
- [ ] **PollBot** — Create polls in chat
- [ ] **DiceBot** — Rolling dice, D&D integration
- [ ] **LanguageBot** — Translate messages
- [ ] **HistoryBot** — Search message archives

**Status**: Not Started
**Estimated Time**: 1.5 weeks

---

## Phase 12 — Notifications

### Convex Notification System
- [ ] Create `convex/notifications.ts` mutations
- [ ] Implement `sendNotification()` mutation
- [ ] Implement `getUnreadNotifications()` query
- [ ] Implement `markAsRead()` mutation
- [ ] Implement `getNotificationSettings()` query
- [ ] Implement `updateNotificationSettings()` mutation
- [ ] Implement `watchNotifications()` subscription
- [ ] Set up notification types (message, call, friend request, etc.)

### Notification UI
- [ ] Create `components/notifications/NotificationBell.tsx`
- [ ] Create `components/notifications/NotificationItem.tsx`
- [ ] Create `components/notifications/NotificationCenter.tsx`
- [ ] Create `app/(app)/notifications/page.tsx`

### Features
- [ ] Real-time notification bell (unread count)
- [ ] Notification dropdown (live updates)
- [ ] Notification center page (full history)
- [ ] Mark as read (individual + all)
- [ ] Clear notifications (bulk action)
- [ ] Notification settings (per notification type)
- [ ] Do not disturb mode
- [ ] Desktop notifications (push API - optional)
- [ ] Email digest (summary of missed notifications)

**Status**: 🔄 In Progress
**Estimated Time**: 3 days

---

## Phase 13 — Security & Compliance

### Security Hardening
- [ ] Implement rate limiting on auth endpoints
- [ ] Add CSRF token validation on mutations
- [ ] Implement input sanitization (prevent XSS)
- [ ] Add SQL injection prevention (already done by Convex)
- [ ] Implement request signing/verification
- [ ] Set up HTTPS everywhere (enforced by framework)
- [ ] Add Content Security Policy (CSP) headers
- [ ] Implement cookie security flags (httpOnly, secure, sameSite)

### Compliance & Privacy
- [ ] Create Privacy Policy page
- [ ] Create Terms of Service page
- [ ] Implement GDPR compliance:
  - [ ] Data export (user can download all data)
  - [ ] Right to be forgotten (delete all user data)
  - [ ] Consent management (for cookies, tracking)
- [ ] Implement CCPA compliance (California residents)
- [ ] Create data retention policy (enforce in DB)
- [ ] Implement age verification (if needed)
- [ ] Add cookie consent banner
- [ ] Create security.txt page

### Deployment & Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Set up performance monitoring
- [ ] Set up uptime monitoring (Pingdom or similar)
- [ ] Create status page (public)
- [ ] Set up backup procedure (Convex handles)
- [ ] Create disaster recovery plan
- [ ] Set up on-call alerting
- [ ] Test disaster recovery procedures

**Status**: Not Started
**Estimated Time**: 1 week

---

## Phase 14 — Deployment & Testing

### Testing Suite
- [ ] Set up Jest for unit tests
- [ ] Set up Playwright for E2E tests
- [ ] Create auth flow tests
- [ ] Create messaging flow tests
- [ ] Create calling flow tests
- [ ] Create payment flow tests
- [ ] Achieve >80% code coverage for critical paths
- [ ] Set up automated test runs (GitHub Actions)

### Performance Optimization
- [ ] Audit bundle size (target <200KB JS)
- [ ] Implement code splitting (lazy load pages)
- [ ] Optimize images (Cloudinary transforms)
- [ ] Enable service worker (PWA offline support)
- [ ] Test Core Web Vitals (LCP, FID, CLS)
- [ ] Benchmark message latency (<100ms)
- [ ] Benchmark API response time (<50ms)

### Deployment
- [ ] Set up GitHub Actions CI/CD pipeline
- [ ] Create staging environment
- [ ] Test staging deployment end-to-end
- [ ] Create production deployment script
- [ ] Set up database backups (daily)
- [ ] Create rollback procedure
- [ ] Test rollback procedure
- [ ] Document deployment runbook

### Launch Checklist
- [ ] Smoke test all user flows
- [ ] Verify dark/light theme on all pages
- [ ] Check mobile responsiveness
- [ ] Test accessibility (keyboard nav, screen readers)
- [ ] Verify all external integrations (Stripe, LiveKit, Cloudinary)
- [ ] Check all analytics tracking
- [ ] Verify error pages (404, 500, etc.)
- [ ] Create launch announcement
- [ ] Set up support channels
- [ ] Monitor closely first 24 hours

**Status**: Not Started
**Estimated Time**: 1 week

---

## Phase 15 — Post-Launch & Maintenance

### Monitoring & Support
- [ ] Set up 24/7 monitoring
- [ ] Create support ticket system
- [ ] Hire support team (2-3 people initially)
- [ ] Create FAQ page
- [ ] Create knowledge base with tutorials
- [ ] Monitor user feedback (Discord, Twitter)
- [ ] Track bug reports + prioritize fixes

### Iteration & Improvements
- [ ] Collect user feedback (surveys, interviews)
- [ ] Analyze usage metrics (which features used most)
- [ ] Identify and fix bottlenecks
- [ ] Optimize slow queries
- [ ] Implement feature requests (high-demand)
- [ ] A/B test UI changes
- [ ] Monthly security audits

### Growth
- [ ] Marketing strategy (content, social, partnerships)
- [ ] Community building (Discord, forums)
- [ ] Developer relations (for addon creators)
- [ ] Enterprise sales (white-label deals)
- [ ] International expansion (translations, localization)
- [ ] Mobile app development (Q3 2026)

**Status**: Not Started
**Estimated Time**: Ongoing

---

## Overall Progress

### Summary by Status

| Phase | Status | % Complete | Notes |
|-------|--------|-----------|-------|
| 0 | ✅ Done | 100% | Architecture & planning complete |
| 1 | 🔄 In Progress | 80% | Foundation setup mostly complete |
| 2 | 🔄 In Progress | 40% | Auth system structure ready |
| 3 | 🔄 In Progress | 60% | Shell and navigation base |
| 4 | 🔄 In Progress | 50% | Messaging core and UI ready |
| 5 | 🔄 In Progress | 40% | Rooms and lobby basics |
| 6 | 🔄 In Progress | 30% | Profile pages and mutations |
| 7 | 🔄 In Progress | 40% | Call backend and base UI |
| 8 | 🔄 In Progress | 60% | Gamification logic and data |
| 9 | ⏳ Pending | 0% | Monetization (1.5 weeks) |
| 10 | ⏳ Pending | 0% | Moderation (1 week) |
| 11 | ⏳ Pending | 0% | Plugins (1.5 weeks) |
| 12 | 🔄 In Progress | 70% | Notifications backend and bell |
| 13 | ⏳ Pending | 0% | Security & compliance (1 week) |
| 14 | ⏳ Pending | 0% | Deployment & testing (1 week) |
| 15 | ⏳ Pending | 0% | Post-launch (ongoing) |

**Total Estimated Time**: ~16 weeks (4 months) for v1.0 production-ready platform.

---

## How to Use This Checklist

1. **Mark Task In Progress**: When starting a task, change status from `[ ]` to `[/]`
2. **Mark Task Complete**: When finished, change status from `[/]` to `[x]`
3. **Track Blockers**: Add notes if blocked (e.g., waiting for API key, design decision pending)
4. **Review Regularly**: Walk through checklist weekly to track progress
5. **Adjust Timeline**: Update "Estimated Time" if behind schedule

---

## Next Steps

1. Start Phase 1 — Foundation & Infrastructure
2. Set up Convex project + schema
3. Configure all third-party services (Stripe, LiveKit, Cloudinary)
4. Begin Phase 2 — Authentication System
5. Smoke test auth flow end-to-end

---

**Created**: March 19, 2026
**Last Updated**: March 19, 2026
**Version**: 1.0
**Status**: Ready for Development 🚀
