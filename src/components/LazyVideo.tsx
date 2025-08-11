// src/components/LazyVideo.tsx
import React, { useEffect } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface LazyVideoProps {
  src: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}

export const LazyVideo = ({ 
  src, 
  width, 
  height,
  className = "",
  priority = false 
}: LazyVideoProps) => {
  const { ref: videoRef, isVisible } = useIntersectionObserver<HTMLVideoElement>({
    threshold: 0.5,
    triggerOnce: false  // Changed to false so it keeps observing
  });

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      if (isVisible || priority) {
        videoElement.play().catch(() => {
          // Handle autoplay failure silently
        });
      } else {
        videoElement.pause();
      }
    }
  }, [isVisible, priority, videoRef]);

  return (
    <video
      ref={videoRef}
      src={src}
      autoPlay={false}
      loop
      muted
      playsInline
      preload={priority ? "auto" : "metadata"}
      width={width}
      height={height}
      className={`${className} ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
    />
  );
};

export default LazyVideo;