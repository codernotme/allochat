import { convexAuth } from '@convex-dev/auth/server';
import { Password } from '@convex-dev/auth/providers/Password';
import Google from '@auth/core/providers/google';
import { Email } from '@convex-dev/auth/providers/Email';

const normalizeUsername = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '');

const buildBaseUsername = (email?: string, name?: string, username?: string) => {
  const seed = username || (email ? email.split('@')[0] : name || 'user');
  const normalized = normalizeUsername(seed);
  if (normalized.length >= 3) return normalized;
  return `user${normalized}`;
};

const buildDisplayName = (email?: string, name?: string, username?: string) => {
  if (name && name.trim().length > 0) return name;
  if (username && username.trim().length > 0) return username;
  if (email && email.includes('@')) return email.split('@')[0];
  return 'User';
};

const getDefaultUserData = (email?: string, name?: string, username?: string) => {
  const baseUsername = buildBaseUsername(email, name, username);
  const now = Date.now();

  return {
    email: email as string,
    username: baseUsername,
    displayName: buildDisplayName(email, name, baseUsername),
    presenceStatus: 'online' as const,
    lastSeenAt: now,
    theme: 'dark' as const,
    language: 'en',
    notifMessages: true,
    notifCalls: true,
    notifMentions: true,
    notifFriends: true,
    notifEmail: true,
    notifSMS: false,
    role: 'user' as const,
    subscriptionTier: 'free' as const,
    xp: 0,
    level: 1,
    emailVerified: false,
    phoneVerified: false,
    isVerified: false,
    isBanned: false,
    isMuted: false,
    isBot: false,
    isDeleted: false,
    isGuest: false,
    consentGiven: true,
    createdAt: now,
    updatedAt: now,
  };
};

const getProfileStrings = (profile: Record<string, unknown>) => {
  const email = typeof profile.email === 'string' ? profile.email : undefined;
  const name = typeof profile.name === 'string' ? profile.name : undefined;
  const username = typeof profile.username === 'string' ? profile.username : undefined;
  return { email, name, username };
};

const withEntropy = (value: string) => `${value}${Math.floor(Math.random() * 1000000)}`;

const providers = [
  Password({
    profile(params) {
      return getDefaultUserData(params.email as string, params.name as string, params.username as string);
    },
  }),
  // Keep provider wiring resilient in environments where OAuth secrets are not set yet.
  ...(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
    ? [
      Google({
        clientId: process.env.AUTH_GOOGLE_ID,
        clientSecret: process.env.AUTH_GOOGLE_SECRET,
        profile(profile) {
          return getDefaultUserData(profile.email, profile.name || profile.given_name);
        }
      }),
    ]
    : []),
  Email({
    id: 'resend',
    maxAge: 10 * 60,
    generateVerificationToken: async () => {
      const code = Math.floor(100000 + Math.random() * 900000); // always 6 digits
      return code.toString();
    },
    async sendVerificationRequest({ identifier: email, url, token }) {
      const resendApi = process.env.RESEND_API_KEY || process.env.RESEND_API;
      const fromEmail = process.env.AUTH_EMAIL_FROM || 'noreply@codernotme.studio';

      if (!resendApi) {
        console.error('RESEND_API_KEY not found in environment variables');
        console.log(`Auth email for ${email}: ${url} (Token: ${token})`);
        return;
      }

      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApi}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `AlloChat <${fromEmail}>`,
          to: [email],
          subject: "Your AlloChat verification code",
          html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; background-color: #ffffff;">

            <!-- Header -->
            <div style="background-color: #0f172a; border-radius: 12px 12px 0 0; padding: 32px 40px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">AlloChat</h1>
            </div>

            <!-- Body -->
            <div style="border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px; padding: 40px;">
              <h2 style="color: #0f172a; font-size: 20px; font-weight: 600; margin: 0 0 12px;">Verify your email address</h2>
              <p style="color: #64748b; font-size: 15px; line-height: 1.6; margin: 0 0 32px;">
                Use the code below to complete your sign-in. It expires in <strong>10 minutes</strong>.
              </p>

              <!-- Code block -->
              <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border: 1px solid #e2e8f0; border-radius: 10px; padding: 28px; text-align: center; margin-bottom: 32px;">
                <p style="color: #94a3b8; font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 10px;">Verification Code</p>
                <span style="font-size: 42px; font-weight: 800; letter-spacing: 10px; color: #0f172a; font-variant-numeric: tabular-nums;">${token}</span>
              </div>

              <p style="color: #94a3b8; font-size: 13px; line-height: 1.6; margin: 0;">
                If you didn't request this, you can safely ignore this email. Your account will not be affected.
              </p>

              <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 32px 0;" />

              <p style="color: #cbd5e1; font-size: 12px; text-align: center; margin: 0;">
                &copy; ${new Date().getFullYear()} AlloChat &nbsp;·&nbsp; All rights reserved
              </p>
            </div>

          </div>
        `,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error("Resend delivery failed:", error);
      } else {
        console.log("OTP successfully sent via Resend to:", email);
      }
    },
  }),
];

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers,
  callbacks: {
    async createOrUpdateUser(ctx, args) {
      const { email, name, username } = getProfileStrings(args.profile);
      const defaults = getDefaultUserData(email, name, username);

      let userId = args.existingUserId;

      // 1. If no existing session, check for another account with the same email
      if (!userId && email) {
        const existingUser = await ctx.db
          .query('users')
          .filter((q) => q.eq(q.field('email'), email))
          .unique();
        if (existingUser) {
          userId = existingUser._id;
        }
      }

      if (userId) {
        const current = await ctx.db.get(userId);
        if (!current) {
          throw new Error('User not found during auth update');
        }

        const patch: Record<string, unknown> = {
          updatedAt: Date.now(),
        };

        // Merge metadata if missing
        if (!current.email && defaults.email) patch.email = defaults.email;
        if (!current.displayName || current.displayName === 'User') {
          patch.displayName = defaults.displayName;
        }

        if (
          !current.username ||
          current.username.length === 0 ||
          current.username.startsWith('user')
        ) {
          // Only update username if the one we have is generic or missing
          // but avoid overwriting a custom username if the new one is just a default
          if (username) {
            patch.username = username; // User provided a specific one in signup
          } else if (!current.username) {
            patch.username = withEntropy(defaults.username);
          }
        }

        if (!current.emailVerified && current.email) {
          patch.emailVerified = true;
        }

        await ctx.db.patch(userId, patch);
        return userId;
      }

      // 2. Create new user
      const existingUsers = await ctx.db.query('users').take(1);
      const isFirstUser = existingUsers.length === 0;

      const newUserId = await ctx.db.insert('users', {
        ...defaults,
        username: username || withEntropy(defaults.username),
        role: isFirstUser ? 'owner' : 'user',
        emailVerified: true,
      });
      return newUserId;
    },
  },
});
