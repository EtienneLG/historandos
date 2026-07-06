import LoginForm from './form';
import { Question } from '@/types/question';

async function getQuestion(): Promise<Question> {
  const driveId = process.env.INFOMANIAK_DRIVE_ID;
  const token = process.env.INFOMANIAK_DRIVE_SECRET
  const QAFileId = process.env.INFOMANIAK_LOGIN_QA_ID;
  
  try {    
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

    const question = QAData.questions[Math.floor(Math.random() * QAData.questions.length)];

    return {
      id: question.id,
      question: question.question
    };
  } catch (error: any) {
    console.error("Question fetch Error:", error.message);

    return { id: -1, question: 'Error fetching question' };
  }
}

export default async function LoginPage() {
  const question = await getQuestion();

  return (
    <main className="flex min-h-screen items-center justify-center">
      <LoginForm question={question} />
    </main>
  );
}