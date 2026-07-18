'use client';

import { useState } from 'react';
import { FaShareAlt, FaCopy, FaChartBar } from 'react-icons/fa';
import dynamic from 'next/dynamic';
import { useToast } from '@/context/ToastContext';
import { publishResume, unpublishResume, regenerateSlug, setCustomSlug } from '@/lib/publicResumes';
import { buildPublicSlugPath } from '@/lib/publicSlug';
import { withFirestoreRetry } from '@/lib/firestoreErrors';
import { getTemplateById } from '@/config/templates';

const ShareDialog = dynamic(() => import('./ShareDialog'), { ssr: false });
const AnalyticsPanel = dynamic(() => import('./AnalyticsPanel'), { ssr: false });

const siteOrigin = () => (typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_SITE_URL || ''));

// Public-sharing controls for a single resume: Public/Private badge, quick
// copy-link, and entry points into the full Share and Analytics dialogs.
// Mounted inside ResumeCard; owns no resume state itself — every mutation
// goes through lib/publicResumes.js and is reported back via onUpdate so the
// dashboard's in-memory resume list stays in sync without a full refetch.
const SharePanel = ({ resume, uid, onUpdate }) => {
    const { showToast } = useToast();
    const [shareOpen, setShareOpen] = useState(false);
    const [analyticsOpen, setAnalyticsOpen] = useState(false);

    const publicUrl = resume.isPublic && resume.slug
        ? `${siteOrigin()}/r/${buildPublicSlugPath(resume, resume.slug)}`
        : null;

    // Each mutation retries once on a transient connectivity error before it
    // surfaces. onUpdate runs only after the Firestore write resolves, so a
    // failure leaves the dashboard's Public/Private state untouched (consistent).
    const handlePublish = async () => {
        const slug = await withFirestoreRetry(() => publishResume(resume.id, uid));
        onUpdate(resume.id, { isPublic: true, slug });
        return slug;
    };

    const handleUnpublish = async () => {
        await withFirestoreRetry(() => unpublishResume(resume.id, uid));
        onUpdate(resume.id, { isPublic: false });
    };

    const handleRegenerateSlug = async () => {
        const slug = await withFirestoreRetry(() => regenerateSlug(resume.id, uid));
        onUpdate(resume.id, { slug, customSlug: null, isPublic: true });
        return slug;
    };

    const handleSetCustomSlug = async desired => {
        const result = await withFirestoreRetry(() => setCustomSlug(resume.id, uid, desired));
        onUpdate(resume.id, { slug: result.slug, customSlug: result.isCustom ? result.slug : null, isPublic: true });
        return result;
    };

    const handleQuickCopy = async () => {
        if (!publicUrl) return;
        try {
            await navigator.clipboard.writeText(publicUrl);
            showToast('Link copied to clipboard.', { tone: 'success' });
        } catch {
            showToast('Could not copy the link.', { tone: 'error' });
        }
    };

    return (
        <>
            <div className="flex items-center gap-1.5">
                <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        resume.isPublic
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                            : 'bg-surface-2 text-fg-muted'
                    }`}
                >
                    <span className={`h-1.5 w-1.5 rounded-full ${resume.isPublic ? 'bg-emerald-500' : 'bg-fg-subtle'}`} />
                    {resume.isPublic ? 'Public' : 'Private'}
                </span>

                {publicUrl && (
                    <button
                        type="button"
                        onClick={handleQuickCopy}
                        title="Copy public link"
                        aria-label="Copy public link"
                        className="rounded-lg border border-line p-1.5 text-fg-muted transition-colors hover:border-accent/40 hover:bg-accent/10 hover:text-accent"
                    >
                        <FaCopy className="h-3 w-3" />
                    </button>
                )}

                <button
                    type="button"
                    onClick={() => setShareOpen(true)}
                    title="Share resume"
                    aria-label="Share resume"
                    className="rounded-lg border border-line p-1.5 text-fg-muted transition-colors hover:border-accent/40 hover:bg-accent/10 hover:text-accent"
                >
                    <FaShareAlt className="h-3 w-3" />
                </button>

                {resume.isPublic && (
                    <button
                        type="button"
                        onClick={() => setAnalyticsOpen(true)}
                        title="View analytics"
                        aria-label="View sharing analytics"
                        className="rounded-lg border border-line p-1.5 text-fg-muted transition-colors hover:border-accent/40 hover:bg-accent/10 hover:text-accent"
                    >
                        <FaChartBar className="h-3 w-3" />
                    </button>
                )}
            </div>

            {shareOpen && (
                <ShareDialog
                    resumeName={resume.name}
                    publicUrl={publicUrl}
                    resumeId={resume.id}
                    uid={uid}
                    template={getTemplateById(resume.selectedTemplate)}
                    owner={{
                        isPublic: !!resume.isPublic,
                        slug: resume.slug || null,
                        customSlug: resume.customSlug || null,
                        updatedPublicAt: resume.updatedPublicAt || null,
                        onPublish: handlePublish,
                        onUnpublish: handleUnpublish,
                        onRegenerateSlug: handleRegenerateSlug,
                        onSetCustomSlug: handleSetCustomSlug,
                    }}
                    onClose={() => setShareOpen(false)}
                    onOpenAnalytics={() => {
                        setShareOpen(false);
                        setAnalyticsOpen(true);
                    }}
                />
            )}

            {analyticsOpen && <AnalyticsPanel resumeId={resume.id} uid={uid} onClose={() => setAnalyticsOpen(false)} />}
        </>
    );
};

export default SharePanel;
