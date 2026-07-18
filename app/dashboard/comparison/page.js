'use client';

import { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import useAtsAnalysis from '@/hooks/useAtsAnalysis';
import Card from '@/components/Ats/Card';
import Badge from '@/components/Ats/Badge';
import ResumeBoundary from '@/components/Ats/ResumeBoundary';
import EmptyState from '@/components/UI/EmptyState';
import Button from '@/components/UI/Button';
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
        <span className={`text-xs font-bold ${positive ? 'text-emerald-600 dark:text-emerald-400' : negative ? 'text-red-600 dark:text-red-400' : 'text-fg-muted'}`}>
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
        return <div className="mx-auto mt-10 max-w-screen-xl px-4 text-fg-muted" role="status" aria-live="polite">Analyzing resume...</div>;
    }

    return (
        <div className="mx-auto mt-10 max-w-screen-xl px-4 pb-16 md:mt-12">
            <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-fg md:text-3xl">Resume Comparison</h1>
                    <p className="text-sm text-fg-muted">Compare the current resume against a previously saved baseline.</p>
                </div>
                <Button onClick={handleSnapshot}>Save current as baseline</Button>
            </div>

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
                            <span className="text-3xl font-black text-fg"><DiffPill value={comparison.atsDifference} /></span>
                            <span className="text-xs text-fg-muted">ATS Score Difference</span>
                        </Card>
                        <Card className="flex flex-col items-center justify-center">
                            <span className="text-3xl font-black text-fg">{improvementPercent != null ? `${improvementPercent > 0 ? '+' : ''}${improvementPercent}%` : '—'}</span>
                            <span className="text-xs text-fg-muted">Improvement Percentage</span>
                        </Card>
                        <Card className="flex flex-col items-center justify-center">
                            <span className="text-sm font-bold text-fg">{new Date(ats.previousSnapshot.savedAt).toLocaleString()}</span>
                            <span className="text-xs text-fg-muted">Baseline Saved</span>
                        </Card>
                    </div>

                    <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <Card title="Current Resume">
                            <p className="text-4xl font-black text-fg">{analysis.overall}</p>
                            <p className="text-xs text-fg-muted">Grade {analysis.grade} · {analysis.completion}% complete</p>
                        </Card>
                        <Card title="Previous Resume">
                            <p className="text-4xl font-black text-fg">{ats.previousSnapshot.analysis?.overall ?? '—'}</p>
                            <p className="text-xs text-fg-muted">
                                Grade {ats.previousSnapshot.analysis?.grade ?? '—'} · {ats.previousSnapshot.analysis?.completion ?? '—'}% complete
                            </p>
                        </Card>
                    </div>

                    <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <Card title="Added Skills">
                            {comparison.addedSkills.length === 0 ? (
                                <p className="text-sm text-fg-muted">No skills added.</p>
                            ) : (
                                <div className="flex flex-wrap gap-2">{comparison.addedSkills.map(s => <Badge key={s} tone="Good">{s}</Badge>)}</div>
                            )}
                        </Card>
                        <Card title="Removed Skills">
                            {comparison.removedSkills.length === 0 ? (
                                <p className="text-sm text-fg-muted">No skills removed.</p>
                            ) : (
                                <div className="flex flex-wrap gap-2">{comparison.removedSkills.map(s => <Badge key={s} tone="Missing">{s}</Badge>)}</div>
                            )}
                        </Card>
                        <Card title="Added Keywords">
                            {comparison.addedKeywords.length === 0 ? (
                                <p className="text-sm text-fg-muted">No new keywords.</p>
                            ) : (
                                <div className="flex flex-wrap gap-2">{comparison.addedKeywords.map(s => <Badge key={s} tone="Good">{s}</Badge>)}</div>
                            )}
                        </Card>
                        <Card title="Removed Keywords">
                            {comparison.removedKeywords.length === 0 ? (
                                <p className="text-sm text-fg-muted">No keywords removed.</p>
                            ) : (
                                <div className="flex flex-wrap gap-2">{comparison.removedKeywords.map(s => <Badge key={s} tone="Missing">{s}</Badge>)}</div>
                            )}
                        </Card>
                    </div>

                    <Card title="Section Score Difference">
                        <div className="space-y-2">
                            {Object.entries(comparison.sectionDifference).map(([key, value]) => (
                                <div key={key} className="flex items-center justify-between rounded-lg border border-line p-2.5">
                                    <span className="text-sm capitalize text-fg">{SECTION_LABELS[key] || key}</span>
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
        <ResumeBoundary>
            <ComparisonContent />
        </ResumeBoundary>
    </ProtectedRoute>
);

export default ComparisonPage;
