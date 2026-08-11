import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { getQA } from '@/lib/infomaniak';
import { env } from '@/env';

const SECRET_KEY = new TextEncoder().encode(env.JWT_SECRET_KEY);

function normalize(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export async function POST(request: NextRequest) {
  try {
    const { id: questionId, answer, password } = await request.json();

    if (password !== env.LOGIN_PASSWORD) {
      return NextResponse.json({ error: 'Mot de passe invalide' }, { status: 401 });
    }

    const QAs = await getQA();
    const question = QAs.find((QA: any) => QA.id === questionId);

    if (!question) throw new Error(`No question found for ID ${questionId}`);

    if (normalize(question.answer) !== normalize(answer)) {
      return NextResponse.json({ error: 'Mauvaise réponse à la question' }, { status: 401 });
    }

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
