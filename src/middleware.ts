import { betterFetch } from '@better-fetch/fetch';
import { NextResponse, type NextRequest } from 'next/server';
import type { Session } from '@/lib/auth';

const authRoutes = ['/', '/sign-in', '/sign-up'];

export default async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isAuthRoute = authRoutes.includes(path);
  const cookie = request.headers.get('cookie') || '';

  if (isAuthRoute) {
    return NextResponse.next();
  }

  try {
    const { data: session } = await betterFetch<Session>(
      '/api/auth/get-session',
      {
        baseURL: process.env.BETTER_AUTH_URL,
        headers: { cookie },
      }
    );

    if (!session) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
};