'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Drawer } from 'vaul';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Features', path: '/Features' },
  { name: 'Pricing', path: '/Pricing' },
  { name: 'About Us', path: '/About' },
  { name: 'FXX', path: '/FXX', isImage: true, imageSrc: '/FXXlogo.png', imageWidth: 120, imageHeight: 40 },
];

export default function FXXNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

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

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 flex items-center justify-between py-6 px-6 transition-transform duration-300 ease-in-out ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        } ${isOpen ? 'bg-transparent z-10' : 'bg-black z-50'}`}
      >
        {/* Menu Button - Left */}
        <Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
          <Drawer.Trigger asChild>
            <button className="flex items-center space-x-2 group z-10">
              <div className="flex flex-col space-y-1.5">
                <div className="w-6 h-[1.5px] bg-white"></div>
                <div className="w-6 h-[1.5px] bg-white"></div>
              </div>
              <span className="text-sm font-light tracking-wide text-white">MENU</span>
            </button>
          </Drawer.Trigger>

          {/* Centered Logo */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="Logo"
                width={120}
                height={40}
              />
            </Link>
          </div>

          {/* Login/Signup - Right */}
          <div className="flex items-center space-x-2 lg:space-x-4 z-10">
            <Link href='/Login'>
              <button className="text-[#767676] px-3 lg:px-4 py-1.5 lg:py-2 text-sm lg:text-base transition-colors uppercase">
                Login
              </button>
            </Link>
            <Link
              href="/Signup"
              className="hidden lg:inline-block text-[#767676] transition-all duration-300 relative group text-[14px] lg:text-[17px] uppercase"
            >
              Sign Up
              <span className="absolute bottom-[-3px] left-0 w-0 h-[0.5px] bg-[#767676] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>

          <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 bg-black/50" />
            <Drawer.Content className="fixed top-0 left-0 h-full w-[450px] bg-black z-50 pt-8">
              <VisuallyHidden asChild>
                <Drawer.Title>Navigation Menu</Drawer.Title>
              </VisuallyHidden>
              
              <div className="flex justify-between items-center px-10 py-6 text-white">
                <Drawer.Close className="text-base font-light tracking-wide hover:text-zinc-400 transition-colors">
                  <span className="text-xl translate-y-[2px] inline-block mr-2">✕</span> CLOSE
                </Drawer.Close>
              </div>

              <div className="px-10 py-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.path}
                    className="block text-white text-6xl font-light py-4 hover:text-zinc-400 transition-colors duration-200 ease-in-out"
                    style={{ letterSpacing: '-0.04em', lineHeight: '92.7%' }}
                    onClick={() => setIsOpen(false)}
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
                ))}
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      </nav>
      {/* Spacer to prevent content jumping when nav becomes fixed */}
      <div className="h-[102px]" />
    </>
  );
}