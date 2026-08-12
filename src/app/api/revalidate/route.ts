import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function GET(request: NextRequest) {
  const tag = request.nextUrl.searchParams.get('tag');

  if (!tag) {
    return NextResponse.json(
      { revalidated: false, now: Date.now(), message: 'Missing tag to revalidate' },
      { status: 400 },
    );
  }

  revalidateTag(tag, 'max');

  return NextResponse.json({ revalidated: true, tag, now: Date.now() });
}
