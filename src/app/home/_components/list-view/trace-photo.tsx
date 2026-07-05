import { useEffect, useState } from 'react';

interface TracePhotoProps {
  photoDirId: number;
}

export function TracePhoto({ photoDirId }: TracePhotoProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    let isCurrentRequest = true;

    setImgSrc(null);
    setIsImageLoaded(false);

    if (!photoDirId) {
      setImgSrc('/fallback-placeholder.jpg');
      return;
    }

    async function fetchPhotoUrl() {
      try {
        const response = await fetch(`/api/photos/random?dir_id=${photoDirId}`);
        if (!response.ok) throw new Error('Network authentication or route layout failure');
        
        const data = await response.json();
        
        if (isCurrentRequest) {
          setImgSrc(data.url);
        }
      } catch (error) {
        console.error('Failed fetching dynamic cover image asset node:', error);
        if (isCurrentRequest) {
          setImgSrc('/fallback-placeholder.jpg');
        }
      }
    }

    fetchPhotoUrl();

    return () => {
      isCurrentRequest = false;
    };
  }, [photoDirId]);

  return (
    <div className="w-1/3 md:w-1/4 bg-gray-100 relative shrink-0 aspect-square overflow-hidden rounded-xl border border-gray-100 shadow-sm">
      
      {(!imgSrc || !isImageLoaded) && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse z-10" />
      )}
      
      {imgSrc && (
        <img 
          src={imgSrc}
          alt=""
          onLoad={() => setIsImageLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-500 ease-out transform ${
            isImageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        />
      )}
    </div>
  );
}