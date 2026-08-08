import { NextRequest, NextResponse } from 'next/server';
import { getHikeGeometry } from '@/lib/data';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: photoId } = await params;

  try {
    const hikeGeometry = await getHikeGeometry(photoId);

    return NextResponse.json(hikeGeometry);
  } catch (error: any) {
    console.error(`Error streaming photo ${photoId}:`, error.message);
    return NextResponse.json({ error: "Image unavailable" }, { status: 404 });
  }
}