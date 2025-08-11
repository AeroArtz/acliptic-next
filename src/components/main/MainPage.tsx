'use client'

import Image from 'next/image';
import Navigation from '@/components/mainNavigation';
import { AnimatedTestimonialsDemo } from '@/components/testimonials';
import { FAQSection } from '@/components/faq-section';
import { LazyVideo } from '@/components/LazyVideo';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import Footer from '../Footer';

interface HomePageProps{
    user_id : string,
  }
export default function MainPage({user_id}: HomePageProps) {

  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  // const [prevFeature, setPrevFeature] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const autoRotateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);

  

  const features = [
    {
      title: "Automatic Editing",
      description: "OUR AI WILL AUTOMATICALLY PERFORM EDITS ON THE CLIPS GENERATED, INCLUDING SPECIAL EFFECTS, ZOOMING IN AND OUT, FOCUSING ON THE PERSON SPEAKING.",
      image: "/autoEdit.jpg"
    },
    {
      title: "Captions",
      description: "CAPTIONS/SUBTITLES IN A CHOICE OF 40+ LANGUAGES WILL AUTOMATICALLY BE APPLIED TO ALL YOUR CLIPS IN VARIOUS ENGAGING STYLES BASED ON YOUR CHOICE.",
      image: "/capt.jpg"
    },
    {
      title: "Multi-Platform Uploads",
      description: "All the generated clips will automatically be uploaded to all the social media platforms of the user that are linked.",
      image: "/multi2.jpg"
    },
    {
      title: "AI Reframe",
      description: "our ai will automatically resize the video to 9:16 aspect ratio, and will do so focusing on the person speaking.",
      image: "/reframe.jpg"
    }
  ];

  // Function to handle feature change with animation
  const changeFeature = (index: number) => {
    if (currentFeature === index || isTransitioning) return;

    // Pause auto-rotation when user manually changes feature
    setAutoRotate(false);

    // Resume auto-rotation after 3 seconds of inactivity
    setTimeout(() => {
      setAutoRotate(true);
    }, 3000);

    setIsTransitioning(true);
    // setPrevFeature(currentFeature);

    // Get references to elements
    const titleElement = document.querySelector('.feature-title');
    const descElement = document.querySelector('.feature-description');
    const currentImageWrapper = document.querySelector('.current-feature-image');
    const nextImageWrapper = document.querySelector('.next-feature-image');

    if (titleElement && descElement && currentImageWrapper && nextImageWrapper) {
      // Add will-change hint before animation
      gsap.set([titleElement, descElement, nextImageWrapper, currentImageWrapper], {
        willChange: 'transform, opacity, filter'
      });

      // Create a timeline for the transition
      const tl = gsap.timeline({
        onComplete: () => {
          setCurrentFeature(index);
          setIsTransitioning(false);

          // Reset the opacity of containers for next transition
          gsap.set(currentImageWrapper, { opacity: 1, scale: 1, filter: 'none', willChange: 'auto', clipPath: 'inset(0%)' });
          gsap.set(nextImageWrapper, { opacity: 0, willChange: 'auto', zIndex: 1, clipPath: 'inset(0%)' });
          gsap.set([titleElement, descElement], { willChange: 'auto' });
        }
      });

      // Prepare next image container with the new image
      const nextImageElement = nextImageWrapper.querySelector('img');
      if (nextImageElement && nextImageElement instanceof HTMLImageElement) {
        // Important: Update the src to the new feature image
        nextImageElement.src = features[index].image;

        // Preload the image to ensure smooth transition
        const preloadImg = document.createElement('img');
        preloadImg.src = features[index].image;
        preloadImg.onload = () => {
          // 1. Fade out text with a more elegant transition
          tl.to([titleElement, descElement], {
            opacity: 0,
            y: -20,
            filter: 'blur(6px)',
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.inOut"
          });

          // 2. Set up next image with higher z-index and initial state
          tl.set(nextImageWrapper, {
            zIndex: 3,
            opacity: 1,
            scale: 1.05,
            clipPath: 'inset(0% 100% 0% 0%)', // Hidden from right side
            filter: 'brightness(1.1)'
          });

          // 3. Dramatic reveal animation - slide in from right
          tl.to(nextImageWrapper, {
            clipPath: 'inset(0% 0% 0% 0%)',
            scale: 1,
            duration: 0.9,
            ease: "power3.inOut"
          });

          // 4. Fade out current image
          tl.to(currentImageWrapper, {
            opacity: 0.3,
            scale: 0.95,
            duration: 0.7,
            ease: "power2.inOut"
          }, "-=0.7");

          // 5. Update text content
          tl.call(() => {
            if (titleElement instanceof HTMLElement) {
              titleElement.textContent = features[index].title;
            }
            if (descElement instanceof HTMLElement) {
              descElement.textContent = features[index].description;
            }
          });

          // 6. Fade in text with a more refined animation
          tl.fromTo([titleElement, descElement],
            {
              opacity: 0,
              y: 25,
              filter: 'blur(10px)'
            },
            {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              duration: 0.8,
              stagger: 0.15,
              ease: "power3.out"
            }
          );
        };
      } else {
        // Fallback if elements aren't found
        setCurrentFeature(index);
        setTimeout(() => {
          setIsTransitioning(false);
        }, 600);
      }
    } else {
      // Fallback if elements aren't found
      setCurrentFeature(index);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 600);
    }
  };

  // Handle opening the modal with GSAP animation
  const openFeatureModal = () => {
    // First make the container visible but with no content visible yet
    setShowFeatureModal(true);

    // Use setTimeout to ensure the modal is in the DOM before animating
    setTimeout(() => {
      if (modalRef.current && modalContentRef.current) {
        // Add will-change hint
        gsap.set([modalRef.current, modalContentRef.current], {
          willChange: 'transform, opacity, clip-path'
        });

        // Create a timeline for more complex animation
        const tl = gsap.timeline({
          onComplete: () => {
            // Remove will-change hint after animation completes
            gsap.set([modalRef.current, modalContentRef.current], {
              willChange: 'auto'
            });
          }
        });

        // Improved modal opening animation with a more elegant reveal
        tl.fromTo(modalRef.current,
          {
            clipPath: 'inset(0 0 100% 0)',
            opacity: 1
          },
          {
            clipPath: 'inset(0 0 0% 0)',
            duration: 1.2,
            ease: "power3.inOut"
          }
        );

        // Then animate the content with a more refined animation
        tl.fromTo(modalContentRef.current,
          {
            y: -30,
            opacity: 0,
            filter: 'blur(8px)'
          },
          {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.9,
            ease: "power2.out"
          },
          "-=0.6" // Start slightly before the previous animation finishes
        );

        // Animate the background image with a more dynamic scale effect
        const imageContainer = document.querySelector('.current-feature-image');
        if (imageContainer) {
          tl.fromTo(imageContainer,
            {
              scale: 1.1,
              opacity: 0.7,
              filter: 'brightness(0.7) blur(8px)'
            },
            {
              scale: 1,
              opacity: 1,
              filter: 'brightness(1) blur(0px)',
              duration: 1.8,
              ease: "power2.out"
            },
            "-=1.2"
          );
        }

        // Animate the title and description with a staggered effect
        const titleElement = document.querySelector('.feature-title');
        const descElement = document.querySelector('.feature-description');

        if (titleElement && descElement) {
          tl.fromTo([titleElement, descElement],
            {
              y: 40,
              opacity: 0,
              filter: 'blur(5px)'
            },
            {
              y: 0,
              opacity: 1,
              filter: 'blur(0px)',
              duration: 1,
              stagger: 0.2,
              ease: "power3.out"
            },
            "-=1.5"
          );
        }
      }
    }, 10);
  };

  // Handle closing the modal with GSAP animation
  const closeFeatureModal = () => {
    if (modalRef.current && modalContentRef.current) {
      // Add will-change hint for better performance
      gsap.set([modalRef.current, modalContentRef.current], {
        willChange: 'transform, opacity, clip-path'
      });

      const tl = gsap.timeline({
        onComplete: () => {
          setShowFeatureModal(false);
          // Clean up will-change
          gsap.set([modalRef.current, modalContentRef.current], {
            willChange: 'auto'
          });
        }
      });

      // Improved closing animation sequence
      // First fade and blur out the content
      tl.to(modalContentRef.current, {
        y: 30,
        opacity: 0,
        filter: 'blur(8px)',
        duration: 0.6,
        ease: "power2.inOut"
      });

      // Animate the background image
      const imageContainer = document.querySelector('.current-feature-image');
      if (imageContainer) {
        tl.to(imageContainer, {
          scale: 1.1,
          opacity: 0.6,
          filter: 'brightness(0.7) blur(5px)',
          duration: 0.7,
          ease: "power2.inOut"
        }, "-=0.4");
      }

      // Then animate the background up with a smoother transition
      tl.to(modalRef.current, {
        clipPath: 'inset(100% 0 0 0)',
        duration: 0.9,
        ease: "power3.inOut"
      }, "-=0.5");
    } else {
      setShowFeatureModal(false);
    }
  };

  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const animationFrame = requestAnimationFrame(raf);

    // Disable scrolling when modal is open
    if (showFeatureModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // Cleanup function
    return () => {
      cancelAnimationFrame(animationFrame);
      lenis.destroy();
      document.body.style.overflow = '';
    };
  }, [showFeatureModal]);

  useEffect(() => {
    // Only run auto-rotation when modal is open and autoRotate is true
    if (showFeatureModal && autoRotate) {
      // Clear any existing interval
      if (autoRotateIntervalRef.current) {
        clearInterval(autoRotateIntervalRef.current);
      }

      // Set up new interval to change features every 3.5 seconds (faster)
      autoRotateIntervalRef.current = setInterval(() => {
        if (!isTransitioning) {
          const nextFeature = (currentFeature + 1) % features.length;
          changeFeature(nextFeature);
        }
      }, 3500);
    }

    // Clean up interval when component unmounts or modal closes
    return () => {
      if (autoRotateIntervalRef.current) {
        clearInterval(autoRotateIntervalRef.current);
        autoRotateIntervalRef.current = null;
      }
    };
  }, [showFeatureModal, currentFeature, isTransitioning, autoRotate]);

  return (
    <div className="overflow-x-hidden">
      <Navigation user_id={user_id}/>

      {/* Hero Section */}
      <div className="px-6 md:px-12 lg:px-24">
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center">
            {/* Trust badge */}
            <div className="mb-10 border border-black px-4 py-2 flex items-center gap-2">
              <div className="flex -space-x-2">
                <img className="w-4 h-6 rounded-md" src="/p1.jpeg" alt="User" />
                <img className="w-4 h-6 rounded-md" src="/p2.jpeg" alt="User" />
                <img className="w-4 h-6 rounded-md" src="/p3.png" alt="User" />
              </div>
              <span className="text-sm hel-font">Trusted by 950k+ happy users</span>
            </div>

            {/* Hero Text with Videos */}
            <div className="text-center">
              <h1 className="text-7xl lg:text-[86px] leading-none" style={{ letterSpacing: '-0.04em' }}>
                Turn streams
                <LazyVideo
                  src="/herotest2.mp4"
                  width={150}
                  height={140}
                  className="inline-block mx-4 -my-8"
                />
                into
                <br />
                viral clips
                <LazyVideo
                  src="/grid2.mp4"
                  width={110}
                  height={140}
                  className="inline-block mx-4 -my-8 translate-y-8 -z-10"
                />
                <span className="relative z-10">in real-time</span>
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-xl lg:text-2xl mt-16 mb-12 text-center max-w-3xl hel-font">
              Create TikToks, Youtube Shorts and Reels in just one click.
            </p>

            {/* CTA Button */}
            <Link href="/Signup">
              <button className="bg-black text-white px-8 py-3 text-lg hover:bg-gray-800 transition-colors hel-font">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </div>


      <div className="mt-1 flex justify-end">
        <button
          onClick={openFeatureModal}
          className="bg-black text-white text-xs uppercase hel-font py-2 px-4 cursor-pointer mr-0 transition-colors duration-300 hover:bg-white hover:text-black hover:border-t hover:border-l hover:border-b hover:border-black border-transparent border-r-0 border"
        >
          SEE FEATURE OVERVIEW
        </button>
      </div>


      {/* Scroll indicator */}
      <div className="px-6 md:px-12 lg:px-7 mt-4 flex justify-end">
        <div className="flex items-center gap-[2px]">
          <span className="text-xs uppercase hel-font -mt-2">SCROLL</span>
          <Image
            src="/thinArrow.svg"
            alt="Scroll Down"
            width={24}
            height={24}
            className="object-contain invert transform rotate-90"
          />
        </div>
      </div>

      {/* Feature Overview Modal */}
      {showFeatureModal && (
        <div
          ref={modalRef}
          className="fixed inset-0 bg-black z-50"
          style={{ clipPath: 'inset(0 0 100% 0)' }} // Initial state - hidden from bottom
        >
          <div
            ref={modalContentRef}
            className="relative h-full w-full opacity-0"
          >
            {/* Close button */}
            <button
              onClick={closeFeatureModal}
              className="absolute top-8 left-8 z-50 p-3 cursor-pointer hover:opacity-70 transition-opacity"
              style={{ touchAction: 'manipulation' }}
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Background image with transition */}
            <div className="absolute top-0 left-0 w-full h-[70%] overflow-hidden">
              {/* Current feature image */}
              <div className="current-feature-image absolute inset-0">
                <Image
                  src={features[currentFeature].image}
                  alt="Feature Background"
                  layout="fill"
                  objectFit="cover"
                  className="opacity-80"
                />
                {/* Blur overlay for transition between image and text */}
                <div className="absolute bottom-0 left-0 w-full h-[30%] bg-gradient-to-t from-black via-black/80 to-transparent"></div>
              </div>

              {/* Next feature image (for transition) */}
              <div className="next-feature-image absolute inset-0 opacity-0">
                <Image
                  src={features[currentFeature].image} // Will be updated during transition
                  alt="Next Feature Background"
                  layout="fill"
                  objectFit="cover"
                  className="opacity-80"
                />
                <div className="absolute bottom-0 left-0 w-full h-[30%] bg-gradient-to-t from-black via-black/80 to-transparent"></div>
              </div>
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-between px-6 md:px-12 lg:px-12">
              <div></div>

              <div className="mb-24">
                {/* Title with animation */}
                <div className="overflow-visible relative z-30 mb-1">
                  <h1
                    className="feature-title text-5xl md:text-7xl lg:text-7xl text-white"
                    style={{ letterSpacing: '-0.04em', paddingBottom: '0.1em', lineHeight: '1.1' }}
                  >
                    {features[currentFeature].title}
                  </h1>
                </div>

                {/* Description with animation */}
                <div className="relative max-w-3xl bg-transparent z-20 mt-2">
                  <p
                    className="feature-description relative z-10 text-sm md:text-base lg:text-sm text-[#888888] pt-1 hel-font uppercase"
                    style={{ backgroundColor: 'transparent' }}
                  >
                    {features[currentFeature].description}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="mt-16 flex gap-1">
                  {features.map((_, index) => (
                    <div
                      key={index}
                      className="py-3 px-1 cursor-pointer group"
                      onClick={() => changeFeature(index)}
                    >
                      <div
                        className={`w-20 feature-progress-bar ${currentFeature === index ? 'h-0.5 bg-white' : 'h-[1px] bg-white/30 group-hover:bg-white/60'} rounded-full transition-colors`}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="px-6 md:px-12 lg:px-24 bg-black mt-[240px] lg:mt-[200px] py-20 lg:py-44">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-12 lg:gap-0">
          <div className="w-full lg:w-auto order-2 lg:order-1">
            <LazyVideo
              src="/Glide.webm"
              width={600}
              height={600}
              priority={true}
              className="object-contain w-[280px] md:w-[350px] lg:w-[600px] mx-auto lg:mx-0"
            />
          </div>
          <div className="max-w-2xl flex flex-col items-center lg:items-end order-1 lg:order-2">
            <h1 className="text-4xl md:text-6xl lg:text-7xl mb-6 lg:mb-10 text-white text-center lg:text-right" style={{ letterSpacing: '-0.04em', lineHeight: '92.7%' }}>
              Exclusively Twitch
              <br />
              Live-Streams
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl mb-16 lg:mb-28 hel-font text-white text-center lg:text-right">
              Link your twitch account with Acliptic, launch
              <br className="hidden lg:block" />
              the plugin when streaming, and let our AI clip
              <br className="hidden lg:block" />
              short videos for you.
            </p>
            <Link
              href="/Signup"
              className="hidden lg:flex items-center gap-4 mt-44 cursor-pointer group"
            >
              <Image
                src="/thinArrow.svg"
                alt="Arrow"
                width={48}
                height={24}
                className="object-contain will-change-transform transition-all duration-300 ease-out group-hover:w-[32px] group-hover:-translate-x-2 h-auto"
              />
              <span className="text-white text-xl lg:text-2xl hel-font will-change-transform transition-all duration-300 ease-out group-hover:-translate-x-2">
                Get Started
              </span>
            </Link>
          </div>
        </div>
        <div className="flex justify-center lg:hidden mt-8">
          <Link
            href="/Signup"
            className="flex items-center gap-4 cursor-pointer group"
          >
            <Image
              src="/thinArrow.svg"
              alt="Arrow"
              width={48}
              height={24}
              className="object-contain will-change-transform transition-all duration-300 ease-out group-hover:w-[32px] group-hover:-translate-x-2 h-auto"
            />
            <span className="text-white text-xl lg:text-2xl hel-font will-change-transform transition-all duration-300 ease-out group-hover:-translate-x-2">
              Get Started
            </span>
          </Link>
        </div>
      </div>

      <div className="mt-20 lg:mt-[150px] px-6 md:px-24 lg:px-48">
        <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-2 lg:justify-between">
          <div className="w-full lg:w-[650px] h-[350px] md:h-[450px] lg:h-[650px] bg-[#F1F1F1] relative p-4 lg:p-8 flex items-center justify-center">
            <LazyVideo
              src="/plugin.webm"
              width={400}
              height={400}
              priority={true}
              className="object-contain w-[280px] md:w-[350px] lg:w-[480px]"
            />
          </div>
          <div className="w-full lg:w-auto text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl lg:text-7xl mb-6" style={{ letterSpacing: '-0.04em', lineHeight: '92.7%' }}>
              Initiate the
              <br />
              Stream.
              <br />
              Do your thing.
            </h1>
            <Link
              href="/Signup"
              className="flex items-center justify-center lg:justify-start gap-4 mt-16 lg:mt-[420px] cursor-pointer group w-fit mx-auto lg:mx-0"
            >
              <Image
                src="/thinArrow.svg"
                alt="Arrow"
                width={48}
                height={24}
                className="object-contain invert will-change-transform transition-all duration-300 ease-out group-hover:w-[32px] group-hover:-translate-x-2 h-auto"
              />
              <span className="text-xl lg:text-2xl hel-font will-change-transform transition-all duration-300 ease-out group-hover:-translate-x-2">
                Get Started
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div className='mt-20 lg:mt-[180px] px-6 md:px-24 lg:px-48'>
        <div className="flex flex-col-reverse lg:flex-row items-start gap-12 lg:gap-2 lg:justify-between">
          <div className="w-full lg:w-auto max-w-2xl text-center lg:text-left">
            <span className="text-sm hel-font uppercase mb-4 block text-[#888888]">Just Chating</span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl mb-6" style={{ letterSpacing: '-0.04em', lineHeight: '92.7%' }}>
              Categories
              <br />
              currently
              <br />
              focused on.
            </h1>
            <Link
              href="/Signup"
              className="flex items-center gap-4 mt-16 lg:mt-[380px] cursor-pointer group w-fit mx-auto lg:mx-0"
            >
              <Image
                src="/thinArrow.svg"
                alt="Arrow"
                width={48}
                height={24}
                className="object-contain invert will-change-transform transition-all duration-300 ease-out group-hover:w-[32px] group-hover:-translate-x-2 h-auto"
              />
              <span className="text-xl lg:text-2xl hel-font will-change-transform transition-all duration-300 ease-out group-hover:-translate-x-2">
                Get Started
              </span>
            </Link>
          </div>
          <div className="w-full lg:w-[650px] h-[350px] md:h-[450px] lg:h-[650px] bg-[#F1F1F1] relative p-4 lg:p-8 flex items-center justify-center flex-shrink-0">
            <Image
              src="/chating.avif"
              alt="Just Chatting"
              width={480}
              height={480}
              className="object-contain w-[280px] md:w-[380px] lg:w-[480px] h-auto"
            />
          </div>
        </div>
      </div>


      <div className='mt-[180px] bg-black px-6 md:px-12 lg:px-24 py-12 md:py-16 lg:py-20'>
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end items-center gap-12 lg:gap-0">
          <div className="text-center lg:text-left">
            <span className="text-xs md:text-sm hel-font text-[#888888] mb-2 md:mb-4 block">40+ Languages</span>
            <h1 className="text-4xl md:text-5xl lg:text-7xl text-white" style={{ letterSpacing: '-0.04em', lineHeight: '92.7%' }}>
              CaPTIons
            </h1>
          </div>
          <div className="lg:-my-20">
            <LazyVideo
              src="/Appear.webm"
              width={650}
              height={400}
              className="object-contain w-[280px] md:w-[450px] lg:w-[650px]"
            />
          </div>
        </div>
      </div>

      <div className='mt-20 lg:mt-[200px] px-6 md:px-24 lg:px-44'>
        <div className="flex flex-col-reverse lg:flex-row items-start gap-12 lg:gap-2 lg:justify-between">
          <div className="w-full lg:w-auto max-w-2xl text-center lg:text-left">
            <span className="text-sm hel-font uppercase mb-4 block text-[#888888]">Our AI will automatically perform edits on the clips<br className="hidden lg:block" />generated, including special effects, focusing<br className="hidden lg:block" />on the person speaking.</span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl mb-6" style={{ letterSpacing: '-0.04em', lineHeight: '92.7%' }}>
              Automatic
              <br />
              Editing.
            </h1>
            <Link
              href="/Signup"
              className="flex items-center gap-4 mt-16 lg:mt-[380px] cursor-pointer group w-fit mx-auto lg:mx-0"
            >
              <Image
                src="/thinArrow.svg"
                alt="Arrow"
                width={48}
                height={24}
                className="object-contain invert will-change-transform transition-all duration-300 ease-out group-hover:w-[32px] group-hover:-translate-x-2 h-auto"
              />
              <span className="text-xl lg:text-2xl hel-font will-change-transform transition-all duration-300 ease-out group-hover:-translate-x-2">
                Get Started
              </span>
            </Link>
          </div>
          <div className="w-full lg:w-[650px] h-[350px] md:h-[450px] lg:h-[650px] bg-[#F1F1F1] relative p-4 lg:p-8 flex items-center justify-center flex-shrink-0 lg:ml-20">
            <LazyVideo
              src="/autoEdit.webm"
              width={480}
              height={480}
              className="object-contain w-[240px] md:w-[380px] lg:w-[480px]"
            />
          </div>
        </div>
      </div>

      <div className='mt-20 lg:mt-[180px] px-6 md:px-24 lg:px-44'>
        <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-2 lg:justify-between">
          <div className="w-full lg:w-[650px] h-[350px] md:h-[450px] lg:h-[650px] bg-[#F1F1F1] relative p-4 lg:p-8 flex items-center justify-center flex-shrink-0">
            <Image
              src="/audio1.jpeg"
              alt="Audio Analysis"
              width={520}
              height={520}
              className="object-contain w-[240px] md:w-[380px] lg:w-[500px] rounded-md"
            />
          </div>
          <div className="w-full lg:w-auto max-w-2xl text-center lg:text-left lg:ml-20">
            <span className="text-sm hel-font uppercase mb-4 block text-[#888888]">Analyzes the audio to see spikes in it, flag certain pitches to determine a clip-worthy moment.</span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl mb-6" style={{ letterSpacing: '-0.04em', lineHeight: '92.7%' }}>
              Audio
              <br />
              Analysis.
            </h1>
            <Link
              href="/Signup"
              className="flex items-center gap-4 mt-16 lg:mt-[420px] cursor-pointer group w-fit mx-auto lg:mx-0"
            >
              <Image
                src="/thinArrow.svg"
                alt="Arrow"
                width={48}
                height={24}
                className="object-contain invert will-change-transform transition-all duration-300 ease-out group-hover:w-[32px] group-hover:-translate-x-2 h-auto"
              />
              <span className="text-xl lg:text-2xl hel-font will-change-transform transition-all duration-300 ease-out group-hover:-translate-x-2">
                Get Started
              </span>
            </Link>
          </div>
        </div>
      </div>


      <div className='mt-20 lg:mt-[200px] px-6 md:px-24 lg:px-44'>
        <div className="flex flex-col-reverse lg:flex-row items-start gap-12 lg:gap-2 lg:justify-between">
          <div className="w-full lg:w-auto max-w-2xl text-center lg:text-left">
            <span className="text-sm hel-font uppercase mb-4 block text-[#888888]">Our AI resizes your videos for any platform. It analyzes your scenes and applies the perfect layout, based on the person speaking, it&#39;ll focus the camera on the person speaking.</span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl mb-6" style={{ letterSpacing: '-0.04em', lineHeight: '92.7%' }}>
              Introducing
              <br />
              AI Reframe.
            </h1>
            <Link
              href="/Signup"
              className="flex items-center gap-4 mt-16 lg:mt-[380px] cursor-pointer group w-fit mx-auto lg:mx-0"
            >
              <Image
                src="/thinArrow.svg"
                alt="Arrow"
                width={48}
                height={24}
                className="object-contain invert will-change-transform transition-all duration-300 ease-out group-hover:w-[32px] group-hover:-translate-x-2 h-auto"
              />
              <span className="text-xl lg:text-2xl hel-font will-change-transform transition-all duration-300 ease-out group-hover:-translate-x-2">
                Get Started
              </span>
            </Link>
          </div>
          <div className="w-full lg:w-[650px] h-[350px] md:h-[450px] lg:h-[650px] bg-[#F1F1F1] relative p-4 lg:p-8 flex items-center justify-center flex-shrink-0 lg:ml-20">
            <LazyVideo
              src="/AI.webm"
              width={650}
              height={650}
              className="object-contain w-[240px] md:w-[380px] lg:w-[650px]"
            />
          </div>
        </div>
      </div>

      <div className='mt-20 lg:mt-[180px] bg-black px-6 md:px-12 lg:px-24 py-12 md:py-20 lg:py-32'>
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-end gap-12 lg:gap-0">
          <div className="max-w-2xl text-center lg:text-left">
            <span className="text-sm hel-font text-[#888888] mb-4 block">Acliptic automatically shares clips to multiple social media<br className="hidden lg:block" />platforms such as YouTube, Instagram, and TikTok.</span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl text-white" style={{ letterSpacing: '-0.04em', lineHeight: '92.7%' }}>
              Multi-Platform
              <br />
              Uploads
            </h1>
          </div>
          <div className="lg:ml-20">
            <Image
              src="/platformNew.avif"
              alt="Multi-Platform Uploads"
              width={800}
              height={600}
              className="object-contain w-[280px] md:w-[450px] lg:w-[800px]"
            />
          </div>
        </div>
      </div>

      <div className='mt-20 lg:mt-[180px] px-6 md:px-24 lg:px-44'>
        <div className="flex flex-col-reverse lg:flex-row items-center lg:items-start lg:justify-between gap-12 lg:gap-0">
          <div className="w-full lg:w-auto lg:ml-4">
            <AnimatedTestimonialsDemo />
          </div>
          <div className="w-full lg:w-auto max-w-2xl lg:-ml-20 lg:mt-20 text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl lg:text-7xl" style={{ letterSpacing: '-0.04em', lineHeight: '92.7%' }}>
              What Our
              <br />
              Users
              <br />
              Have To
              <br />
              Say.
            </h1>
          </div>
        </div>
      </div>

      <div className='mt-[180px]'>
        <FAQSection />
      </div>

      <Footer />
    </div>
  );
}
