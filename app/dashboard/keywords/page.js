'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import useAtsAnalysis from '@/hooks/useAtsAnalysis';
import Card from '@/components/Ats/Card';
import Badge from '@/components/Ats/Badge';
import ResumeBoundary from '@/components/Ats/ResumeBoundary';
import { ChartSkeleton } from '@/components/Ats/Skeleton';
import { extractKeywords } from '@/lib/ats/keywords';
import { resumeToText } from '@/lib/ats/textUtils';

const KeywordDistributionChart = dynamic(() => import('@/components/Ats/charts/KeywordDistributionChart'), { ssr: false, loading: () => <ChartSkeleton /> });

function KeywordBadgeList({ items, tone, emptyLabel }) {
    if (!items || items.length === 0) return <p className="text-sm text-fg-muted">{emptyLabel}</p>;
    return (
        <div className="flex flex-wrap gap-2">
            {items.map(k => <Badge key={k} tone={tone}>{k}</Badge>)}
        </div>
    );
}

function KeywordsContent() {
    const resume = useSelector(state => state.resume);
    const ats = useSelector(state => state.ats);
    const analysis = useAtsAnalysis();

    const keywordCounts = useMemo(() => extractKeywords(resumeToText(resume), { limit: 15 }), [resume]);

    if (!analysis) {
        return <div className="mx-auto mt-10 max-w-screen-xl px-4 text-fg-muted" role="status" aria-live="polite">Analyzing resume...</div>;
    }

    const { keywordAnalysis } = analysis;

    return (
        <div className="mx-auto mt-10 max-w-screen-xl px-4 pb-16 md:mt-12">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-fg md:text-3xl">Keyword Dashboard</h1>
                <p className="text-sm text-fg-muted">Everything the ATS engine sees when it scans your resume for keywords.</p>
            </div>

            <Card title="Top Resume Keywords" className="mb-8">
                <KeywordDistributionChart keywords={keywordCounts} />
            </Card>

            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card title="Matched Keywords (vs. last analyzed job description)">
                    {ats.jdAnalysis ? (
                        <KeywordBadgeList items={ats.jdAnalysis.matchedKeywords} tone="Good" emptyLabel="No matches found." />
                    ) : (
                        <p className="text-sm text-fg-muted">Analyze a job description from the Job Match page first.</p>
                    )}
                </Card>
                <Card title="Missing Keywords (vs. last analyzed job description)">
                    {ats.jdAnalysis ? (
                        <KeywordBadgeList items={ats.jdAnalysis.missingKeywords} tone="Missing" emptyLabel="None missing." />
                    ) : (
                        <p className="text-sm text-fg-muted">Analyze a job description from the Job Match page first.</p>
                    )}
                </Card>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card title="Overused Keywords">
                    <KeywordBadgeList items={keywordAnalysis.overusedKeywords} tone="medium" emptyLabel="No overused keywords detected." />
                </Card>
                <Card title="Duplicate Keywords">
                    <KeywordBadgeList items={keywordAnalysis.duplicateKeywords} tone="high" emptyLabel="No duplicate skill entries." />
                </Card>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card title="Unused Skills">
                    <KeywordBadgeList items={keywordAnalysis.unusedSkills} tone="low" emptyLabel="All listed skills are referenced in your resume." />
                </Card>
                <Card title="Suggested Industry Keywords">
                    <KeywordBadgeList items={keywordAnalysis.suggestedIndustryKeywords} tone={null} emptyLabel="No additional suggestions." />
                </Card>
            </div>
        </div>
    );
}

const KeywordsPage = () => (
    <ProtectedRoute>
        <ResumeBoundary>
            <KeywordsContent />
        </ResumeBoundary>
    </ProtectedRoute>
);

export default KeywordsPage;
