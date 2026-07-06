import { NextRequest, NextResponse } from 'next/server';
import { calculateTraceMetrics, gpxToGeoJson } from '@/lib/geo';

function toKebabCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, '-')
    .toLowerCase();
}

export async function POST(
  request: NextRequest
) {
  const driveId = process.env.INFOMANIAK_DRIVE_ID;
  const targetDirId = process.env.INFOMANIAK_TRACE_DIR_ID;
  const metadataId = process.env.INFOMANIAK_METADATA_ID;
  const token = process.env.INFOMANIAK_DRIVE_SECRET;

  try {
    const formData = await request.formData();

    const title = formData.get('title');
    const description = formData.get('description') || '';
    const date = formData.get('date');
    const photoDirectoryId = formData.get('photoDirectoryId') || '';
    const gpxFile = formData.get('gpxFile');

    if (typeof title !== 'string' || title.length === 0 || !(gpxFile instanceof File)) {
      return NextResponse.json({ error: 'Invalid upload request' }, { status: 400 })
    }

    const traceId = toKebabCase(title);

    console.log(`Uploading trace: "${title}"`);

    const paramsUpload = new URLSearchParams({
      directory_id: targetDirId || '',
      file_name: `${traceId}.gpx`,
      total_size: gpxFile.size.toString()
    });
    const responseUpload = await fetch(`https://api.infomaniak.com/3/drive/${driveId}/upload?${paramsUpload.toString()}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/gpx+xml'
      },
      body: gpxFile
    });

    if (!responseUpload.ok) {
      const errorText = await responseUpload.text();
      throw new Error(`Upload failed: ${responseUpload.status} - ${errorText}`);
    }

    const gpxData = await responseUpload.json()

    console.log(`Fetching metadata`);

    const responseMetadata = await fetch(`https://api.infomaniak.com/2/drive/${driveId}/files/${metadataId}/download`, { 
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    if (!responseMetadata.ok) 
      throw new Error(`Failed to fetch metadata: ${responseMetadata.status}`);
    
    console.log(`Updating metadata`);

    const metadata = await responseMetadata.json();

    const existingTraceIndex = metadata.traces.findIndex((trace: { id: string }) => trace.id === traceId);
    if (existingTraceIndex > -1) {
      metadata.traces.splice(existingTraceIndex, 1)
    }

    const gpxStr = await gpxFile.text();
    const geoJson = gpxToGeoJson(gpxStr);
    const metrics = calculateTraceMetrics(geoJson);

    const firstCoordinates = geoJson.features?.[0]?.geometry?.coordinates?.[0] || [0, 0];
    const lon = firstCoordinates[0];
    const lat = firstCoordinates[1];

    metadata.traces.push({
      id: traceId,
      gpxFileId: gpxData.data.id,
      photoDirId: photoDirectoryId,
      title: title,
      description: description,
      date: date,
      lat: lat,
      lon: lon,
      metrics: {
        distance: metrics.distance,
        elevationGain: metrics.elevationGain,
        elevationLoss: metrics.elevationLoss
      }
    })

    const metadataPayloadStr = JSON.stringify(metadata);
    const paramsUpdate = new URLSearchParams({
      file_id: metadataId || '',
      total_size: Buffer.byteLength(metadataPayloadStr, 'utf-8').toString(),
    });
    const responseUpdate = await fetch(`https://api.infomaniak.com/3/drive/${driveId}/upload?${paramsUpdate.toString()}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: metadataPayloadStr
    });

    if (!responseUpdate.ok) 
      throw new Error(`Failed to update metadata: ${responseUpdate.status}`);

    const result = await responseUpdate.json();

    return NextResponse.json({ 
      message: 'Trace uploaded with success',
      fileId: result.data.id
    })
  } catch (error) {
    console.error('Error uploading trace:', error);

    return NextResponse.json({ error: 'Failed to upload trace.' }, { status: 500 });
  }
}