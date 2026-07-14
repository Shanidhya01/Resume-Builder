'use client';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { HiX } from 'react-icons/hi';
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
        <div className="fixed inset-0 z-[90] flex justify-end bg-black/50 backdrop-blur-sm">
            <div className="h-full w-full max-w-md overflow-y-auto border-l border-purple-500/30 bg-slate-900 p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">Version History</h2>
                    <button onClick={onClose} className="rounded-lg p-2 text-slate-300 hover:bg-white/5">
                        <HiX className="h-5 w-5" />
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
                                className="flex items-center justify-between rounded-lg border border-purple-500/20 px-4 py-3"
                            >
                                <span className="text-sm text-slate-300">{formatTimestamp(version.savedAt)}</span>
                                <button
                                    onClick={() => setPendingRestoreId(version.id)}
                                    className="text-xs font-semibold text-primary-400 underline"
                                >
                                    Restore
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

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
