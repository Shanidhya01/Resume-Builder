'use client';

import { useState } from 'react';
import { FaShareAlt, FaCopy, FaChartBar } from 'react-icons/fa';
import dynamic from 'next/dynamic';
import { useToast } from '@/context/ToastContext';
import { publishResume, unpublishResume, regenerateSlug, setCustomSlug } from '@/lib/publicResumes';

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

    const publicUrl = resume.isPublic && resume.slug ? `${siteOrigin()}/r/${resume.slug}` : null;

    const handlePublish = async () => {
        const slug = await publishResume(resume.id, uid);
        onUpdate(resume.id, { isPublic: true, slug });
        return slug;
    };

    const handleUnpublish = async () => {
        await unpublishResume(resume.id, uid);
        onUpdate(resume.id, { isPublic: false });
    };

    const handleRegenerateSlug = async () => {
        const slug = await regenerateSlug(resume.id, uid);
        onUpdate(resume.id, { slug, customSlug: null, isPublic: true });
        return slug;
    };

    const handleSetCustomSlug = async desired => {
        const result = await setCustomSlug(resume.id, uid, desired);
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
                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        resume.isPublic ? 'bg-green-500/15 text-green-300' : 'bg-slate-500/15 text-slate-400'
                    }`}
                >
                    {resume.isPublic ? 'Public' : 'Private'}
                </span>

                {publicUrl && (
                    <button
                        type="button"
                        onClick={handleQuickCopy}
                        title="Copy public link"
                        aria-label="Copy public link"
                        className="rounded-lg border border-purple-500/20 p-1.5 text-slate-300 transition-colors hover:bg-purple-500/10 hover:text-white"
                    >
                        <FaCopy className="h-3 w-3" />
                    </button>
                )}

                <button
                    type="button"
                    onClick={() => setShareOpen(true)}
                    title="Share resume"
                    aria-label="Share resume"
                    className="rounded-lg border border-purple-500/20 p-1.5 text-slate-300 transition-colors hover:bg-purple-500/10 hover:text-white"
                >
                    <FaShareAlt className="h-3 w-3" />
                </button>

                {resume.isPublic && (
                    <button
                        type="button"
                        onClick={() => setAnalyticsOpen(true)}
                        title="View analytics"
                        aria-label="View sharing analytics"
                        className="rounded-lg border border-purple-500/20 p-1.5 text-slate-300 transition-colors hover:bg-purple-500/10 hover:text-white"
                    >
                        <FaChartBar className="h-3 w-3" />
                    </button>
                )}
            </div>

            {shareOpen && (
                <ShareDialog
                    resumeName={resume.name}
                    publicUrl={publicUrl}
                    owner={{
                        isPublic: !!resume.isPublic,
                        slug: resume.slug || null,
                        customSlug: resume.customSlug || null,
                        onPublish: handlePublish,
                        onUnpublish: handleUnpublish,
                        onRegenerateSlug: handleRegenerateSlug,
                        onSetCustomSlug: handleSetCustomSlug,
                    }}
                    onClose={() => setShareOpen(false)}
                />
            )}

            {analyticsOpen && <AnalyticsPanel resumeId={resume.id} uid={uid} onClose={() => setAnalyticsOpen(false)} />}
        </>
    );
};

export default SharePanel;
