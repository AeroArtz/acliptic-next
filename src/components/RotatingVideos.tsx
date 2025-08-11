'use client'

import React, { useState, useEffect, useRef } from 'react';

const initialVideoSources = [
  '/h1.webm', '/h2.webm', '/h3.webm', '/h4.webm',
  '/h5.webm', '/h6.webm', '/h7.webm'
];

const videoPositions = [
  { top: 0, left: 697, rotate: 2.46, zIndex: 10 },
  { top: -10, left: 820, rotate: 5.02, zIndex: 5 },
  { top: 30, left: 944, rotate: -5.91, zIndex: 4 },
  { top: 12, left: 1068, rotate: 0.99, zIndex: 10 },
  { top: 25, left: 297, rotate: 7.08, zIndex: 0 },
  { top: 12, left: 432, rotate: 0.21, zIndex: 0 },
  { top: 35, left: 565, rotate: -4.3, zIndex: 0 }
];

export default function RotatingVideos() {
  const [videoSources, setVideoSources] = useState(initialVideoSources);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const rotateVideos = () => {
      setActiveVideoIndex((prevIndex) => (prevIndex + 1) % videoSources.length);
      setVideoSources((prevSources) => {
        const newSources = [...prevSources];
        const shiftedSource = newSources.shift();
        if (shiftedSource) newSources.push(shiftedSource);
        return newSources;
      });
    };

    const intervalId = setInterval(rotateVideos, 5000);
    return () => clearInterval(intervalId);
  }, [videoSources.length]);

  useEffect(() => {
    videoRefs.current.forEach((videoRef, index) => {
      if (videoRef) {
        if (index === 0) {
          videoRef.play().catch(error => console.error('Error playing video:', error));
        } else {
          videoRef.pause();
          videoRef.currentTime = 0;
        }
      }
    });
  }, [activeVideoIndex]);

  return (
    <div className="mt-12 flex justify-center relative">
      {videoSources.map((src, index) => (
        <video
          key={src}
          ref={(el) => { videoRefs.current[index] = el; }}
          src={src}
          width={150}
          height={270}
          className="absolute rounded-[14px] transition-all duration-500 ease-in-out"
          style={{
            top: `${videoPositions[index].top}px`,
            left: `${videoPositions[index].left}px`,
            transform: `rotate(${videoPositions[index].rotate}deg)`,
            zIndex: index === 3 ? -1 : videoPositions[index].zIndex
          }}
          muted
          playsInline
        />
      ))}
    </div>
  );
}

