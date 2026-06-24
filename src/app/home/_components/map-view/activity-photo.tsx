import { useState, useEffect } from 'react';

export function ActivityPhoto({ photoId }: { photoId: string }) {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<boolean>(true);

  const driveId = process.env.INFOMANIAK_DRIVE_ID;
  const token = process.env.INFOMANIAK_DRIVE_SECRET;

  useEffect(() => {
    let objectUrl: string | null = null;
    
    async function downloadPhoto() {
      try {
        const res = await fetch(`https://api.infomaniak.com/2/drive/${driveId}/files/${photoId}/thumbnail`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) throw new Error('Download failed');

        const blob = await res.blob();
        objectUrl = URL.createObjectURL(blob);
        setImgSrc(objectUrl);
      } catch (err) {
        console.error(`Failed downloading photo ${photoId}:`, err);
      } finally {
        setIsDownloading(false);
      }
    }

    downloadPhoto();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [photoId]);

  return (
    <div className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-50 border border-slate-200/40 shadow-sm flex items-center justify-center">
      {isDownloading ? (
        // Individual micro-loader skeleton while this specific image builds
        <div className="h-4 w-4 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin" />
      ) : imgSrc ? (
        <>
          <img 
            src={imgSrc} 
            alt="Trail snapshot" 
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors duration-300" />
        </>
      ) : (
        // Fallback icon/text if individual download fails
        <span className="text-[10px] text-slate-400 font-medium">Unavailable</span>
      )}
    </div>
  );
}