import { useRef, RefObject, useCallback, useState, useEffect } from 'react';

export function useScrollingPhotos(photoDirId: number | null, containerRef: RefObject<HTMLDivElement | null>) {
  const [visiblePhotoIds, setVisiblePhotoIds] = useState<number[]>([]);
  const [isFetchingPhotos, setIsFetchingPhotos] = useState<boolean>(false);
  const [hasMorePhotos, setHasMorePhotos] = useState<boolean>(true);
  const [cursorPos, setCursorPos] = useState<string | null>(null);
  const [sentinelNode, setSentinelNode] = useState<HTMLDivElement | null>(null);

  const isFetchingRef = useRef(isFetchingPhotos);
  const hasMoreRef = useRef(hasMorePhotos);
  const cursorRef = useRef(cursorPos);
  const photoDirIdRef = useRef(photoDirId);

  hasMoreRef.current = hasMorePhotos;
  cursorRef.current = cursorPos;
  isFetchingRef.current = isFetchingPhotos;
  photoDirIdRef.current = photoDirId;

  const fetchMorePhotos = useCallback(async () => {
    const dirId = photoDirIdRef.current;
    if (!dirId || isFetchingRef.current || !hasMoreRef.current) return;

    setIsFetchingPhotos(true);
    try {
      const cursorParam = cursorRef.current ? `&cursor=${cursorRef.current}` : '';
      const res = await fetch(`/api/photos/list?dir_id=${dirId}${cursorParam}`);

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
  }, []);
  
  const sentinelRef = useCallback((node: HTMLDivElement | null) => {
    setSentinelNode(node);
  }, []);

  useEffect(() => {
    setCursorPos(null);
    setHasMorePhotos(true);
    setVisiblePhotoIds([]);
  }, [photoDirId]);

  useEffect(() => {
    const root = containerRef.current;
    if (!sentinelNode || !root || !photoDirId || !hasMorePhotos) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting) {
          fetchMorePhotos();
        }
      },
      {
        root,
        rootMargin: '200px',
        threshold: 0.1,
      }
    );

    observer.observe(sentinelNode);

    return () => observer.disconnect();
  }, [sentinelNode, containerRef, photoDirId, hasMorePhotos, fetchMorePhotos]);

  return { sentinelRef, visiblePhotoIds, isFetchingPhotos, hasMorePhotos };
}