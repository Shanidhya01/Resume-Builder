import Link from 'next/link';
import ImgTilt from './ImgTilt';
import { FaGithub, FaRocket, FaFileAlt, FaDownload, FaUsers } from 'react-icons/fa';
import { IoIosRocket, IoMdCheckmarkCircle } from 'react-icons/io';
import { HiSparkles, HiLightningBolt } from 'react-icons/hi';

const page = () => {
    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Gradient orbs */}
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
                
                {/* Floating particles */}
                <div className="absolute inset-0">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-2 h-2 bg-white/10 rounded-full animate-float"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`,
                                animationDuration: `${3 + Math.random() * 4}s`
                            }}
                        ></div>
                    ))}
                </div>
            </div>

            <div className="relative z-10 mx-auto flex h-full min-h-[calc(100vh-5rem)] max-w-7xl flex-col-reverse items-center justify-center gap-12 px-6 py-12 text-center lg:flex-row lg:justify-between lg:text-left lg:gap-20">
                
                {/* Content Section */}
                <div className="flex-1 space-y-8 lg:space-y-10">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-sm font-medium text-white/90 animate-fade-in-up">
                        <HiSparkles className="w-4 h-4 text-yellow-400" />
                        <span>Free & Open Source</span>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    </div>

                    {/* Main Heading */}
                    <div className="space-y-4 animate-fade-in-up animation-delay-200">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight tracking-tight">
                            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient-x">
                                Resume Building
                            </span>
                            <br />
                            <span className="text-white drop-shadow-2xl">
                                Made <span className="relative">
                                    Simple

                                </span>
                            </span>
                        </h1>
                        
                        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-slate-300 max-w-2xl">
                            Create professional, ATS-friendly resumes in minutes
                        </h2>
                    </div>
                    
                    {/* Description */}
                    <p className="text-base lg:text-lg text-slate-400 leading-relaxed max-w-2xl animate-fade-in-up animation-delay-400">
                        HireReady is a powerful, free resume builder designed to help you create stunning, 
                        professional resumes without any hassle. No sign-up required, no hidden fees - 
                        just beautiful resumes ready for download.
                    </p>

                    {/* Features List */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl text-left animate-fade-in-up animation-delay-600">
                        {[
                            "ATS-Friendly Templates",
                            "Instant PDF Export", 
                            "No Registration Required",
                            "100% Free Forever"
                        ].map((feature, index) => (
                            <div key={index} className="flex items-center gap-3 text-slate-300">
                                <IoMdCheckmarkCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                                <span className="font-medium">{feature}</span>
                            </div>
                        ))}
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up animation-delay-800">
                        <Link 
                            href={'/editor'} 
                            className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 hover:-translate-y-1 overflow-hidden"
                        >
                            <span className="absolute inset-0 w-0 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500 ease-out group-hover:w-full"></span>
                            <IoIosRocket className="relative w-5 h-5 transition-transform group-hover:rotate-12 group-hover:scale-110" />
                            <span className="relative text-lg">Start Building Now</span>
                            <HiLightningBolt className="relative w-5 h-5 text-yellow-300 animate-pulse" />
                        </Link>

                        <a 
                            href="https://github.com/Shanidhya01/Resume-Builder" 
                            className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/20 text-slate-200 font-semibold rounded-2xl shadow-lg transition-all duration-300 hover:bg-white/10 hover:border-white/30 hover:shadow-xl hover:scale-105 hover:-translate-y-1"
                        >
                            <FaGithub className="w-5 h-5 transition-transform group-hover:rotate-12" />
                            <span>View Source</span>
                        </a>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-center lg:justify-start gap-8 pt-8 animate-fade-in-up animation-delay-1000">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white">10K+</div>
                            <div className="text-sm text-slate-400">Resumes Created</div>
                        </div>
                        <div className="w-px h-12 bg-slate-600"></div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white">100%</div>
                            <div className="text-sm text-slate-400">ATS Compatible</div>
                        </div>
                        <div className="w-px h-12 bg-slate-600"></div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white">Free</div>
                            <div className="text-sm text-slate-400">Forever</div>
                        </div>
                    </div>
                </div>
                
                {/* Image Section */}
                <div className="flex-1 max-w-lg w-full animate-fade-in-up animation-delay-400">
                    <ImgTilt>
                        <div className="relative group">
                            {/* Glow effect */}
                            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity duration-500"></div>
                            
                            {/* Main image container */}
                            <div className="relative overflow-hidden rounded-3xl shadow-2xl shadow-black/50 bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                                <img 
                                    src="/sample.png" 
                                    alt="Professional Resume Sample"
                                    className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
                                />
                                
                                {/* Floating action badge */}
                                <div className="absolute top-4 right-4 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg animate-bounce">
                                    Live Preview
                                </div>
                            </div>
                        </div>
                    </ImgTilt>
                </div>
            </div>

            {/* Bottom gradient fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent"></div>
        </div>
    );
};

export default page;