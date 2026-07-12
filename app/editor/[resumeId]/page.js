'use client';

import { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { getResume } from '@/lib/resumes';
import { loadResume } from '@/store/slices/resumeSlice';
import useAutoSave from '@/hooks/useAutoSave';
import Editor from '@/components/Editor';
import Preview from '@/components/Resume/Preview';
import Tabs from '@/components/Tabs';
import TemplateSwitcher from '@/components/Resume/TemplateSwitcher';
import ResumeFields from '@/config/ResumeFields';
import ErrorMessage from '@/components/UI/ErrorMessage';

const VersionHistoryDrawer = dynamic(() => import('@/components/Editor/VersionHistoryDrawer'), { ssr: false });

const DEFAULT_TAB = 'contact';

const SaveStatusPill = ({ status, onRetry }) => {
    const config = {
        idle: { label: 'Auto-save enabled', color: 'bg-gray-400' },
        saving: { label: 'Saving...', color: 'bg-yellow-500 animate-pulse' },
        saved: { label: 'Saved', color: 'bg-green-500' },
        error: { label: 'Save failed', color: 'bg-red-500' },
    }[status] || { label: 'Idle', color: 'bg-gray-400' };

    return (
        <div className="flex items-center gap-2 text-sm text-gray-300">
            <div className={`h-2 w-2 rounded-full transition-colors duration-300 ${config.color}`}></div>
            <span>{config.label}</span>
            {status === 'error' && (
                <button onClick={onRetry} className="text-xs font-semibold text-primary-400 underline">
                    Retry
                </button>
            )}
        </div>
    );
};

const EditorContent = () => {
    const { resumeId } = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const dispatch = useDispatch();
    const { user } = useAuth();
    const resume = useSelector(state => state.resume);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [historyOpen, setHistoryOpen] = useState(false);

    const requestedTab = searchParams?.get('tab');
    const tab = requestedTab && ResumeFields[requestedTab] ? requestedTab : DEFAULT_TAB;

    const loadFromFirestore = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getResume(resumeId);
            if (!data) {
                setError('Resume not found.');
                return;
            }
            if (data.ownerId !== user.uid) {
                setError('You do not have access to this resume.');
                return;
            }
            dispatch(loadResume(data));
        } catch (err) {
            setError('Could not load this resume.');
        } finally {
            setLoading(false);
        }
    }, [resumeId, user.uid, dispatch]);

    useEffect(() => {
        loadFromFirestore();
    }, [loadFromFirestore]);

    const { status: saveStatus, retry } = useAutoSave(resumeId, resume, user.uid);

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500/30 border-t-purple-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mx-auto mt-16 max-w-md px-4">
                <ErrorMessage message={error} onRetry={loadFromFirestore} />
                <button onClick={() => router.push('/dashboard')} className="btn-filled mt-4 w-full justify-center">
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="mx-auto mt-10 flex max-w-screen-xl 2xl:max-w-screen-2xl flex-col-reverse gap-8 px-4 pb-10 md:flex-row md:mt-12 2xl:mt-16 2xl:gap-12">
            <div className="flex-1 rounded-xl border border-[#6F42C1] shadow-lg overflow-hidden transition-shadow duration-300 hover:shadow-2xl">
                <Preview />
            </div>

            <div className="flex-1 flex flex-col gap-4">
                <div className="flex items-center justify-between rounded-xl border border-[#6F42C1] shadow-md p-4 bg-transparent">
                    <SaveStatusPill status={saveStatus} onRetry={retry} />
                    <button
                        onClick={() => setHistoryOpen(true)}
                        className="text-xs font-semibold text-primary-400 underline"
                    >
                        Version History
                    </button>
                </div>

                <div className="rounded-xl border border-[#6F42C1] shadow-md p-4 md:p-6 transition-shadow duration-300 hover:shadow-lg bg-transparent">
                    <h2 className="mb-3 text-sm font-semibold text-gray-300 md:text-base">Template</h2>
                    <TemplateSwitcher />
                </div>

                <div className="rounded-xl border border-[#6F42C1] shadow-md p-4 md:p-6 transition-shadow duration-300 hover:shadow-lg bg-transparent">
                    <Tabs activeTab={tab} />
                </div>

                <div className="rounded-xl border border-[#6F42C1] shadow-md p-4 md:p-6 transition-shadow duration-300 hover:shadow-lg flex-grow bg-transparent">
                    <Editor tab={tab} />
                </div>
            </div>

            {historyOpen && (
                <VersionHistoryDrawer resumeId={resumeId} onClose={() => setHistoryOpen(false)} onRestored={loadFromFirestore} />
            )}
        </div>
    );
};

const ResumeEditorPage = () => (
    <ProtectedRoute>
        <EditorContent />
    </ProtectedRoute>
);

export default ResumeEditorPage;
