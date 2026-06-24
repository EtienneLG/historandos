'use client';

import { Trace } from '@/types/trace';
import { useEffect, useRef, RefObject } from 'react';

export function useScrollingPhotos(activeTrace: Trace, containerRef: RefObject<HTMLDivElement | null>) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    const container = containerRef.current;

    console.log("in the observer", sentinel, container);
    
    if (!sentinel || !container) return;

    console.log("ok now it's good");

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        console.log("target ?", target);
        if (target.isIntersecting) {
          // Trigger your fetch code here
          console.log("Sentinel crossed! Fetching more photos...");
        }
      },
      {
        root: container,      
        rootMargin: '200px',  
        threshold: 0,
      }
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [activeTrace]);

  return { sentinelRef };
}