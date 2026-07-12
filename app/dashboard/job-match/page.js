'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import useAI from '@/hooks/useAI';
import Card from '@/components/Ats/Card';
import Badge from '@/components/Ats/Badge';
import ProgressBar from '@/components/Ats/ProgressBar';
import DashboardNav from '@/components/Ats/DashboardNav';
import ErrorState from '@/components/Ats/ErrorState';
import { CardSkeleton } from '@/components/Ats/Skeleton';

function JobMatchContent() {
    const resume = useSelector(state => state.resume);
    const { run, loading, error } = useAI();
    const [jobDescription, setJobDescription] = useState('');
    const [matchResult, setMatchResult] = useState(null);
    const [insights, setInsights] = useState(null);

    const isAnalyzing = loading.jobMatch || loading.jdInsights;

    const handleAnalyze = async () => {
        if (!jobDescription.trim()) return;

        const match = await run('jobMatch', { resume, jobDescription });
        if (match) setMatchResult(match);

        const insightsResult = await run('jdInsights', {
            resume,
            jobDescription,
            matchedSkills: match?.matchedKeywords || [],
            missingSkills: match?.missingKeywords || [],
        });
        if (insightsResult) setInsights(insightsResult);
    };

    return (
        <div className="mx-auto mt-10 max-w-screen-xl px-4 pb-16 md:mt-12">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white md:text-3xl">Job Description Analyzer</h1>
                <p className="text-sm text-slate-400">Paste a job description to see how well your resume matches, powered by AI.</p>
            </div>

            <DashboardNav />

            <Card title="Job Description" className="mb-8">
                <label htmlFor="job-description" className="sr-only">Job description</label>
                <textarea
                    id="job-description"
                    value={jobDescription}
                    onChange={e => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here..."
                    rows={6}
                    className="mb-3 w-full rounded-lg border border-purple-500/20 bg-slate-800/60 p-3 text-sm text-white outline-none focus:border-purple-500/50"
                />
                <button
                    onClick={handleAnalyze}
                    disabled={!jobDescription.trim() || isAnalyzing}
                    className="rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-purple-500/30 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                >
                    {isAnalyzing ? 'Analyzing...' : 'Analyze'}
                </button>
                {(error.jobMatch || error.jdInsights) && (
                    <div className="mt-4">
                        <ErrorState message={error.jobMatch || error.jdInsights} onRetry={handleAnalyze} />
                    </div>
                )}
            </Card>

            {isAnalyzing && !matchResult && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <CardSkeleton />
                    <CardSkeleton />
                </div>
            )}

            {matchResult && (
                <>
                    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                        <Card title="Match %">
                            <ProgressBar label="Overall Match" value={matchResult.score} />
                        </Card>
                        <Card title="Suggestions">
                            <ul className="list-disc space-y-1 pl-5 text-sm text-slate-300">
                                {matchResult.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                            </ul>
                        </Card>
                    </div>

                    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                        <Card title="Matched Keywords">
                            <div className="flex flex-wrap gap-2">
                                {matchResult.matchedKeywords.length === 0 ? <p className="text-sm text-slate-400">None found.</p> : matchResult.matchedKeywords.map(k => <Badge key={k} tone="Good">{k}</Badge>)}
                            </div>
                        </Card>
                        <Card title="Missing Keywords">
                            <div className="flex flex-wrap gap-2">
                                {matchResult.missingKeywords.length === 0 ? <p className="text-sm text-slate-400">None — great match!</p> : matchResult.missingKeywords.map(k => <Badge key={k} tone="Missing">{k}</Badge>)}
                            </div>
                        </Card>
                    </div>

                    {insights && (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <Card title="Recommended Skills">
                                <div className="flex flex-wrap gap-2">
                                    {insights.recommendedSkills.length === 0 ? <p className="text-sm text-slate-400">—</p> : insights.recommendedSkills.map(s => <Badge key={s}>{s}</Badge>)}
                                </div>
                            </Card>
                            <Card title="Recommended Resume Changes">
                                <ul className="list-disc space-y-1 pl-5 text-sm text-slate-300">
                                    {insights.recommendedChanges.length === 0 ? <li className="list-none text-slate-400">—</li> : insights.recommendedChanges.map((s, i) => <li key={i}>{s}</li>)}
                                </ul>
                            </Card>
                            <Card title="Improvement Tips (Certifications)">
                                <ul className="list-disc space-y-1 pl-5 text-sm text-slate-300">
                                    {insights.recommendedCertifications.length === 0 ? <li className="list-none text-slate-400">—</li> : insights.recommendedCertifications.map((s, i) => <li key={i}>{s}</li>)}
                                </ul>
                            </Card>
                            <Card title="Recommended Projects">
                                <ul className="list-disc space-y-1 pl-5 text-sm text-slate-300">
                                    {insights.recommendedProjects.length === 0 ? <li className="list-none text-slate-400">—</li> : insights.recommendedProjects.map((s, i) => <li key={i}>{s}</li>)}
                                </ul>
                            </Card>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

const JobMatchPage = () => (
    <ProtectedRoute>
        <JobMatchContent />
    </ProtectedRoute>
);

export default JobMatchPage;
