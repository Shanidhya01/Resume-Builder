import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import Header from '@/components/Header';

import './globals.scss';
import ReduxProvider from '@/store/ReduxProvider';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { ThemeProvider } from '@/context/ThemeProvider';
import OfflineBanner from '@/components/UI/OfflineBanner';
import {GoogleAnalytics} from '@next/third-parties/google'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata = {
    metadataBase: new URL(SITE_URL),
    title: 'Free Resume Maker | HireReady',
    description:
        'Our tool helps you create a resume that works with job application systems. It makes sure you look good to employers.',
    openGraph: {
        title: 'HireReady - Free Resume Builder',
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
        <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
            <body>
                <ThemeProvider>
                    <AuthProvider>
                        <ReduxProvider>
                            <ToastProvider>
                                <a href="#main-content" className="skip-link">
                                    Skip to content
                                </a>
                                <OfflineBanner />
                                <Header />
                                <main id="main-content" className="mx-auto min-h-[calc(100vh-3rem)]">
                                    {children}
                                </main>
                            </ToastProvider>
                        </ReduxProvider>
                    </AuthProvider>
                </ThemeProvider>
                <GoogleAnalytics gaId='G-WPXWXJ9MC2' />
            </body>
        </html>
    );
}
