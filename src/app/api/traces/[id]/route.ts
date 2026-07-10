import { NextRequest, NextResponse } from 'next/server';
import { calculateTraceMetrics, gpxToGeoJson } from '@/lib/geo'; 

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const driveId = process.env.INFOMANIAK_DRIVE_ID;
  const token = process.env.INFOMANIAK_DRIVE_SECRET;

  const { id: traceId } = await params;  
  
  console.log(`Fetching trace ${traceId}`);
  
  try {
    const response = await fetch(`https://api.infomaniak.com/2/drive/${driveId}/files/${traceId}/download`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      next: { revalidate: 604800 }
    });

    if (!response.ok) 
      throw new Error(`Failed to fetch trace: ${response.status}`);

    const gpxText = await response.text();
    const geoJson = gpxToGeoJson(gpxText);

    const metrics = calculateTraceMetrics(geoJson);

    return NextResponse.json({
      geoJson,
      metrics
    }, {
      headers: {
        'Cache-Control': 'public, max-age=86400, immutable'
      }
    });
  } catch (error) {
    console.error('Error fetching trace:', error);

    return NextResponse.json({ error: 'Failed to load trace data.' }, 
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