import { NextRequest, NextResponse } from 'next/server';

const availableOrdersBy = [
    'added_at', 'last_modified_at', 'mime_type', 'name', 'revised_at', 'size', 'type', 'updated_at'
] as const;

const availableOrders = ['asc', 'desc'] as const;

export async function GET(
  request: NextRequest
) {
  const searchParams = request.nextUrl.searchParams;
  const dirId = searchParams.get('dir_id');

  if (!dirId) {
    return NextResponse.json({ error: "Missing directory ID" }, { status: 400 });
  }

  const driveId = process.env.INFOMANIAK_DRIVE_ID;
  const token = process.env.INFOMANIAK_DRIVE_SECRET;
  
  try {
    const randomOrderBy = availableOrdersBy[Math.floor(Math.random() * availableOrdersBy.length)];
    const randomOrder = availableOrders[Math.floor(Math.random() * availableOrders.length)];
    
    const params = new URLSearchParams({
        'type[]': 'file',
        'limit': '30',
        'order_by[]': randomOrderBy,
        'order': randomOrder,
    });
    const response = await fetch(`https://api.infomaniak.com/3/drive/${driveId}/files/${dirId}/files?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',  
        },
        cache: 'no-store',
    });

    if (!response.ok)
      throw new Error(`Infomaniak API responded with status ${response.status}`);

    const data = await response.json();

    if (!data.data)
      throw new Error(`Could not load photos from Infomaniak ${data}`);

    const photoIds = data.data
      .filter((file: { id: number; extension_type: string }) => file.extension_type === 'image');

    if (photoIds.length === 0) {
      const fallbackResponse = NextResponse.redirect(new URL('/fallback-placeholder.jpg', request.url), 307);
      fallbackResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      return fallbackResponse;
    }

    const randomPhotoId = photoIds[Math.floor(Math.random() * photoIds.length)].id;    

    return NextResponse.json({ 
      url: `/api/photos/${randomPhotoId}/thumbnail`
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache'
      }
    });
  } catch (error: any) {
    console.error("Fetch Error:", error.message);

    return NextResponse.json({ error: "Failed to fetch photos" }, { status: 500 });
  }
}