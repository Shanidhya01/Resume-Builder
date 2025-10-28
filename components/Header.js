'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FaGithub, FaFileAlt, FaDownload } from 'react-icons/fa';
import { HiMenuAlt3, HiX, HiSparkles } from 'react-icons/hi';
import { IoIosRocket } from 'react-icons/io';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { href: '/', label: 'Home', icon: null },
        { href: '/editor', label: 'Editor', icon: FaFileAlt },
        // { href: '/templates', label: 'Templates', icon: null },
        { href: '/about', label: 'About', icon: null },
    ];

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled 
                    ? 'bg-gradient-to-br from-purple-900/80 via-slate-900/90 to-blue-900/80 backdrop-blur-xl border-b border-purple-400/30 shadow-2xl shadow-purple-900/20' 
                    : 'bg-slate-900/40 backdrop-blur-md'
            }`}>
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    {/* Logo */}
                    <Link 
                        href={'/'} 
                        className="group flex items-center gap-2 text-2xl font-bold transition-all duration-300 hover:scale-105"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-lg blur-xl opacity-40 group-hover:opacity-70 transition-opacity"></div>
                            <div className="relative bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 p-2 rounded-lg shadow-lg">
                                <IoIosRocket className="w-6 h-6 text-white transform group-hover:rotate-12 transition-transform" />
                            </div>
                        </div>
                        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-black tracking-tight">
                            HireReady
                        </span>
                        <HiSparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-1">
                        {navLinks.map((link, index) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={index}
                                    href={link.href}
                                    className={`group relative px-4 py-2 font-medium transition-all duration-300 rounded-xl ${
                                        isActive 
                                            ? 'text-white bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 shadow-lg shadow-purple-500/20' 
                                            : 'text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-500/10 hover:via-purple-500/10 hover:to-pink-500/10'
                                    }`}
                                >
                                    <span className="flex items-center gap-2">
                                        {link.icon && <link.icon className="w-4 h-4" />}
                                        {link.label}
                                    </span>
                                    <span className={`absolute bottom-0 h-0.5 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 transition-all duration-300 rounded-full ${
                                        isActive 
                                            ? 'w-full left-0 shadow-lg shadow-purple-400/50' 
                                            : 'w-0 left-1/2 group-hover:w-full group-hover:left-0'
                                    }`}></span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Desktop CTA Buttons */}
                    <div className="hidden md:flex items-center space-x-3">
                        <a
                            href="https://github.com/Shanidhya01/Resume-Builder"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-2 px-4 py-2 text-slate-300 font-medium transition-all duration-300 hover:text-white hover:bg-gradient-to-r hover:from-slate-800/50 hover:via-purple-800/30 hover:to-slate-800/50 rounded-xl border border-transparent hover:border-purple-500/20"
                        >
                            <FaGithub className="w-4 h-4 transition-transform group-hover:rotate-12" />
                            <span className="hidden lg:inline">GitHub</span>
                        </a>
                        
                        <Link
                            href="/editor"
                            className="group relative flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg shadow-purple-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/60 hover:scale-110 overflow-hidden animate-gradient-x bg-[length:200%_auto]"
                        >
                            <span className="absolute inset-0 w-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 transition-all duration-500 ease-out group-hover:w-full"></span>
                            <div className="relative flex items-center gap-2">
                                <span className="absolute -left-1 w-6 h-6 bg-white rounded-full blur-md opacity-0 group-hover:opacity-60 transition-all duration-300"></span>
                                <IoIosRocket className="relative w-5 h-5 group-hover:animate-shake" />
                            </div>
                            <span className="relative">Get Started</span>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300"
                    >
                        {isMobileMenuOpen ? (
                            <HiX className="w-6 h-6" />
                        ) : (
                            <HiMenuAlt3 className="w-6 h-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Navigation */}
                <div className={`md:hidden transition-all duration-300 ease-in-out ${
                    isMobileMenuOpen 
                        ? 'max-h-96 opacity-100' 
                        : 'max-h-0 opacity-0 overflow-hidden'
                }`}>
                    <div className="px-6 py-4 bg-gradient-to-br from-slate-900/95 via-purple-900/80 to-slate-900/95 backdrop-blur-lg border-t border-purple-500/20">
                        <nav className="flex flex-col space-y-2">
                            {navLinks.map((link, index) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={index}
                                        href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`group flex items-center gap-3 px-4 py-3 font-medium transition-all duration-300 rounded-xl ${
                                            isActive 
                                                ? 'text-white bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 border border-purple-500/40 shadow-lg shadow-purple-500/20' 
                                                : 'text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-500/10 hover:via-purple-500/10 hover:to-pink-500/10'
                                        }`}
                                    >
                                        {link.icon && <link.icon className="w-5 h-5" />}
                                        <span>{link.label}</span>
                                        {isActive && (
                                            <div className="ml-auto w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse shadow-lg shadow-purple-400/50"></div>
                                        )}
                                    </Link>
                                );
                            })}
                            
                            <div className="pt-4 border-t border-purple-500/20 space-y-2">
                                <a
                                    href="https://github.com/Shanidhya01/Resume-Builder"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 px-4 py-3 text-slate-300 font-medium transition-all duration-300 hover:text-white hover:bg-gradient-to-r hover:from-slate-800/50 hover:via-purple-800/30 hover:to-slate-800/50 rounded-xl border border-transparent hover:border-purple-500/20"
                                >
                                    <FaGithub className="w-5 h-5" />
                                    <span>View Source</span>
                                </a>
                                
                                <Link
                                    href="/editor"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg shadow-purple-500/40 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-purple-500/60"
                                >
                                    <IoIosRocket className="w-5 h-5" />
                                    <span>Get Started</span>
                                </Link>
                            </div>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Spacer to prevent content overlap */}
            <div className="h-20"></div>
        </>
    );
};

export default Header;