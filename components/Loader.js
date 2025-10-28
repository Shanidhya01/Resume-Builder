import { CgSpinner } from 'react-icons/cg';

const Loader = () => {
    return (
        <div className="relative flex min-h-[calc(100vh-6rem)] items-center justify-center overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute inset-0 z-0 animate-gradient-xy bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 opacity-40 blur-xl"></div>
            {/* Glowing spinner */}
            <div className="relative z-10 flex flex-col items-center">
                <div className="relative">
                    <CgSpinner className="text-6xl md:text-7xl animate-spin text-primary-400 drop-shadow-lg" />
                    <div className="absolute inset-0 rounded-full blur-2xl opacity-40 bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 animate-pulse"></div>
                </div>
                <span className="mt-8 text-lg md:text-xl font-semibold text-primary-300 animate-pulse tracking-wide drop-shadow">Loading, please wait...</span>
            </div>
        </div>
    );
};

export default Loader;
