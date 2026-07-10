import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const driveId = process.env.INFOMANIAK_DRIVE_ID;
  const token = process.env.INFOMANIAK_DRIVE_SECRET;
  const QAFileId = process.env.INFOMANIAK_LOGIN_QA_ID;

  try {
    const responseQA = await fetch(`https://api.infomaniak.com/2/drive/${driveId}/files/${QAFileId}/download`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { 
        revalidate: 3600,
        tags: ['login-qa']
      },
    });

    if (!responseQA.ok) {
      throw new Error(`Infomaniak API responded with status ${responseQA.status}`);
    }

    const QAData = await responseQA.json();

    if (!QAData.questions || !Array.isArray(QAData.questions) || QAData.questions.length === 0) {
      throw new Error(`Could not load QA from Infomaniak ${QAData}`);
    }

    const question = QAData.questions[Math.floor(Math.random() * QAData.questions.length)];

    return NextResponse.json({
      question: {
        id: question.id,
        question: question.question,
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
