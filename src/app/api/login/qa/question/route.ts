import { NextResponse, connection } from 'next/server';
import { getQA } from '@/lib/infomaniak';

export async function GET() {
  await connection();
  
  try {
    const QAs = await getQA();
    const question = QAs[Math.floor(Math.random() * QAs.length)];

    return NextResponse.json({
      question: {
        id: question.id,
        question: question.question,
        type: question.type
      },
    });
  } catch (error: any) {
    console.error('Question fetch error:', error.message);

    return NextResponse.json(
      { error: 'Unable to load question' },
      { status: 500 }
    );
  }
}
