import { readFileSync, readdirSync } from 'node:fs';
import { join, extname } from 'node:path';

/**
 * DEMO branch: no Infomaniak Drive account is used here.
 */

const DEMO_PHOTOS_DIR = join(process.cwd(), 'public', 'demo-photos');

const MIME_TYPES: Record<string, string> = {
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

function listDemoPhotoFiles(): string[] {
  try {
    return readdirSync(DEMO_PHOTOS_DIR)
      .filter((name) => Boolean(MIME_TYPES[extname(name)]))
      .sort();
  } catch {
    return [];
  }
}

export async function getQA() {
  return [
    {
      id: 'demo-question',
      question: 'Quel est le nom de cette démo ?',
      type: 'text',
      answer: 'demo',
    },
  ];
}

export async function getFileList(_params: URLSearchParams, _dirId: string) {
  const files = listDemoPhotoFiles();

  return {
    data: files.map((_, index) => ({ id: index + 1, extension_type: 'image' })),
    cursor: null,
    has_more: false,
  };
}

export async function getThumbnail(photoId: string) {
  const files = listDemoPhotoFiles();
  const index = Number(photoId) - 1;
  const fileName = files[index] ?? files[0];

  if (!fileName) {
    throw new Error('No demo photos available');
  }

  const imageBuffer = readFileSync(join(DEMO_PHOTOS_DIR, fileName));
  const contentType = MIME_TYPES[extname(fileName)] ?? 'application/octet-stream';

  return { imageBuffer, contentType };
}
