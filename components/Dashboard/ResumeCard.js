'use client';

import { memo, useState } from 'react';
import Link from 'next/link';
import { Pencil, Copy, Trash2, ArrowRight } from 'lucide-react';
import { getTemplateById } from '@/config/templates';
import SharePanel from '@/components/Share/SharePanel';
import { computeCompletion } from '@/lib/dashboardStats';
import { cn } from '@/lib/cn';
import Badge from '@/components/UI/Badge';
import Tooltip from '@/components/UI/Tooltip';
import { Progress } from '@/components/UI/Progress';

const formatRelativeTime = timestamp => {
    if (!timestamp?.toMillis) return 'Unknown';
    const diffMs = Date.now() - timestamp.toMillis();
    const diffMin = Math.round(diffMs / 60000);
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.round(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDay = Math.round(diffHr / 24);
    return `${diffDay}d ago`;
};

const iconBtn =
    'inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent';

const ResumeCard = ({ resume, uid, onDuplicate, onDelete, onRename, onShareUpdate }) => {
    const [isRenaming, setIsRenaming] = useState(false);
    const [name, setName] = useState(resume.name);
    const template = getTemplateById(resume.selectedTemplate);
    const completion = computeCompletion(resume);

    const submitRename = () => {
        setIsRenaming(false);
        if (name.trim() && name.trim() !== resume.name) onRename(resume.id, name.trim());
        else setName(resume.name);
    };

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-ds-sm transition-all duration-300 hover:-translate-y-1 hover:border-line-strong hover:shadow-ds-lg">
            {/* Document-style preview */}
            <Link href={`/editor/${resume.id}`} className="relative block overflow-hidden" aria-label={`Edit ${resume.name}`}>
                <div
                    className="relative h-36 overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${template.primaryColor}, ${template.secondaryColor})` }}
                >
                    {/* Faux page lines for a document feel */}
                    <div className="absolute inset-x-6 top-6 space-y-2 opacity-40">
                        <div className="h-2.5 w-1/2 rounded-full bg-white/90" />
                        <div className="h-1.5 w-1/3 rounded-full bg-white/70" />
                    </div>
                    <div className="absolute inset-x-6 bottom-6 space-y-1.5 opacity-30">
                        {[11, 9, 10, 7].map((w, i) => (
                            <div key={i} className="h-1.5 rounded-full bg-white" style={{ width: `${w * 8}%` }} />
                        ))}
                    </div>
                    <span className="absolute right-3 top-3">
                        <Badge tone="neutral" size="sm" className="border-white/30 bg-black/25 text-white backdrop-blur-sm">
                            {template.name}
                        </Badge>
                    </span>
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
                <p className="mt-0.5 text-xs text-fg-muted">Updated {formatRelativeTime(resume.updatedAt)}</p>

                {/* Completion */}
                <div className="mt-3">
                    <div className="mb-1 flex items-center justify-between text-[11px]">
                        <span className="text-fg-muted">Completion</span>
                        <span className="font-semibold text-fg">{completion}%</span>
                    </div>
                    <Progress
                        value={completion}
                        tone={completion >= 80 ? 'success' : completion >= 50 ? 'accent' : 'warning'}
                    />
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
