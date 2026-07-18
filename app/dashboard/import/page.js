'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Wand2, RotateCcw, Save } from 'lucide-react';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import Button from '@/components/UI/Button';
import FileDropzone from '@/components/ImportExport/FileDropzone';
import ImportReview from '@/components/ImportExport/ImportReview';
import DuplicateResolver from '@/components/ImportExport/DuplicateResolver';
import ErrorMessage from '@/components/UI/ErrorMessage';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { uploadFileWithProgress } from '@/lib/importExport/upload';
import { parseBackupJson, BackupValidationError, portableToFields } from '@/lib/importExport/backup';
import { detectDuplicates, mergeResumes } from '@/lib/importExport/duplicates';
import { recordImport } from '@/lib/importExport/history';
import { createResume, updateResume, listResumesForUser, saveVersionSnapshot } from '@/lib/resumes';
import { normalizeImportedResume, computeMissingFields, computeHeuristicConfidence } from '@/lib/import/normalize';
import { detectFormat } from '@/lib/import/validation';
import { DEFAULT_TEMPLATE_ID } from '@/config/templates';

const STEP_LABELS = { upload: 'Upload', review: 'Review & Edit' };

const ImportContent = () => {
    const { user } = useAuth();
    const router = useRouter();
    const { showToast } = useToast();

    const [step, setStep] = useState('upload');
    const [error, setError] = useState('');
    const [progress, setProgress] = useState(null);
    const [phase, setPhase] = useState(''); // 'extracting' | 'parsing' | 'cleaning'

    const [fileMeta, setFileMeta] = useState(null); // { fileName, source }
    const [originalText, setOriginalText] = useState('');
    const [resume, setResume] = useState(null);
    const [parseInfo, setParseInfo] = useState({ confidence: 0, missingFields: [], suggestions: [] });
    const [cleanup, setCleanup] = useState(null);
    const [cleanupLoading, setCleanupLoading] = useState(false);

    const [saving, setSaving] = useState(false);
    const [duplicateMatches, setDuplicateMatches] = useState(null);

    const busy = progress !== null;

    // Best-effort history logging — a Firestore hiccup here must never break the import UX.
    const logHistory = useCallback(
        async entry => {
            try {
                await recordImport(user.uid, entry);
            } catch (err) {
                console.warn('Could not record import history:', err);
            }
        },
        [user.uid]
    );

    const runCleanup = useCallback(
        async targetResume => {
            setCleanupLoading(true);
            try {
                const res = await fetch('/api/import/cleanup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ resume: targetResume }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data?.error || 'AI cleanup failed.');
                setResume(data.resume);
                setCleanup({
                    changes: data.changes || [],
                    missingSkills: data.missingSkills || [],
                    atsRecommendations: data.atsRecommendations || [],
                });
                showToast('AI cleanup applied.', { tone: 'success' });
            } catch (err) {
                showToast(err.message || 'AI cleanup failed — your import is unchanged.', { tone: 'error' });
            } finally {
                setCleanupLoading(false);
            }
        },
        [showToast]
    );

    const handleFile = useCallback(
        async (file, rejectionError) => {
            setError('');
            if (rejectionError) {
                setError(rejectionError);
                return;
            }
            if (!file) return;

            const format = detectFormat(file.name, file.type);

            try {
                if (format === 'json') {
                    // JSON backups never leave the browser.
                    setProgress(100);
                    setPhase('parsing');
                    const text = await file.text();
                    const backup = parseBackupJson(text);
                    const first = backup.resumes[0];
                    const normalized = normalizeImportedResume(first);
                    setFileMeta({ fileName: file.name, source: backup.kind === 'backup' ? 'backup' : 'json', name: first.name, selectedTemplate: first.selectedTemplate });
                    setOriginalText(JSON.stringify(JSON.parse(text), null, 2).slice(0, 20000));
                    setResume(normalized);
                    setParseInfo({
                        confidence: computeHeuristicConfidence(normalized),
                        missingFields: computeMissingFields(normalized),
                        suggestions: backup.resumes.length > 1 ? [`This backup contains ${backup.resumes.length} resumes — only the first is imported here. Use Restore on the Export page to bring back all of them.`] : [],
                    });
                    setCleanup(null);
                    setStep('review');
                    setProgress(null);
                    setPhase('');
                    return;
                }

                // PDF / DOCX: extract server-side (in memory), then AI-parse.
                setProgress(0);
                setPhase('extracting');
                const extracted = await uploadFileWithProgress('/api/import/extract', file, { onProgress: setProgress });

                setPhase('parsing');
                const res = await fetch('/api/import/parse', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: extracted.text }),
                });
                const parsed = await res.json();
                if (!res.ok) throw new Error(parsed?.error || 'Could not parse this resume.');

                setFileMeta({ fileName: file.name, source: format });
                setOriginalText(extracted.text);
                setResume(parsed.resume);
                setParseInfo({
                    confidence: parsed.confidence ?? computeHeuristicConfidence(parsed.resume),
                    missingFields: parsed.missingFields || [],
                    suggestions: parsed.suggestions || [],
                });
                setCleanup(null);
                setStep('review');
                setProgress(null);
                setPhase('');

                // Feature 9: AI cleanup runs automatically after import; failures are non-fatal.
                runCleanup(parsed.resume);
            } catch (err) {
                setProgress(null);
                setPhase('');
                const message = err instanceof BackupValidationError ? err.message : err.message || 'Import failed.';
                setError(message);
                logHistory({
                    fileName: file.name,
                    source: format || 'unknown',
                    status: 'failed',
                    parseSuccess: false,
                    error: message,
                });
            }
        },
        [logHistory, runCleanup]
    );

    const persistResume = useCallback(
        async action => {
            setSaving(true);
            try {
                const fields = portableToFields(normalizeImportedResume(resume));
                let resumeId;
                let resumeName;

                if (action.type === 'merge' || action.type === 'replace') {
                    const existing = action.match.resume;
                    resumeId = existing.id;
                    resumeName = existing.name;
                    // Snapshot before mutating so the change is reversible from Version History.
                    const { id, ownerId, createdAt, updatedAt, ...existingFields } = existing;
                    await saveVersionSnapshot(resumeId, {
                        contact: existingFields.contact || {},
                        summary: existingFields.summary || {},
                        education: existingFields.education || [],
                        experience: existingFields.experience || [],
                        projects: existingFields.projects || [],
                        skills: existingFields.skills || {},
                        certificates: existingFields.certificates || [],
                        languages: existingFields.languages || [],
                        selectedTemplate: existingFields.selectedTemplate || DEFAULT_TEMPLATE_ID,
                    });
                    const nextFields = action.type === 'merge' ? mergeResumes(existing, fields) : fields;
                    await updateResume(resumeId, nextFields, user.uid);
                } else {
                    resumeName = fileMeta?.name || (resume.contact?.name ? `${resume.contact.name} (Imported)` : 'Imported Resume');
                    resumeId = await createResume(user.uid, resumeName, fileMeta?.selectedTemplate || DEFAULT_TEMPLATE_ID);
                    await updateResume(resumeId, fields, user.uid);
                }

                await logHistory({
                    fileName: fileMeta?.fileName,
                    source: fileMeta?.source,
                    status: 'success',
                    parseSuccess: true,
                    confidence: parseInfo.confidence,
                    resumeId,
                    resumeName,
                });

                showToast(
                    action.type === 'merge' ? 'Import merged into existing resume.' : action.type === 'replace' ? 'Resume replaced with the import.' : 'Resume imported successfully.',
                    { tone: 'success' }
                );
                router.push(`/editor/${resumeId}`);
            } catch (err) {
                setSaving(false);
                setDuplicateMatches(null);
                setError('Could not save the imported resume. Please try again.');
            }
        },
        [resume, fileMeta, parseInfo.confidence, user.uid, router, showToast, logHistory]
    );

    const handleSave = useCallback(async () => {
        setError('');
        setSaving(true);
        try {
            const existing = await listResumesForUser(user.uid);
            const matches = detectDuplicates(normalizeImportedResume(resume), existing);
            if (matches.length > 0) {
                setSaving(false);
                setDuplicateMatches(matches);
                return;
            }
        } catch (err) {
            // If duplicate detection can't load resumes, fall through and save as new.
        }
        await persistResume({ type: 'new' });
    }, [resume, user.uid, persistResume]);

    const handleResolveDuplicate = useCallback(
        (actionId, match) => {
            setDuplicateMatches(null);
            if (actionId === 'merge') persistResume({ type: 'merge', match });
            else if (actionId === 'replace') persistResume({ type: 'replace', match });
            else persistResume({ type: 'new' });
        },
        [persistResume]
    );

    const reset = useCallback(() => {
        setStep('upload');
        setError('');
        setResume(null);
        setOriginalText('');
        setFileMeta(null);
        setCleanup(null);
        setParseInfo({ confidence: 0, missingFields: [], suggestions: [] });
    }, []);

    return (
        <div className="mx-auto mt-10 max-w-screen-xl px-4 pb-10 md:mt-12">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-fg md:text-3xl">Import Resume</h1>
                <p className="mt-1 text-sm text-fg-muted">
                    Upload an existing resume (PDF, DOCX, or JSON backup) and let AI convert it into an editable resume.
                    Files are processed in memory and never stored.
                </p>
            </div>

            <nav aria-label="Import progress" className="mb-6 flex items-center gap-2 text-xs font-semibold">
                {Object.entries(STEP_LABELS).map(([key, label], index) => (
                    <div key={key} className="flex items-center gap-2">
                        {index > 0 && <span className="text-fg-subtle" aria-hidden="true">→</span>}
                        <span
                            aria-current={step === key ? 'step' : undefined}
                            className={`rounded-full border px-3 py-1 ${
                                step === key ? 'border-accent bg-accent text-accent-fg' : 'border-line text-fg-muted'
                            }`}
                        >
                            {index + 1}. {label}
                        </span>
                    </div>
                ))}
            </nav>

            {error && (
                <div className="mb-6">
                    <ErrorMessage message={error} onRetry={step === 'upload' ? undefined : reset} />
                </div>
            )}

            {step === 'upload' && (
                <>
                    <FileDropzone
                        onFile={handleFile}
                        disabled={busy}
                        progress={progress}
                        busyLabel={phase === 'parsing' ? 'AI is parsing your resume...' : 'Extracting text...'}
                    />
                    {busy && (
                        <p className="mt-4 text-center text-sm text-fg-muted" role="status" aria-live="polite">
                            {phase === 'parsing' ? 'Converting the extracted text into structured resume data with AI…' : 'Uploading and extracting text from your file…'}
                        </p>
                    )}
                    <p className="mt-6 text-center text-xs text-fg-subtle">
                        Looking for a backup you exported earlier? JSON backups restore instantly — or use{' '}
                        <Link href="/dashboard/export" className="text-accent underline">
                            the Export Center
                        </Link>{' '}
                        to restore full account backups.
                    </p>
                </>
            )}

            {step === 'review' && resume && (
                <>
                    <ImportReview
                        originalText={originalText}
                        resume={resume}
                        confidence={parseInfo.confidence}
                        missingFields={parseInfo.missingFields}
                        suggestions={parseInfo.suggestions}
                        cleanup={cleanup}
                        onChange={setResume}
                    />

                    <div className="sticky bottom-4 mt-8 flex flex-wrap items-center justify-end gap-3 rounded-2xl border border-line bg-surface/95 p-4 shadow-ds-lg backdrop-blur">
                        <Button
                            variant="ghost"
                            onClick={reset}
                            disabled={saving || cleanupLoading}
                            leftIcon={<RotateCcw className="h-4 w-4" aria-hidden="true" />}
                        >
                            Start over
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => runCleanup(resume)}
                            disabled={saving || cleanupLoading}
                            loading={cleanupLoading}
                            leftIcon={!cleanupLoading ? <Wand2 className="h-4 w-4" aria-hidden="true" /> : null}
                        >
                            {cleanupLoading ? 'Cleaning up…' : cleanup ? 'Re-run AI cleanup' : 'Run AI cleanup'}
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={saving || cleanupLoading}
                            loading={saving}
                            leftIcon={!saving ? <Save className="h-4 w-4" aria-hidden="true" /> : null}
                        >
                            {saving ? 'Saving…' : 'Save resume'}
                        </Button>
                    </div>
                </>
            )}

            {duplicateMatches && (
                <DuplicateResolver
                    matches={duplicateMatches}
                    busy={saving}
                    onResolve={handleResolveDuplicate}
                    onCancel={() => setDuplicateMatches(null)}
                />
            )}
        </div>
    );
};

const ImportPage = () => (
    <ProtectedRoute>
        <ImportContent />
    </ProtectedRoute>
);

export default ImportPage;
