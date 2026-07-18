'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaTrash, FaFilePdf, FaFileWord, FaFileAlt, FaHistory } from 'react-icons/fa';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import Badge from '@/components/Ats/Badge';
import ErrorMessage from '@/components/UI/ErrorMessage';
import EmptyState from '@/components/UI/EmptyState';
import Skeleton from '@/components/UI/Skeleton';
import ConfirmModal from '@/components/UI/ConfirmModal';
import { useAuth } from '@/context/AuthContext';
import { listImportHistory, deleteImportEntry } from '@/lib/importExport/history';

const SOURCE_META = {
    pdf: { icon: FaFilePdf, label: 'PDF' },
    docx: { icon: FaFileWord, label: 'DOCX' },
    json: { icon: FaFileAlt, label: 'JSON' },
    backup: { icon: FaFileAlt, label: 'Backup' },
};

const formatTimestamp = ts => {
    const millis = ts?.toMillis?.();
    if (!millis) return '—';
    return new Date(millis).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
};

const confidenceTone = score => {
    if (score == null) return 'low';
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
};

const HistoryContent = () => {
    const { user } = useAuth();
    const router = useRouter();
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [pendingDeleteId, setPendingDeleteId] = useState(null);

    // Data loads in the effect via promise callbacks (no sync setState in the
    // effect body); bumping reloadKey re-runs it for retry.
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let cancelled = false;
        listImportHistory(user.uid)
            .then(list => {
                if (cancelled) return;
                setEntries(list);
                setError('');
            })
            .catch(() => {
                if (!cancelled) setError('Could not load your import history.');
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [user.uid, reloadKey]);

    const retryFetch = useCallback(() => {
        setLoading(true);
        setError('');
        setReloadKey(k => k + 1);
    }, []);

    const handleDelete = async () => {
        const id = pendingDeleteId;
        setPendingDeleteId(null);
        try {
            await deleteImportEntry(id);
            setEntries(prev => prev.filter(e => e.id !== id));
        } catch (err) {
            setError('Could not delete this history entry.');
        }
    };

    return (
        <div className="mx-auto mt-10 max-w-screen-xl px-4 pb-10 md:mt-12">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-fg md:text-3xl">Import History</h1>
                <p className="mt-1 text-sm text-fg-muted">Every resume import and backup restore, with parse results and confidence.</p>
            </div>

            {error && <ErrorMessage message={error} onRetry={retryFetch} />}

            {loading ? (
                <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                    ))}
                </div>
            ) : entries.length === 0 ? (
                <EmptyState
                    icon={FaHistory}
                    title="No imports yet"
                    description="When you import a resume or restore a backup, it will show up here."
                    actionLabel="Import a Resume"
                    onAction={() => router.push('/dashboard/import')}
                />
            ) : (
                <div className="overflow-x-auto rounded-xl border border-line">
                    <table className="w-full min-w-[720px] text-left text-sm">
                        <caption className="sr-only">Import history: file, date, source, status, parse result, confidence, and created resume.</caption>
                        <thead>
                            <tr className="border-b border-line bg-surface-2 text-xs uppercase tracking-wide text-fg-muted">
                                <th scope="col" className="px-4 py-3">Imported File</th>
                                <th scope="col" className="px-4 py-3">Date</th>
                                <th scope="col" className="px-4 py-3">Source</th>
                                <th scope="col" className="px-4 py-3">Status</th>
                                <th scope="col" className="px-4 py-3">Parse</th>
                                <th scope="col" className="px-4 py-3">Confidence</th>
                                <th scope="col" className="px-4 py-3">Resume Created</th>
                                <th scope="col" className="px-4 py-3">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {entries.map(entry => {
                                const source = SOURCE_META[entry.source] || { icon: FaFileAlt, label: entry.source || 'Unknown' };
                                const SourceIcon = source.icon;
                                return (
                                    <tr key={entry.id} className="border-b border-line last:border-0 hover:bg-surface-2">
                                        <td className="max-w-[220px] truncate px-4 py-3 font-medium text-fg" title={entry.fileName}>
                                            {entry.fileName}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-fg-muted">{formatTimestamp(entry.importedAt)}</td>
                                        <td className="px-4 py-3">
                                            <span className="inline-flex items-center gap-1.5 text-fg-muted">
                                                <SourceIcon className="text-accent" aria-hidden="true" /> {source.label}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge tone={entry.status === 'success' ? 'Excellent' : 'Missing'}>{entry.status}</Badge>
                                        </td>
                                        <td className="px-4 py-3 text-fg-muted">{entry.parseSuccess ? 'Parsed' : entry.error ? 'Failed' : '—'}</td>
                                        <td className="px-4 py-3">
                                            {entry.confidence != null ? (
                                                <Badge tone={confidenceTone(entry.confidence)}>{entry.confidence}%</Badge>
                                            ) : (
                                                <span className="text-fg-subtle">—</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            {entry.resumeId ? (
                                                <Link href={`/editor/${entry.resumeId}`} className="font-semibold text-accent underline hover:text-accent-hover">
                                                    {entry.resumeName || 'Open resume'}
                                                </Link>
                                            ) : (
                                                <span className="text-fg-subtle">{entry.error ? entry.error.slice(0, 60) : '—'}</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                type="button"
                                                onClick={() => setPendingDeleteId(entry.id)}
                                                aria-label={`Delete history entry for ${entry.fileName}`}
                                                className="rounded p-2 text-red-500 hover:bg-red-500/10"
                                            >
                                                <FaTrash className="h-3.5 w-3.5" aria-hidden="true" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {pendingDeleteId && (
                <ConfirmModal
                    title="Delete this history entry?"
                    description="This only removes the log entry — any resume created from the import is not affected."
                    confirmLabel="Delete"
                    danger
                    onConfirm={handleDelete}
                    onCancel={() => setPendingDeleteId(null)}
                />
            )}
        </div>
    );
};

const HistoryPage = () => (
    <ProtectedRoute>
        <HistoryContent />
    </ProtectedRoute>
);

export default HistoryPage;
