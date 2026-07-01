import { NextRequest, NextResponse } from 'next/server';
import { calculateTraceMetrics, gpxToGeoJson } from '@/lib/geo'; 

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const searchParams = request.nextUrl.searchParams;
  const dirId = searchParams.get('dir_id');

  const driveId = process.env.INFOMANIAK_DRIVE_ID;
  const token = process.env.INFOMANIAK_DRIVE_SECRET;
  
  try {
    
  } catch (error) {
    
  }
}