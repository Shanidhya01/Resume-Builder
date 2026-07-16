'use client';

import { useEffect, useRef, useState, useCallback, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus, Upload, Sparkles } from 'lucide-react';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { listResumesForUser, createResume, duplicateResume, deleteResume, renameResume } from '@/lib/resumes';
import ResumeCard from '@/components/Dashboard/ResumeCard';
import DashboardStats from '@/components/Dashboard/DashboardStats';
import QuickActions from '@/components/Dashboard/QuickActions';
import { SkeletonGrid } from '@/components/UI/Skeleton';
import EmptyState from '@/components/UI/EmptyState';
import ErrorMessage from '@/components/UI/ErrorMessage';
import ConfirmModal from '@/components/UI/ConfirmModal';
import Button from '@/components/UI/Button';
import DashboardNav from '@/components/Ats/DashboardNav';
import { DEFAULT_TEMPLATE_ID } from '@/config/templates';

const DashboardContent = () => {
    const { user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [creating, setCreating] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState(null);

    // Data loads in the effect via promise callbacks (no sync setState in the
    // effect body); bumping reloadKey re-runs it for retry / post-duplicate refresh.
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let cancelled = false;
        listResumesForUser(user.uid)
            .then(list => {
                if (cancelled) return;
                setResumes(list);
                setError('');
            })
            .catch(() => {
                if (!cancelled) setError('Could not load your resumes.');
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [user.uid, reloadKey]);

    const fetchResumes = useCallback(() => {
        setLoading(true);
        setError('');
        setReloadKey(k => k + 1);
    }, []);

    const handleCreate = useCallback(async () => {
        setCreating(true);
        try {
            const id = await createResume(user.uid, 'Untitled Resume', DEFAULT_TEMPLATE_ID);
            router.push(`/editor/${id}`);
        } catch (err) {
            setError('Could not create a new resume.');
            setCreating(false);
        }
    }, [user.uid, router]);

    // Seamless entry point: /dashboard?create=true provisions a Firestore resume
    // and redirects straight into the editor. We replace the query param out of
    // history first so the back button doesn't re-trigger a second creation.
    const autoCreateHandled = useRef(false);
    useEffect(() => {
        if (searchParams.get('create') !== 'true' || autoCreateHandled.current) return;
        autoCreateHandled.current = true;
        router.replace('/dashboard');
        handleCreate();
    }, [searchParams, router, handleCreate]);

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

    const handleShareUpdate = useCallback((id, patch) => {
        setResumes(prev => prev.map(r => (r.id === id ? { ...r, ...patch } : r)));
    }, []);

    const recentResumes = useMemo(() => resumes.slice(0, 3), [resumes]);
    const firstName = user.displayName ? user.displayName.split(' ')[0] : null;

    return (
        <div className="mx-auto mt-8 max-w-screen-xl px-4 pb-16 md:mt-10">
            {/* Hero */}
            <section className="relative mb-8 overflow-hidden rounded-3xl border border-line bg-surface p-6 shadow-ds-sm md:p-8">
                <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.4] [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" aria-hidden="true" />
                <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-accent/20 blur-3xl" aria-hidden="true" />
                <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-2 px-2.5 py-1 text-xs font-medium text-fg-muted">
                            <Sparkles className="h-3 w-3 text-accent" /> Your workspace
                        </span>
                        <h1 className="mt-3 text-2xl font-bold tracking-tight text-fg md:text-3xl">
                            Welcome back{firstName ? `, ${firstName}` : ''}
                        </h1>
                        <p className="mt-1 text-sm text-fg-muted">
                            {resumes.length} resume{resumes.length !== 1 ? 's' : ''} &middot; {user.email}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                        <Button as={Link} href="/dashboard/import" variant="secondary" size="lg" leftIcon={<Upload className="h-4 w-4" />}>
                            Import
                        </Button>
                        <Button onClick={handleCreate} loading={creating} variant="primary" size="lg" leftIcon={<Plus className="h-4 w-4" />}>
                            {creating ? 'Creating…' : 'New Resume'}
                        </Button>
                    </div>
                </div>
            </section>

            <DashboardNav />

            {error && <ErrorMessage message={error} onRetry={fetchResumes} />}

            {loading ? (
                <SkeletonGrid />
            ) : resumes.length === 0 ? (
                <EmptyState
                    title="No resumes yet"
                    description="Create your first resume, or import an existing one to get started."
                    actionLabel="Create New Resume"
                    onAction={handleCreate}
                />
            ) : (
                <>
                    <DashboardStats resumes={resumes} />

                    <div className="mb-8">
                        <h2 className="mb-3 text-sm font-semibold text-fg-muted">Quick Actions</h2>
                        <QuickActions />
                    </div>

                    {recentResumes.length > 0 && (
                        <div className="mb-6">
                            <h2 className="mb-3 text-sm font-semibold text-fg-muted">Recently Edited</h2>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {recentResumes.map(resume => (
                                    <ResumeCard
                                        key={resume.id}
                                        resume={resume}
                                        uid={user.uid}
                                        onDuplicate={handleDuplicate}
                                        onRename={handleRename}
                                        onDelete={setPendingDeleteId}
                                        onShareUpdate={handleShareUpdate}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    <h2 className="mb-3 text-sm font-semibold text-fg-muted">All Resumes</h2>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {resumes.map(resume => (
                            <ResumeCard
                                key={resume.id}
                                resume={resume}
                                uid={user.uid}
                                onDuplicate={handleDuplicate}
                                onRename={handleRename}
                                onDelete={setPendingDeleteId}
                                onShareUpdate={handleShareUpdate}
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
        <Suspense fallback={null}>
            <DashboardContent />
        </Suspense>
    </ProtectedRoute>
);

export default DashboardPage;
