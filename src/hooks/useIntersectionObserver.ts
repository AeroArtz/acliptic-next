// import { useEffect, useRef, useState } from 'react';

// export const useIntersectionObserver = (isPriority: boolean = false) => {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const [isVisible, setIsVisible] = useState(isPriority);

//   useEffect(() => {
//     if (isPriority) return; // Don't observe if it's a priority video

//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setIsVisible(true);
//           if (videoRef.current) {
//             videoRef.current.play();
//           }
//         } else {
//           setIsVisible(false);
//           if (videoRef.current) {
//             videoRef.current.pause();
//           }
//         }
//       },
//       {
//         threshold: 0.1
//       }
//     );

//     if (videoRef.current) {
//       observer.observe(videoRef.current);
//     }

//     return () => {
//       if (videoRef.current) {
//         observer.unobserve(videoRef.current);
//       }
//     };
//   }, [isPriority]);

//   return { videoRef, isVisible };
// };


// import { useEffect, useRef, useState, useCallback } from 'react';

// export const useIntersectionObserver = (isPriority: boolean = false) => {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const [isVisible, setIsVisible] = useState(isPriority);
//   const observerRef = useRef<IntersectionObserver | null>(null);

//   const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
//     const [entry] = entries;
//     if (entry.isIntersecting) {
//       setIsVisible(true);
//       if (videoRef.current && videoRef.current.paused) {
//         videoRef.current.play().catch(() => {
//           // Autoplay was prevented, do nothing
//         });
//       }
//     } else {
//       setIsVisible(false);
//       if (videoRef.current && !videoRef.current.paused) {
//         videoRef.current.pause();
//       }
//     }
//   }, []);

//   useEffect(() => {
//     if (isPriority) return;

//     const options = {
//       root: null,
//       rootMargin: '0px',
//       threshold: 0.5
//     };

//     observerRef.current = new IntersectionObserver(handleIntersection, options);

//     if (videoRef.current) {
//       observerRef.current.observe(videoRef.current);
//     }

//     return () => {
//       if (observerRef.current) {
//         observerRef.current.disconnect();
//       }
//     };
//   }, [isPriority, handleIntersection]);

//   return { videoRef, isVisible };
// };








// import { useEffect, useRef, useState, useCallback } from 'react';

// export const useIntersectionObserver = (isPriority: boolean = false) => {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const [isVisible, setIsVisible] = useState(isPriority);
//   const observerRef = useRef<IntersectionObserver | null>(null);

//   const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
//     const [entry] = entries;
//     if (entry.isIntersecting) {
//       setIsVisible(true);
//       if (videoRef.current && videoRef.current.paused) {
//         videoRef.current.play().catch(() => {
//           // Autoplay was prevented, do nothing
//         });
//       }
//     } else {
//       setIsVisible(false);
//       if (videoRef.current && !videoRef.current.paused) {
//         videoRef.current.pause();
//       }
//     }
//   }, []);

//   useEffect(() => {
//     const options = {
//       root: null,
//       rootMargin: '0px',
//       threshold: 0.5
//     };

//     observerRef.current = new IntersectionObserver(handleIntersection, options);

//     if (videoRef.current) {
//       observerRef.current.observe(videoRef.current);
//     }

//     return () => {
//       if (observerRef.current) {
//         observerRef.current.disconnect();
//       }
//     };
//   }, [handleIntersection]);

//   return { videoRef, isVisible };
// };





// src/hooks/useIntersectionObserver.ts
import { useEffect, useRef, useState, useCallback, RefObject } from 'react';

interface IntersectionOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export const useIntersectionObserver = <T extends HTMLElement>(options: IntersectionOptions = {}) => {
  const {
    threshold = 0.5,
    rootMargin = '0px',
    triggerOnce = false
  } = options;

  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    
    if (entry.isIntersecting) {
      setIsVisible(true);
      if (triggerOnce && observerRef.current) {
        observerRef.current.disconnect();
      }
    } else if (!triggerOnce) {
      setIsVisible(false);
    }
  }, [triggerOnce]);

  useEffect(() => {
    const currentRef = ref.current;
    
    const observerOptions = {
      root: null,
      rootMargin,
      threshold
    };

    observerRef.current = new IntersectionObserver(handleIntersection, observerOptions);

    if (currentRef) {
      observerRef.current.observe(currentRef);
    }

    return () => {
      if (observerRef.current && currentRef) {
        observerRef.current.unobserve(currentRef);
        observerRef.current.disconnect();
      }
    };
  }, [handleIntersection, rootMargin, threshold]);

  return { ref, isVisible } as { ref: RefObject<T>, isVisible: boolean };
};