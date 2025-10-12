import { CgSpinner } from 'react-icons/cg';
import { HiSparkles } from 'react-icons/hi';

const Loader = () => {
    return (
        <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-400/5 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
            </div>

            {/* Main loader container */}
            <div className="relative z-10 text-center space-y-6">
                {/* Animated loader with glow effect */}
                <div className="relative inline-block">
                    {/* Outer glow ring */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 blur-2xl opacity-30 animate-pulse scale-150"></div>
                    
                    {/* Secondary spinner ring */}
                    <div className="absolute inset-0 w-20 h-20 md:w-24 md:h-24 border-4 border-blue-200 rounded-full animate-spin-slow opacity-40"></div>
                    
                    {/* Main spinner */}
                    <div className="relative">
                        <CgSpinner className="text-5xl md:text-6xl animate-spin text-blue-600 drop-shadow-lg" />
                    </div>
                    
                    {/* Inner pulse effect */}
                    <div className="absolute inset-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 animate-ping"></div>
                </div>

                {/* Loading text with animation */}
                <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2">
                        <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-slate-700 to-slate-500 bg-clip-text text-transparent">
                            Loading
                        </h2>
                        <HiSparkles className="w-5 h-5 text-yellow-500 animate-pulse" />
                    </div>
                    
                    <p className="text-slate-600 font-medium animate-pulse">
                        Please wait while we prepare everything for you...
                    </p>
                    
                    {/* Animated dots */}
                    <div className="flex justify-center space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce animation-delay-200"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce animation-delay-400"></div>
                    </div>
                </div>

                {/* Progress bar animation */}
                <div className="w-64 mx-auto bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-loading-bar"></div>
                </div>
            </div>

            {/* Floating particles */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-blue-400/40 rounded-full animate-float"
                        style={{
                            left: `${20 + (i * 10)}%`,
                            top: `${30 + (i * 5)}%`,
                            animationDelay: `${i * 0.5}s`,
                            animationDuration: `${3 + (i * 0.2)}s`
                        }}
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default Loader;
