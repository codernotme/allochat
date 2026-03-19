import { convexAuth } from '@convex-dev/auth/server';
import { Password } from '@convex-dev/auth/providers/Password';
import Google from '@auth/core/providers/google';
import { Email } from '@convex-dev/auth/providers/Email';

const getDefaultUserData = (email?: string, name?: string, username?: string) => {
  const baseUsername = username || (email ? email.split('@')[0] : (name ? name.toLowerCase().replace(/\s+/g, '_') : 'user_' + Math.floor(Math.random() * 10000)));
  const now = Date.now();
  
  return {
    email: email as string,
    username: baseUsername.toLowerCase().replace(/[^a-z0-9]/g, ''),
    displayName: name || baseUsername,
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
});
