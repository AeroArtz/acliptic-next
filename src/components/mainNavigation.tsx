'use client'
import { useState, useEffect, useRef, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { gsap } from "gsap";
//import { createClient } from "@/lib/supabase/client";
import { SignOutAction } from '@/actions/SignOutAction';

 

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Features', path: '/Features' },
  { name: 'Pricing', path: '/Pricing' },
  { name: 'About Us', path: '/About' },
  { name: 'FXX', path: '/FXX', isImage: true, imageSrc: '/FXXlogo.png', imageWidth: 120, imageHeight: 40 },
];


interface NavigationProps{
  user_id : string,
}
export default function Navigation({user_id}: NavigationProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  //const supabase = createClient();

  // const handleLogout = async () => {
  //   /*
  //   try {
  //     const { error } = await supabase.auth.signOut()
  //     if (error) throw error
  //     router.push('/Login')
  //   } catch (error) {
  //     console.error('Error logging out:', error)
  //   }

  //   */
    
  // }

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {

        if (user_id){
          setIsAuthenticated(true);
        }
       // const { data: { user }, error } = await supabase.auth.getUser();
        
        // if (user && !error) {
         // setIsAuthenticated(true);
        //} else {
        //  setIsAuthenticated(false);
        //}
        
      } catch (error) {
        console.error("Error checking authentication status:", error);
        setIsAuthenticated(false);
      }

      
    };
    
    checkAuthStatus();
  }, []);
  
  // Check if current page is FXX related
  const isFXXPage = useMemo(() => {
    return pathname === '/FXX' || pathname === '/FXX/clips' || pathname.startsWith('/FXX/');
  }, [pathname]);
  
  // Refs for GSAP animations
  const menuRef = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<HTMLDivElement[]>([]);
  
  // Separate refs for hamburger and close buttons
  const hamburgerLine1Ref = useRef<HTMLDivElement>(null);
  const hamburgerLine2Ref = useRef<HTMLDivElement>(null);
  // const closeLine1Ref = useRef<HTMLDivElement>(null);
  // const closeLine2Ref = useRef<HTMLDivElement>(null);
  
  // Reset refs array for menu items
  // const resetMenuItemsRef = () => {
  //   menuItemsRef.current = [];
  // };
  
  // Add to menu items ref array
  const addToMenuItemsRef = (el: HTMLDivElement) => {
    if (el && !menuItemsRef.current.includes(el)) {
      menuItemsRef.current.push(el);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const isScrollingUp = prevScrollPos > currentScrollPos;

      if (Math.abs(prevScrollPos - currentScrollPos) > 5) {
        setIsVisible(isScrollingUp || currentScrollPos < 10);
      }

      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);
  
  // GSAP animations for menu
  useEffect(() => {
    if (!menuRef.current || !hamburgerLine1Ref.current || !hamburgerLine2Ref.current) return;
    
    if (menuOpen) {
      // When opening: make visible and fade in quickly
      gsap.set(menuRef.current, { 
        visibility: 'visible',
        pointerEvents: 'auto',
        opacity: 0,
        x: 0, // Keep it in place, no sliding
        'will-change': 'opacity',
        zIndex: 45 // Just below the nav elements but above other content
      });
      
      // Create timeline for opening animation - smoother but still snappy
      const openTl = gsap.timeline();
      
      // Animate hamburger lines to X
      // Add active class to disable hover animations
      hamburgerLine1Ref.current.classList.add('active');
      hamburgerLine2Ref.current.classList.add('active');
      
      openTl.to(hamburgerLine1Ref.current, {
        duration: 0.15,
        rotation: 45,
        y: 4,
        height: "1px",
        backgroundColor: "white",
        ease: "power1.out"
      }, 0);
      
      openTl.to(hamburgerLine2Ref.current, {
        duration: 0.15,
        rotation: -45,
        y: -4,
        height: "1px",
        backgroundColor: "white",
        ease: "power1.out"
      }, 0);
      
      // Fade in background quickly but smoothly
      openTl.to(menuRef.current, {
        duration: 0.08,
        opacity: 1,
        ease: "none"
      }, 0);
      
      // Fade in menu items quickly with minimal stagger
      openTl.fromTo(
        menuItemsRef.current,
        { opacity: 0, y: -10 },
        { 
          duration: 0.08,
          opacity: 1,
          y: 0,
          stagger: 0.01,
          ease: "none",
          'will-change': 'opacity, transform'
        },
        0
      );
      
    } else {
      // Create timeline for closing animation
      const closeTl = gsap.timeline({
        onComplete: () => {
          // After animation is complete, fully disable the menu
          if (menuRef.current) {
            gsap.set(menuRef.current, { 
              visibility: 'hidden',
              pointerEvents: 'none',
              zIndex: 45
            });
          }
        }
      });
      
      // Keep z-index high during the entire closing animation
      gsap.set(menuRef.current, { zIndex: 45 });
      
      // Animate X back to hamburger
      hamburgerLine1Ref.current.classList.remove('active');
      hamburgerLine2Ref.current.classList.remove('active');
      
      closeTl.to(hamburgerLine1Ref.current, {
        duration: 0.15,
        rotation: 0,
        y: 0,
        height: "1px",
        backgroundColor: isFXXPage ? "#767676" : "black",
        ease: "power1.out"
      }, 0);
      
      closeTl.to(hamburgerLine2Ref.current, {
        duration: 0.15,
        rotation: 0,
        y: 0,
        height: "1px",
        backgroundColor: isFXXPage ? "#767676" : "black",
        ease: "power1.out"
      }, 0);
      
      // Quick fade out of menu items first
      closeTl.to(menuItemsRef.current, {
        duration: 0.05,
        opacity: 0,
        y: 0,
        stagger: 0.01,
        ease: "none"
      }, 0);
      
      // Then fade out black box after items have faded
      closeTl.to(menuRef.current, {
        duration: 0.08,
        opacity: 0,
        ease: "none"
      }, 0);
    }
    
  }, [menuOpen]);
  
  // Toggle menu
  const toggleMenu = () => {
    // Kill any running animations to prevent glitches when clicking rapidly
    if (menuRef.current) {
      gsap.killTweensOf(menuRef.current);
      gsap.killTweensOf(menuItemsRef.current);
      gsap.killTweensOf(hamburgerLine1Ref.current);
      gsap.killTweensOf(hamburgerLine2Ref.current);
    }
    
    setMenuOpen(prev => !prev);
  };
  
  // Add explicit close function to ensure it works
  const closeMenu = () => {
    // Kill any running animations to prevent glitches
    if (menuRef.current) {
      gsap.killTweensOf(menuRef.current);
      gsap.killTweensOf(menuItemsRef.current);
      gsap.killTweensOf(hamburgerLine1Ref.current);
      gsap.killTweensOf(hamburgerLine2Ref.current);
    }
    
    setMenuOpen(false);
  };

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 flex items-center justify-between py-6 px-6 
        transition-all duration-200 ease-in-out ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        } ${menuOpen ? 'bg-transparent z-50' : isFXXPage ? 'bg-black z-50' : 'bg-white z-50'}`}
      >
        {/* Menu/Close Button - Left (Always visible, changes appearance) */}
        <div className={`z-[60] relative ${menuOpen || isFXXPage ? 'text-white' : 'text-black'}`}>
          <button 
            onClick={toggleMenu} 
            className={`flex items-center space-x-2 group hamburger-button ${menuOpen ? 'menu-open' : ''}`}
          >
            <div className="hamburger-menu cursor-pointer">
              <div 
                ref={hamburgerLine1Ref} 
                className={`w-7 h-[1px] mb-2 hamburger-line top-line ${menuOpen ? 'bg-white active' : isFXXPage ? 'bg-white active' : 'bg-black'}`}
              ></div>
              <div 
                ref={hamburgerLine2Ref} 
                className={`w-7 h-[1px] hamburger-line bottom-line ${menuOpen ? 'bg-white active' : isFXXPage ? 'bg-white active' : 'bg-black'}`}
              ></div>
            </div>
            <span className={`text-sm font-light tracking-wide menu-text ${menuOpen ? 'text-white' : isFXXPage ? 'text-white' : 'text-black'}`}>
              {menuOpen ? 'CLOSE' : 'MENU'}
            </span>
          </button>
        </div>

        {/* Centered Logo */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Link href="/">
            <div className={isFXXPage ? "invert" : ""}>
            <Image
              src="/AELogo.svg"
              alt="Logo"
              width={70}
              height={70}
              priority
              quality={100}
              className="w-auto h-[30px] md:h-[40px] object-contain"
            />
            </div>
          </Link>
        </div>

        {/* Login/Signup - Right */}
        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <Link href='/Studio'>
              <span className={`text-md font-light tracking-wide ${isFXXPage ? 'text-[#767676]' : 'text-black'}`}>
                Studio
              </span>
            </Link>

            <form action={SignOutAction}>
              <button 
                className="flex items-center justify-center"
              >
                <Image
                  src="/logout2.svg"
                  alt="Logout"
                  width={20}
                  height={20}
                  style={{ filter: isFXXPage ? "invert(46%) sepia(9%) saturate(13%) hue-rotate(314deg) brightness(94%) contrast(86%)" : "" }}
                />
              </button>
            </form>
          </div>
        ) : (
          <div className="flex items-center space-x-2 lg:space-x-4 z-[60]">
            <Link href='/Login'>
              <button className={`${isFXXPage ? 'bg-transparent text-[#767676]' : 'bg-black text-white'} px-3 lg:px-4 py-1.5 lg:py-2 text-sm lg:text-base transition-colors uppercase`}>
                LOGIN
              </button>
            </Link>
            <Link
              href="/Signup"
              className={`hidden lg:inline-block ${isFXXPage ? 'text-[#767676]' : 'text-black'} hover:opacity-80 transition-all duration-300 relative group text-[14px] lg:text-[17px] uppercase`}
            >
              SIGN UP
              <span className={`absolute bottom-[-3px] left-0 w-0 h-[0.5px] ${isFXXPage ? 'bg-[#767676]' : 'bg-black'} transition-all duration-300 group-hover:w-full`}></span>
            </Link>
          </div>
        )}
        
      </nav>

      {/* GSAP Menu Overlay - Completely separate from the top navigation */}
      <div 
        ref={menuRef}
        className="fixed top-0 left-0 h-full w-[450px] bg-black opacity-0"
        style={{ visibility: 'hidden', pointerEvents: 'none', zIndex: 45 }}
      >
        {/* Menu content - Raised higher by adjusting padding-top and margin-top */}
        <div className="px-10 pt-16 mt-8">
          {navItems.map((item) => (
            <div 
              key={item.name}
              ref={addToMenuItemsRef}
              className="py-2"
            >
              <Link
                href={item.path}
                className="block text-white text-6xl font-light hover:text-zinc-400 transition-colors duration-200 ease-in-out"
                style={{ letterSpacing: '-0.04em', lineHeight: '85%' }}
                onClick={closeMenu}
              >
                {item.isImage ? (
                  <Image
                    src={item.imageSrc}
                    alt={item.name}
                    width={item.imageWidth}
                    height={item.imageHeight}
                    className="h-auto"
                  />
                ) : (
                  item.name
                )}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Spacer to prevent content jumping when nav becomes fixed */}
      <div className="h-[102px]" />

      {/* Add hamburger menu hover animation styles */}
      <style jsx>{`
        .hamburger-menu {
          padding: 4px;
          transition: transform 0.3s ease;
        }
        
        .hamburger-line {
          transition: transform 0.3s ease, margin 0.3s ease, background-color 0.3s ease;
        }
        
        /* Only apply hover animations to non-active (not cross) state */
        .hamburger-button:hover .top-line:not(.active) {
          transform: translateY(-2px);
          margin-bottom: 5px;
        }
        
        .hamburger-button:hover .bottom-line:not(.active) {
          transform: translateY(2px);
        }
        
        /* Active state (cross) only has color transitions */
        .hamburger-line.active {
          transition: transform 0.3s ease, background-color 0.3s ease;
        }
        
        /* Menu text transition */
        .menu-text {
          transition: color 0.3s ease;
        }
        
        /* Ensure button is visible when menu is open */
        .menu-open {
          position: relative;
          z-index: 100;
        }
      `}</style>
    </>
  );
}