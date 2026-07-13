import { cache } from 'react';
import { notFound } from 'next/navigation';
import { resolvePublicResumeBySlug } from '@/lib/publicResumes';
import PublicResumeView from '@/components/Resume/PublicResumeView';
import PublicResumeActions from '@/components/Resume/PublicResumeActions';
import ViewTracker from '@/components/Resume/ViewTracker';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// Deduplicated per-request: generateMetadata and the page component both
// need the same resume, and React's cache() ensures that's a single
// Firestore read, not two.
const getResumeForSlug = cache(async slug => resolvePublicResumeBySlug(slug));

const toAbsoluteUrl = value => {
    if (!value) return null;
    return /^https?:\/\//i.test(value) ? value : `https://${value}`;
};

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const resume = await getResumeForSlug(slug);

    if (!resume) {
        return {
            title: 'Resume not found | HireReady',
            robots: { index: false, follow: false },
        };
    }

    const name = resume.contact?.name || resume.name || 'Resume';
    const title = resume.contact?.title ? `${name} — ${resume.contact.title}` : `${name}'s Resume`;
    const description = (
        resume.summary?.summary?.trim() || `View ${name}'s professional resume, built with HireReady.`
    ).slice(0, 160);
    const url = `${SITE_URL}/r/${slug}`;

    return {
        title: `${title} | HireReady`,
        description,
        alternates: { canonical: url },
        robots: { index: true, follow: true },
        openGraph: {
            type: 'profile',
            title,
            description,
            url,
            siteName: 'HireReady',
            images: ['/banner.png'],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: ['/banner.png'],
        },
    };
}

export default async function PublicResumePage({ params }) {
    const { slug } = await params;
    const resume = await getResumeForSlug(slug);

    if (!resume) notFound();

    const name = resume.contact?.name || resume.name || 'Resume';
    const url = `${SITE_URL}/r/${slug}`;

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name,
        ...(resume.contact?.title ? { jobTitle: resume.contact.title } : {}),
        ...(resume.summary?.summary ? { description: resume.summary.summary } : {}),
        url,
        sameAs: [resume.contact?.linkedin, resume.contact?.github, resume.contact?.twitter, resume.contact?.portfolio]
            .filter(Boolean)
            .map(toAbsoluteUrl),
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/40 to-slate-950 px-4 py-10 print:bg-white print:px-0 print:py-0 sm:px-6">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <ViewTracker slug={slug} />
            <PublicResumeView resume={resume} />
            <PublicResumeActions resume={resume} slug={slug} publicUrl={url} />
            <p className="mt-8 text-center text-xs text-slate-500 print:hidden">
                Built with <span className="font-semibold text-purple-300">HireReady</span>
            </p>
        </div>
    );
}
