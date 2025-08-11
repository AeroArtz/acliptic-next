'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { AnimatedCommentsDemo } from '@/components/Dashboard/dashboardComments'
import { BarChart, Bar, Cell, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import Navigation from '@/components/afterNav'

const data = [
    { name: 'Jan', value: 8 },
    { name: 'Feb', value: 8 },
    { name: 'Mar', value: 8 },
    { name: 'Apr', value: 70 },
    { name: 'May', value: 85 },
    { name: 'Jun', value: 45 },
    { name: 'Jul', value: 65 },
    { name: 'Aug', value: 35 },
    { name: 'Sep', value: 55 },
    { name: 'Oct', value: 8 },
    { name: 'Nov', value: 8 },
    { name: 'Dec', value: 8 },
];

export default function MobileDashboard() {
    const [activeTab, setActiveTab] = useState(1)

    const renderContent = () => {
        switch (activeTab) {
            case 1:
                return (
                    <div className="p-4 space-y-6">
                        {/* Instagram Card */}
                        <div className="w-full rounded-md overflow-hidden bg-gradient-to-b from-[#000000] via-[#222222] to-[#333333] p-6 hel-font">
                            <div className="text-white text-4xl mb-6">Instagram</div>
                            <div className="text-[#7A868A] text-xs mb-1">NOTE:</div>
                            <div className="text-white text-sm mb-6">Statistics are across all clips.</div>
                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div>
                                    <div className="text-[#7A868A] text-xs mb-1">COMMENTS</div>
                                    <div className="text-white text-4xl">14k</div>
                                </div>
                                <div>
                                    <div className="text-[#7A868A] text-xs mb-1">LIKES</div>
                                    <div className="text-white text-4xl">92k</div>
                                </div>
                            </div>
                            <div className="mb-6">
                                <div className="text-[#7A868A] text-xs mb-1">VIEWS</div>
                                <div className="text-white text-4xl">421K</div>
                                <div className="h-[1px] bg-[#767676] mt-4"></div>
                            </div>
                            <Button className="w-full bg-white text-black hover:bg-white/90 transition-colors rounded-lg hel-font text-sm">
                                GO TO ACCOUNT
                            </Button>
                        </div>

                        {/* TikTok Card */}
                        <div className="w-full rounded-md overflow-hidden bg-gradient-to-b from-[#1B3E37] via-[#335249] to-[#4A6963] p-6 hel-font">
                            <div className="text-white text-4xl mb-6">TikTok</div>
                            <div className="text-[#7A868A] text-xs mb-1">NOTE:</div>
                            <div className="text-white text-sm mb-6">Statistics are across all clips.</div>
                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div>
                                    <div className="text-[#7A868A] text-xs mb-1">COMMENTS</div>
                                    <div className="text-white text-4xl">14k</div>
                                </div>
                                <div>
                                    <div className="text-[#7A868A] text-xs mb-1">LIKES</div>
                                    <div className="text-white text-4xl">92k</div>
                                </div>
                            </div>
                            <div className="mb-6">
                                <div className="text-[#7A868A] text-xs mb-1">VIEWS</div>
                                <div className="text-white text-4xl">421K</div>
                                <div className="h-[1px] bg-[#767676] mt-4"></div>
                            </div>
                            <Button className="w-full bg-white text-black hover:bg-white/90 transition-colors rounded-lg hel-font text-sm">
                                GO TO ACCOUNT
                            </Button>
                        </div>

                        {/* YouTube Card */}
                        <div className="w-full rounded-md overflow-hidden bg-gradient-to-b from-[#3D2B4B] via-[#6A3352] to-[#8A3B50] p-6 hel-font">
                            <div className="text-white text-4xl mb-6">YouTube</div>
                            <div className="text-[#7A868A] text-xs mb-1">NOTE:</div>
                            <div className="text-white text-sm mb-6">Statistics are across all clips.</div>
                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div>
                                    <div className="text-[#7A868A] text-xs mb-1">COMMENTS</div>
                                    <div className="text-white text-4xl">14k</div>
                                </div>
                                <div>
                                    <div className="text-[#7A868A] text-xs mb-1">LIKES</div>
                                    <div className="text-white text-4xl">92k</div>
                                </div>
                            </div>
                            <div className="mb-6">
                                <div className="text-[#7A868A] text-xs mb-1">VIEWS</div>
                                <div className="text-white text-4xl">421K</div>
                                <div className="h-[1px] bg-[#767676] mt-4"></div>
                            </div>
                            <Button className="w-full bg-white text-black hover:bg-white/90 transition-colors rounded-lg hel-font text-sm">
                                GO TO ACCOUNT
                            </Button>
                        </div>
                    </div>
                )
            // case 2:
            //     return (
            //         <div className="p-4">
            //             <AnimatedCommentsDemo />
            //         </div>
            //     )
            case 2:
                return (
                    <div className="p-4 space-y-6">
                        {/* Engagement Rate Chart */}
                        <div className="w-full bg-black rounded-lg p-4">
                            <div className="text-[#7A868A] mb-2 hel-font">Engagement Rate</div>
                            <div className="text-4xl text-white mb-4">+123%</div>
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={data}>
                                    <Bar
                                        dataKey="value"
                                        fill="#F0F0F0"
                                        radius={[6, 6, 6, 6]}
                                        animationDuration={1500}
                                    >
                                        {data.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.value === 8 ? '#606060' : '#F0F0F0'}
                                            />
                                        ))}
                                    </Bar>
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={false}
                                    />
                                    <YAxis hide={true} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Retention Rate */}
                        <div className="w-full bg-black rounded-lg p-4">
                            <div className="text-3xl text-white mb-4">Retention Rate</div>
                            <div className="flex items-center justify-between">
                                <svg width="150" height="40" viewBox="-10 0 240 40" className="mr-2">
                                    <path 
                                        d="M-40,30 C-30,30 -10,30 10,30 S40,15 60,15 S90,25 110,25 S140,5 160,5 S190,10 210,10" 
                                        fill="none" 
                                        stroke="#F0F0F0" 
                                        strokeWidth="1.5"
                                        strokeDasharray="250"
                                        strokeDashoffset="0"
                                        style={{ animation: 'drawLine 1.5s ease-in-out' }}
                                    />
                                    <circle cx="10" cy="30" r="4" fill="#F0F0F0" style={{ animation: 'fadeIn 0.3s ease-in-out forwards', animationDelay: '0.3s', opacity: 0 }} />
                                    <circle cx="60" cy="15" r="4" fill="#F0F0F0" style={{ animation: 'fadeIn 0.3s ease-in-out forwards', animationDelay: '0.6s', opacity: 0 }} />
                                    <circle cx="110" cy="25" r="4" fill="#F0F0F0" style={{ animation: 'fadeIn 0.3s ease-in-out forwards', animationDelay: '0.9s', opacity: 0 }} />
                                    <circle cx="160" cy="5" r="4" fill="#F0F0F0" style={{ animation: 'fadeIn 0.3s ease-in-out forwards', animationDelay: '1.2s', opacity: 0 }} />
                                    <circle cx="210" cy="10" r="4" fill="#F0F0F0" style={{ animation: 'fadeIn 0.3s ease-in-out forwards', animationDelay: '1.5s', opacity: 0 }} />
                                </svg>
                                <div className="text-4xl text-white">84%</div>
                            </div>
                        </div>

                        {/* Followers Growth */}
                        <div className="w-full bg-black rounded-lg p-4">
                            <div className="text-[#7A868A] mb-2 hel-font">Followers Growth</div>
                            <div className="text-4xl text-white mb-4">+287%</div>
                            <div className="flex items-end justify-between h-[100px]">
                                {Array(20).fill(0).map((_, i) => (
                                    <div key={i} className="w-[8px] h-[40px] bg-[#F0F0F0] rounded-md" />
                                ))}
                            </div>
                        </div>
                    </div>
                )
            // case 4:
            //     return (
            //         <div className="px-4 text-white">
            //             <div className="text-5xl hel-font mb-4">FXX MEMBERSHIP</div>
            //             <div className="text-3xl hel-font mb-6">$29.99<span className="text-xl">/month</span></div>
                        
            //             <div className="bg-black p-4 rounded-lg">
            //                 <div className="text-4xl text-[#9BA1A3] hel-font mb-2">Active</div>
            //                 <div className="h-[1px] bg-[#9BA1A3] mb-4"></div>
                            
            //                 <div className="space-y-4 mb-6">
            //                     <p className="text-lg hel-font">Purchase Date: 10/02/2025</p>
            //                     <p className="text-lg hel-font">Renewal Date: 10/03/2025</p>
            //                 </div>
                            
            //                 <div className="space-y-4 mb-6">
            //                     <div>
            //                         <div className="flex justify-between mb-2 hel-font">
            //                             <span>24 / 30 Streams</span>
            //                         </div>
            //                         <div className="h-1 bg-gray-200 rounded-full">
            //                             <div className="h-1 bg-[#9BA1A3] rounded-full w-[80%]"></div>
            //                         </div>
            //                     </div>
                                
            //                     <div>
            //                         <div className="flex justify-between mb-2 hel-font">
            //                             <span>215 / 300 Clips</span>
            //                         </div>
            //                         <div className="h-1 bg-gray-200 rounded-full">
            //                             <div className="h-1 bg-black rounded-full w-[72%]"></div>
            //                         </div>
            //                     </div>
            //                 </div>
                            
            //                 <div className="flex gap-4">
            //                     <Button className="flex-1 bg-black text-white hover:bg-white hover:text-black border border-black">
            //                         CANCEL
            //                     </Button>
            //                     <Button className="flex-1 bg-black text-white hover:bg-white hover:text-black border border-black">
            //                         UPGRADE
            //                     </Button>
            //                 </div>
            //             </div>
            //         </div>
            //     )
            default:
                return null
        }
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            <Navigation />
            
            {/* Content */}
            <div className="pt-20 pb-20">
                {renderContent()}
            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-black dark:border-gray-700 p-4 flex justify-around">
                {[1, 2].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`text-sm px-3 py-2 rounded-lg transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white
                            ${activeTab === tab
                                ? 'text-black dark:text-white bg-gray-400 dark:bg-gray-800'
                                : 'text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-400 dark:hover:bg-gray-800/50'}
                        `}
                    >
                        {tab === 1 ? 'ANALYTICS' :
                         'INSIGHTS'}
                    </button>
                ))}
            </div>
        </div>
    )
}