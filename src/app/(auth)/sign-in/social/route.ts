// src/app/api/auth/sign-in/social/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    }
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { provider, callbackURL } = body;

  if (provider === "google") {
    const redirectURL = `https://accounts.google.com/o/oauth2/v2/auth?...&redirect_uri=${callbackURL}`;
    return NextResponse.json({ redirect: redirectURL });
  }

  return NextResponse.json({ message: "Unsupported provider" }, { status: 400 });
}
