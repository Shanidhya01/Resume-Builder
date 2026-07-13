'use client';

import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import {
    FaCopy, FaExternalLinkAlt, FaLinkedin, FaEnvelope, FaShareAlt, FaToggleOn, FaToggleOff, FaSync, FaCheck,
} from 'react-icons/fa';
import { FaXmark, FaXTwitter } from 'react-icons/fa6';
import { useToast } from '@/context/ToastContext';
import { validateCustomSlug } from '@/lib/publicResumes';
import { ChartSkeleton } from '@/components/Ats/Skeleton';
import useModalA11y from '@/hooks/useModalA11y';

// QR generation is lazy-loaded — it pulls in the `qrcode` library and is
// only ever needed once a user opens the dialog and the resume is public.
const QRCodeBlock = dynamic(() => import('./QRCodeBlock'), { ssr: false, loading: () => <ChartSkeleton height={216} /> });

const ShareDialog = ({ resumeName = 'Resume', publicUrl, owner, onClose }) => {
    const { showToast } = useToast();
    const dialogRef = useRef(null);
    const closeButtonRef = useRef(null);
    const [slugInput, setSlugInput] = useState(owner?.customSlug || owner?.slug || '');
    const [slugBusy, setSlugBusy] = useState(false);

    useModalA11y({ containerRef: dialogRef, initialFocusRef: closeButtonRef, onClose });

    const shareText = `Check out ${resumeName}'s resume`;

    const handleCopy = async () => {
        if (!publicUrl) return;
        try {
            await navigator.clipboard.writeText(publicUrl);
            showToast('Link copied to clipboard.', { tone: 'success' });
            fetch('/api/public/share', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug: owner?.slug || publicUrl.split('/r/')[1], channel: 'copy' }) }).catch(() => {});
        } catch {
            showToast('Could not copy the link.', { tone: 'error' });
        }
    };

    const handleNativeShare = async () => {
        if (!publicUrl || !navigator.share) return;
        try {
            await navigator.share({ title: shareText, url: publicUrl });
        } catch {
            // User cancelled — not an error.
        }
    };

    const handleSlugSubmit = async e => {
        e.preventDefault();
        if (!owner) return;
        const trimmed = slugInput.trim().toLowerCase();
        const formatError = validateCustomSlug(trimmed);
        if (formatError) {
            showToast(formatError, { tone: 'error' });
            return;
        }
        setSlugBusy(true);
        try {
            const result = await owner.onSetCustomSlug(trimmed);
            if (result.isCustom) {
                showToast(`Your resume is now live at /r/${result.slug}`, { tone: 'success' });
            } else {
                showToast(`"${result.requested}" was taken — assigned /r/${result.slug} instead.`, { tone: 'info' });
            }
            setSlugInput(result.slug);
        } catch (err) {
            showToast(err.message || 'Could not set custom URL.', { tone: 'error' });
        } finally {
            setSlugBusy(false);
        }
    };

    const handleRegenerate = async () => {
        if (!owner) return;
        setSlugBusy(true);
        try {
            const slug = await owner.onRegenerateSlug();
            setSlugInput(slug);
            showToast('Generated a new share link.', { tone: 'success' });
        } catch (err) {
            showToast(err.message || 'Could not regenerate the link.', { tone: 'error' });
        } finally {
            setSlugBusy(false);
        }
    };

    const handleTogglePublic = async () => {
        if (!owner) return;
        setSlugBusy(true);
        try {
            if (owner.isPublic) {
                await owner.onUnpublish();
                showToast('Sharing disabled. Your public link no longer works.', { tone: 'info' });
            } else {
                const slug = await owner.onPublish();
                setSlugInput(slug);
                showToast('Sharing enabled!', { tone: 'success' });
            }
        } catch (err) {
            showToast(err.message || 'Could not update sharing status.', { tone: 'error' });
        } finally {
            setSlugBusy(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
            onMouseDown={e => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="share-dialog-title"
                className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-purple-500/30 bg-slate-900 p-6 shadow-2xl"
            >
                <div className="mb-5 flex items-center justify-between">
                    <h2 id="share-dialog-title" className="flex items-center gap-2 text-lg font-bold text-white">
                        <FaShareAlt className="h-4 w-4 text-purple-400" aria-hidden="true" /> Share Resume
                    </h2>
                    <button
                        ref={closeButtonRef}
                        type="button"
                        onClick={onClose}
                        aria-label="Close share dialog"
                        className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                    >
                        <FaXmark className="h-4 w-4" />
                    </button>
                </div>

                {owner && (
                    <div className="mb-5 rounded-xl border border-purple-500/20 bg-slate-800/50 p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-white">{owner.isPublic ? 'Public' : 'Private'}</span>
                            <button
                                type="button"
                                onClick={handleTogglePublic}
                                disabled={slugBusy}
                                aria-pressed={owner.isPublic}
                                aria-label={owner.isPublic ? 'Disable sharing' : 'Enable sharing'}
                                className="text-2xl text-purple-400 transition-transform hover:scale-110 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded"
                            >
                                {owner.isPublic ? <FaToggleOn /> : <FaToggleOff className="text-slate-500" />}
                            </button>
                        </div>

                        {owner.isPublic && (
                            <form onSubmit={handleSlugSubmit} className="mt-3">
                                <label htmlFor="custom-slug" className="mb-1 block text-xs font-medium text-slate-400">
                                    Custom URL
                                </label>
                                <div className="flex gap-2">
                                    <div className="flex flex-1 items-center rounded-lg border border-purple-500/20 bg-slate-900/60 px-2">
                                        <span className="text-xs text-slate-500">/r/</span>
                                        <input
                                            id="custom-slug"
                                            value={slugInput}
                                            onChange={e => setSlugInput(e.target.value.toLowerCase())}
                                            className="w-full bg-transparent px-1 py-1.5 text-sm text-white outline-none"
                                            placeholder="your-name"
                                            maxLength={40}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={slugBusy}
                                        className="rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-purple-500 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                                    >
                                        <FaCheck className="h-3 w-3" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleRegenerate}
                                        disabled={slugBusy}
                                        aria-label="Regenerate a random share link"
                                        title="Regenerate link"
                                        className="rounded-lg border border-purple-500/30 px-3 py-1.5 text-xs font-semibold text-purple-200 hover:bg-purple-500/10 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                                    >
                                        <FaSync className="h-3 w-3" />
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                )}

                {!publicUrl ? (
                    <p className="text-sm text-slate-400">Enable sharing to get a public link, QR code, and social share options.</p>
                ) : (
                    <div className="space-y-5">
                        <div className="flex items-center gap-2 rounded-lg border border-purple-500/20 bg-slate-800/50 px-3 py-2">
                            <span className="flex-1 truncate text-sm text-slate-300">{publicUrl}</span>
                            <button
                                type="button"
                                onClick={handleCopy}
                                aria-label="Copy public resume link"
                                className="shrink-0 rounded-md p-1.5 text-purple-300 hover:bg-purple-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                            >
                                <FaCopy className="h-3.5 w-3.5" />
                            </button>
                        </div>

                        <QRCodeBlock url={publicUrl} fileName={`${resumeName}-qr`.replace(/\s+/g, '-').toLowerCase()} />

                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <a
                                href={publicUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 rounded-lg border border-purple-500/20 py-2 font-medium text-slate-200 hover:bg-purple-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                            >
                                <FaExternalLinkAlt className="h-3.5 w-3.5" aria-hidden="true" /> Open Page
                            </a>
                            <a
                                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(publicUrl)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 rounded-lg border border-purple-500/20 py-2 font-medium text-slate-200 hover:bg-purple-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                            >
                                <FaLinkedin className="h-3.5 w-3.5 text-[#0A66C2]" aria-hidden="true" /> LinkedIn
                            </a>
                            <a
                                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(publicUrl)}&text=${encodeURIComponent(shareText)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 rounded-lg border border-purple-500/20 py-2 font-medium text-slate-200 hover:bg-purple-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                            >
                                <FaXTwitter className="h-3.5 w-3.5" aria-hidden="true" /> X
                            </a>
                            <a
                                href={`mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(publicUrl)}`}
                                className="flex items-center justify-center gap-2 rounded-lg border border-purple-500/20 py-2 font-medium text-slate-200 hover:bg-purple-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                            >
                                <FaEnvelope className="h-3.5 w-3.5" aria-hidden="true" /> Email
                            </a>
                        </div>

                        {typeof navigator !== 'undefined' && !!navigator.share && (
                            <button
                                type="button"
                                onClick={handleNativeShare}
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 py-2.5 text-sm font-semibold text-white hover:scale-[1.02] transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                            >
                                <FaShareAlt className="h-3.5 w-3.5" aria-hidden="true" /> More sharing options
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShareDialog;
