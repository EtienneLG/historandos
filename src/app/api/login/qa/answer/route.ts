import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

function normalize(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}

export async function POST(request: NextRequest) {
  const driveId = process.env.INFOMANIAK_DRIVE_ID;
  const token = process.env.INFOMANIAK_DRIVE_SECRET
  const QAFileId = process.env.INFOMANIAK_LOGIN_QA_ID;
  
  try {
    const { id: questionId, answer, password } = await request.json();

    if (password !== process.env.LOGIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Mot de passe invalide' },
        { status: 401 }
      );
    }
    
    const responseQA = await fetch(`https://api.infomaniak.com/2/drive/${driveId}/files/${QAFileId}/download`, { 
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    if (!responseQA.ok)
      throw new Error(`Infomaniak API responded with status ${responseQA.status}`);

    const QAData = await responseQA.json();

    if (!QAData.questions)
      throw new Error(`Could not load QA from Infomaniak ${QAData}`);

    const question = QAData.questions.find((QA: any) => QA.id === questionId);

    if (!question)
      throw new Error(`No question found for ID ${questionId}`);

    if (normalize(question.answer) !== normalize(answer)) {
      return NextResponse.json(
        { error: 'Mauvaise réponse à la question' },
        { status: 401 }
      );
    }

    const JWTtoken = await new SignJWT({})
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(SECRET_KEY);
    
    const response = NextResponse.json({
      success: true,
      redirect: '/home',
    });

    response.cookies.set({
      name: 'authentificated',
      value: JWTtoken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error: any) {
    console.error("Login Error:", error.message);

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}