'use client';

import { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Sparkles } from 'lucide-react';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import Button from '@/components/UI/Button';
import { useAuth } from '@/context/AuthContext';
import { getResume } from '@/lib/resumes';
import { withFirestoreRetry, friendlyFirestoreError } from '@/lib/firestoreErrors';
import { loadResume } from '@/store/slices/resumeSlice';
import useAutoSave from '@/hooks/useAutoSave';
import useUndoRedo from '@/hooks/useUndoRedo';
import { useToast } from '@/context/ToastContext';
import TopBar from '@/components/Editor/TopBar';
import WorkspaceLayout from '@/components/Editor/WorkspaceLayout';
import SectionSidebar from '@/components/Editor/SectionSidebar';
import SectionCanvas from '@/components/Editor/SectionCanvas';
import MobileBottomNav from '@/components/Editor/MobileBottomNav';
import Preview from '@/components/Resume/PreviewClient';
import TemplateCarousel from '@/components/Resume/TemplateCarousel';
import ResumeFields from '@/config/ResumeFields';
import ErrorMessage from '@/components/UI/ErrorMessage';

const VersionHistoryDrawer = dynamic(() => import('@/components/Editor/VersionHistoryDrawer'), { ssr: false });
const AIAssistantPanel = dynamic(() => import('@/components/AIAssistant/AIAssistantPanel'), { ssr: false });

const DEFAULT_TAB = 'contact';

const EditorContent = () => {
    const { resumeId } = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const dispatch = useDispatch();
    const { user } = useAuth();
    const resume = useSelector(state => state.resume);

    const [historyOpen, setHistoryOpen] = useState(false);
    const [previewMode, setPreviewMode] = useState(false); // mobile edit/preview toggle
    // Dashboard's "AI Generate" quick action links here with ?ai=1 so the AI
    // Assistant panel opens pre-expanded instead of collapsed by default.
    const [aiOpen, setAiOpen] = useState(() => searchParams?.get('ai') === '1');
    const [downloadInfo, setDownloadInfo] = useState({ url: null, filename: null });
    // Metadata that lives on the Firestore doc but not in the Redux content
    // slice (name, public-share state) — captured alongside `loadResume` so
    // the TopBar can display/share it without touching the resume reducer.
    const [resumeMeta, setResumeMeta] = useState(null);

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
                setResumeMeta({
                    id: resumeId,
                    name: data.name,
                    isPublic: data.isPublic,
                    slug: data.slug,
                    customSlug: data.customSlug,
                    ownerId: data.ownerId,
                });
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

    const handleResumeMetaUpdate = useCallback((id, patch) => {
        setResumeMeta(prev => (prev ? { ...prev, ...patch } : prev));
    }, []);

    const handlePreviewReady = useCallback(info => setDownloadInfo(info), []);

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

    const previewPane = <Preview onReady={handlePreviewReady} />;

    const formPane = (
        <div className="flex h-full flex-col gap-5 pb-24 md:pb-4">
            <div className="rounded-2xl border border-line bg-surface p-3 shadow-ds-sm md:p-4">
                <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-fg-subtle">Template</h2>
                <TemplateCarousel />
            </div>

            <div className="flex flex-1 flex-col gap-5 md:flex-row">
                <div className="shrink-0 rounded-2xl border border-line bg-surface p-2 shadow-ds-sm md:w-52 md:p-3">
                    <SectionSidebar activeTab={tab} />
                </div>

                <div className="flex-1 rounded-2xl border border-line bg-surface p-4 shadow-ds-sm md:p-6">
                    <SectionCanvas tab={tab} />
                </div>
            </div>

            <div className="rounded-2xl border border-line bg-surface shadow-ds-sm">
                <button
                    type="button"
                    onClick={() => setAiOpen(o => !o)}
                    aria-expanded={aiOpen}
                    className="flex w-full items-center justify-between gap-2 rounded-2xl px-4 py-3.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:px-6"
                >
                    <span className="flex items-center gap-2 text-sm font-semibold text-fg md:text-base">
                        <Sparkles className="h-4 w-4 text-accent" /> AI Assistant
                    </span>
                    <ChevronDown className={`h-4 w-4 text-fg-muted transition-transform ${aiOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence initial={false}>
                    {aiOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className="overflow-hidden"
                        >
                            <div className="px-4 pb-5 md:px-6">
                                <AIAssistantPanel />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen flex-col">
            <TopBar
                resumeName={resumeMeta?.name}
                resumeMeta={resumeMeta}
                uid={user.uid}
                onResumeMetaUpdate={handleResumeMetaUpdate}
                saveStatus={saveStatus}
                onRetrySave={retry}
                undo={undo}
                redo={redo}
                canUndo={canUndo}
                canRedo={canRedo}
                onHistoryClick={() => setHistoryOpen(true)}
                previewMode={previewMode}
                onTogglePreviewMode={() => setPreviewMode(p => !p)}
                download={downloadInfo}
            />

            <div className="mx-auto flex w-full max-w-screen-2xl flex-1 flex-col gap-0 px-4 py-4 md:min-h-[calc(100vh-8.5rem)] md:px-6">
                <WorkspaceLayout left={formPane} right={previewPane} previewMode={previewMode} />
            </div>

            <MobileBottomNav activeTab={tab} />

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
