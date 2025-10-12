import Header from '@/components/Header';
import './globals.scss';
import ReduxProvider from '@/store/ReduxProvider';
import { GoogleAnalytics } from '@next/third-parties/google';

export const metadata = {
    metadataBase: 'http://localhost:3000',
    title: 'Free Resume Maker | HireReady',
    description:
        'Our tool helps you create a resume that works with job application systems. It makes sure you look good to employers.',
    openGraph: {
        title: 'HireReady – resumes that get you hired',
        images: `/banner.png`,
        icons: {
            icon: `/favicon.png`,
        },
        type: 'website',
    },
    alternates: {
        canonical: '/',
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className="scroll-smooth">
            <body className="relative overflow-x-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white antialiased">
                {/* Background decorative elements */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    {/* Animated gradient orbs */}
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
                    
                    {/* Subtle grid pattern */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
                    
                    {/* Floating particles */}
                    <div className="absolute inset-0">
                        {[...Array(15)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                    animationDelay: `${Math.random() * 5}s`,
                                    animationDuration: `${3 + Math.random() * 4}s`
                                }}
                            ></div>
                        ))}
                    </div>
                    
                    {/* Radial gradient overlay */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.1),transparent_50%)]"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(168,85,247,0.1),transparent_50%)]"></div>
                </div>

                <ReduxProvider>
                    {/* Enhanced header wrapper */}
                    <div className="relative z-50">
                        <Header />
                    </div>
                    
                    {/* Enhanced main content wrapper */}
                    <div className="relative z-10">
                        <div className="mx-auto min-h-[calc(100vh-5rem)] relative">
                            {/* Content background with glass effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-white/[0.01] backdrop-blur-[0.5px]"></div>
                            
                            {/* Main content */}
                            <div className="relative z-10">
                                {children}
                            </div>
                            
                            {/* Subtle border effects */}
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
                        </div>
                    </div>

                    {/* Enhanced bottom fade */}
                    <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900/50 to-transparent pointer-events-none z-20"></div>
                </ReduxProvider>
                
                <GoogleAnalytics gaId='G-WPXWXJ9MC2' />
                
                {/* Custom cursor effect (optional) */}
                <div id="cursor-glow" className="fixed w-6 h-6 bg-blue-500/20 rounded-full blur-xl pointer-events-none z-50 transition-all duration-300 ease-out hidden lg:block"></div>
            </body>
        </html>
    );
}
