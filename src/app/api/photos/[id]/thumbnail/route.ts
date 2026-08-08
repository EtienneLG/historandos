import { NextRequest, NextResponse } from 'next/server';
import { getThumbnail } from '@/lib/infomaniak';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: photoId } = await params;

  try {
    const { imageBuffer, contentType } = await getThumbnail(photoId);

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });

  } catch (error: any) {
    console.error(`Error streaming photo ${photoId}:`, error.message);
    return NextResponse.json({ error: "Image unavailable" }, { status: 404 });
  }
}