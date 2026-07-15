'use client';

import { useEffect, useRef, useState } from 'react';
import { FaEye, FaDownload, FaShareAlt, FaUsers, FaClock } from 'react-icons/fa';
import { FaXmark } from 'react-icons/fa6';
import { getPublicAnalytics } from '@/lib/publicResumes';
import useModalA11y from '@/hooks/useModalA11y';

const formatTimestamp = ts => {
    const millis = ts?.toMillis?.();
    if (!millis) return 'Never';
    return new Date(millis).toLocaleString();
};

const StatTile = ({ icon: Icon, label, value }) => (
    <div className="flex flex-col items-center gap-1 rounded-xl border border-line bg-surface-2 p-4 text-center">
        <Icon className="h-4 w-4 text-accent" aria-hidden="true" />
        <span className="text-2xl font-black text-fg">{value}</span>
        <span className="text-xs text-fg-muted">{label}</span>
    </div>
);

const AnalyticsPanel = ({ resumeId, uid, onClose }) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState('');
    const dialogRef = useRef(null);
    const closeButtonRef = useRef(null);

    useModalA11y({ containerRef: dialogRef, initialFocusRef: closeButtonRef, onClose });

    useEffect(() => {
        let cancelled = false;
        getPublicAnalytics(resumeId, uid)
            .then(result => {
                if (!cancelled) setData(result);
            })
            .catch(err => {
                if (!cancelled) setError(err.message || 'Could not load analytics.');
            });
        return () => {
            cancelled = true;
        };
    }, [resumeId, uid]);

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
                aria-labelledby="analytics-dialog-title"
                className="w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-2xl"
            >
                <div className="mb-5 flex items-center justify-between">
                    <h2 id="analytics-dialog-title" className="text-lg font-bold text-fg">Sharing Analytics</h2>
                    <button
                        ref={closeButtonRef}
                        type="button"
                        onClick={onClose}
                        aria-label="Close analytics panel"
                        className="rounded-lg p-2 text-fg-muted hover:bg-surface-2 hover:text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                        <FaXmark className="h-4 w-4" />
                    </button>
                </div>

                {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

                {!data && !error && (
                    <div className="grid grid-cols-2 gap-3" role="status" aria-label="Loading analytics">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-24 animate-pulse rounded-xl bg-surface-2" />
                        ))}
                    </div>
                )}

                {data && (
                    <>
                        <div className="mb-4 grid grid-cols-2 gap-3">
                            <StatTile icon={FaEye} label="Views" value={data.viewCount} />
                            <StatTile icon={FaUsers} label="Unique Visitors" value={data.uniqueVisitors} />
                            <StatTile icon={FaDownload} label="Downloads" value={data.downloadCount} />
                            <StatTile icon={FaShareAlt} label="Shares" value={data.shareCount} />
                        </div>
                        <div className="flex items-center gap-2 rounded-xl border border-line bg-surface-2 p-3 text-sm text-fg-muted">
                            <FaClock className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                            Last viewed: <span className="font-semibold text-fg">{formatTimestamp(data.lastViewed)}</span>
                        </div>
                        {!data.isPublic && (
                            <p className="mt-4 text-xs text-fg-subtle">Sharing is currently disabled — these are historical totals.</p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default AnalyticsPanel;
