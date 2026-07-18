'use client';

import { memo, useMemo, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Pencil, Copy, Trash2, ArrowRight, Download, Eye, Loader2 } from 'lucide-react';
import { getTemplateById } from '@/config/templates';
import SharePanel from '@/components/Share/SharePanel';
import { computeCompletion } from '@/lib/dashboardStats';
import { runAtsAnalysis } from '@/lib/ats/analysis';
import { exportResume } from '@/lib/importExport/exporters';
import { formatRelativeTime } from '@/lib/formatRelativeTime';
import { useToast } from '@/context/ToastContext';
import { cn } from '@/lib/cn';
import Badge from '@/components/UI/Badge';
import Tooltip from '@/components/UI/Tooltip';
import { Progress } from '@/components/UI/Progress';

// react-pdf/usePDF are browser-only (same reason the editor's Preview.js is
// ssr:false) — without this, `next build`'s static prerender of /dashboard
// tries to run them in Node and fails.
const ResumeThumbnail = dynamic(() => import('@/components/Dashboard/ResumeThumbnail'), {
    ssr: false,
    loading: () => <div className="h-36 w-full bg-surface-2" />,
});

const iconBtn =
    'inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent';

const atsTone = score => (score >= 80 ? 'success' : score >= 55 ? 'accent' : 'warning');

const ResumeCard = ({ resume, uid, onDuplicate, onDelete, onRename, onShareUpdate }) => {
    const [isRenaming, setIsRenaming] = useState(false);
    const [name, setName] = useState(resume.name);
    const [downloading, setDownloading] = useState(false);
    const { error: toastError } = useToast();
    const template = getTemplateById(resume.selectedTemplate);
    const completion = computeCompletion(resume);

    // Cheap/synchronous heuristic (not an AI call) — safe to run per card.
    const atsScore = useMemo(() => {
        try {
            return runAtsAnalysis(resume, '').overall;
        } catch {
            return null;
        }
    }, [resume]);

    const submitRename = () => {
        setIsRenaming(false);
        if (name.trim() && name.trim() !== resume.name) onRename(resume.id, name.trim());
        else setName(resume.name);
    };

    const handleDownload = async () => {
        setDownloading(true);
        try {
            await exportResume('pdf', resume);
        } catch {
            toastError('Could not download the PDF. Please try again.');
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-ds-sm transition-all duration-300 hover:-translate-y-1 hover:border-line-strong hover:shadow-ds-lg">
            {/* Document-style preview */}
            <Link href={`/editor/${resume.id}`} className="relative block overflow-hidden" aria-label={`Edit ${resume.name}`}>
                <div className="relative h-36 overflow-hidden">
                    <ResumeThumbnail resume={resume} template={template} />
                    <div className="absolute right-3 top-3 flex flex-col items-end gap-1.5">
                        <Badge tone="neutral" size="sm" className="border-white/30 bg-black/25 text-white backdrop-blur-sm">
                            {template.name}
                        </Badge>
                        <Badge
                            tone="neutral"
                            size="sm"
                            className={cn(
                                'border-white/30 backdrop-blur-sm',
                                resume.isPublic ? 'bg-emerald-500/40 text-white' : 'bg-black/25 text-white',
                            )}
                        >
                            {resume.isPublic ? 'Public' : 'Private'}
                        </Badge>
                    </div>
                    <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/25 group-hover:opacity-100">
                        <span className="flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-sm font-semibold text-zinc-900 shadow-lg">
                            Open editor <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                    </span>
                </div>
            </Link>

            <div className="flex flex-1 flex-col p-4">
                {isRenaming ? (
                    <input
                        autoFocus
                        value={name}
                        onChange={e => setName(e.target.value)}
                        onBlur={submitRename}
                        onKeyDown={e => e.key === 'Enter' && submitRename()}
                        aria-label="Resume name"
                        className="mb-1 w-full rounded-lg border border-line bg-surface-2 px-2.5 py-1.5 text-sm text-fg outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                    />
                ) : (
                    <h3 className="truncate text-base font-semibold text-fg">{resume.name}</h3>
                )}
                <div className="mt-0.5 flex items-center justify-between text-xs text-fg-muted">
                    <span>Updated {formatRelativeTime(resume.updatedAt)}</span>
                    <span className="inline-flex items-center gap-1">
                        <Eye className="h-3 w-3" aria-hidden="true" /> {resume.viewCount || 0}
                    </span>
                </div>

                {/* Completion + ATS */}
                <div className="mt-3 grid grid-cols-2 gap-3">
                    <div>
                        <div className="mb-1 flex items-center justify-between text-[11px]">
                            <span className="text-fg-muted">Completion</span>
                            <span className="font-semibold text-fg">{completion}%</span>
                        </div>
                        <Progress
                            value={completion}
                            tone={completion >= 80 ? 'success' : completion >= 50 ? 'accent' : 'warning'}
                        />
                    </div>
                    <div>
                        <div className="mb-1 flex items-center justify-between text-[11px]">
                            <span className="text-fg-muted">ATS Score</span>
                            <span className="font-semibold text-fg">{atsScore ?? '—'}</span>
                        </div>
                        <Progress value={atsScore ?? 0} tone={atsTone(atsScore ?? 0)} />
                    </div>
                </div>

                <div className="mt-4">
                    <SharePanel resume={resume} uid={uid} onUpdate={onShareUpdate} />
                </div>

                <div className="mt-4 flex items-center gap-2">
                    <Link
                        href={`/editor/${resume.id}`}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-accent px-3 py-2 text-sm font-semibold text-accent-fg transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                    >
                        <Pencil className="h-3.5 w-3.5" /> Edit
                    </Link>
                    <Tooltip label="Rename">
                        <button onClick={() => setIsRenaming(true)} aria-label={`Rename ${resume.name}`} className={iconBtn}>
                            <Pencil className="h-4 w-4" />
                        </button>
                    </Tooltip>
                    <Tooltip label="Duplicate">
                        <button onClick={() => onDuplicate(resume.id)} aria-label={`Duplicate ${resume.name}`} className={iconBtn}>
                            <Copy className="h-4 w-4" />
                        </button>
                    </Tooltip>
                    <Tooltip label="Download PDF">
                        <button
                            onClick={handleDownload}
                            disabled={downloading}
                            aria-label={`Download ${resume.name} as PDF`}
                            className={cn(iconBtn, 'disabled:cursor-not-allowed disabled:opacity-50')}
                        >
                            {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                        </button>
                    </Tooltip>
                    <Tooltip label="Delete">
                        <button
                            onClick={() => onDelete(resume.id)}
                            aria-label={`Delete ${resume.name}`}
                            className={cn(iconBtn, 'border-red-500/30 text-red-500 hover:bg-red-500/10 hover:text-red-500')}
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
};

export default memo(ResumeCard);
