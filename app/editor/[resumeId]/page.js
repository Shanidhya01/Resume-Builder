'use client';

import { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { FaRedo, FaUndo, FaHistory } from 'react-icons/fa';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { getResume } from '@/lib/resumes';
import { loadResume } from '@/store/slices/resumeSlice';
import useAutoSave from '@/hooks/useAutoSave';
import useUndoRedo from '@/hooks/useUndoRedo';
import { useToast } from '@/context/ToastContext';
import Editor from '@/components/Editor';
import Preview from '@/components/Resume/PreviewClient';
import Tabs from '@/components/Tabs';
import TemplateSwitcher from '@/components/Resume/TemplateSwitcher';
import ResumeFields from '@/config/ResumeFields';
import ErrorMessage from '@/components/UI/ErrorMessage';

const VersionHistoryDrawer = dynamic(() => import('@/components/Editor/VersionHistoryDrawer'), { ssr: false });
const AIAssistantPanel = dynamic(() => import('@/components/AIAssistant/AIAssistantPanel'), { ssr: false });

const DEFAULT_TAB = 'contact';

const SaveStatusPill = ({ status, onRetry }) => {
    const config = {
        idle: { label: 'Auto-save enabled', color: 'bg-fg-muted' },
        saving: { label: 'Saving...', color: 'bg-yellow-500 animate-pulse' },
        saved: { label: 'Saved', color: 'bg-green-500' },
        error: { label: 'Save failed', color: 'bg-red-500' },
    }[status] || { label: 'Idle', color: 'bg-fg-muted' };

    return (
        <div className="flex items-center gap-2 text-sm text-fg-muted">
            <div className={`h-2 w-2 rounded-full transition-colors duration-300 ${config.color}`}></div>
            <span>{config.label}</span>
            {status === 'error' && (
                <button onClick={onRetry} className="text-xs font-semibold text-accent underline">
                    Retry
                </button>
            )}
        </div>
    );
};

const ToolbarButton = ({ onClick, disabled, title, ariaLabel, children }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        title={title}
        aria-label={ariaLabel}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
        {children}
    </button>
);

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

    // Data loads in the effect via promise callbacks (no sync setState in the
    // effect body); bumping reloadKey re-runs it for retry / post-restore refresh.
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let cancelled = false;
        getResume(resumeId)
            .then(data => {
                if (cancelled) return;
                if (!data) {
                    setError('Resume not found.');
                    return;
                }
                if (data.ownerId !== user.uid) {
                    setError('You do not have access to this resume.');
                    return;
                }
                dispatch(loadResume(data));
                setError('');
            })
            .catch(() => {
                if (!cancelled) setError('Could not load this resume.');
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [resumeId, user.uid, dispatch, reloadKey]);

    const loadFromFirestore = useCallback(() => {
        setLoading(true);
        setError('');
        setReloadKey(k => k + 1);
    }, []);

    const { status: saveStatus, retry } = useAutoSave(resumeId, resume, user.uid);
    const { undo, redo, canUndo, canRedo } = useUndoRedo(resume);
    const { info } = useToast();

    // Keyboard shortcuts (Feature 2). Undo/redo only fire when focus is NOT in a
    // text field, so native in-field text undo keeps working while typing.
    useEffect(() => {
        const isEditable = el => {
            if (!el) return false;
            const tag = el.tagName;
            return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable;
        };
        const handler = e => {
            const mod = e.ctrlKey || e.metaKey;
            if (!mod) return;
            const key = e.key.toLowerCase();
            if (key === 's') {
                e.preventDefault();
                info('Changes save automatically.');
                return;
            }
            if (isEditable(e.target)) return;
            if (key === 'z' && !e.shiftKey) {
                e.preventDefault();
                undo();
            } else if ((key === 'z' && e.shiftKey) || key === 'y') {
                e.preventDefault();
                redo();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [undo, redo, info]);

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-line border-t-accent"></div>
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
        <div className="mx-auto mt-6 flex max-w-screen-xl 2xl:max-w-screen-2xl flex-col-reverse gap-6 px-4 pb-10 md:flex-row md:mt-10 2xl:mt-14 2xl:gap-10">
            {/* Live preview — sticky on desktop so it stays in view while editing (split screen). */}
            <div className="flex-1 md:sticky md:top-24 md:self-start">
                <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
                    <Preview />
                </div>
            </div>

            <div className="flex flex-1 flex-col gap-4">
                {/* Sticky toolbar */}
                <div className="sticky top-20 z-20 flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface/95 p-3 shadow-sm backdrop-blur">
                    <SaveStatusPill status={saveStatus} onRetry={retry} />
                    <div className="flex items-center gap-2">
                        <ToolbarButton onClick={undo} disabled={!canUndo} title="Undo (Ctrl+Z)" ariaLabel="Undo">
                            <FaUndo className="h-3.5 w-3.5" />
                        </ToolbarButton>
                        <ToolbarButton onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Shift+Z)" ariaLabel="Redo">
                            <FaRedo className="h-3.5 w-3.5" />
                        </ToolbarButton>
                        <button
                            onClick={() => setHistoryOpen(true)}
                            className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                        >
                            <FaHistory className="h-3 w-3" /> <span className="hidden sm:inline">History</span>
                        </button>
                    </div>
                </div>

                <div className="rounded-2xl border border-line bg-surface p-4 shadow-sm md:p-6">
                    <h2 className="mb-3 text-sm font-semibold text-fg md:text-base">Template</h2>
                    <TemplateSwitcher />
                </div>

                <div className="rounded-2xl border border-line bg-surface p-4 shadow-sm md:p-6">
                    <Tabs activeTab={tab} />
                </div>

                <div className="flex-grow rounded-2xl border border-line bg-surface p-4 shadow-sm md:p-6">
                    <Editor tab={tab} />
                </div>

                <div className="rounded-2xl border border-line bg-surface p-4 shadow-sm md:p-6">
                    <h2 className="mb-3 text-sm font-semibold text-fg md:text-base">AI Assistant</h2>
                    <AIAssistantPanel />
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
