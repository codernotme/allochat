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
      const array = new Uint8Array(4);
      crypto.getRandomValues(array);
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('').toUpperCase();
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
          subject: "Verify your email - AlloChat",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
              <h2 style="color: #0f172a; margin-bottom: 16px;">Welcome to AlloChat!</h2>
              <p style="color: #475569; font-size: 16px; line-height: 24px; margin-bottom: 24px;">To complete your sign-up, please use the following verification code:</p>
              <div style="background-color: #f1f5f9; padding: 16px; border-radius: 6px; text-align: center; margin-bottom: 24px;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #020617;">${token}</span>
              </div>
              <p style="color: #64748b; font-size: 14px;">This code will expire in 10 minutes. If you didn't request this email, you can safely ignore it.</p>
              <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
              <p style="color: #94a3b8; font-size: 12px; text-align: center;">&copy; ${new Date().getFullYear()} AlloChat. All rights reserved.</p>
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

      if (args.existingUserId) {
        const current = await ctx.db.get(args.existingUserId);
        if (!current) {
          throw new Error('User not found during auth update');
        }

        const patch: Record<string, unknown> = {
          updatedAt: Date.now(),
        };

        if (!current.email && defaults.email) patch.email = defaults.email;
        if (!current.displayName) patch.displayName = defaults.displayName;

        if (!current.username || current.username.length === 0) {
          patch.username = withEntropy(defaults.username);
        }

        if (!current.emailVerified && current.email) {
          patch.emailVerified = true;
        }

        await ctx.db.patch(args.existingUserId, patch);
        return args.existingUserId;
      }

      const existingUsers = await ctx.db.query('users').take(1);
      const isFirstUser = existingUsers.length === 0;

      const userId = await ctx.db.insert('users', {
        ...defaults,
        username: withEntropy(defaults.username),
        role: isFirstUser ? 'owner' : 'user',
        emailVerified: true,
      });
      return userId;
    },
  },
});
