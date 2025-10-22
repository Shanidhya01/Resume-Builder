"use client"

import ResumeFields from '@/config/ResumeFields';
import Link from 'next/link';

// Define a gradient color for each tab
const tabColors = {
    personal: 'from-purple-800 via-purple-600 to-purple-400',
    education: 'from-pink-700 via-pink-500 to-pink-300',
    experience: 'from-blue-800 via-blue-600 to-blue-400',
    skills: 'from-green-800 via-green-600 to-green-400',
    projects: 'from-indigo-800 via-indigo-600 to-indigo-400',
    // Add more tab keys and colors as needed
};

const Tabs = ({ activeTab }) => {
    const tabs = Object.keys(ResumeFields);

    return (
        <div className="relative w-full">
            {/* Subtle background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 blur-xl -z-10"></div>
            
            <div className="flex w-full gap-2 overflow-x-auto md:gap-3 p-1 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent">
                {tabs.map(tab => {
                    const activeGradient = tabColors[tab] || 'from-purple-800 via-purple-600 to-purple-400';

                    return (
                        <Link
                            key={tab}
                            href={`/editor/?tab=${tab}`}
                            className={`
                                relative cursor-pointer rounded-lg px-5 py-2.5 text-sm capitalize 
                                md:text-base 2xl:text-lg font-semibold
                                transition-all duration-300 ease-in-out transform
                                whitespace-nowrap
                                ${activeTab === tab 
                                    ? `bg-gradient-to-r ${activeGradient} text-white shadow-2xl shadow-purple-500/30 scale-105 ring-2 ring-white/20` 
                                    : 'bg-purple-700/90 text-white/90 hover:scale-105 hover:bg-gradient-to-r hover:from-purple-700 hover:via-purple-500 hover:to-purple-300 hover:shadow-lg hover:shadow-purple-500/20 hover:text-white'}
                            `}
                        >
                            {/* Shimmer effect overlay for active tab */}
                            {activeTab === tab && (
                                <>
                                    <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></span>
                                    <span className="absolute top-0 left-0 w-full h-full rounded-lg bg-white/5 animate-pulse"></span>
                                </>
                            )}
                            
                            {/* Tab text with subtle text shadow */}
                            <span className="relative z-10 drop-shadow-sm">{tab}</span>
                            
                            {/* Bottom highlight bar for active tab */}
                            {activeTab === tab && (
                                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-white/40 rounded-full"></span>
                            )}
                        </Link>
                    );
                })}
            </div>
            
            {/* Add custom shimmer animation in your global CSS or tailwind.config.js */}
            <style jsx>{`
                @keyframes shimmer {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(100%);
                    }
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
            `}</style>
        </div>
    );
};

export default Tabs;