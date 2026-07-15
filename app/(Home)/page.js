import Hero from '@/components/Landing/Hero';
import SocialProof from '@/components/Landing/SocialProof';
import Features from '@/components/Landing/Features';
import InteractiveDemo from '@/components/Landing/InteractiveDemo';
import HowItWorks from '@/components/Landing/HowItWorks';
import TemplateShowcase from '@/components/Landing/TemplateShowcase';
import AtsShowcase from '@/components/Landing/AtsShowcase';
import AiShowcase from '@/components/Landing/AiShowcase';
import SharingShowcase from '@/components/Landing/SharingShowcase';
import Testimonials from '@/components/Landing/Testimonials';
import Faq from '@/components/Landing/Faq';
import FinalCta from '@/components/Landing/FinalCta';
import Footer from '@/components/Landing/Footer';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata = {
    title: 'HireReady — Free AI Resume Builder with ATS Scoring',
    description:
        'Build ATS-optimized resumes with an AI writing assistant, real-time scoring, premium templates, and one-click public sharing. Free and open source.',
    keywords: ['resume builder', 'ATS resume', 'AI resume', 'free resume maker', 'CV builder', 'resume templates'],
    alternates: { canonical: '/' },
    openGraph: {
        type: 'website',
        url: SITE_URL,
        siteName: 'HireReady',
        title: 'HireReady — Free AI Resume Builder with ATS Scoring',
        description:
            'AI writing assistant, real-time ATS scoring, premium templates, and public sharing — free and open source.',
        images: [{ url: '/banner.png', width: 1200, height: 630, alt: 'HireReady resume builder' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'HireReady — Free AI Resume Builder with ATS Scoring',
        description: 'AI writing assistant, real-time ATS scoring, premium templates, and public sharing. Free & open source.',
        images: ['/banner.png'],
    },
};

const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'HireReady',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description:
        'Free AI resume builder with real-time ATS scoring, premium templates, import/export, and public sharing.',
    url: SITE_URL,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', ratingCount: '1280' },
};

export default function HomePage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            <div className="flex flex-col">
                <Hero />
                <SocialProof />
                <Features />
                <InteractiveDemo />
                <HowItWorks />
                <TemplateShowcase />
                <AtsShowcase />
                <AiShowcase />
                <SharingShowcase />
                <Testimonials />
                <Faq />
                <FinalCta />
                <Footer />
            </div>
        </>
    );
}
