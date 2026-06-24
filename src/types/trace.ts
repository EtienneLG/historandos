export interface Trace {
  id: string;
  gpxFileId: number;
  photoDirId: number;
  title: string;
  description: string;
  date: string;
  lat: number;
  lon: number;
  thumbnailUrl?: string;
}

export interface TracePoint {
  distance: number;
  elevation: number;
  lat: number;
  lon: number;
}

export interface TraceMetrics {
  distance: number;
  elevationGain: number;
  elevationLoss: number;
  profile?: TracePoint[];
}