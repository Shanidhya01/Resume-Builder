'use client';

import { useMemo } from 'react';
import { FiEye, FiDownload, FiShare2, FiGlobe, FiTarget } from 'react-icons/fi';
import { aggregateStats } from '@/lib/dashboardStats';
import { runAtsAnalysis } from '@/lib/ats/analysis';

const Tile = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-3 rounded-xl border border-line bg-surface-2/60 p-3.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
            <p className="text-lg font-bold text-fg">{value}</p>
            <p className="text-xs text-fg-muted">{label}</p>
        </div>
    </div>
);

/**
 * Mini analytics dashboard for the sidebar/overview area. Views, Downloads,
 * Shares and Public-resume-count are real aggregates already computed by
 * `aggregateStats`. There is no time-series data anywhere in this app (no
 * historical snapshots), so "ATS trend" / "weekly growth" from the original
 * spec have no real data to back them — rather than fabricate a chart, this
 * shows the average ATS score across all resumes instead (a real, if static,
 * number computed the same way as the per-card ATS badge).
 */
const AnalyticsSummary = ({ resumes = [] }) => {
    const stats = useMemo(() => aggregateStats(resumes), [resumes]);

    const avgAts = useMemo(() => {
        if (resumes.length === 0) return null;
        const scores = resumes.map(r => {
            try {
                return runAtsAnalysis(r, '').overall;
            } catch {
                return 0;
            }
        });
        return Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length);
    }, [resumes]);

    if (resumes.length === 0) return null;

    return (
        <div className="rounded-2xl border border-line bg-surface p-4 shadow-ds-sm md:p-5">
            <h2 className="mb-3 text-sm font-semibold text-fg-muted">Analytics Summary</h2>
            <div className="grid grid-cols-2 gap-3">
                <Tile icon={FiEye} label="Total Views" value={stats.views} />
                <Tile icon={FiDownload} label="Downloads" value={stats.downloads} />
                <Tile icon={FiShare2} label="Shares" value={stats.shares} />
                <Tile icon={FiGlobe} label="Public Resumes" value={stats.publicCount} />
                <Tile icon={FiTarget} label="Avg. ATS Score" value={avgAts ?? '—'} />
            </div>
        </div>
    );
};

export default AnalyticsSummary;
