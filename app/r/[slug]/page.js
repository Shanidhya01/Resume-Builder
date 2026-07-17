import { cache } from 'react';
import { notFound } from 'next/navigation';
import { resolvePublicResumeBySlug } from '@/lib/publicResumes.server';
import PublicResumeView from '@/components/Resume/PublicResumeView';
import PublicResumeActions from '@/components/Resume/PublicResumeActions';
import ViewTracker from '@/components/Resume/ViewTracker';

// Admin SDK requires the Node.js runtime (not Edge) and a per-request read.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// Deduplicated per-request: generateMetadata and the page component both
// need the same resume, and React's cache() ensures that's a single
// Firestore read, not two.
//
// Distinguishes three outcomes the callers MUST treat differently:
//   { resume }            → found & public
//   { resume: null }      → slug/resume genuinely absent or private  → 404
//   { error: true }       → the read itself failed (transient DB/transport)
// Previously a failed read threw straight out of generateMetadata / the page,
// collapsing the whole route into a hard 500 — so an intermittent server-side
// Firestore hiccup looked to users like "sharing is broken." We now surface a
// retryable "temporarily unavailable" state instead of crashing.
const getResumeForSlug = cache(async slug => {
    try {
        const resume = await resolvePublicResumeBySlug(slug);
        return { resume };
    } catch (err) {
        console.error(`[/r/${slug}] resolvePublicResumeBySlug failed:`, err);
        return { error: true, resume: null };
    }
});

const toAbsoluteUrl = value => {
    if (!value) return null;
    return /^https?:\/\//i.test(value) ? value : `https://${value}`;
};

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const { resume } = await getResumeForSlug(slug);

    if (!resume) {
        // Covers both "not found" and "temporarily unavailable": in neither case
        // do we have content to describe, and we must never let a failed read
        // throw out of generateMetadata (that alone would 500 the whole page).
        return {
            title: 'Resume | HireReady',
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
    const { resume, error } = await getResumeForSlug(slug);

    // Transient read failure: render a retryable state instead of a hard 500.
    // The anchor points back at the same URL, so "Try again" is a full reload
    // that re-runs the server read — the failure is almost always momentary.
    if (error) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-canvas px-4 text-center">
                <h1 className="text-xl font-semibold text-fg">This resume is temporarily unavailable</h1>
                <p className="max-w-md text-sm text-fg-muted">
                    We couldn&apos;t reach the database just now. This is usually momentary — please try again.
                </p>
                <a
                    href={`/r/${slug}`}
                    className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-fg hover:bg-accent-hover"
                >
                    Try again
                </a>
            </div>
        );
    }

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
        <div className="relative min-h-screen overflow-hidden bg-canvas px-4 py-10 print:bg-white print:px-0 print:py-0 sm:px-6">
            <div className="bg-grid pointer-events-none absolute inset-0 opacity-40 print:hidden" aria-hidden="true" />
            <div
                className="pointer-events-none absolute left-1/2 top-0 h-96 w-[42rem] -translate-x-1/2 rounded-full opacity-15 blur-3xl print:hidden"
                style={{ background: 'radial-gradient(circle, rgb(var(--accent)) 0%, transparent 70%)' }}
                aria-hidden="true"
            />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <ViewTracker slug={slug} />
            <div className="relative">
                <PublicResumeView resume={resume} />
                <PublicResumeActions resume={resume} slug={slug} publicUrl={url} />
                <p className="mt-8 text-center text-xs text-fg-subtle print:hidden">
                    Built with <span className="font-semibold text-accent">HireReady</span>
                </p>
            </div>
        </div>
    );
}
