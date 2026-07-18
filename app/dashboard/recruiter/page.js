'use client';

import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import useAtsAnalysis from '@/hooks/useAtsAnalysis';
import Card from '@/components/Ats/Card';
import ProgressBar from '@/components/Ats/ProgressBar';
import Badge from '@/components/Ats/Badge';
import ResumeBoundary from '@/components/Ats/ResumeBoundary';

function RecruiterContent() {
    const analysis = useAtsAnalysis();

    if (!analysis) {
        return <div className="mx-auto mt-10 max-w-screen-xl px-4 text-fg-muted" role="status" aria-live="polite">Analyzing resume...</div>;
    }

    const { recruiter, insights } = analysis;

    return (
        <div className="mx-auto mt-10 max-w-screen-xl px-4 pb-16 md:mt-12">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-fg md:text-3xl">Recruiter Preview</h1>
                <p className="text-sm text-fg-muted">A simulation of how a recruiter skims your resume in the first few seconds.</p>
            </div>

            <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                <Card className="flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-fg">{Math.round((recruiter.estimatedReadingSeconds / 60) * 10) / 10} min</span>
                    <span className="text-xs text-fg-muted">Estimated Reading Time</span>
                </Card>
                <Card className="flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-fg">{recruiter.visualHierarchyScore}</span>
                    <span className="text-xs text-fg-muted">Visual Hierarchy Score</span>
                </Card>
                <Card className="flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-fg">{recruiter.importantSections.length}</span>
                    <span className="text-xs text-fg-muted">Important Sections Present</span>
                </Card>
                <Card className="flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-fg">{recruiter.missingRecruiterInfo.length}</span>
                    <span className="text-xs text-fg-muted">Missing Info Items</span>
                </Card>
            </div>

            <Card title="Visual Hierarchy" className="mb-8">
                <ProgressBar label="Visual Hierarchy Score" value={recruiter.visualHierarchyScore} />
            </Card>

            <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card title="First Impression">
                    <p className="text-sm text-fg">{recruiter.firstImpression}</p>
                </Card>
                <Card title="Important Sections">
                    <div className="flex flex-wrap gap-2">
                        {recruiter.importantSections.length === 0 ? (
                            <p className="text-sm text-fg-muted">No key sections detected yet.</p>
                        ) : (
                            recruiter.importantSections.map(s => <Badge key={s} tone="Good">{s}</Badge>)
                        )}
                    </div>
                </Card>
            </div>

            <Card title="Missing Recruiter Information" className="mb-8">
                {recruiter.missingRecruiterInfo.length === 0 ? (
                    <p className="text-sm text-fg-muted">Nothing missing — all key recruiter-facing info is present.</p>
                ) : (
                    <div className="flex flex-wrap gap-2">
                        {recruiter.missingRecruiterInfo.map(s => <Badge key={s} tone="Missing">{s}</Badge>)}
                    </div>
                )}
            </Card>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Card title="Recruiter Tips">
                    <ul className="list-disc space-y-1 pl-5 text-sm text-fg-muted">
                        {insights.recruiterTips.map((t, i) => <li key={i}>{t}</li>)}
                    </ul>
                </Card>
                <Card title="Industry Tips">
                    <ul className="list-disc space-y-1 pl-5 text-sm text-fg-muted">
                        {insights.industryTips.length === 0 ? <li className="list-none text-fg-muted">No specific tips right now.</li> : insights.industryTips.map((t, i) => <li key={i}>{t}</li>)}
                    </ul>
                </Card>
                <Card title="ATS Tips">
                    <ul className="list-disc space-y-1 pl-5 text-sm text-fg-muted">
                        {insights.atsTips.map((t, i) => <li key={i}>{t}</li>)}
                    </ul>
                </Card>
            </div>
        </div>
    );
}

const RecruiterPage = () => (
    <ProtectedRoute>
        <ResumeBoundary>
            <RecruiterContent />
        </ResumeBoundary>
    </ProtectedRoute>
);

export default RecruiterPage;
