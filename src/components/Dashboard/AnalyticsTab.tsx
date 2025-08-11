// components/dashboard/AnalyticsTab.jsx
'use client'
import { Button } from "@/components/ui/button";

export default function AnalyticsTab() {
    return (
        <>
            {/* Instagram Card */}
            <div className="absolute right-[640px] top-1/2 -translate-y-1/2 transform -rotate-[14deg] z-10 card-stack-animation" 
                 style={{ '--delay': '0.2s', '--distance': '100px' } as any}>
                <div className="w-[315px] rounded-md overflow-hidden bg-gradient-to-b from-[#000000] via-[#222222] to-[#333333] p-7 hel-font">
                    <div className="text-white text-5xl mb-8 mt-5 -ml-2">Instagram</div>

                    <div className="text-[#7A868A] text-xs mb-1">NOTE:</div>
                    <div className="text-white text-sm mb-8">Statistics are across all clips.</div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <div className="text-[#7A868A] text-xs mb-1">COMMENTS</div>
                            <div className="text-white text-5xl">14k</div>
                        </div>
                        <div>
                            <div className="text-[#7A868A] text-xs mb-1">LIKES</div>
                            <div className="text-white text-5xl">92k</div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <div className="text-[#7A868A] text-xs mb-1">VIEWS</div>
                        <div className="text-white text-5xl">421K</div>
                        <div className="h-[1px] bg-[#767676] mt-4"></div>
                    </div>

                    <Button
                        className="w-[60%] bg-white text-black hover:bg-white/90 transition-colors rounded-lg hel-font text-sm"
                    >
                        GO TO ACCOUNT
                    </Button>
                </div>
            </div>

            {/* TikTok Card */}
            <div className="absolute right-[360px] top-1/2 -translate-y-1/2 transform -rotate-[14deg] z-20 card-stack-animation"
                 style={{ '--delay': '0.4s', '--distance': '80px' } as any}>
                <div className="w-[315px] rounded-md overflow-hidden bg-gradient-to-b from-[#1B3E37] via-[#335249] to-[#4A6963] p-7 hel-font">
                    <div className="text-white text-5xl mb-8 mt-5 -ml-2">TikTok</div>

                    <div className="text-[#7A868A] text-xs mb-1">NOTE:</div>
                    <div className="text-white text-sm mb-8">Statistics are across all clips.</div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <div className="text-[#7A868A] text-xs mb-1">COMMENTS</div>
                            <div className="text-white text-5xl">14k</div>
                        </div>
                        <div>
                            <div className="text-[#7A868A] text-xs mb-1">LIKES</div>
                            <div className="text-white text-5xl">92k</div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <div className="text-[#7A868A] text-xs mb-1">VIEWS</div>
                        <div className="text-white text-5xl">421K</div>
                        <div className="h-[1px] bg-[#767676] mt-4"></div>
                    </div>

                    <Button
                        className="w-[60%] bg-white text-black hover:bg-white/90 transition-colors rounded-lg hel-font text-sm"
                    >
                        GO TO ACCOUNT
                    </Button>
                </div>
            </div>

            {/* YouTube Card */}
            <div className="absolute right-20 top-1/2 -translate-y-1/2 transform -rotate-[14deg] z-30 card-stack-animation"
                 style={{ '--delay': '0.6s', '--distance': '60px' } as any}>
                <div className="w-[315px] rounded-md overflow-hidden bg-gradient-to-b from-[#3D2B4B] via-[#6A3352] to-[#8A3B50] p-7 hel-font">
                    <div className="text-white text-5xl mb-8 mt-5 -ml-2">YouTube</div>

                    <div className="text-[#7A868A] text-xs mb-1">NOTE:</div>
                    <div className="text-white text-sm mb-8">Statistics are across all clips.</div>

                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <div className="text-[#7A868A] text-xs mb-1">COMMENTS</div>
                            <div className="text-white text-5xl">14k</div>
                        </div>
                        <div>
                            <div className="text-[#7A868A] text-xs mb-1">LIKES</div>
                            <div className="text-white text-5xl">92k</div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <div className="text-[#7A868A] text-xs mb-1">VIEWS</div>
                        <div className="text-white text-5xl">421K</div>
                        <div className="h-[1px] bg-[#767676] mt-4"></div>
                    </div>

                    <Button
                        className="w-[60%] bg-white text-black hover:bg-white/90 transition-colors rounded-lg hel-font text-sm"
                    >
                        GO TO ACCOUNT
                    </Button>
                </div>
            </div>

            {/* Bottom left text */}
            <div className="absolute bottom-8 left-8 text-fade-in" style={{ '--delay': '0.8s' } as any}>
                <p className="text-4xl" style={{ letterSpacing: '-0.04em', lineHeight: '92.7%' }}>STREAM<br />ANALYTICS</p>
            </div>

            {/* Enhanced animation keyframes */}
            <style jsx>{`
                @keyframes stackedCardAppear {
                    0% {
                        opacity: 0;
                        transform: translate(calc(-1 * var(--distance)), -50%) rotate(-14deg);
                        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
                    }
                    20% {
                        opacity: 1;
                    }
                    100% {
                        opacity: 1;
                        transform: translate(0, -50%) rotate(-14deg);
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    }
                }
                
                .card-stack-animation {
                    animation: stackedCardAppear 1s var(--delay) cubic-bezier(0.25, 1, 0.5, 1) forwards;
                    opacity: 0;
                    will-change: transform, opacity;
                    transform-origin: center center;
                }
                
                @keyframes textFadeIn {
                    0% {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .text-fade-in {
                    animation: textFadeIn 0.8s var(--delay) cubic-bezier(0.22, 1, 0.36, 1) forwards;
                    opacity: 0;
                }
            `}</style>
        </>
    );
}