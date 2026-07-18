'use client';

import { useEffect, useRef, useState, useCallback, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus, Upload, Sparkles } from 'lucide-react';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { listResumesForUser, createResume, duplicateResume, deleteResume, renameResume } from '@/lib/resumes';
import { withFirestoreRetry, friendlyFirestoreError, logDev } from '@/lib/firestoreErrors';
import ResumeCard from '@/components/Dashboard/ResumeCard';
import DashboardStats from '@/components/Dashboard/DashboardStats';
import QuickActions from '@/components/Dashboard/QuickActions';
import SearchFilterSortBar from '@/components/Dashboard/SearchFilterSortBar';
import RecentActivity from '@/components/Dashboard/RecentActivity';
import AnalyticsSummary from '@/components/Dashboard/AnalyticsSummary';
import { SkeletonGrid } from '@/components/UI/Skeleton';
import EmptyState from '@/components/UI/EmptyState';
import ErrorMessage from '@/components/UI/ErrorMessage';
import ConfirmModal from '@/components/UI/ConfirmModal';
import Button from '@/components/UI/Button';
import { DEFAULT_TEMPLATE_ID } from '@/config/templates';

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

const filterAndSortResumes = (resumes, search, filter, sort) => {
    const q = search.trim().toLowerCase();
    let list = resumes;

    if (q) list = list.filter(r => r.name?.toLowerCase().includes(q));

    if (filter === 'published') list = list.filter(r => r.isPublic);
    else if (filter === 'private') list = list.filter(r => !r.isPublic);
    else if (filter === 'recent') {
        const cutoff = Date.now() - SEVEN_DAYS_MS;
        list = list.filter(r => (r.updatedAt?.toMillis?.() ?? 0) >= cutoff);
    }

    const sorted = [...list];
    if (sort === 'newest') sorted.sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0));
    else if (sort === 'oldest') sorted.sort((a, b) => (a.createdAt?.toMillis?.() ?? 0) - (b.createdAt?.toMillis?.() ?? 0));
    else if (sort === 'views') sorted.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
    else sorted.sort((a, b) => (b.updatedAt?.toMillis?.() ?? 0) - (a.updatedAt?.toMillis?.() ?? 0)); // 'updated' default

    return sorted;
};

const DashboardContent = () => {
    const { user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [creating, setCreating] = useState(false);
    const [aiGenerating, setAiGenerating] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState(null);

    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [sort, setSort] = useState('updated');

    // Data loads in the effect via promise callbacks (no sync setState in the
    // effect body); bumping reloadKey re-runs it for retry / post-duplicate refresh.
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let cancelled = false;
        withFirestoreRetry(() => listResumesForUser(user.uid))
            .then(list => {
                if (cancelled) return;
                setResumes(list);
                setError('');
            })
            .catch(err => {
                if (!cancelled) setError(friendlyFirestoreError(err));
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
        setError('');
        try {
            const id = await withFirestoreRetry(() => createResume(user.uid, 'Untitled Resume', DEFAULT_TEMPLATE_ID));
            router.push(`/editor/${id}`);
        } catch (err) {
            // Surface a friendly message so a failed write can't hide behind a
            // stuck "Creating…" button; log details in development only.
            logDev('Create resume failed:', err);
            setError(friendlyFirestoreError(err));
            setCreating(false);
        }
    }, [user.uid, router]);

    // Reuses the exact same createResume() call as "New Resume" — only the
    // post-create redirect differs (?ai=1 tells the editor to default its
    // already-existing AI Assistant panel to open).
    const handleAiGenerate = useCallback(async () => {
        setAiGenerating(true);
        setError('');
        try {
            const id = await withFirestoreRetry(() => createResume(user.uid, 'Untitled Resume', DEFAULT_TEMPLATE_ID));
            router.push(`/editor/${id}?ai=1`);
        } catch (err) {
            logDev('AI-generate resume failed:', err);
            setError(friendlyFirestoreError(err));
            setAiGenerating(false);
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
            await withFirestoreRetry(() => duplicateResume(id, user.uid));
            fetchResumes();
        } catch (err) {
            setError(friendlyFirestoreError(err));
        }
    };

    const handleRename = async (id, name) => {
        try {
            await withFirestoreRetry(() => renameResume(id, name, user.uid));
            setResumes(prev => prev.map(r => (r.id === id ? { ...r, name } : r)));
        } catch (err) {
            setError(friendlyFirestoreError(err));
        }
    };

    const handleDelete = async () => {
        const id = pendingDeleteId;
        setPendingDeleteId(null);
        try {
            await withFirestoreRetry(() => deleteResume(id, user.uid));
            setResumes(prev => prev.filter(r => r.id !== id));
        } catch (err) {
            setError(friendlyFirestoreError(err));
        }
    };

    const handleShareUpdate = useCallback((id, patch) => {
        setResumes(prev => prev.map(r => (r.id === id ? { ...r, ...patch } : r)));
    }, []);

    const visibleResumes = useMemo(() => filterAndSortResumes(resumes, search, filter, sort), [resumes, search, filter, sort]);
    const recentResumes = useMemo(() => resumes.slice(0, 3), [resumes]);
    const isFiltering = search.trim() !== '' || filter !== 'all';
    const firstName = user.displayName ? user.displayName.split(' ')[0] : null;
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

    return (
        <div className="mx-auto mt-8 max-w-screen-xl px-4 pb-16 md:mt-10">
            {/* Hero */}
            <section className="relative mb-8 overflow-hidden rounded-3xl border border-line bg-surface p-6 shadow-ds-sm md:p-8">
                <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.4] [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" aria-hidden="true" />
                <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-accent/20 blur-3xl" aria-hidden="true" />
                <div className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" aria-hidden="true" />
                <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                    <div>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-2 px-2.5 py-1 text-xs font-medium text-fg-muted">
                            <Sparkles className="h-3 w-3 text-accent" /> Your workspace
                        </span>
                        <h1 className="mt-3 text-2xl font-bold tracking-tight text-fg md:text-3xl">
                            {greeting}{firstName ? `, ${firstName}` : ''} 👋
                        </h1>
                        <p className="mt-1 text-sm text-fg-muted">Let&apos;s build your next opportunity.</p>
                        <p className="mt-2 text-xs text-fg-subtle">
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

            {error && <ErrorMessage message={error} onRetry={fetchResumes} />}

            {loading ? (
                <SkeletonGrid />
            ) : resumes.length === 0 ? (
                <EmptyState
                    icon={Sparkles}
                    title="No resumes yet"
                    description="Create your first resume, or import an existing one to get started."
                    actionLabel="Create New Resume"
                    onAction={handleCreate}
                    secondaryAction={
                        <Button as={Link} href="/dashboard/import" variant="outline" size="md" leftIcon={<Upload className="h-4 w-4" />}>
                            Import instead
                        </Button>
                    }
                />
            ) : (
                <>
                    <DashboardStats resumes={resumes} />

                    <div className="mb-8">
                        <h2 className="mb-3 text-sm font-semibold text-fg-muted">Quick Actions</h2>
                        <QuickActions onAiGenerate={handleAiGenerate} aiGenerating={aiGenerating} />
                    </div>

                    <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <RecentActivity resumes={resumes} />
                        </div>
                        <AnalyticsSummary resumes={resumes} />
                    </div>

                    <SearchFilterSortBar
                        search={search}
                        onSearchChange={setSearch}
                        filter={filter}
                        onFilterChange={setFilter}
                        sort={sort}
                        onSortChange={setSort}
                        resultCount={visibleResumes.length}
                    />

                    {!isFiltering && recentResumes.length > 0 && (
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

                    <h2 className="mb-3 text-sm font-semibold text-fg-muted">{isFiltering ? 'Results' : 'All Resumes'}</h2>
                    {visibleResumes.length === 0 ? (
                        <EmptyState
                            icon={Sparkles}
                            title="No matching resumes"
                            description="Try a different search term or clear the filters."
                        />
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {visibleResumes.map(resume => (
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
                    )}
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
