import { NextRequest, NextResponse } from 'next/server';
import { getFileList } from '@/lib/infomaniak';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const cursor = searchParams.get('cursor');
  const dirId = searchParams.get('dir_id');

  if (!dirId) {
    return NextResponse.json({ error: 'Missing directory ID' }, { status: 400 });
  }

  try {
    const params = new URLSearchParams({
      'order_by[]': 'name',
      order: 'asc',
      'type[]': 'file',
    });
    if (cursor) {
      params.append('cursor', cursor);
    }

    const fileList = await getFileList(params, dirId);

    const photoIds = fileList.data
      .filter((file: { id: number; extension_type: string }) => file.extension_type === 'image')
      .map((file: { id: number }) => file.id);

    return NextResponse.json({
      photo_ids: photoIds,
      cursor: fileList.cursor,
      has_more: fileList.has_more,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Fetch Error:', message);

    return NextResponse.json({ error: 'Failed to fetch photos' }, { status: 500 });
  }
}
