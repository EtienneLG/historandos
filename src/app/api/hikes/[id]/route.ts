import { NextRequest, NextResponse } from 'next/server';
import { getHikeGeometry } from '@/lib/data';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: hikeId } = await params;

  try {
    const hikeGeometry = await getHikeGeometry(hikeId);

    return NextResponse.json(hikeGeometry);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Error fetching hike ${hikeId}:`, message);
    return NextResponse.json({ error: 'Hike not found' }, { status: 404 });
  }
}
