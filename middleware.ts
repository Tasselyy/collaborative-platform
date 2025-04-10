import { betterFetch } from "@better-fetch/fetch";
import { NextResponse, type NextRequest } from "next/server";
import type { Session } from "@/lib/auth";

const authRoutes = ["/sign-in", "/sign-up"];

export default async function authMiddleware(request: NextRequest) {
  const pathName = request.nextUrl.pathname;
  const isAuthRoute = authRoutes.includes(pathName);

  console.log('TESTsession :>> ');


  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: process.env.BETTER_AUTH_URL,
      headers: {
        //get the cookie from the request
        cookie: request.headers.get("cookie") || "",
      },
    },
  );

  if (!session) {
    if (isAuthRoute) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
//user has signed in
  if (isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }


  return NextResponse.next();
}

export const config = {
  runtime: "nodejs",
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};


