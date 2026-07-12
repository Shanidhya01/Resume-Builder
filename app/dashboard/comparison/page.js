'use client';

import { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import useAtsAnalysis from '@/hooks/useAtsAnalysis';
import Card from '@/components/Ats/Card';
import Badge from '@/components/Ats/Badge';
import DashboardNav from '@/components/Ats/DashboardNav';
import EmptyState from '@/components/UI/EmptyState';
import { snapshotPrevious } from '@/store/slices/atsSlice';
import { compareResumes } from '@/lib/ats/comparison';

const SECTION_LABELS = {
    header: 'Header', summary: 'Summary', experience: 'Experience', projects: 'Projects',
    education: 'Education', skills: 'Skills', certificates: 'Certificates',
    formatting: 'Formatting', keywordMatch: 'Keyword Match', readability: 'Readability',
};

function DiffPill({ value }) {
    const positive = value > 0;
    const negative = value < 0;
    return (
        <span className={`text-xs font-bold ${positive ? 'text-green-300' : negative ? 'text-red-300' : 'text-slate-400'}`}>
            {positive ? '+' : ''}{value}
        </span>
    );
}

function ComparisonContent() {
    const dispatch = useDispatch();
    const resume = useSelector(state => state.resume);
    const ats = useSelector(state => state.ats);
    const analysis = useAtsAnalysis();

    const comparison = useMemo(() => {
        if (!ats.previousSnapshot || !analysis) return null;
        return compareResumes(resume, ats.previousSnapshot.resume, analysis, ats.previousSnapshot.analysis);
    }, [ats.previousSnapshot, analysis, resume]);

    const improvementPercent = useMemo(() => {
        if (!comparison || !ats.previousSnapshot) return null;
        const prevScore = ats.previousSnapshot.analysis?.overall || 0;
        if (prevScore === 0) return null;
        return Math.round((comparison.atsDifference / prevScore) * 100);
    }, [comparison, ats.previousSnapshot]);

    const handleSnapshot = () => dispatch(snapshotPrevious({ resume, analysis }));

    if (!analysis) {
        return <div className="mx-auto mt-10 max-w-screen-xl px-4 text-slate-300" role="status" aria-live="polite">Analyzing resume...</div>;
    }

    return (
        <div className="mx-auto mt-10 max-w-screen-xl px-4 pb-16 md:mt-12">
            <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white md:text-3xl">Resume Comparison</h1>
                    <p className="text-sm text-slate-400">Compare the current resume against a previously saved baseline.</p>
                </div>
                <button
                    onClick={handleSnapshot}
                    className="rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-purple-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                >
                    Save Current as Baseline
                </button>
            </div>

            <DashboardNav />

            {!comparison ? (
                <EmptyState
                    title="No baseline saved yet"
                    description="Save your current resume as a baseline, keep editing, then return here to see what changed."
                    actionLabel="Save Current as Baseline"
                    onAction={handleSnapshot}
                />
            ) : (
                <>
                    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                        <Card className="flex flex-col items-center justify-center">
                            <span className="text-3xl font-black text-white"><DiffPill value={comparison.atsDifference} /></span>
                            <span className="text-xs text-slate-400">ATS Score Difference</span>
                        </Card>
                        <Card className="flex flex-col items-center justify-center">
                            <span className="text-3xl font-black text-white">{improvementPercent != null ? `${improvementPercent > 0 ? '+' : ''}${improvementPercent}%` : '—'}</span>
                            <span className="text-xs text-slate-400">Improvement Percentage</span>
                        </Card>
                        <Card className="flex flex-col items-center justify-center">
                            <span className="text-sm font-bold text-white">{new Date(ats.previousSnapshot.savedAt).toLocaleString()}</span>
                            <span className="text-xs text-slate-400">Baseline Saved</span>
                        </Card>
                    </div>

                    <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <Card title="Current Resume">
                            <p className="text-4xl font-black text-white">{analysis.overall}</p>
                            <p className="text-xs text-slate-400">Grade {analysis.grade} · {analysis.completion}% complete</p>
                        </Card>
                        <Card title="Previous Resume">
                            <p className="text-4xl font-black text-white">{ats.previousSnapshot.analysis?.overall ?? '—'}</p>
                            <p className="text-xs text-slate-400">
                                Grade {ats.previousSnapshot.analysis?.grade ?? '—'} · {ats.previousSnapshot.analysis?.completion ?? '—'}% complete
                            </p>
                        </Card>
                    </div>

                    <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <Card title="Added Skills">
                            {comparison.addedSkills.length === 0 ? (
                                <p className="text-sm text-slate-400">No skills added.</p>
                            ) : (
                                <div className="flex flex-wrap gap-2">{comparison.addedSkills.map(s => <Badge key={s} tone="Good">{s}</Badge>)}</div>
                            )}
                        </Card>
                        <Card title="Removed Skills">
                            {comparison.removedSkills.length === 0 ? (
                                <p className="text-sm text-slate-400">No skills removed.</p>
                            ) : (
                                <div className="flex flex-wrap gap-2">{comparison.removedSkills.map(s => <Badge key={s} tone="Missing">{s}</Badge>)}</div>
                            )}
                        </Card>
                        <Card title="Added Keywords">
                            {comparison.addedKeywords.length === 0 ? (
                                <p className="text-sm text-slate-400">No new keywords.</p>
                            ) : (
                                <div className="flex flex-wrap gap-2">{comparison.addedKeywords.map(s => <Badge key={s} tone="Good">{s}</Badge>)}</div>
                            )}
                        </Card>
                        <Card title="Removed Keywords">
                            {comparison.removedKeywords.length === 0 ? (
                                <p className="text-sm text-slate-400">No keywords removed.</p>
                            ) : (
                                <div className="flex flex-wrap gap-2">{comparison.removedKeywords.map(s => <Badge key={s} tone="Missing">{s}</Badge>)}</div>
                            )}
                        </Card>
                    </div>

                    <Card title="Section Score Difference">
                        <div className="space-y-2">
                            {Object.entries(comparison.sectionDifference).map(([key, value]) => (
                                <div key={key} className="flex items-center justify-between rounded-lg border border-purple-500/10 p-2.5">
                                    <span className="text-sm capitalize text-slate-200">{SECTION_LABELS[key] || key}</span>
                                    <DiffPill value={value} />
                                </div>
                            ))}
                        </div>
                    </Card>
                </>
            )}
        </div>
    );
}

const ComparisonPage = () => (
    <ProtectedRoute>
        <ComparisonContent />
    </ProtectedRoute>
);

export default ComparisonPage;
