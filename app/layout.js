import Header from '@/components/Header';

import './globals.scss';
import ReduxProvider from '@/store/ReduxProvider';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
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
        <html lang="en">
            <body>
                <AuthProvider>
                    <ReduxProvider>
                        <ToastProvider>
                            <Header />
                            <div className="mx-auto  min-h-[calc(100vh-3rem)]">{children}</div>
                        </ToastProvider>
                    </ReduxProvider>
                </AuthProvider>
                <GoogleAnalytics gaId='G-WPXWXJ9MC2' />
            </body>
        </html>
    );
}
