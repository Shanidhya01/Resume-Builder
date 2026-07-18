'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'framer-motion';
import {
    FaCopy, FaExternalLinkAlt, FaLinkedin, FaEnvelope, FaShareAlt, FaSync, FaCheck,
    FaEye, FaDownload, FaClock, FaUserShield,
} from 'react-icons/fa';
import { FaXmark, FaXTwitter, FaWhatsapp, FaTelegram } from 'react-icons/fa6';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { validateCustomSlug, getPublicAnalytics } from '@/lib/publicResumes';
import { friendlyFirestoreError } from '@/lib/firestoreErrors';
import { formatRelativeTime } from '@/lib/formatRelativeTime';
import { ChartSkeleton } from '@/components/Ats/Skeleton';
import useModalA11y from '@/hooks/useModalA11y';

// QR generation is lazy-loaded — it pulls in the `qrcode` library and is
// only ever needed once a user opens the dialog and the resume is public.
const QRCodeBlock = dynamic(() => import('./QRCodeBlock'), { ssr: false, loading: () => <ChartSkeleton height={216} /> });

const formatTimestamp = ts => {
    const millis = ts?.toMillis?.();
    return millis ? new Date(millis).toLocaleString() : 'Never';
};

const SectionHeading = ({ children }) => (
    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-fg-subtle">{children}</h3>
);

const MiniStat = ({ icon: Icon, label, value }) => (
    <div className="flex flex-col items-center gap-1 rounded-xl border border-line bg-surface-2/60 p-3 text-center">
        <Icon className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
        <span className="text-lg font-bold text-fg">{value}</span>
        <span className="text-[11px] text-fg-muted">{label}</span>
    </div>
);

const SocialLink = ({ href, icon: Icon, label, color, ...props }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 rounded-xl border border-line py-2.5 text-sm font-medium text-fg transition-colors hover:bg-accent/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        {...props}
    >
        <Icon className="h-3.5 w-3.5" style={color ? { color } : undefined} aria-hidden="true" /> {label}
    </a>
);

/**
 * Premium sharing center: identity/status header, animated visibility card,
 * public URL + QR + social grid, folded-in analytics mini-cards, SEO/security
 * summaries, and the publish success pulse. Owns no mutation logic of its
 * own — every write goes through `owner.onPublish/onUnpublish/onRegenerateSlug/
 * onSetCustomSlug`, exactly as before; this is a visual/structural rewrite.
 */
const ShareDialog = ({ resumeName = 'Resume', publicUrl, owner, resumeId, uid, template, onClose, onOpenAnalytics }) => {
    const { showToast } = useToast();
    const { user } = useAuth();
    const dialogRef = useRef(null);
    const closeButtonRef = useRef(null);
    const [slugInput, setSlugInput] = useState(owner?.customSlug || owner?.slug || '');
    const [slugBusy, setSlugBusy] = useState(false);
    const [justPublished, setJustPublished] = useState(false);
    const [analytics, setAnalytics] = useState(null);

    useModalA11y({ containerRef: dialogRef, initialFocusRef: closeButtonRef, onClose });

    const shareText = `Check out ${resumeName}'s resume`;

    useEffect(() => {
        if (!owner?.isPublic || !resumeId || !uid) return;
        let cancelled = false;
        getPublicAnalytics(resumeId, uid)
            .then(result => {
                if (!cancelled) setAnalytics(result);
            })
            .catch(() => {});
        return () => {
            cancelled = true;
        };
    }, [owner?.isPublic, resumeId, uid]);

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
            showToast(friendlyFirestoreError(err), { tone: 'error' });
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
            showToast(friendlyFirestoreError(err), { tone: 'error' });
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
                setJustPublished(true);
                setTimeout(() => setJustPublished(false), 1800);
                showToast('Resume is now publicly available.', { tone: 'success' });
            }
        } catch (err) {
            showToast(friendlyFirestoreError(err), { tone: 'error' });
        } finally {
            setSlugBusy(false);
        }
    };

    // Portal to <body>: the dialog is mounted inside a resume card that uses a
    // hover `transform`, and a transformed ancestor makes `position: fixed`
    // resolve against the card instead of the viewport — causing the modal to
    // snap around (flicker) and dodge clicks. Rendering on <body> avoids that.
    return createPortal(
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
            onMouseDown={e => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <motion.div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="share-dialog-title"
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-line bg-surface p-6 shadow-2xl"
            >
                {/* Header */}
                <div className="mb-5 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h2 id="share-dialog-title" className="flex items-center gap-2 text-lg font-bold text-fg">
                            <FaShareAlt className="h-4 w-4 text-accent shrink-0" aria-hidden="true" /> Share Resume
                        </h2>
                        <p className="mt-0.5 text-xs text-fg-muted">Publish your resume and share it with recruiters worldwide.</p>
                        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-fg-subtle">
                            <span className="truncate font-medium text-fg">{resumeName}</span>
                            {template && <span className="rounded-full border border-line px-2 py-0.5">{template.name}</span>}
                            {owner?.updatedPublicAt && <span>Updated {formatRelativeTime(owner.updatedPublicAt)}</span>}
                        </div>
                    </div>
                    <button
                        ref={closeButtonRef}
                        type="button"
                        onClick={onClose}
                        aria-label="Close share dialog"
                        className="shrink-0 rounded-lg p-2 text-fg-muted hover:bg-surface-2 hover:text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                        <FaXmark className="h-4 w-4" />
                    </button>
                </div>

                {/* Visibility card */}
                {owner && (
                    <div className="mb-5 overflow-hidden rounded-xl border border-line bg-surface-2">
                        <div className="flex items-center justify-between p-4">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className={`h-2 w-2 rounded-full ${owner.isPublic ? 'bg-emerald-500' : 'bg-fg-subtle'}`} />
                                    <span className="text-sm font-semibold text-fg">{owner.isPublic ? 'Public' : 'Private'}</span>
                                </div>
                                <p className="mt-1 text-xs text-fg-muted">
                                    {owner.isPublic ? '🌍 Anyone with the link can view it.' : '🔒 Only you can access this resume.'}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={handleTogglePublic}
                                disabled={slugBusy}
                                aria-pressed={owner.isPublic}
                                aria-label={owner.isPublic ? 'Disable sharing' : 'Enable sharing'}
                                className={`relative h-7 w-12 shrink-0 rounded-full transition-colors disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-2 ${
                                    owner.isPublic ? 'bg-accent' : 'bg-surface-3'
                                }`}
                            >
                                <motion.span
                                    layout
                                    transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                                    className="absolute top-1 h-5 w-5 rounded-full bg-white shadow-ds-sm"
                                    style={{ left: owner.isPublic ? '1.625rem' : '0.25rem' }}
                                />
                            </button>
                        </div>

                        <AnimatePresence>
                            {justPublished && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="flex items-center gap-2 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
                                >
                                    <FaCheck className="h-3 w-3" /> Resume is now publicly available.
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {owner.isPublic && (
                            <form onSubmit={handleSlugSubmit} className="border-t border-line p-4 pt-3">
                                <label htmlFor="custom-slug" className="mb-1 block text-xs font-medium text-fg-muted">
                                    Custom URL
                                </label>
                                <div className="flex gap-2">
                                    <div className="flex flex-1 items-center rounded-lg border border-line bg-surface px-2">
                                        <span className="text-xs text-fg-subtle">/r/</span>
                                        <input
                                            id="custom-slug"
                                            value={slugInput}
                                            onChange={e => setSlugInput(e.target.value.toLowerCase())}
                                            className="w-full bg-transparent px-1 py-1.5 text-sm text-fg outline-none"
                                            placeholder="your-name"
                                            maxLength={40}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={slugBusy}
                                        className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-accent-fg hover:bg-accent-hover disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                                    >
                                        <FaCheck className="h-3 w-3" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleRegenerate}
                                        disabled={slugBusy}
                                        aria-label="Regenerate a random share link"
                                        title="Regenerate link"
                                        className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent/10 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                                    >
                                        <FaSync className="h-3 w-3" />
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                )}

                {!publicUrl ? (
                    <p className="text-sm text-fg-muted">Enable sharing to get a public link, QR code, and social share options.</p>
                ) : (
                    <div className="space-y-6">
                        {/* Public URL */}
                        <div>
                            <SectionHeading>Public URL</SectionHeading>
                            <div className="flex items-center gap-2 rounded-lg border border-line bg-surface-2 px-3 py-2">
                                <span className="flex-1 truncate text-sm text-fg-muted">{publicUrl}</span>
                                <button
                                    type="button"
                                    onClick={handleCopy}
                                    aria-label="Copy public resume link"
                                    className="shrink-0 rounded-md p-1.5 text-accent hover:bg-accent/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                                >
                                    <FaCopy className="h-3.5 w-3.5" />
                                </button>
                            </div>

                            <div className="mt-4">
                                <QRCodeBlock url={publicUrl} fileName={`${resumeName}-qr`.replace(/\s+/g, '-').toLowerCase()} />
                            </div>
                        </div>

                        {/* Social share */}
                        <div>
                            <SectionHeading>Share</SectionHeading>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <SocialLink href={publicUrl} icon={FaExternalLinkAlt} label="Open Page" />
                                <SocialLink
                                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(publicUrl)}`}
                                    icon={FaLinkedin}
                                    label="LinkedIn"
                                    color="#0A66C2"
                                />
                                <SocialLink
                                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(publicUrl)}&text=${encodeURIComponent(shareText)}`}
                                    icon={FaXTwitter}
                                    label="X"
                                />
                                <SocialLink
                                    href={`https://wa.me/?text=${encodeURIComponent(`${shareText} ${publicUrl}`)}`}
                                    icon={FaWhatsapp}
                                    label="WhatsApp"
                                    color="#25D366"
                                />
                                <SocialLink
                                    href={`https://t.me/share/url?url=${encodeURIComponent(publicUrl)}&text=${encodeURIComponent(shareText)}`}
                                    icon={FaTelegram}
                                    label="Telegram"
                                    color="#26A5E4"
                                />
                                <SocialLink href={`mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(publicUrl)}`} icon={FaEnvelope} label="Email" />
                            </div>

                            {typeof navigator !== 'undefined' && !!navigator.share && (
                                <button
                                    type="button"
                                    onClick={handleNativeShare}
                                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-2.5 text-sm font-semibold text-accent-fg hover:scale-[1.02] transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                                >
                                    <FaShareAlt className="h-3.5 w-3.5" aria-hidden="true" /> More sharing options
                                </button>
                            )}
                        </div>

                        {/* Analytics */}
                        {analytics && (
                            <div>
                                <div className="mb-3 flex items-center justify-between">
                                    <SectionHeading>Analytics</SectionHeading>
                                    {onOpenAnalytics && (
                                        <button
                                            type="button"
                                            onClick={onOpenAnalytics}
                                            className="text-xs font-semibold text-accent hover:underline"
                                        >
                                            View full analytics
                                        </button>
                                    )}
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <MiniStat icon={FaEye} label="Views" value={analytics.viewCount} />
                                    <MiniStat icon={FaDownload} label="Downloads" value={analytics.downloadCount} />
                                    <MiniStat icon={FaShareAlt} label="Shares" value={analytics.shareCount} />
                                </div>
                                <div className="mt-2 flex items-center gap-2 rounded-lg border border-line bg-surface-2 px-3 py-2 text-xs text-fg-muted">
                                    <FaClock className="h-3 w-3 text-accent" aria-hidden="true" />
                                    Last viewed: <span className="font-semibold text-fg">{formatTimestamp(analytics.lastViewed)}</span>
                                </div>
                            </div>
                        )}

                        {/* SEO */}
                        <div>
                            <SectionHeading>SEO Settings</SectionHeading>
                            <div className="space-y-1.5 rounded-lg border border-line bg-surface-2 px-3 py-2.5 text-xs">
                                <div className="flex justify-between gap-2">
                                    <span className="text-fg-muted">Readable URL</span>
                                    <span className="truncate text-right font-medium text-fg">{publicUrl}</span>
                                </div>
                                <div className="flex justify-between gap-2">
                                    <span className="text-fg-muted">Canonical URL</span>
                                    <span className="truncate text-right font-medium text-fg">{publicUrl}</span>
                                </div>
                                <div className="flex justify-between gap-2">
                                    <span className="text-fg-muted">Slug</span>
                                    <span className="font-medium text-fg">{owner?.slug}</span>
                                </div>
                            </div>
                        </div>

                        {/* Security */}
                        <div>
                            <SectionHeading>Security</SectionHeading>
                            <div className="flex items-start gap-2 rounded-lg border border-line bg-surface-2 px-3 py-2.5 text-xs text-fg-muted">
                                <FaUserShield className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" />
                                <p>
                                    Owner: <span className="font-medium text-fg">{user?.displayName || user?.email}</span>. Anyone with
                                    the link can view this resume; it is not indexed for search unless you share it yourself.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>,
        document.body,
    );
};

export default ShareDialog;
