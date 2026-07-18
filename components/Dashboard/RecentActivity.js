'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { FilePlus2, Pencil, Globe, Eye } from 'lucide-react';
import { formatRelativeTime } from '@/lib/formatRelativeTime';

const EVENT_META = {
    created: { icon: FilePlus2, label: 'Created', tone: 'text-accent bg-accent/10' },
    edited: { icon: Pencil, label: 'Edited', tone: 'text-blue-500 bg-blue-500/10' },
    published: { icon: Globe, label: 'Published', tone: 'text-emerald-500 bg-emerald-500/10' },
    viewed: { icon: Eye, label: 'Viewed', tone: 'text-fg-muted bg-surface-2' },
};

// Synthesized purely from fields already loaded on each resume doc — no
// activity-log collection or new writes exist in this app, so "recent
// activity" is derived from createdAt/updatedAt/isPublic+updatedPublicAt/
// lastViewed rather than a real chronological event log.
const buildTimeline = resumes => {
    const entries = [];
    for (const r of resumes) {
        if (r.createdAt) entries.push({ type: 'created', ts: r.createdAt, resume: r });
        // Skip "edited" when it's effectively the same moment as "created" (first
        // save), so a never-touched-since resume doesn't produce duplicate noise.
        if (r.updatedAt && (!r.createdAt || Math.abs(r.updatedAt.toMillis() - r.createdAt.toMillis()) > 60000)) {
            entries.push({ type: 'edited', ts: r.updatedAt, resume: r });
        }
        if (r.isPublic && r.updatedPublicAt) entries.push({ type: 'published', ts: r.updatedPublicAt, resume: r });
        if (r.lastViewed) entries.push({ type: 'viewed', ts: r.lastViewed, resume: r });
    }
    return entries
        .filter(e => e.ts?.toMillis)
        .sort((a, b) => b.ts.toMillis() - a.ts.toMillis())
        .slice(0, 12);
};

const RecentActivity = ({ resumes = [] }) => {
    const timeline = useMemo(() => buildTimeline(resumes), [resumes]);

    if (timeline.length === 0) return null;

    return (
        <div className="rounded-2xl border border-line bg-surface p-4 shadow-ds-sm md:p-5">
            <h2 className="mb-3 text-sm font-semibold text-fg-muted">Recent Activity</h2>
            <ul className="space-y-1">
                {timeline.map((entry, i) => {
                    const meta = EVENT_META[entry.type];
                    const Icon = meta.icon;
                    return (
                        <li key={`${entry.type}-${entry.resume.id}-${i}`} className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-surface-2">
                            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${meta.tone}`}>
                                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm text-fg">
                                    <span className="font-medium">{meta.label}</span>{' '}
                                    <Link href={`/editor/${entry.resume.id}`} className="text-fg-muted hover:text-accent hover:underline">
                                        {entry.resume.name}
                                    </Link>
                                </p>
                            </div>
                            <span className="shrink-0 text-xs text-fg-subtle">{formatRelativeTime(entry.ts)}</span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default RecentActivity;
