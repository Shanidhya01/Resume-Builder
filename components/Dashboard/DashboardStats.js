'use client';

import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { FiActivity, FiCpu, FiEye, FiFileText, FiGlobe, FiTarget } from 'react-icons/fi';
import StatCard from './StatCard';
import { aggregateStats } from '@/lib/dashboardStats';
import { runAtsAnalysis } from '@/lib/ats/analysis';

/**
 * Dashboard overview metrics (Phase 8, Feature 1): resume count, average
 * completion, public sharing analytics, an ATS score for the most-recent
 * resume, and AI usage — all derived client-side from data already loaded.
 */
const DashboardStats = ({ resumes = [] }) => {
    const stats = useMemo(() => aggregateStats(resumes), [resumes]);

    // ATS score for the most recently edited resume (single, cheap synchronous run).
    const latestAts = useMemo(() => {
        const latest = resumes[0];
        if (!latest) return null;
        try {
            const result = runAtsAnalysis(latest, '');
            return { overall: result.overall, grade: result.grade };
        } catch {
            return null;
        }
    }, [resumes]);

    const totalAiGenerations = useSelector(s => s.ats?.totalAiGenerations ?? 0);
    const totalResumeEdits = useSelector(s => s.ats?.totalResumeEdits ?? 0);

    if (resumes.length === 0) return null;

    return (
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <StatCard icon={FiFileText} label="Resumes" value={stats.total} hint={`${stats.publicCount} public`} />
            <StatCard
                icon={FiTarget}
                label="Avg. Completion"
                value={`${stats.avgCompletion}%`}
                progress={stats.avgCompletion}
            />
            <StatCard
                icon={FiActivity}
                label="ATS Score"
                value={latestAts ? latestAts.overall : '—'}
                hint={latestAts ? `Grade ${latestAts.grade} · latest` : 'No data'}
                accent
            />
            <StatCard icon={FiEye} label="Total Views" value={stats.views} hint={`${stats.downloads} downloads`} />
            <StatCard icon={FiGlobe} label="Shares" value={stats.shares} hint={`${stats.publicCount} shared`} />
            <StatCard
                icon={FiCpu}
                label="AI Usage"
                value={totalAiGenerations}
                hint={`${totalResumeEdits} edits tracked`}
            />
        </div>
    );
};

export default DashboardStats;
