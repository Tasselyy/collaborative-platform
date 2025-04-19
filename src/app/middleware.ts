console.log('✅ Middleware file loaded');
import { betterFetch } from '@better-fetch/fetch';
import { NextResponse, type NextRequest } from 'next/server';
import type { Session } from '@/lib/auth';

const authRoutes = ['/sign-in', '/sign-up'];

export default async function authMiddleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname;
  const isAuthRoute = authRoutes.includes(pathName);
  const cookieHeader = request.headers.get('cookie') || '';

  console.log('🔍 [Middleware] Requested Path:', pathName);
  console.log('🔍 [Middleware] Is Auth Route:', isAuthRoute);
  console.log('🍪 [Middleware] Cookie Header:', cookieHeader);

  try {
    const { data: session } = await betterFetch<Session>(
      '/api/auth/get-session',
      {
        baseURL: process.env.BETTER_AUTH_URL,
        headers: {
          cookie: cookieHeader,
        },
      }
    );

    console.log('🧠 [Middleware] Session Data:', session);

    // User is not logged in
    if (!session) {
      if (isAuthRoute) {
        console.log('✅ [Middleware] Public auth route, allow access.');
        return NextResponse.next();
      }
      console.log('🚫 [Middleware] No session. Redirecting to /sign-in.');
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    // User is logged in and trying to access /sign-in or /sign-up
    if (isAuthRoute) {
      console.log('🔁 [Middleware] Already signed in. Redirecting to /dashboard.');
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    console.log('✅ [Middleware] Authenticated. Allowing access.');
    return NextResponse.next();
  } catch (err) {
    console.error('❌ [Middleware] Error while validating session:', err);
    return NextResponse.next(); // fail-open fallback — you can change this to a redirect if you want
  }
}
export const config = {
    matcher: ['/dashboard', '/dashboard/:path*'],
  };