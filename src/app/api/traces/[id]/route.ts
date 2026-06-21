import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const driveId = process.env.INFOMANIAK_DRIVE_ID;
  const token = process.env.INFOMANIAK_DRIVE_SECRET;

  const { id: traceId } = await params;
  
  try {
    const response = await fetch(`https://api.infomaniak.com/2/drive/${driveId}/files/${traceId}/download`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    if (!response.ok) 
      throw new Error(`Failed to fetch trace: ${response.status}`);

    return new NextResponse(response.body, {
      headers: { 
        'Content-Type': 'application/gpx+xml',
        'Cache-Control': 'public, max-age=3600'
      },
    });
  } catch (error) {
    console.error('Error fetching trace:', error);

    return new NextResponse(
      JSON.stringify({ error: 'Failed to load trace data.' }), 
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, max-age=0' 
        },
      }
    );
  }
}