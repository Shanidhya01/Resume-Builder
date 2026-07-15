'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, FileType2, FileCode2, FileJson, Hash, DownloadCloud, UploadCloud } from 'lucide-react';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import Button from '@/components/UI/Button';
import DashboardNav from '@/components/Ats/DashboardNav';
import Card from '@/components/Ats/Card';
import Badge from '@/components/Ats/Badge';
import ErrorMessage from '@/components/UI/ErrorMessage';
import EmptyState from '@/components/UI/EmptyState';
import Skeleton from '@/components/UI/Skeleton';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { listResumesForUser, createResume, updateResume, saveVersionSnapshot } from '@/lib/resumes';
import { EXPORT_FORMATS, exportResume, triggerDownload, safeFileName } from '@/lib/importExport/exporters';
import { createBackupObject, parseBackupJson, portableToFields, BackupValidationError, BACKUP_VERSION } from '@/lib/importExport/backup';
import { mergeResumes } from '@/lib/importExport/duplicates';
import { recordImport } from '@/lib/importExport/history';
import { getTemplateById } from '@/config/templates';

const FORMAT_ICONS = {
    pdf: FileText,
    docx: FileType2,
    html: FileCode2,
    markdown: Hash,
    json: FileJson,
};

const RESTORE_MODES = [
    { id: 'new', label: 'Restore as new resumes', description: 'Every resume in the backup is added as a new resume. Nothing is overwritten.' },
    { id: 'replace', label: 'Replace selected resume', description: 'The selected resume is overwritten with the first resume in the backup (a version snapshot is saved first).' },
    { id: 'merge', label: 'Merge into selected resume', description: 'New entries and skills from the backup are added to the selected resume (a version snapshot is saved first).' },
];

const ExportContent = () => {
    const { user } = useAuth();
    const router = useRouter();
    const { showToast } = useToast();

    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedId, setSelectedId] = useState('');
    const [exporting, setExporting] = useState(''); // format id currently exporting

    const [restoreFile, setRestoreFile] = useState(null);
    const [restoreBackup, setRestoreBackup] = useState(null);
    const [restoreMode, setRestoreMode] = useState('new');
    const [restoring, setRestoring] = useState(false);
    const restoreInputRef = useRef(null);

    // Data loads in the effect via promise callbacks (no sync setState in the
    // effect body); bumping reloadKey re-runs it for retry and post-restore refresh.
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let cancelled = false;
        listResumesForUser(user.uid)
            .then(list => {
                if (cancelled) return;
                setResumes(list);
                setSelectedId(prev => prev || list[0]?.id || '');
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

    const retryFetch = useCallback(() => {
        setLoading(true);
        setError('');
        setReloadKey(k => k + 1);
    }, []);

    const selectedResume = useMemo(() => resumes.find(r => r.id === selectedId) || null, [resumes, selectedId]);

    const handleExport = async format => {
        if (!selectedResume) return;
        setExporting(format);
        try {
            await exportResume(format, selectedResume);
            showToast(`${format.toUpperCase()} export downloaded.`, { tone: 'success' });
        } catch (err) {
            console.error('Export failed:', err);
            showToast(`Could not export as ${format.toUpperCase()}. Please try again.`, { tone: 'error' });
        } finally {
            setExporting('');
        }
    };

    const handleBackupDownload = () => {
        const backup = createBackupObject(resumes);
        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json;charset=utf-8' });
        const stamp = new Date().toISOString().slice(0, 10);
        triggerDownload(blob, safeFileName(`hireready-backup-v${BACKUP_VERSION}-${stamp}`, 'json'));
        showToast(`Backup of ${resumes.length} resume${resumes.length !== 1 ? 's' : ''} downloaded.`, { tone: 'success' });
    };

    const handleRestoreFile = async event => {
        const file = event.target.files?.[0];
        event.target.value = '';
        if (!file) return;
        setRestoreFile(file.name);
        setRestoreBackup(null);
        try {
            const parsed = parseBackupJson(await file.text());
            setRestoreBackup(parsed);
        } catch (err) {
            const message = err instanceof BackupValidationError ? err.message : 'Could not read this backup file.';
            showToast(message, { tone: 'error' });
            setRestoreFile(null);
        }
    };

    const handleRestore = async () => {
        if (!restoreBackup) return;
        if ((restoreMode === 'replace' || restoreMode === 'merge') && !selectedResume) {
            showToast('Select a resume to restore into first.', { tone: 'error' });
            return;
        }

        setRestoring(true);
        try {
            let toastMessage;
            if (restoreMode === 'new') {
                for (const portable of restoreBackup.resumes) {
                    const id = await createResume(user.uid, `${portable.name} (Restored)`, portable.selectedTemplate);
                    await updateResume(id, portableToFields(portable), user.uid);
                }
                toastMessage = `Restored ${restoreBackup.resumes.length} resume${restoreBackup.resumes.length !== 1 ? 's' : ''} from backup.`;
            } else {
                const portable = restoreBackup.resumes[0];
                const { id, ownerId, createdAt, updatedAt, ...existingFields } = selectedResume;
                await saveVersionSnapshot(selectedResume.id, {
                    contact: existingFields.contact || {},
                    summary: existingFields.summary || {},
                    education: existingFields.education || [],
                    experience: existingFields.experience || [],
                    projects: existingFields.projects || [],
                    skills: existingFields.skills || {},
                    certificates: existingFields.certificates || [],
                    languages: existingFields.languages || [],
                });
                const fields = restoreMode === 'merge' ? mergeResumes(selectedResume, portableToFields(portable)) : portableToFields(portable);
                await updateResume(selectedResume.id, fields, user.uid);
                toastMessage = restoreMode === 'merge' ? 'Backup merged into the selected resume.' : 'Selected resume replaced from backup.';
            }

            try {
                await recordImport(user.uid, {
                    fileName: restoreFile,
                    source: 'backup',
                    status: 'success',
                    parseSuccess: true,
                    confidence: 100,
                    resumeName: restoreMode === 'new' ? null : selectedResume?.name,
                    resumeId: restoreMode === 'new' ? null : selectedResume?.id,
                });
            } catch (err) {
                console.warn('Could not record restore in history:', err);
            }

            showToast(toastMessage, { tone: 'success' });
            setRestoreFile(null);
            setRestoreBackup(null);
            setReloadKey(k => k + 1);
        } catch (err) {
            console.error('Restore failed:', err);
            showToast('Restore failed. Your resumes were not changed.', { tone: 'error' });
        } finally {
            setRestoring(false);
        }
    };

    return (
        <div className="mx-auto mt-10 max-w-screen-xl px-4 pb-10 md:mt-12">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-fg md:text-3xl">Export Resume</h1>
                <p className="mt-1 text-sm text-fg-muted">
                    Download your resume in any format, or back up and restore everything. Files are generated on demand — nothing is stored.
                </p>
            </div>

            <DashboardNav />

            {error && <ErrorMessage message={error} onRetry={retryFetch} />}

            {loading ? (
                <div className="space-y-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-48 w-full" />
                </div>
            ) : resumes.length === 0 ? (
                <EmptyState
                    title="Nothing to export yet"
                    description="Create or import a resume first, then come back to export it."
                    actionLabel="Import a Resume"
                    onAction={() => router.push('/dashboard/import')}
                />
            ) : (
                <div className="space-y-6">
                    <Card title="Choose a resume">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <label htmlFor="export-resume-select" className="sr-only">
                                Resume to export
                            </label>
                            <select
                                id="export-resume-select"
                                value={selectedId}
                                onChange={e => setSelectedId(e.target.value)}
                                className="w-full max-w-md rounded-xl border border-line bg-surface-2 px-3 py-2 text-sm text-fg outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/30"
                            >
                                {resumes.map(resume => (
                                    <option key={resume.id} value={resume.id}>
                                        {resume.name}
                                    </option>
                                ))}
                            </select>
                            {selectedResume && (
                                <Badge>{getTemplateById(selectedResume.selectedTemplate)?.name} template</Badge>
                            )}
                        </div>
                    </Card>

                    <Card title="Export formats">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                            {EXPORT_FORMATS.map(format => {
                                const Icon = FORMAT_ICONS[format.id];
                                const isExporting = exporting === format.id;
                                return (
                                    <button
                                        key={format.id}
                                        type="button"
                                        disabled={Boolean(exporting) || !selectedResume}
                                        onClick={() => handleExport(format.id)}
                                        aria-label={`Export as ${format.label}. ${format.description}`}
                                        className="flex flex-col items-center gap-2 rounded-xl border border-line bg-surface p-5 text-center transition-all hover:-translate-y-0.5 hover:border-accent hover:bg-accent/5 hover:shadow-ds-md focus:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <Icon className={`h-8 w-8 ${isExporting ? 'animate-pulse text-accent' : 'text-accent'}`} aria-hidden="true" />
                                        <span className="text-sm font-bold text-fg">{isExporting ? 'Generating…' : format.label}</span>
                                        <span className="text-xs text-fg-muted">{format.description}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </Card>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <Card title="Backup">
                            <p className="mb-4 text-sm text-fg-muted">
                                Download a versioned JSON backup of all {resumes.length} resume{resumes.length !== 1 ? 's' : ''} — contacts, content,
                                and template choices. Keep it safe; you can restore it any time.
                            </p>
                            <Button onClick={handleBackupDownload} leftIcon={<DownloadCloud className="h-4 w-4" aria-hidden="true" />}>
                                Download full backup
                            </Button>
                        </Card>

                        <Card title="Restore">
                            <p className="mb-4 text-sm text-fg-muted">Upload a HireReady backup file (.json) to bring your resumes back.</p>

                            <input
                                ref={restoreInputRef}
                                type="file"
                                accept="application/json,.json"
                                onChange={handleRestoreFile}
                                className="sr-only"
                                aria-label="Choose a backup file to restore"
                            />
                            <Button
                                variant="outline"
                                onClick={() => restoreInputRef.current?.click()}
                                disabled={restoring}
                                leftIcon={<UploadCloud className="h-4 w-4" aria-hidden="true" />}
                            >
                                {restoreFile ? `Selected: ${restoreFile}` : 'Choose backup file'}
                            </Button>

                            {restoreBackup && (
                                <div className="mt-4 space-y-3">
                                    <p className="text-xs text-fg-muted">
                                        Backup contains <span className="font-semibold text-fg">{restoreBackup.resumes.length}</span> resume
                                        {restoreBackup.resumes.length !== 1 ? 's' : ''}
                                        {restoreBackup.exportedAt ? ` · exported ${new Date(restoreBackup.exportedAt).toLocaleDateString()}` : ''}
                                        {restoreBackup.version ? ` · format v${restoreBackup.version}` : ''}
                                    </p>
                                    <fieldset>
                                        <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent">Restore mode</legend>
                                        <div className="space-y-2">
                                            {RESTORE_MODES.map(mode => (
                                                <label key={mode.id} className="flex cursor-pointer items-start gap-2 rounded-lg border border-line p-3 hover:bg-accent/5">
                                                    <input
                                                        type="radio"
                                                        name="restore-mode"
                                                        value={mode.id}
                                                        checked={restoreMode === mode.id}
                                                        onChange={() => setRestoreMode(mode.id)}
                                                        className="mt-0.5 accent-accent"
                                                    />
                                                    <span>
                                                        <span className="block text-sm font-semibold text-fg">{mode.label}</span>
                                                        <span className="block text-xs text-fg-muted">{mode.description}</span>
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </fieldset>
                                    <Button onClick={handleRestore} disabled={restoring} loading={restoring}>
                                        {restoring ? 'Restoring…' : 'Restore backup'}
                                    </Button>
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
};

const ExportPage = () => (
    <ProtectedRoute>
        <ExportContent />
    </ProtectedRoute>
);

export default ExportPage;
