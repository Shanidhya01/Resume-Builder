'use client';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { X, RotateCcw } from 'lucide-react';
import { listVersions, restoreVersion } from '@/lib/resumes';
import { loadResume } from '@/store/slices/resumeSlice';
import { useAuth } from '@/context/AuthContext';
import Skeleton from '@/components/UI/Skeleton';
import EmptyState from '@/components/UI/EmptyState';
import ErrorMessage from '@/components/UI/ErrorMessage';
import ConfirmModal from '@/components/UI/ConfirmModal';

const formatTimestamp = timestamp => {
    if (!timestamp?.toDate) return 'Unknown time';
    return timestamp.toDate().toLocaleString();
};

const VersionHistoryDrawer = ({ resumeId, onClose, onRestored }) => {
    const { user } = useAuth();
    const dispatch = useDispatch();
    const [versions, setVersions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [pendingRestoreId, setPendingRestoreId] = useState(null);

    // Data loads in the effect via promise callbacks (no sync setState in the
    // effect body); bumping reloadKey re-runs it for retry.
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let cancelled = false;
        listVersions(resumeId)
            .then(list => {
                if (cancelled) return;
                setVersions(list);
                setError('');
            })
            .catch(() => {
                if (!cancelled) setError('Could not load version history.');
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [resumeId, reloadKey]);

    const fetchVersions = () => {
        setLoading(true);
        setError('');
        setReloadKey(k => k + 1);
    };

    const handleRestore = async () => {
        const versionId = pendingRestoreId;
        setPendingRestoreId(null);
        try {
            const fields = await restoreVersion(resumeId, versionId, user.uid);
            dispatch(loadResume({ ...fields, id: resumeId }));
            onRestored?.();
            onClose();
        } catch (err) {
            setError('Could not restore this version.');
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex justify-end bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                onClick={e => e.stopPropagation()}
                className="h-full w-full max-w-md overflow-y-auto border-l border-line bg-surface p-6 shadow-ds-xl"
            >
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-fg">Version history</h2>
                        <p className="text-xs text-fg-muted">Restore a previously saved version.</p>
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Close version history"
                        className="rounded-lg p-2 text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {error && <ErrorMessage message={error} onRetry={fetchVersions} />}

                {loading ? (
                    <div className="space-y-3">
                        <Skeleton className="h-14 w-full" />
                        <Skeleton className="h-14 w-full" />
                        <Skeleton className="h-14 w-full" />
                    </div>
                ) : versions.length === 0 ? (
                    <EmptyState title="No versions yet" description="Versions are saved periodically as you edit." />
                ) : (
                    <ul className="space-y-3">
                        {versions.map(version => (
                            <li
                                key={version.id}
                                className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface-2/50 px-4 py-3 transition-colors hover:border-line-strong"
                            >
                                <span className="text-sm text-fg-muted">{formatTimestamp(version.savedAt)}</span>
                                <button
                                    onClick={() => setPendingRestoreId(version.id)}
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-xs font-semibold text-accent transition-colors hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                                >
                                    <RotateCcw className="h-3.5 w-3.5" /> Restore
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </motion.div>

            {pendingRestoreId && (
                <ConfirmModal
                    title="Restore this version?"
                    description="Your current resume content will be replaced with this saved version."
                    confirmLabel="Restore"
                    onConfirm={handleRestore}
                    onCancel={() => setPendingRestoreId(null)}
                />
            )}
        </div>
    );
};

export default VersionHistoryDrawer;
