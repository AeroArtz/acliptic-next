'use client'
import Image from "next/image";
import { useState, useRef, useEffect, WheelEvent } from "react";
import DashboardSidebar from "@/components/Dashboard/dashboardSidebar";
import Link from "next/link";
import AnalyticsTab from "@/components/Dashboard/AnalyticsTab";
import CommentsTab from "@/components/Dashboard/CommentsTab";
import InsightsTab from "@/components/Dashboard/InsightsTab";
import SubscriptionTab from "@/components/Dashboard/SubscriptionTab";
import { gsap } from "gsap";
import { useRouter } from 'next/navigation';
import { SignOutAction } from '@/actions/SignOutAction';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import Navigation from "@/components/afterNav";

const navItems = [
  { name: 'DASHBOARD', path: '/Dashboard', width: 470, height: 80, imgSrc: '/DASHBOARD4.svg' },
  { name: 'STUDIO', path: '/Studio', width: 250, height: 80, imgSrc: '/STUDIO2.svg' },
  { name: 'PROFILE', path: '/Profile', width: 250, height: 80, imgSrc: '/PROFILE.svg' },
];

const additionalMenuItems = [
  { name: 'Home', path: '/home' },
  { name: 'About', path: '/About' },
  { name: 'Features', path: '/Features' },
  { name: 'FXX', path: '/FXX' },
];

export default function DashboardPageTest() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState(1);
    const [isScrolling, setIsScrolling] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [currentPath, setCurrentPath] = useState('DASHBOARD');
    
    // Refs for GSAP animations
    const menuRef = useRef<HTMLDivElement>(null);
    const menuItemsRef = useRef<HTMLElement[]>([]);
    const crossRef = useRef<HTMLDivElement>(null);
    const socialLinksRef = useRef<HTMLDivElement>(null);
    const contactInfoRef = useRef<HTMLDivElement>(null);
    const additionalItemsRef = useRef<HTMLDivElement>(null);
    const navRef = useRef<HTMLDivElement>(null);
    const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);
    const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });

    // Reset menu items ref when component unmounts or menu closes
    useEffect(() => {
        if (!menuOpen) {
            menuItemsRef.current = [];
        }
    }, [menuOpen]);

    // Add to menu items ref array
    const addToMenuItemsRef = (el: HTMLElement | null) => {
        if (el && !menuItemsRef.current.includes(el)) {
            menuItemsRef.current.push(el);
        }
    };

    const getCurrentPath = () => {
        return currentPath;
    };

    useEffect(() => {
        setCurrentPath(window.location.pathname.slice(1).toUpperCase() || 'DASHBOARD');
    }, []);

    useEffect(() => {
        const updateUnderline = () => {
            const activeIndex = navItems.findIndex(
                (item) => item.name.toUpperCase() === currentPath
            );
            const activeTab = tabRefs.current[activeIndex];
            if (activeTab) {
                const { offsetLeft, offsetWidth } = activeTab;
                setUnderlineStyle({ left: offsetLeft, width: offsetWidth });
            }
        };

        updateUnderline();
        window.addEventListener('resize', updateUnderline);
        return () => window.removeEventListener('resize', updateUnderline);
    }, [currentPath]);

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
        if (!menuRef.current) return;
        
        const validMenuItems = menuItemsRef.current.filter(item => item !== null && item !== undefined);
        const validFooterElements = [crossRef.current, socialLinksRef.current, contactInfoRef.current, additionalItemsRef.current]
            .filter(el => el !== null && el !== undefined);
        
        if (menuOpen) {
            gsap.set(menuRef.current, { 
                visibility: 'visible',
                pointerEvents: 'auto',
                'will-change': 'transform, opacity'
            });
            
            const openTl = gsap.timeline();
            
            // Animate background with scale effect
            openTl.fromTo(menuRef.current, 
                { opacity: 0, scale: 0.95 },
                {
                    duration: 0.6,
                    opacity: 1,
                    scale: 1,
                    ease: "power3.out"
                }
            );
            
            // Animate menu items
            if (validMenuItems.length > 0) {
                openTl.fromTo(
                    validMenuItems,
                    { y: 60, opacity: 0, rotateX: -15 },
                    { 
                        duration: 0.5, 
                        y: 0, 
                        opacity: 1,
                        rotateX: 0,
                        stagger: 0.15,
                        ease: "back.out(1.7)",
                        'will-change': 'transform, opacity'
                    },
                    "-=0.3"
                );
            }
            
            // Animate footer elements
            if (validFooterElements.length > 0) {
                openTl.fromTo(
                    validFooterElements,
                    { y: 30, opacity: 0, scale: 0.8 },
                    { 
                        duration: 0.4, 
                        y: 0, 
                        opacity: 1, 
                        scale: 1,
                        ease: "power2.out", 
                        stagger: 0.1 
                    },
                    "-=0.2"
                );
            }
        } else {
            const closeTl = gsap.timeline({
                onComplete: () => {
                    if (menuRef.current) {
                        gsap.set(menuRef.current, { 
                            visibility: 'hidden',
                            pointerEvents: 'none',
                            'will-change': 'auto'
                        });
                    }
                }
            });
            
            if (validFooterElements.length > 0) {
                closeTl.to(
                    validFooterElements.reverse(),
                    {
                        duration: 0.25,
                        opacity: 0,
                        y: 20,
                        scale: 0.9,
                        ease: "power2.in",
                        stagger: 0.05
                    }
                );
            }
            
            if (validMenuItems.length > 0) {
                closeTl.to(validMenuItems.slice().reverse(), {
                    duration: 0.35,
                    opacity: 0,
                    y: 40,
                    rotateX: 15,
                    stagger: 0.08,
                    ease: "power3.in"
                }, "-=0.15");
            }
            
            closeTl.to(menuRef.current, {
                duration: 0.4,
                opacity: 0,
                scale: 0.95,
                ease: "power3.inOut",
            }, "-=0.2");
        }
    }, [menuOpen]);

    // Add wheel event handler to switch tabs on scroll with debounce
    const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
        if (isScrolling) return;
        
        const direction = event.deltaY > 0 ? 1 : -1;
        const totalTabs = 4;
        let newTab = activeTab + direction;
        
        if (newTab < 1) newTab = totalTabs;
        if (newTab > totalTabs) newTab = 1;
        
        if (newTab !== activeTab) {
            setActiveTab(newTab);
            setIsScrolling(true);
            
            setTimeout(() => {
                setIsScrolling(false);
            }, 530);
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 1:
                return <AnalyticsTab />;
            case 2:
                return <CommentsTab />;
            case 3:
                return <InsightsTab />;
            // case 4:
            //     return <SubscriptionTab />;
            default:
                return null;
        }
    };

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
        <div className="min-h-screen">
            <Navigation />

            {/* Main Dashboard Content */}
            <div className="p-4">
                <div 
                    className="border-[1.5px] border-black dark:border-white w-[calc(100%-0.5rem)] mx-auto h-[calc(100vh-2rem-70px)] md:h-[calc(100vh-2rem-86px)] lg:h-[calc(100vh-2rem-94px)] flex"
                    onWheel={handleWheel}
                >
                    <div className="flex-1 relative">
                        {renderContent()}
                    </div>

                    <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>
            </div>

            {/* Enhanced Full Viewport Menu Overlay */}
            <div 
                ref={menuRef}
                className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black text-white z-50 opacity-0 overflow-y-auto xl:hidden"
                style={{ visibility: 'hidden', pointerEvents: 'none' }}
            >
                {/* Header - Acliptic and CLOSE */}
                <div className="flex justify-between p-4 md:p-6 lg:p-8 border-b border-gray-800">
                    <div ref={addToMenuItemsRef} className="text-sm md:text-base font-light tracking-wider">
                        SIDE/EFFECT
                    </div>
                    <div 
                        className="cursor-pointer menu-link-hover text-sm md:text-base font-light tracking-wider hover:text-red-400 transition-colors duration-300" 
                        onClick={closeMenu}
                        ref={addToMenuItemsRef}
                    >
                        CLOSE
                    </div>
                </div>
                
                {/* Menu Links - with SVG images */}
                <div className="flex flex-col items-start justify-center min-h-[50vh] px-8 md:px-16 lg:px-24 py-8">
                    {navItems.map((item, index) => (
                        <Link href={item.path} key={item.name} onClick={closeMenu}>
                            <div 
                                className={`${index < navItems.length - 1 ? 'mb-8' : 'mb-4'} menu-link-hover transform transition-all duration-300 hover:scale-[0.98] group`}
                                ref={addToMenuItemsRef}
                            >
                                <div className={`relative ${item.name === 'DASHBOARD' ? 'w-[280px] sm:w-[350px] md:w-[420px] lg:w-[470px]' : item.name === 'STUDIO' || item.name === 'PROFILE' ? 'w-[180px] sm:w-[210px] md:w-[230px] lg:w-[250px]' : 'w-[80px] sm:w-[100px] md:w-[120px] lg:w-[130px]'}`}>
                                    <Image
                                        src={item.imgSrc}
                                        alt={item.name}
                                        width={item.width}
                                        height={item.height}
                                        priority
                                        className="w-full h-auto transition-all duration-300 group-hover:brightness-125"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Additional Menu Items */}
                <div className="px-8 md:px-16 lg:px-24 py-4" ref={additionalItemsRef}>
                    <h3 className="text-lg font-light tracking-wider mb-6 text-gray-300">Quick Links</h3>
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        {additionalMenuItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.path}
                                onClick={closeMenu}
                                className="text-gray-300 hover:text-white transition-all duration-300 py-2 px-4 rounded-lg hover:bg-white/10 backdrop-blur-sm border border-transparent hover:border-white/20"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Enhanced Styles */}
            <style jsx>{`
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
                
                .thin-cross {
                    transition: all 0.3s ease;
                }
                
                .thin-cross:hover {
                    transform: rotate(90deg) scale(1.1);
                }
                
                .menu-link-hover {
                    transition: all 0.3s ease;
                    position: relative;
                }
                
                .menu-link-hover:hover {
                    filter: brightness(1.2) saturate(1.1);
                }

                .menu-link-hover::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    pointer-events: none;
                }

                .menu-link-hover:hover::before {
                    opacity: 1;
                }

                @media (max-width: 640px) {
                    .menu-link-hover:hover {
                        transform: scale(0.97);
                    }
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }

                .floating-animation {
                    animation: float 3s ease-in-out infinite;
                }

                /* Smooth scrollbar for menu */
                .menu-overlay::-webkit-scrollbar {
                    width: 4px;
                }

                .menu-overlay::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.1);
                }

                .menu-overlay::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 2px;
                }

                .menu-overlay::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.5);
                }
            `}</style>
        </div>
    );
}