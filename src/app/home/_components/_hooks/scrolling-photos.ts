import { Trace } from '@/types/trace';
import { useRef, RefObject, useCallback, useState, useEffect, act } from 'react';

export function useScrollingPhotos(activeTrace: Trace, containerRef: RefObject<HTMLDivElement | null>) {
  const [visiblePhotoIds, setVisiblePhotoIds] = useState<number[]>([]);
  const [isFetchingPhotos, setIsFetchingPhotos] = useState<boolean>(false);
  const [hasMorePhotos, setHasMorePhotos] = useState<boolean>(true);
  const [cursorPos, setCursorPos] = useState<string | null>(null);
  
  const isFetchingRef = useRef(isFetchingPhotos);
  const hasMoreRef = useRef(hasMorePhotos);
  const cursorRef = useRef(cursorPos);
  const observerRef = useRef<IntersectionObserver | null>(null);

  hasMoreRef.current = hasMorePhotos;
  cursorRef.current = cursorPos;
  isFetchingRef.current = isFetchingPhotos;

  const fetchMorePhotos = async () => {
    if (!activeTrace || isFetchingRef.current || !hasMoreRef.current) return;

    setIsFetchingPhotos(true);
    try {
      const cursorParam = cursorRef.current ? `&cursor=${cursorRef.current}` : '';
      const res = await fetch(`/api/photos/list?dir_id=${activeTrace.photoDirId}${cursorParam}`);

      const data = await res.json();

      if (data.photo_ids.length > 0) {
        setVisiblePhotoIds((prev) => {
          const uniqueIds = new Set([...prev, ...data.photo_ids]);
          return Array.from(uniqueIds);
        });
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

  return { sentinelRef, visiblePhotoIds, isFetchingPhotos, hasMorePhotos };
}