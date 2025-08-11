// components/dashboard/InsightsTab.jsx
'use client'
import { BarChart, Bar, Cell, XAxis, YAxis, ResponsiveContainer } from "recharts";

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

export default function InsightsTab() {
    return (
        <>
            {/* INSIGHTS text */}
            <div className="absolute left-10 top-24">
                <p className="text-4xl" style={{ letterSpacing: '-0.04em', lineHeight: '92.7%' }}>INSIGHTS</p>
            </div>

            <div className="absolute left-40 top-[60%] -translate-y-1/2 transform">
                <div className="w-[290px] h-[460px] bg-black rounded-lg p-4 relative">
                    <div className="flex justify-between items-center">
                        <div className="text-[#7A868A] mb-2 hel-font">Engagement Rate</div>
                    </div>
                    <div className="text-5xl text-white" style={{ letterSpacing: '-0.04em', lineHeight: '92.7%' }}>+123%</div>
                    <ResponsiveContainer width="100%" height={380}>
                        <BarChart data={data}>
                            <Bar
                                dataKey="value"
                                fill="#F0F0F0"
                                radius={[6, 6, 6, 6]}
                                animationDuration={1500}
                            >
                                {
                                    data.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.value === 8 ? '#606060' : '#F0F0F0'}
                                        />
                                    ))
                                }
                            </Bar>
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={false}
                            />
                            <YAxis
                                hide={true}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Retention Rate Chart */}
            <div className="absolute right-10 top-[34.5%] -translate-y-1/2 transform">
                <div className="w-[760px] h-[120px] bg-black rounded-lg p-6 flex justify-between items-center">
                    <div className="text-4xl text-white" style={{ letterSpacing: '-0.04em', lineHeight: '92.7%' }}>
                        Retention Rate
                    </div>
                    <div className="flex items-center gap-4">
                        <svg width="230" height="40" viewBox="-10 0 240 40" className="mr-2">
                            <style jsx>{`
                                @keyframes drawLine {
                                    0% { stroke-dashoffset: 250; }
                                    100% { stroke-dashoffset: 0; }
                                }
                                @keyframes fadeIn {
                                    0% { opacity: 0; }
                                    100% { opacity: 1; }
                                }
                            `}</style>
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
                        <div className="text-5xl text-white" style={{ letterSpacing: '-0.04em', lineHeight: '92.7%' }}>
                            84%
                        </div>
                    </div>
                </div>
            </div>

            {/* Followers Growth Chart */}
            <div className="absolute right-10 top-[70%] -translate-y-1/2 transform">
                <div className="w-[760px] h-[320px] bg-black rounded-lg p-6 text-right">
                    <style jsx>{`
                        @keyframes flicker {
                            0%, 100% { opacity: 1; }
                            50% { opacity: 0.3; }
                        }
                    `}</style>
                    <div className="text-[#7A868A] mb-2 hel-font">Followers Growth</div>
                    <div className="text-5xl text-white" style={{ letterSpacing: '-0.04em', lineHeight: '92.7%' }}>
                        +287<span className="text-2xl align-bottom">%</span>
                    </div>
                    <div className="mt-9 flex items-end justify-between px-4 h-[140px]">
                        {[
                            { boxes: 1, gray: true },
                            { boxes: 2, gray: true },
                            { boxes: 1, gray: true },
                            { boxes: 2, gray: true },
                            { boxes: 1, gray: true },
                            { boxes: 3, gray: true },
                            { boxes: 2, gray: true },
                            { boxes: 1, gray: true },
                            { boxes: 1, gray: true },
                            { boxes: 1, gray: true },
                            { boxes: 2, gray: true },
                            { boxes: 3, gray: true },
                            { boxes: 1, gray: true },
                            { boxes: 2, gray: true },
                            { boxes: 1, gray: true },
                            { boxes: 2, gray: false },
                            { boxes: 3, gray: false },
                            { boxes: 5, gray: false },
                            { boxes: 4, gray: false },
                            { boxes: 3, gray: false },
                            { boxes: 4, gray: false },
                            { boxes: 5, gray: false },
                            { boxes: 4, gray: false },
                            { boxes: 6, gray: false },
                            { boxes: 5, gray: false },
                            { boxes: 3, gray: false },
                            { boxes: 4, gray: false },
                            { boxes: 5, gray: false },
                            { boxes: 7, gray: false },
                            { boxes: 6, gray: false },
                            { boxes: 2, gray: false },
                            { boxes: 3, gray: false },
                            { boxes: 4, gray: false },
                            { boxes: 5, gray: false },
                        ].map((column, columnIndex) => (
                            <div key={columnIndex} className="flex flex-col gap-[1px]">
                                {Array(column.boxes).fill(0).map((_, boxIndex) => (
                                    <div
                                        key={boxIndex}
                                        className="w-[18px] h-[18px] rounded-md"
                                        style={{
                                            backgroundColor: column.gray ? '#606060' : '#F0F0F0',
                                            animation: column.gray ? 'none' : 'flicker 0.5s ease-in-out',
                                            animationDelay: column.gray ? '0s' : `${(columnIndex * 0.1 + boxIndex * 0.05)}s`,
                                            animationIterationCount: column.gray ? '0' : '3'
                                        }}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between px-4 mt-2 text-sm text-white hel-font">
                        <span>1 Jan</span>
                        <span>8 Jan</span>
                        <span>15 Jan</span>
                        <span>22 Jan</span>
                        <span>29 Jan</span>
                        <span>4 Feb</span>
                        <span>15 Feb</span>
                        <span>21 Feb</span>
                    </div>
                </div>
            </div>
        </>
    );
}