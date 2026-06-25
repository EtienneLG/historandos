import { Trace } from '@/types/trace';
import { useRef, RefObject, useCallback, useState, useEffect, act } from 'react';

export function useScrollingPhotos(activeTrace: Trace, containerRef: RefObject<HTMLDivElement | null>) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [visiblePhotoIds, setVisiblePhotoIds] = useState<number[]>([]);
  const [isFetchingPhotos, setIsFetchingPhotos] = useState<boolean>(false);
  const [hasMorePhotos, setHasMorePhotos] = useState<boolean>(true);
  const [cursorPos, setCursorPos] = useState<string | null>(null);

  const driveId = process.env.INFOMANIAK_DRIVE_ID;
  const token = process.env.INFOMANIAK_DRIVE_SECRET;

  const fetchMorePhotos = async () => {
    if (!activeTrace || isFetchingPhotos || !hasMorePhotos) return;

    setIsFetchingPhotos(true);
    try {
      console.log("Fetching :", `/api/photos/list?cursor=${cursorPos}`);
      const cursorParam = cursorPos ? `&cursor=${cursorPos}` : '';
      const res = await fetch(`/api/photos/list?dir_id=${activeTrace.photoDirId}${cursorParam}`);

      const data = await res.json();
      console.log("Got data !", data);

      if (data.photo_ids.length > 0) {
        setVisiblePhotoIds((prev) => [...prev, ...data.photo_ids]);
        setCursorPos(data.cursor);
        if (!data.has_more) setHasMorePhotos(false);
      } else {
        setHasMorePhotos(false);
      }
    } catch (error) {
      console.error("Error fetching photos:", error);
    } finally {
      setIsFetchingPhotos(false);
    }
  };

  const sentinelRef = useCallback((node: HTMLDivElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    if (!node || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting) {
          console.log("Intersect ! Fetch more...");
          fetchMorePhotos();
        }
      },
      {
        root: containerRef.current,
        rootMargin: '200px',
        threshold: 0.1,
      }
    );

    observer.observe(node);
    observerRef.current = observer;

  }, [activeTrace]);

  useEffect(() => {
    setCursorPos(null);
    setHasMorePhotos(true);
    setVisiblePhotoIds([]);
  }, [activeTrace]);

  return { sentinelRef, visiblePhotoIds, isFetchingPhotos };
}