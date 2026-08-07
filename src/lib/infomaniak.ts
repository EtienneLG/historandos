import { cacheLife, cacheTag } from 'next/cache';
import { env } from '@/env';

export async function getQA() {
  'use cache';
  cacheTag('login-qa');
  cacheLife('days');

  const response = await fetch(`https://api.infomaniak.com/2/drive/${env.INFOMANIAK_DRIVE_ID}/files/${env.INFOMANIAK_LOGIN_QA_ID}/download`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${env.INFOMANIAK_DRIVE_SECRET}`,
    }
  });

  if (!response.ok)
    throw new Error(`Infomaniak API responded with status ${response.status}`);

  const data = await response.json();

  if (!data.questions && !Array.isArray(data.questions) || data.questions.length === 0)
    throw new Error(`Could not load QA from Infomaniak ${data}`);

  return data.questions;
}