import React from 'react';
import RotatingVideos from './RotatingVideos';

export default function HeroSection() {
  return (
    <div className="text-center mt-16">
      <p className="text-[60px] font-medium leading-tight">
        Generate short-clips <br />
        from your streams in{' '}
        <span className="rockybilly-font text-[28px] bg-gradient-to-r from-[#6790BC] via-[#91B7D9] to-[#BBDDF6] bg-clip-text text-transparent">
          Real-Time
        </span>
      </p>
      <p className='text-[21px] font-normal text-[#545454] mt-5'>
        Create TikToks, Reels, Shorts from your streams in just one click.
      </p>
      <div className="mt-8">
        <button className="bg-[#000000] text-white px-5 py-2 rounded-[10px] 
                     hover:scale-105 transition-transform duration-300 
                     active:scale-95 text-[14px] 
                     hover:shadow-md active:shadow-sm">
          Get Started
        </button>
      </div>
      <RotatingVideos />
    </div>
  );
}

