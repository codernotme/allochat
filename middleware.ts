import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  isAuthenticatedNextjs,
  nextjsMiddlewareRedirect,
} from '@convex-dev/auth/nextjs/server';
import { NextResponse } from 'next/server';

const isAuthPage = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/forgot-password(.*)',
  '/reset-password(.*)',
  '/verify-email(.*)',
  '/magic-link(.*)',
  '/onboarding(.*)',
]);

const isAdminPage = createRouteMatcher(['/admin(.*)']);
const isPublicPage = createRouteMatcher([
  '/',
  '/api/auth(.*)',
  '/about',
  '/privacy',
  '/terms',
  '/cookies',
  '/refund',
  '/community-rules',
  '/contact',
]);

const ANALYTICS_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
const FIRST_TOUCH_COOKIE_MAX_AGE = 60 * 60 * 24 * 90;

function setAnalyticsCookies(request: Request, response: NextResponse) {
  const url = new URL(request.url);
  const aidCookie = request.headers.get('cookie')?.includes('allo_aid=');

  if (!aidCookie) {
    response.cookies.set('allo_aid', crypto.randomUUID(), {
      httpOnly: false,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: ANALYTICS_COOKIE_MAX_AGE,
    });
  }

  const hasFirstTouchCookie = request.headers.get('cookie')?.includes('allo_ft=');
  if (!hasFirstTouchCookie) {
    const firstTouchPayload = JSON.stringify({
      ts: Date.now(),
      path: url.pathname,
      utm_source: url.searchParams.get('utm_source') || undefined,
      utm_medium: url.searchParams.get('utm_medium') || undefined,
      utm_campaign: url.searchParams.get('utm_campaign') || undefined,
      utm_term: url.searchParams.get('utm_term') || undefined,
      utm_content: url.searchParams.get('utm_content') || undefined,
      ref: request.headers.get('referer') || undefined,
    });

    response.cookies.set('allo_ft', encodeURIComponent(firstTouchPayload), {
      httpOnly: false,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: FIRST_TOUCH_COOKIE_MAX_AGE,
    });
  }

  response.cookies.set('allo_lp', encodeURIComponent(url.pathname + url.search), {
    httpOnly: false,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
}

export default convexAuthNextjsMiddleware(async (request, ctx) => {
  const authenticated = await isAuthenticatedNextjs();

  // Redirect unauthenticated users away from protected pages
  if (!isAuthPage(request) && !isPublicPage(request) && !authenticated) {
    const response = nextjsMiddlewareRedirect(request, '/sign-in');
    setAnalyticsCookies(request, response);
    return response;
  }

  // Redirect authenticated users away from auth pages
  if (isAuthPage(request) && authenticated) {
    const response = nextjsMiddlewareRedirect(request, '/lobby');
    setAnalyticsCookies(request, response);
    return response;
  }

  const response = NextResponse.next();
  setAnalyticsCookies(request, response);
  return response;
});

export const config = {
  // Run middleware on all routes except static files
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
