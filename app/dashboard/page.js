'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { FaPlus } from 'react-icons/fa';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { listResumesForUser, createResume, duplicateResume, deleteResume, renameResume } from '@/lib/resumes';
import ResumeCard from '@/components/Dashboard/ResumeCard';
import { SkeletonGrid } from '@/components/UI/Skeleton';
import EmptyState from '@/components/UI/EmptyState';
import ErrorMessage from '@/components/UI/ErrorMessage';
import ConfirmModal from '@/components/UI/ConfirmModal';
import { DEFAULT_TEMPLATE_ID } from '@/config/templates';

const DashboardContent = () => {
    const { user } = useAuth();
    const router = useRouter();
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [creating, setCreating] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState(null);

    const fetchResumes = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const list = await listResumesForUser(user.uid);
            setResumes(list);
        } catch (err) {
            setError('Could not load your resumes.');
        } finally {
            setLoading(false);
        }
    }, [user.uid]);

    useEffect(() => {
        fetchResumes();
    }, [fetchResumes]);

    const handleCreate = async () => {
        setCreating(true);
        try {
            const id = await createResume(user.uid, 'Untitled Resume', DEFAULT_TEMPLATE_ID);
            router.push(`/editor/${id}`);
        } catch (err) {
            setError('Could not create a new resume.');
            setCreating(false);
        }
    };

    const handleDuplicate = async id => {
        try {
            await duplicateResume(id, user.uid);
            fetchResumes();
        } catch (err) {
            setError('Could not duplicate resume.');
        }
    };

    const handleRename = async (id, name) => {
        try {
            await renameResume(id, name, user.uid);
            setResumes(prev => prev.map(r => (r.id === id ? { ...r, name } : r)));
        } catch (err) {
            setError('Could not rename resume.');
        }
    };

    const handleDelete = async () => {
        const id = pendingDeleteId;
        setPendingDeleteId(null);
        try {
            await deleteResume(id, user.uid);
            setResumes(prev => prev.filter(r => r.id !== id));
        } catch (err) {
            setError('Could not delete resume.');
        }
    };

    const recentResumes = useMemo(() => resumes.slice(0, 3), [resumes]);

    return (
        <div className="mx-auto mt-10 max-w-screen-xl px-4 pb-10 md:mt-12">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white md:text-3xl">Welcome back{user.displayName ? `, ${user.displayName}` : ''}</h1>
                    <p className="text-sm text-slate-400">{user.email} &middot; {resumes.length} resume{resumes.length !== 1 ? 's' : ''}</p>
                </div>
                <button
                    onClick={handleCreate}
                    disabled={creating}
                    className="flex items-center justify-center gap-2 self-start rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-6 py-2.5 font-bold text-white shadow-lg shadow-purple-500/40 transition-all duration-300 hover:scale-105 disabled:opacity-60"
                >
                    <FaPlus /> {creating ? 'Creating...' : 'Create New Resume'}
                </button>
            </div>

            {error && <ErrorMessage message={error} onRetry={fetchResumes} />}

            {loading ? (
                <SkeletonGrid />
            ) : resumes.length === 0 ? (
                <EmptyState
                    title="No resumes yet"
                    description="Create your first resume to get started."
                    actionLabel="Create New Resume"
                    onAction={handleCreate}
                />
            ) : (
                <>
                    {recentResumes.length > 0 && (
                        <div className="mb-6">
                            <h2 className="mb-3 text-sm font-semibold text-slate-300">Recently Edited</h2>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {recentResumes.map(resume => (
                                    <ResumeCard
                                        key={resume.id}
                                        resume={resume}
                                        onDuplicate={handleDuplicate}
                                        onRename={handleRename}
                                        onDelete={setPendingDeleteId}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    <h2 className="mb-3 text-sm font-semibold text-slate-300">All Resumes</h2>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {resumes.map(resume => (
                            <ResumeCard
                                key={resume.id}
                                resume={resume}
                                onDuplicate={handleDuplicate}
                                onRename={handleRename}
                                onDelete={setPendingDeleteId}
                            />
                        ))}
                    </div>
                </>
            )}

            {pendingDeleteId && (
                <ConfirmModal
                    title="Delete this resume?"
                    description="This will permanently delete the resume and its version history. This action cannot be undone."
                    confirmLabel="Delete"
                    danger
                    onConfirm={handleDelete}
                    onCancel={() => setPendingDeleteId(null)}
                />
            )}
        </div>
    );
};

const DashboardPage = () => (
    <ProtectedRoute>
        <DashboardContent />
    </ProtectedRoute>
);

export default DashboardPage;
