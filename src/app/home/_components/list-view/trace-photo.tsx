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
    <div className="w-1/3 md:w-55 bg-stone relative shrink-0 aspect-square overflow-hidden rounded-xl border border-stone shadow-sm">

      {(!imgSrc || !isImageLoaded) && (
        <div className="absolute inset-0 bg-stone animate-pulse z-10 flex items-center justify-center">
          <svg className="w-5 h-5 text-stone-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 19l6.5-11L14 15l2.5-3.5L21 19H3z" />
          </svg>
        </div>
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

      {/* subtle bottom vignette so any overlaid text/badges stay legible */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/15 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}