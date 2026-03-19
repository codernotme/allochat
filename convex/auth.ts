import { convexAuth } from '@convex-dev/auth/server';
import { Password } from '@convex-dev/auth/providers/Password';
import Google from '@auth/core/providers/google';
import GitHub from '@auth/core/providers/github';
import { Email } from '@convex-dev/auth/providers/Email';

const providers = [
  Password({
    profile(params) {
      return {
        email: params.email as string,
        name: params.name as string,
      };
    },
  }),
  // Keep provider wiring resilient in environments where OAuth secrets are not set yet.
  ...(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
    ? [
      Google({
        clientId: process.env.AUTH_GOOGLE_ID,
        clientSecret: process.env.AUTH_GOOGLE_SECRET,
      }),
    ]
    : []),
  ...(process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET
    ? [
      GitHub({
        clientId: process.env.AUTH_GITHUB_ID,
        clientSecret: process.env.AUTH_GITHUB_SECRET,
      }),
    ]
    : []),
  Email({
    id: 'email-otp',
    maxAge: 10 * 60,
    async sendVerificationRequest({ identifier, url }) {
      // Temporary local/dev implementation. Replace with Resend integration in production.
      console.log(`Auth email for ${identifier}: ${url}`);
    },
  }),
];

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers,
});
