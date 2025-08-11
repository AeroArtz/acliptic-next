'use client'

export default function SubscriptionCard() {
    return (
        <div className="absolute bottom-8 left-8 flex items-end gap-32">
            <div>
                <div className="mb-52">
                    <p className="text-6xl hel-font subscription-title" style={{ letterSpacing: '-0.04em', lineHeight: '92.7%', '--delay': '0.2s' } as any}>FXX</p>
                    <p className="text-6xl hel-font subscription-title" style={{ letterSpacing: '-0.04em', lineHeight: '92.7%', '--delay': '0.3s' } as any}>MEMBERSHIP</p>
                    <p className="text-3xl mt-2 hel-font subscription-price" style={{ '--delay': '0.5s' } as any}>$29.99<span className="text-xl">/month</span></p>
                </div>
                <p className="text-4xl subscription-label" style={{ letterSpacing: '-0.04em', lineHeight: '92.7%', '--delay': '0.7s' } as any}>SUBSCRIPTION</p>
            </div>

            <div className="absolute ml-[650px] mb-16 subscription-details">
                <div className="mb-8 subscription-status" style={{ '--delay': '0.4s' } as any}>
                    <p className="text-6xl text-[#9BA1A3] hel-font" style={{ letterSpacing: '-0.04em' }}>Active</p>
                    <div className="h-[1px] bg-[#9BA1A3] mt-2 status-line"></div>
                </div>

                <div className="space-y-4 mb-8 subscription-dates" style={{ '--delay': '0.6s' } as any}>
                    <p className="text-lg hel-font">Purchase Date: 10/02/2025</p>
                    <p className="text-lg hel-font">Renewal Date: 10/03/2025</p>
                </div>

                <div className="flex gap-6 mb-12 subscription-usage" style={{ '--delay': '0.8s' } as any}>
                    <div className="flex-1">
                        <div className="flex justify-between mb-2 hel-font">
                            <span>24 / 30 Streams.</span>
                        </div>
                        <div className="h-1 bg-gray-200 rounded-full w-[200px]">
                            <div className="h-1 bg-[#9BA1A3] rounded-full progress-bar" style={{ width: '80%' }}></div>
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="flex justify-between mb-2 hel-font">
                            <span>215 / 300 Clips.</span>
                        </div>
                        <div className="h-1 bg-gray-200 rounded-full w-[200px]">
                            <div className="h-1 bg-black rounded-full progress-bar" style={{ width: '72%', animationDelay: '0.2s' }}></div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 subscription-buttons" style={{ '--delay': '1s' } as any}>
                    <button className="bg-black text-white px-8 py-3 transition-colors hover:bg-white hover:text-black border border-black">CANCEL</button>
                    <button className="bg-black text-white px-8 py-3 transition-colors hover:bg-white hover:text-black border border-black">UPGRADE</button>
                </div>
            </div>

            {/* Add subscription animations */}
            <style jsx>{`
                .subscription-title {
                    opacity: 0;
                    transform: translateY(20px);
                    animation: fadeUp 0.7s var(--delay) cubic-bezier(0.22, 1, 0.36, 1) forwards;
                }
                
                .subscription-price {
                    opacity: 0;
                    transform: translateX(-10px);
                    animation: fadeSlideIn 0.6s var(--delay) cubic-bezier(0.22, 1, 0.36, 1) forwards;
                }
                
                .subscription-label {
                    opacity: 0;
                    animation: fadeIn 0.8s var(--delay) ease-out forwards;
                }
                
                .subscription-status {
                    opacity: 0;
                    transform: translateY(15px);
                    animation: fadeUp 0.7s var(--delay) cubic-bezier(0.22, 1, 0.36, 1) forwards;
                }
                
                .status-line {
                    transform: scaleX(0);
                    transform-origin: left;
                    animation: growLine 0.6s calc(var(--delay) + 0.2s) cubic-bezier(0.22, 1, 0.36, 1) forwards;
                }
                
                .subscription-dates {
                    opacity: 0;
                    animation: fadeIn 0.7s var(--delay) ease-out forwards;
                }
                
                .subscription-usage {
                    opacity: 0;
                    animation: fadeIn 0.7s var(--delay) ease-out forwards;
                }
                
                .progress-bar {
                    transform: scaleX(0);
                    transform-origin: left;
                    animation: growLine 1s calc(var(--delay) + 0.2s) cubic-bezier(0.22, 1, 0.36, 1) forwards;
                }
                
                .subscription-buttons {
                    opacity: 0;
                    transform: translateY(10px);
                    animation: fadeUp 0.7s var(--delay) cubic-bezier(0.22, 1, 0.36, 1) forwards;
                }
                
                @keyframes fadeUp {
                    0% {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes fadeIn {
                    0% {
                        opacity: 0;
                    }
                    100% {
                        opacity: 1;
                    }
                }
                
                @keyframes fadeSlideIn {
                    0% {
                        opacity: 0;
                        transform: translateX(-10px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                @keyframes growLine {
                    0% {
                        transform: scaleX(0);
                    }
                    100% {
                        transform: scaleX(1);
                    }
                }
            `}</style>
        </div>
    );
}