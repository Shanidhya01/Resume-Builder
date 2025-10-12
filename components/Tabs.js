import ResumeFields from '@/config/ResumeFields';
import Link from 'next/link';
import { HiCheck } from 'react-icons/hi';

const Tabs = ({ activeTab }) => {
    const tabs = Object.keys(ResumeFields);

    return (
        <div className="relative w-full">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-white to-slate-50 rounded-t-2xl"></div>
            
            {/* Tabs container */}
            <div className="relative flex w-full gap-1 overflow-x-auto md:gap-2 p-4 scrollbar-hide">
                {tabs.map((tab, index) => {
                    const isActive = activeTab === tab;
                    const isCompleted = false; // You can add completion logic here
                    
                    return (
                        <Link
                            key={tab}
                            className={`
                                group relative flex-shrink-0 cursor-pointer rounded-xl px-4 py-3 text-sm font-semibold capitalize transition-all duration-300 ease-out
                                md:px-6 md:py-3 md:text-base 2xl:text-lg
                                ${isActive 
                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25 scale-105 z-10' 
                                    : 'bg-white/80 text-slate-700 hover:bg-white hover:text-slate-900 hover:shadow-md hover:scale-102 border border-slate-200/50'
                                }
                                backdrop-blur-sm
                            `}
                            href={`/editor/?tab=${tab}`}
                        >
                            {/* Active tab glow effect */}
                            {isActive && (
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-lg opacity-50 -z-10 scale-110"></div>
                            )}
                            
                            {/* Tab content */}
                            <div className="flex items-center gap-2">
                                {/* Completion indicator */}
                                {isCompleted && (
                                    <div className={`
                                        flex items-center justify-center w-4 h-4 rounded-full text-xs
                                        ${isActive ? 'bg-white/20 text-white' : 'bg-green-100 text-green-600'}
                                    `}>
                                        <HiCheck className="w-3 h-3" />
                                    </div>
                                )}
                                
                                {/* Tab number */}
                                <span className={`
                                    flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold
                                    ${isActive 
                                        ? 'bg-white/20 text-white' 
                                        : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                                    }
                                `}>
                                    {index + 1}
                                </span>
                                
                                {/* Tab label */}
                                <span className="whitespace-nowrap">
                                    {tab}
                                </span>
                            </div>
                            
                            {/* Active tab indicator line */}
                            {isActive && (
                                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-white rounded-t-full"></div>
                            )}
                            
                            {/* Hover effect for inactive tabs */}
                            {!isActive && (
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                            )}
                        </Link>
                    );
                })}
            </div>
            
            {/* Progress indicator */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-200 rounded-full mx-4">
                <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500 ease-out"
                    style={{ 
                        width: `${((tabs.indexOf(activeTab) + 1) / tabs.length) * 100}%` 
                    }}
                ></div>
            </div>
            
            {/* Mobile scroll indicators */}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-8 h-full bg-gradient-to-r from-white to-transparent pointer-events-none md:hidden"></div>
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-8 h-full bg-gradient-to-l from-white to-transparent pointer-events-none md:hidden"></div>
        </div>
    );
};

export default Tabs;
