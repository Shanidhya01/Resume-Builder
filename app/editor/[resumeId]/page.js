'use client';

import { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { Undo2, Redo2, History } from 'lucide-react';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import Button from '@/components/UI/Button';
import { useAuth } from '@/context/AuthContext';
import { getResume } from '@/lib/resumes';
import { withFirestoreRetry, friendlyFirestoreError } from '@/lib/firestoreErrors';
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

    const [historyOpen, setHistoryOpen] = useState(false);
    // Tracks which resume Redux has actually been hydrated from Firestore.
    // Autosave stays disabled until this matches the current resumeId, so a
    // pre-load / stale-navigation Redux state can never be written over the doc.
    const [hydratedId, setHydratedId] = useState(null);
    // Errors are tagged with the resumeId they belong to, so navigating to a
    // different resume clears a stale error without a synchronous effect reset.
    const [errorState, setErrorState] = useState(null);

    const requestedTab = searchParams?.get('tab');
    const tab = requestedTab && ResumeFields[requestedTab] ? requestedTab : DEFAULT_TAB;

    // Bumping reloadKey re-runs the load for retry / post-restore refresh.
    const [reloadKey, setReloadKey] = useState(0);

    // Derived, so switching resumeId instantly reflects the new resume's state
    // without any in-effect setState (which React flags as cascading renders).
    const error = errorState?.id === resumeId ? errorState.message : '';
    const loading = !error && hydratedId !== resumeId;

    useEffect(() => {
        let cancelled = false;
        withFirestoreRetry(() => getResume(resumeId))
            .then(data => {
                if (cancelled) return;
                if (!data) {
                    setErrorState({ id: resumeId, message: 'Resume not found. It may have been deleted.' });
                    return;
                }
                if (data.ownerId !== user.uid) {
                    setErrorState({ id: resumeId, message: 'You do not have access to this resume.' });
                    return;
                }
                dispatch(loadResume(data));
                setHydratedId(resumeId);
            })
            .catch(err => {
                if (!cancelled) setErrorState({ id: resumeId, message: friendlyFirestoreError(err) });
            });
        return () => {
            cancelled = true;
        };
    }, [resumeId, user.uid, dispatch, reloadKey]);

    const loadFromFirestore = useCallback(() => {
        setErrorState(null);
        setReloadKey(k => k + 1);
    }, []);

    // Only autosave once Firestore has finished hydrating Redux for THIS resume.
    const autoSaveEnabled = hydratedId === resumeId && !error;
    const { status: saveStatus, retry } = useAutoSave(resumeId, resume, user.uid, autoSaveEnabled);
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
                <Button variant="primary" fullWidth className="mt-4" onClick={() => router.push('/dashboard')}>
                    Back to Dashboard
                </Button>
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
                            <Undo2 className="h-4 w-4" />
                        </ToolbarButton>
                        <ToolbarButton onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Shift+Z)" ariaLabel="Redo">
                            <Redo2 className="h-4 w-4" />
                        </ToolbarButton>
                        <button
                            onClick={() => setHistoryOpen(true)}
                            className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                        >
                            <History className="h-3.5 w-3.5" /> <span className="hidden sm:inline">History</span>
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
