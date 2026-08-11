import { useRef } from 'react';
import { ActivityPhoto } from './activity-photo';
import { useScrollingPhotos } from '../../_hooks/scrolling-photos';

interface PhotosTabProps {
  photoDirId: number;
}

export function PhotosTab({ photoDirId }: PhotosTabProps) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const { sentinelRef, visiblePhotoIds, isFetchingPhotos, hasMorePhotos } = useScrollingPhotos(
    photoDirId,
    scrollContainerRef,
  );

  return (
    <div
      ref={scrollContainerRef}
      className="h-full overflow-y-auto px-6 py-5"
      style={{ scrollbarGutter: 'stable' }}
    >
      {visiblePhotoIds.length > 0 ? (
        <div className="grid grid-cols-2 gap-2">
          {visiblePhotoIds.map((id: number) => (
            <ActivityPhoto key={id} photoId={id} />
          ))}
        </div>
      ) : (
        !hasMorePhotos && (
          <p className="text-center text-sm text-ink/40 py-10">
            Aucune photo pour cette randonnée.
          </p>
        )
      )}

      {/* Scroll Sentinel Target & Loader */}
      {hasMorePhotos && (
        <div ref={sentinelRef} className="py-6 flex justify-center items-center min-h-[40px]">
          {isFetchingPhotos && (
            <div className="h-4 w-4 border-2 border-stone-dark border-t-blaze rounded-full animate-spin" />
          )}
        </div>
      )}
    </div>
  );
}
