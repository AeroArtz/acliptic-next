'use client';

import React, { useEffect, useRef } from 'react';

export default function MainVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1 // Video will start playing when 10% is visible
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (!videoRef.current) return;

        if (entry.isIntersecting) {
          videoRef.current.play().catch(() => {
            // Handle any autoplay errors silently
          });
        } else {
          videoRef.current.pause();
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, options);

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef} 
      className="top-[500px] rounded-[18px] w-[1380px] h-[680px] mx-auto px-16 py-16 relative"
    >
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover rounded-[18px]"
        src="/land1.webm"
        muted
        playsInline
        preload="metadata"
   
      >
      </video>
    </div>
  );
}