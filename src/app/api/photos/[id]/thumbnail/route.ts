import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const driveId = process.env.INFOMANIAK_DRIVE_ID;
  const token = process.env.INFOMANIAK_DRIVE_SECRET;

  const { id: photoId } = await params;

  try {
    const response = await fetch(`https://api.infomaniak.com/2/drive/${driveId}/trash/${photoId}/thumbnail`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',  
        },
        next: { revalidate: 2592000 }
    });

    if (!response.ok) {
      throw new Error(`Infomaniak API responded with status ${response.status}`);
    }

    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

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