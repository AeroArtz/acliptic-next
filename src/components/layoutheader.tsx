'use client'

import Image from 'next/image';
import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#E9E9EB] relative flex items-center">
      <Image
        src="/logo.png"
        alt="Logo"
        width={120}
        height={40}
      />
      <div className="absolute top-5 right-5 flex items-center space-x-3">
        <div className="w-10 h-10 bg-[#F6F6F8] rounded-full flex items-center justify-center">
          <Image
            src="/question.svg"
            alt="Question"
            width={20}
            height={20}
          />
        </div>
        {pathname === '/Profile' ? (
  <div className="w-10 h-10 overflow-hidden rounded-[14px]">
    <Image
      src="/twitchblack.jpg"
      alt="Profile"
      width={40}
      height={40}
      className="object-cover w-full h-full"
    />
  </div>
) : (
  <div className="w-10 h-10 bg-[#F6F6F8] rounded-[14px] flex items-center justify-center text-lg font-medium text-black">
    A
  </div>
)}
      </div>
      {children}
    </div>
  );
}

