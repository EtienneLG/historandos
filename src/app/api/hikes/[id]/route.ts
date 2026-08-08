import { NextRequest, NextResponse } from 'next/server';
import { getHikeDetail } from '@/lib/data';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: photoId } = await params;

  try {
    const hikeDetail = await getHikeDetail(photoId);

    return NextResponse.json(hikeDetail);
  } catch (error: any) {
    console.error(`Error streaming photo ${photoId}:`, error.message);
    return NextResponse.json({ error: "Image unavailable" }, { status: 404 });
  }
}