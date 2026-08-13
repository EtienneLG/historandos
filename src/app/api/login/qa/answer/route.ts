import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { env } from '@/env';

const SECRET_KEY = new TextEncoder().encode(env.JWT_SECRET_KEY);

/**
 * DEMO branch: the password/security-question flow is cosmetic only.
 */
export async function POST(request: NextRequest) {
  try {
    await request.json();

    const JWTtoken = await new SignJWT({})
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(SECRET_KEY);

    const response = NextResponse.json({
      success: true,
      redirect: '/',
    });

    response.cookies.set({
      name: 'authenticated',
      value: JWTtoken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Login Error:', message);

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
