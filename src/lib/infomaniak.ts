import { cacheLife, cacheTag } from 'next/cache';
import { env } from '@/env';

export async function getQA() {
  'use cache';
  cacheTag('login-qa');
  cacheLife('days');

  const response = await fetch(
    `https://api.infomaniak.com/2/drive/${env.INFOMANIAK_DRIVE_ID}/files/${env.INFOMANIAK_LOGIN_QA_ID}/download`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${env.INFOMANIAK_DRIVE_SECRET}`,
      },
    },
  );

  if (!response.ok) throw new Error(`Infomaniak API responded with status ${response.status}`);

  const data = await response.json();

  if ((!data.questions && !Array.isArray(data.questions)) || data.questions.length === 0)
    throw new Error(`Could not load QA from Infomaniak ${data}`);

  return data.questions;
}

export async function getFileList(params: URLSearchParams, dirId: string) {
  const response = await fetch(
    `https://api.infomaniak.com/3/drive/${env.INFOMANIAK_DRIVE_ID}/files/${dirId}/files?${params.toString()}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${env.INFOMANIAK_DRIVE_SECRET}`,
        'Content-Type': 'application/json',
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Infomaniak API responded with status ${response.status}`);
  }

  const data = await response.json();

  if (!data.data) {
    throw new Error(`Could not load photos from Infomaniak ${data}`);
  }

  return data;
}

export async function getThumbnail(photoId: string) {
  'use cache';
  cacheLife('max');

  const response = await fetch(
    `https://api.infomaniak.com/2/drive/${env.INFOMANIAK_DRIVE_ID}/trash/${photoId}/thumbnail`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${env.INFOMANIAK_DRIVE_SECRET}`,
        'Content-Type': 'application/json',
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Infomaniak API responded with status ${response.status}`);
  }

  const imageBuffer = await response.arrayBuffer();
  const contentType = response.headers.get('content-type') || 'image/jpeg';

  return { imageBuffer, contentType };
}
