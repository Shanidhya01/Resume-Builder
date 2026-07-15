'use client';

import { memo, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import Button from '@/components/UI/Button';
import useAtsAnalysis from '@/hooks/useAtsAnalysis';
import useAI from '@/hooks/useAI';
import ProgressBar from '@/components/Ats/ProgressBar';
import ProgressRing from '@/components/Ats/ProgressRing';
import Badge from '@/components/Ats/Badge';
import Card from '@/components/Ats/Card';
import DashboardNav from '@/components/Ats/DashboardNav';
import { ChartSkeleton } from '@/components/Ats/Skeleton';
import { setJobDescription, setJdAnalysis, jdInsightsStart, jdInsightsSuccess, jdInsightsError, snapshotPrevious } from '@/store/slices/atsSlice';
import { analyzeKeywords } from '@/lib/ats/keywords';
import { compareResumes } from '@/lib/ats/comparison';

// Charts are lazy-loaded client-side only — recharts has no value being in the server bundle.
const AtsHistoryChart = dynamic(() => import('@/components/Ats/charts/AtsHistoryChart'), { ssr: false, loading: () => <ChartSkeleton /> });
const CompletionTrendChart = dynamic(() => import('@/components/Ats/charts/CompletionTrendChart'), { ssr: false, loading: () => <ChartSkeleton /> });
const SectionRadarChart = dynamic(() => import('@/components/Ats/charts/SectionRadarChart'), { ssr: false, loading: () => <ChartSkeleton height={280} /> });

const SECTION_LABELS = {
    header: 'Header', summary: 'Summary', experience: 'Experience', projects: 'Projects',
    education: 'Education', skills: 'Skills', certificates: 'Certificates',
    formatting: 'Formatting', keywordMatch: 'Keyword Match', readability: 'Readability',
};

const SectionScoreBars = memo(({ sectionScores }) => (
    <div className="space-y-3">
        {Object.entries(sectionScores).map(([key, value]) => (
            <ProgressBar key={key} label={SECTION_LABELS[key] || key} value={value} />
        ))}
    </div>
));
SectionScoreBars.displayName = 'SectionScoreBars';

const SectionIntelligenceList = memo(({ sectionStatus }) => (
    <div className="space-y-2">
        {Object.entries(sectionStatus).map(([key, info]) => (
            <div key={key} className="flex items-start justify-between gap-3 rounded-lg border border-line p-2.5">
                <div>
                    <p className="text-sm font-semibold text-fg capitalize">{SECTION_LABELS[key] || key}</p>
                    <p className="text-xs text-fg-muted">{info.reason}</p>
                </div>
                <Badge tone={info.status}>{info.status}</Badge>
            </div>
        ))}
    </div>
));
SectionIntelligenceList.displayName = 'SectionIntelligenceList';

function AnalyticsContent() {
    const dispatch = useDispatch();
    const resume = useSelector(state => state.resume);
    const ats = useSelector(state => state.ats);
    const aiHistory = useSelector(state => state.ai.history);
    const analysis = useAtsAnalysis();
    const { run, loading } = useAI();
    const [jdInput, setJdInput] = useState(ats.jobDescription || '');

    const aiUsageByFeature = useMemo(() => {
        const counts = {};
        aiHistory.forEach(h => {
            counts[h.feature] = (counts[h.feature] || 0) + 1;
        });
        return counts;
    }, [aiHistory]);

    const comparison = useMemo(() => {
        if (!ats.previousSnapshot || !analysis) return null;
        return compareResumes(resume, ats.previousSnapshot.resume, analysis, ats.previousSnapshot.analysis);
    }, [ats.previousSnapshot, analysis, resume]);

    if (!analysis) {
        return (
            <div className="mx-auto mt-10 max-w-screen-xl px-4 text-fg-muted" role="status" aria-live="polite">
                Analyzing resume...
            </div>
        );
    }

    const handleAnalyzeJd = async () => {
        const kw = analyzeKeywords(resume, jdInput);
        dispatch(setJobDescription(jdInput));
        dispatch(setJdAnalysis(kw));

        dispatch(jdInsightsStart());
        const result = await run('jdInsights', {
            resume,
            jobDescription: jdInput,
            matchedSkills: kw.matchedKeywords,
            missingSkills: kw.missingKeywords,
        });
        if (result) dispatch(jdInsightsSuccess(result));
        else dispatch(jdInsightsError('Could not generate recommendations.'));
    };

    const handleSnapshot = () => {
        dispatch(snapshotPrevious({ resume, analysis }));
    };

    return (
        <div className="mx-auto mt-10 max-w-screen-xl px-4 pb-16 md:mt-12">
            <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-fg md:text-3xl">Resume Quality Dashboard</h1>
                    <p className="text-sm text-fg-muted">Live analysis of the resume currently open in your editor.</p>
                </div>
                <Button as={Link} href="/improvements" variant="outline" size="md" rightIcon={<span aria-hidden="true">→</span>}>
                    Open Improvement Center
                </Button>
            </div>

            <DashboardNav />

            {/* Top stat cards */}
            <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                <Card className="flex flex-col items-center">
                    <ProgressRing value={analysis.overall} label="ATS Score" />
                    <span className="mt-2 text-lg font-bold text-fg">Grade {analysis.grade}</span>
                </Card>
                <Card className="flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-fg">{analysis.completion}%</span>
                    <span className="text-xs text-fg-muted">Completion</span>
                </Card>
                <Card className="flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-fg">{analysis.readability.score}</span>
                    <span className="text-xs text-fg-muted">Readability ({analysis.readability.label})</span>
                </Card>
                <Card className="flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-fg">{analysis.grammar.score}</span>
                    <span className="text-xs text-fg-muted">Grammar Score</span>
                </Card>
            </div>

            {/* Secondary stat cards */}
            <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                <Card className="flex flex-col items-center justify-center" title={null}>
                    <span className="text-2xl font-black text-fg">{analysis.keywordAnalysis.matchPercent ?? '—'}{analysis.keywordAnalysis.matchPercent != null ? '%' : ''}</span>
                    <span className="text-xs text-fg-muted">Keyword Coverage</span>
                </Card>
                <Card className="flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-fg">{analysis.insights.recruiterImpression}</span>
                    <span className="text-xs text-fg-muted">Recruiter Impression</span>
                </Card>
                <Card className="flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-fg">{analysis.wordCount}</span>
                    <span className="text-xs text-fg-muted">Resume Word Count</span>
                </Card>
                <Card className="flex flex-col items-center justify-center">
                    <span className="text-sm font-bold text-fg">{new Date(analysis.analyzedAt).toLocaleTimeString()}</span>
                    <span className="text-xs text-fg-muted">Last Analyzed</span>
                </Card>
            </div>

            <Card title="Resume Strength Meter" className="mb-8">
                <ProgressBar label="Overall Resume Strength" value={analysis.overall} />
            </Card>

            <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card title="Section Scores">
                    <SectionScoreBars sectionScores={analysis.sectionScores} />
                </Card>

                <Card title="Section Intelligence">
                    <SectionIntelligenceList sectionStatus={analysis.sectionStatus} />
                </Card>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card title="ATS Score History">
                    <AtsHistoryChart history={ats.history} />
                </Card>
                <Card title="Resume Completion Trend">
                    <CompletionTrendChart history={ats.history} />
                </Card>
            </div>

            <Card title="Section Score Radar" className="mb-8">
                <SectionRadarChart sectionScores={analysis.sectionScores} />
            </Card>

            <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Card title="Missing Sections">
                    {Object.entries(analysis.sectionStatus).filter(([, i]) => i.status === 'Missing').length === 0 ? (
                        <p className="text-sm text-fg-muted">None — all sections present.</p>
                    ) : (
                        <ul className="space-y-1 text-sm text-red-600 dark:text-red-400">
                            {Object.entries(analysis.sectionStatus).filter(([, i]) => i.status === 'Missing').map(([key]) => (
                                <li key={key} className="capitalize">• {SECTION_LABELS[key] || key}</li>
                            ))}
                        </ul>
                    )}
                </Card>
                <Card title={`Weak Bullet Points (${analysis.bulletAnalysis.weakBullets.length})`}>
                    <ul className="space-y-2 text-xs text-fg-muted">
                        {analysis.bulletAnalysis.weakBullets.slice(0, 5).map((b, i) => (
                            <li key={i} className="rounded-lg bg-red-500/5 p-2">{b.text}</li>
                        ))}
                        {analysis.bulletAnalysis.weakBullets.length === 0 && <li className="text-fg-subtle">None found.</li>}
                    </ul>
                </Card>
                <Card title={`Strong Bullet Points (${analysis.bulletAnalysis.strongBullets.length})`}>
                    <ul className="space-y-2 text-xs text-fg-muted">
                        {analysis.bulletAnalysis.strongBullets.slice(0, 5).map((b, i) => (
                            <li key={i} className="rounded-lg bg-green-500/5 p-2">{b.text}</li>
                        ))}
                        {analysis.bulletAnalysis.strongBullets.length === 0 && <li className="text-fg-subtle">None yet.</li>}
                    </ul>
                </Card>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card title="Resume Insights">
                    <div className="space-y-3 text-sm">
                        <div>
                            <p className="mb-1 font-semibold text-emerald-600 dark:text-emerald-400">Top Strengths</p>
                            <ul className="list-disc space-y-1 pl-5 text-fg-muted">{analysis.insights.topStrengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
                        </div>
                        <div>
                            <p className="mb-1 font-semibold text-red-600 dark:text-red-400">Top Weaknesses</p>
                            <ul className="list-disc space-y-1 pl-5 text-fg-muted">{analysis.insights.topWeaknesses.map((s, i) => <li key={i}>{s}</li>)}</ul>
                        </div>
                        <div>
                            <p className="mb-1 font-semibold text-accent">Biggest Opportunities</p>
                            <ul className="list-disc space-y-1 pl-5 text-fg-muted">{analysis.insights.biggestOpportunities.map((s, i) => <li key={i}>{s}</li>)}</ul>
                        </div>
                        <p className="text-xs text-fg-muted">Estimated recruiter impression: <span className="font-semibold text-fg">{analysis.insights.recruiterImpression}</span></p>
                    </div>
                </Card>

                <Card title="Recruiter Preview">
                    <div className="space-y-2 text-sm text-fg-muted">
                        <p>Estimated reading time: <span className="font-semibold text-fg">{Math.round(analysis.recruiter.estimatedReadingSeconds / 60 * 10) / 10} min</span></p>
                        <p>First impression: <span className="font-semibold text-fg">{analysis.recruiter.firstImpression}</span></p>
                        <p>Visual hierarchy score: <span className="font-semibold text-fg">{analysis.recruiter.visualHierarchyScore}/100</span></p>
                        {analysis.recruiter.missingRecruiterInfo.length > 0 && (
                            <div>
                                <p className="mb-1 font-semibold text-amber-600 dark:text-amber-400">Missing recruiter info</p>
                                <ul className="list-disc space-y-1 pl-5">{analysis.recruiter.missingRecruiterInfo.map((s, i) => <li key={i}>{s}</li>)}</ul>
                            </div>
                        )}
                    </div>
                </Card>
            </div>

            {/* Job Description Analyzer */}
            <Card title="Job Description Analyzer" className="mb-8">
                <textarea
                    value={jdInput}
                    onChange={e => setJdInput(e.target.value)}
                    placeholder="Paste a job description here…"
                    rows={5}
                    className="mb-3 w-full rounded-xl border border-line bg-surface-2 p-3 text-sm text-fg outline-none transition-colors placeholder:text-fg-subtle focus:border-accent focus:ring-2 focus:ring-accent/30"
                />
                <Button onClick={handleAnalyzeJd} disabled={!jdInput.trim() || loading.jdInsights} loading={loading.jdInsights}>
                    {loading.jdInsights ? 'Analyzing…' : 'Analyze match'}
                </Button>

                {ats.jdAnalysis && (
                    <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <ProgressBar label="Match %" value={ats.jdAnalysis.matchPercent ?? 0} />
                            <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                                <div>
                                    <p className="mb-1 font-semibold text-emerald-600 dark:text-emerald-400">Matched Skills</p>
                                    <p className="text-fg-muted">{ats.jdAnalysis.matchedKeywords.join(', ') || '—'}</p>
                                </div>
                                <div>
                                    <p className="mb-1 font-semibold text-red-600 dark:text-red-400">Missing Skills</p>
                                    <p className="text-fg-muted">{ats.jdAnalysis.missingKeywords.join(', ') || '—'}</p>
                                </div>
                            </div>
                        </div>
                        {ats.jdInsights && (
                            <div className="space-y-2 text-xs">
                                <p><span className="font-semibold text-accent">Recommended Skills:</span> {ats.jdInsights.recommendedSkills.join(', ') || '—'}</p>
                                <p><span className="font-semibold text-accent">Recommended Projects:</span> {ats.jdInsights.recommendedProjects.join(', ') || '—'}</p>
                                <p><span className="font-semibold text-accent">Recommended Certifications:</span> {ats.jdInsights.recommendedCertifications.join(', ') || '—'}</p>
                                <p><span className="font-semibold text-accent">Recommended Resume Changes:</span> {ats.jdInsights.recommendedChanges.join(', ') || '—'}</p>
                            </div>
                        )}
                    </div>
                )}
            </Card>

            {/* Keyword Intelligence */}
            <Card title="Keyword Intelligence" className="mb-8">
                <div className="grid grid-cols-1 gap-4 text-xs md:grid-cols-3">
                    <div><p className="mb-1 font-semibold text-amber-600 dark:text-amber-400">Overused Keywords</p><p className="text-fg-muted">{analysis.keywordAnalysis.overusedKeywords.join(', ') || '—'}</p></div>
                    <div><p className="mb-1 font-semibold text-orange-600 dark:text-orange-400">Duplicate Keywords</p><p className="text-fg-muted">{analysis.keywordAnalysis.duplicateKeywords.join(', ') || '—'}</p></div>
                    <div><p className="mb-1 font-semibold text-fg-muted">Unused Skills</p><p className="text-fg-muted">{analysis.keywordAnalysis.unusedSkills.join(', ') || '—'}</p></div>
                    <div className="md:col-span-3"><p className="mb-1 font-semibold text-accent">Suggested Industry Keywords</p><p className="text-fg-muted">{analysis.keywordAnalysis.suggestedIndustryKeywords.join(', ') || '—'}</p></div>
                </div>
            </Card>

            {/* Resume Comparison */}
            <Card title="Resume Comparison" action={<button onClick={handleSnapshot} className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent/10">Save current as baseline</button>} className="mb-8">
                {!comparison ? (
                    <p className="text-sm text-fg-muted">Save a baseline snapshot, keep editing, then return here to see the diff.</p>
                ) : (
                    <div className="grid grid-cols-1 gap-4 text-xs md:grid-cols-2">
                        <p>ATS score change: <span className={`font-bold ${comparison.atsDifference >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>{comparison.atsDifference >= 0 ? '+' : ''}{comparison.atsDifference}</span></p>
                        <p>Baseline saved: {new Date(ats.previousSnapshot.savedAt).toLocaleString()}</p>
                        <div><p className="mb-1 font-semibold text-emerald-600 dark:text-emerald-400">Added Skills</p><p className="text-fg-muted">{comparison.addedSkills.join(', ') || '—'}</p></div>
                        <div><p className="mb-1 font-semibold text-red-600 dark:text-red-400">Removed Skills</p><p className="text-fg-muted">{comparison.removedSkills.join(', ') || '—'}</p></div>
                    </div>
                )}
            </Card>

            {/* Analytics history */}
            <Card title="ATS Improvement History" className="mb-8">
                {ats.history.length <= 1 ? (
                    <p className="text-sm text-fg-muted">Keep editing your resume — score history builds up over time.</p>
                ) : (
                    <div className="flex items-end gap-2 overflow-x-auto pb-2">
                        {[...ats.history].reverse().map((h, i) => (
                            <div key={i} className="flex flex-col items-center gap-1">
                                <div className="w-6 rounded-t bg-gradient-to-t from-accent to-blue-400" style={{ height: `${Math.max(4, h.overall)}px` }} />
                                <span className="text-[10px] text-fg-subtle">{h.overall}</span>
                            </div>
                        ))}
                    </div>
                )}
                <p className="mt-3 text-xs text-fg-muted">Total AI generations: {ats.totalAiGenerations} · Resume edits tracked: {ats.totalResumeEdits}</p>
            </Card>

            {/* AI Usage Statistics */}
            <Card title="AI Usage Statistics">
                <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-4">
                    <div>
                        <p className="text-2xl font-black text-fg">{aiHistory.length}</p>
                        <p className="text-xs text-fg-muted">Total AI Generations</p>
                    </div>
                    <div>
                        <p className="text-2xl font-black text-fg">{ats.totalResumeEdits}</p>
                        <p className="text-xs text-fg-muted">Resume Edits Tracked</p>
                    </div>
                    <div>
                        <p className="text-2xl font-black text-fg">{aiHistory[0] ? new Date(aiHistory[0].timestamp).toLocaleDateString() : '—'}</p>
                        <p className="text-xs text-fg-muted">Last AI Analysis</p>
                    </div>
                    <div>
                        <p className="text-2xl font-black text-fg">{Object.keys(aiUsageByFeature).length}</p>
                        <p className="text-xs text-fg-muted">Features Used</p>
                    </div>
                </div>
                {Object.keys(aiUsageByFeature).length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {Object.entries(aiUsageByFeature).map(([feature, count]) => (
                            <Badge key={feature}>{feature}: {count}</Badge>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
}

const AnalyticsPage = () => (
    <ProtectedRoute>
        <AnalyticsContent />
    </ProtectedRoute>
);

export default AnalyticsPage;
