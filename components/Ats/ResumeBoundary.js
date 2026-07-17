'use client';

import { useRouter } from 'next/navigation';
import useHydratedResume from '@/hooks/useHydratedResume';
import EmptyState from '@/components/UI/EmptyState';
import ErrorMessage from '@/components/UI/ErrorMessage';

/**
 * Gate for analytics / insight pages. Ensures the resume is hydrated from
 * Firestore (the source of truth) before its children — which read the Redux
 * resume slice and run the ATS engine — are mounted. This is what makes those
 * pages survive a hard refresh instead of analyzing an empty Redux state.
 *
 * Children only mount once status is 'ready', so the ATS hooks inside them are
 * never called against un-hydrated data and the rules of hooks stay intact.
 */
const ResumeBoundary = ({ children }) => {
    const { status, retry } = useHydratedResume();
    const router = useRouter();

    if (status === 'loading') {
        return (
            <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-live="polite">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-line border-t-accent" />
                <span className="sr-only">Loading your resume…</span>
            </div>
        );
    }

    if (status === 'empty') {
        return (
            <div className="mx-auto mt-10 max-w-screen-xl px-4">
                <EmptyState
                    title="No resume to analyze yet"
                    description="Create your first resume, then come back to see its analytics."
                    actionLabel="Create New Resume"
                    onAction={() => router.push('/dashboard?create=true')}
                />
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="mx-auto mt-10 max-w-md px-4">
                <ErrorMessage
                    message="Unable to load your resume from the database. Please check your internet connection and try again."
                    onRetry={retry}
                />
            </div>
        );
    }

    return children;
};

export default ResumeBoundary;
