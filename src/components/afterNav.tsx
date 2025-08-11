'use client'
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { gsap } from "gsap";
import { SignOutAction } from '@/actions/SignOutAction';
import { DarkModeToggle } from '@/components/DarkModeToggle';

const navItems = [
  { 
    name: 'DASHBOARD', 
    path: '/Dashboard', 
    width: 470, 
    height: 80, 
    imgSrc: '/DASHBOARD4.svg',
    icon: '📊'
  },
  { 
    name: 'STUDIO', 
    path: '/Studio', 
    width: 250, 
    height: 80, 
    imgSrc: '/STUDIO2.svg',
    icon: '🎨'
  },
  { 
    name: 'PROFILE', 
    path: '/Profile', 
    width: 250, 
    height: 80, 
    imgSrc: '/PROFILE.svg',
    icon: '👤'
  },
];

const additionalMenuItems = [
  { name: 'Home', path: '/home', icon: '🏠' },
  { name: 'About', path: '/About', icon: 'ℹ️' },
  { name: 'Features', path: '/Features', icon: '⭐' },
  { name: 'FXX', path: '/FXX', icon: '🔥' },
];

export default function Navigation() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [currentPath, setCurrentPath] = useState('');
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  
  // Refs for GSAP animations
  const menuRef = useRef<HTMLDivElement | null>(null);
  const navRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const getCurrentPath = () => {
    return currentPath || 'DASHBOARD';
  };

  useEffect(() => {
    // Set the current path immediately without any delay
    const path = window.location.pathname.slice(1).toUpperCase() || 'DASHBOARD';
    setCurrentPath(path);
  }, []);

  // Listen for route changes to update currentPath
  useEffect(() => {
    const handleRouteChange = () => {
      const path = window.location.pathname.slice(1).toUpperCase() || 'DASHBOARD';
      setCurrentPath(path);
    };

    // Listen for popstate events (back/forward navigation)
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

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

  // Enhanced dropdown animation for full-width menu
  useEffect(() => {
    if (!menuRef.current) return;
    
    if (menuOpen) {
      gsap.set(menuRef.current, { 
        visibility: 'visible',
        pointerEvents: 'auto'
      });
      
      gsap.fromTo(menuRef.current, 
        { 
          opacity: 0, 
          y: -20,
          scaleY: 0.8
        },
        {
          duration: 0.4,
          opacity: 1,
          y: 0,
          scaleY: 1,
          ease: "power2.out",
          transformOrigin: "top"
        }
      );
    } else {
      gsap.to(menuRef.current, {
        duration: 0.3,
        opacity: 0,
        y: -20,
        scaleY: 0.8,
        ease: "power2.in",
        transformOrigin: "top",
        onComplete: () => {
          if (menuRef.current) {
            gsap.set(menuRef.current, { 
              visibility: 'hidden',
              pointerEvents: 'none'
            });
          }
        }
      });
    }
  }, [menuOpen]);
  
  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };
  
  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleManualLogout = async () => {
    try {
      await SignOutAction();
      router.push('/');
    } catch (error) {
      console.error('Error during logout:', error);
      router.replace('/');
    }
  };

  return (
    <>
      {/* Main Navigation Bar */}
      <nav 
        ref={navRef}
        className={`fixed w-full grid grid-cols-3 items-center py-3 px-4 md:py-4 md:px-6 lg:py-5 lg:px-8
          transition-all duration-300 ease-out z-40 bg-white dark:bg-gray-900
          ${isVisible ? 'translate-y-0' : '-translate-y-full'}
          border-b border-gray-100 dark:border-gray-800`}
        style={{ willChange: 'transform, background-color, box-shadow' }}
      >
        {/* Left section - Hamburger menu for mobile/tablet, tabs for desktop */}
        <div className="flex items-center space-x-2 justify-start relative">
          {/* Mobile/Tablet hamburger menu (now visible up to lg screens) */}
          <button 
            onClick={toggleMenu} 
            className="flex items-center space-x-2 group hamburger-button lg:hidden"
            aria-label="Menu toggle"
          >
            <div className="hamburger-menu cursor-pointer">
              <div className="w-7 h-[1px] bg-black dark:bg-white mb-1 hamburger-line top-line"></div>
              <div className="w-7 h-[1px] bg-black dark:bg-white hamburger-line bottom-line"></div>
            </div>
            <span className="text-sm font-light tracking-wide hidden sm:inline dark:text-white">
              {getCurrentPath()}
            </span>
          </button>

          {/* Desktop navigation tabs (visible on lg screens and above) */}
          <div className="hidden lg:flex items-center space-x-2 relative">
            {navItems.map((item, index) => (
              <Link 
                href={item.path} 
                key={item.name}
                className={`relative text-base tracking-wide transition-all duration-300 px-6 py-3 rounded-lg
                  ${currentPath && currentPath === item.name.toUpperCase() 
                    ? 'text-black dark:text-white active-tab-shadow bg-gray-400 dark:bg-gray-800 shadow-lg' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-400 dark:hover:bg-gray-800'
                  }`}
                ref={(el: HTMLAnchorElement | null) => {
                  if (el) tabRefs.current[index] = el;
                }}
              >
                <span className="relative z-10">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Center logo */}
        <div className="flex justify-center">
          <Link href="/" className="flex items-center group">
            <Image
              src="/AELogo.svg"
              alt="Logo"
              width={120}
              height={120}
              priority
              quality={100}
              className="w-auto h-[30px] md:h-[40px] object-contain dark:invert"
            />
          </Link>
        </div>

        {/* Right section with dark mode toggle and logout */}
        <div className="flex items-center space-x-4 justify-end">
          <DarkModeToggle />
          <button 
            type="submit"
            className="text-black hover:text-gray-800 dark:text-white dark:hover:text-gray-300 transition-all duration-300 p-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-800 hover:scale-110"
            onClick={(e) => {
              e.preventDefault();
              handleManualLogout();
            }}
            aria-label="Logout"
          >
            <Image
              src="/logout2.svg"
              alt="Logout"
              width={24}
              height={24}
              className="w-6 h-6 md:w-8 md:h-8 dark:invert"
            />
          </button>
        </div>
      </nav>

      {/* Full-Width Dropdown Menu for Mobile/Tablet */}
      <div 
        ref={menuRef}
        className="fixed left-0 w-full bg-white dark:bg-gray-900 lg:hidden z-30 shadow-lg"
        style={{ 
          visibility: 'hidden', 
          pointerEvents: 'none',
          top: '70px' // Adjust based on navbar height
        }}
      >
        {/* Thin horizontal separator line */}
        <div className="w-full h-[1px] bg-gray-200 dark:bg-gray-700"></div>
        
        <div className="py-6 px-4 md:px-6">
          {/* Main Navigation Items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
            {navItems
              .filter((item) => currentPath !== item.name.toUpperCase())
              .map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  onClick={closeMenu}
                  className="group flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:shadow-md hover:scale-[1.02] border border-gray-100 dark:border-gray-700"
                >
                  <div className="text-2xl group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      {item.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Navigate to {item.name.toLowerCase()}
                    </div>
                  </div>
                  <div className="text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300">
                    →
                  </div>
                </Link>
              ))}
          </div>

          {/* Additional Menu Items */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 px-2">
              Quick Links
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {additionalMenuItems
                .filter((item) => currentPath !== item.name.toUpperCase())
                .map((item) => (
                  <Link
                    key={item.name}
                    href={item.path}
                    onClick={closeMenu}
                    className="group flex flex-col items-center space-y-2 p-4 rounded-lg transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:shadow-md hover:scale-[1.02] border border-gray-100 dark:border-gray-700"
                  >
                    <div className="text-xl group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 text-center">
                      {item.name}
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Spacer to account for fixed navbar height */}
      <div className="h-[70px] md:h-[86px] lg:h-[94px]" />

      {/* Overlay for mobile menu */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 lg:hidden"
          onClick={closeMenu}
        />
      )}

      {/* Enhanced Styles */}
      <style jsx>{`
        nav {
          background-color: rgb(210, 215, 201);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .active-tab-shadow {
          background-color: rgb(243, 244, 246) !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
        }
        
        :global(.dark) .active-tab-shadow {
          background-color: rgb(31, 41, 55) !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2) !important;
        }
        
        .hamburger-menu {
          padding: 4px;
          transition: transform 0.3s ease;
        }
        
        .hamburger-line {
          transition: all 0.3s ease;
        }
        
        .hamburger-button:hover .hamburger-menu {
          transform: scale(1.1);
        }
        
        .hamburger-button:hover .top-line {
          transform: translateY(-2px) rotate(2deg);
          margin-bottom: 5px;
        }
        
        .hamburger-button:hover .bottom-line {
          transform: translateY(2px) rotate(-2deg);
        }

        @media (max-width: 768px) {
          .dropdown-menu {
            top: 70px;
          }
        }
        
        @media (min-width: 769px) and (max-width: 1023px) {
          .dropdown-menu {
            top: 86px;
          }
        }
      `}</style>
    </>
  );
}