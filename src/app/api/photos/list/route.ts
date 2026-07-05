import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const cursor = searchParams.get('cursor');
  const dirId = searchParams.get('dir_id');

  const driveId = process.env.INFOMANIAK_DRIVE_ID;
  const token = process.env.INFOMANIAK_DRIVE_SECRET;

  try {
    const cursorParam = cursor ? `&cursor=${cursor}` : '';
    const params = new URLSearchParams({
        'order_by[]': 'name',
        'order': 'asc',
        'type[]': 'file',
    });
    const response = await fetch(`https://api.infomaniak.com/3/drive/${driveId}/files/${dirId}/files?${params.toString()}${cursorParam}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',  
        }
    });

    if (!response.ok) {
      throw new Error(`Infomaniak API responded with status ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.data) {
      throw new Error(`Could not load photos from Infomaniak ${data}`);
    }

    const photoIds = data.data
      .filter((file: { id: number; extension_type: string }) => file.extension_type === 'image')
      .map((file: { id: number }) => file.id);

    return NextResponse.json({
      photo_ids: photoIds,
      cursor: data.cursor,
      has_more: data.has_more,
    });

  } catch (error: any) {
    console.error("Fetch Error:", error.message);
    
    return NextResponse.json({ error: "Failed to fetch photos" }, { status: 500 });
  }
}