'use client';

import { memo, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import useAtsAnalysis from '@/hooks/useAtsAnalysis';
import Badge from '@/components/Ats/Badge';
import Card from '@/components/Ats/Card';
import DashboardNav from '@/components/Ats/DashboardNav';
import { setSuggestionStatus } from '@/store/slices/atsSlice';
import { FaCheck, FaTimes, FaCheckDouble, FaUndo } from 'react-icons/fa';

const PRIORITY_ORDER = ['critical', 'high', 'medium', 'low'];
const PRIORITY_LABEL = { critical: 'Critical', high: 'High', medium: 'Medium', low: 'Low' };

const SuggestionRow = memo(({ suggestion, status, onSet }) => {
    return (
        <div className={`flex items-start justify-between gap-4 rounded-lg border p-3 ${status === 'rejected' ? 'opacity-50' : ''} ${status === 'completed' ? 'border-green-500/30 bg-green-500/5' : 'border-line'}`}>
            <div>
                <div className="mb-1 flex items-center gap-2">
                    <Badge tone={suggestion.priority}>{PRIORITY_LABEL[suggestion.priority]}</Badge>
                    <span className="text-xs uppercase tracking-wide text-fg-subtle">{suggestion.category}</span>
                    {status && <span className="text-xs font-semibold capitalize text-accent">{status}</span>}
                </div>
                <p className="text-sm text-fg">{suggestion.message}</p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
                <button type="button" aria-label={`Accept suggestion: ${suggestion.message}`} title="Accept" onClick={() => onSet(suggestion.id, 'accepted')} className="rounded-lg border border-blue-500/30 p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">
                    <FaCheck className="h-3 w-3" />
                </button>
                <button type="button" aria-label={`Mark suggestion complete: ${suggestion.message}`} title="Mark Complete" onClick={() => onSet(suggestion.id, 'completed')} className="rounded-lg border border-green-500/30 p-2 text-emerald-600 dark:text-emerald-400 hover:bg-green-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400">
                    <FaCheckDouble className="h-3 w-3" />
                </button>
                <button type="button" aria-label={`Reject suggestion: ${suggestion.message}`} title="Reject" onClick={() => onSet(suggestion.id, 'rejected')} className="rounded-lg border border-red-500/30 p-2 text-red-600 dark:text-red-400 hover:bg-red-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400">
                    <FaTimes className="h-3 w-3" />
                </button>
                {status && (
                    <button type="button" aria-label={`Reset suggestion status: ${suggestion.message}`} title="Reset" onClick={() => onSet(suggestion.id, null)} className="rounded-lg border border-line p-2 text-fg-muted hover:bg-surface-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent">
                        <FaUndo className="h-3 w-3" />
                    </button>
                )}
            </div>
        </div>
    );
});
SuggestionRow.displayName = 'SuggestionRow';

function ImprovementsContent() {
    const dispatch = useDispatch();
    const analysis = useAtsAnalysis();
    const suggestionStatus = useSelector(state => state.ats.suggestionStatus);
    const [filter, setFilter] = useState('all');

    const grouped = useMemo(() => {
        if (!analysis) return {};
        const byPriority = analysis.recommendationsByPriority;
        if (filter === 'all') return byPriority;
        return { [filter]: byPriority[filter] || [] };
    }, [analysis, filter]);

    const onSet = (id, status) => dispatch(setSuggestionStatus({ id, status }));

    if (!analysis) {
        return <div className="mx-auto mt-10 max-w-screen-xl px-4 text-fg-muted" role="status" aria-live="polite">Analyzing resume...</div>;
    }

    const total = analysis.recommendations.length;
    const completedCount = analysis.recommendations.filter(r => suggestionStatus[r.id] === 'completed').length;
    const priorityCounts = analysis.recommendationsByPriority;

    return (
        <div className="mx-auto mt-10 max-w-screen-xl px-4 pb-16 md:mt-12">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-fg md:text-3xl">Improvement Center</h1>
                <p className="text-sm text-fg-muted">{total} suggestion(s) generated from your latest ATS analysis · {completedCount} completed</p>
            </div>

            <DashboardNav />

            <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter suggestions by priority">
                {['all', ...PRIORITY_ORDER].map(p => (
                    <button
                        key={p}
                        type="button"
                        aria-pressed={filter === p}
                        onClick={() => setFilter(p)}
                        className={`rounded-full border px-4 py-1.5 text-xs font-semibold capitalize transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                            filter === p ? 'border-accent bg-accent text-accent-fg' : 'border-line text-fg-muted hover:bg-surface-2 hover:text-fg'
                        }`}
                    >
                        {p === 'all' ? `All (${total})` : `${PRIORITY_LABEL[p]} (${priorityCounts[p]?.length || 0})`}
                    </button>
                ))}
            </div>

            <div className="space-y-6">
                {PRIORITY_ORDER.filter(p => grouped[p]).map(priority => (
                    grouped[priority].length > 0 && (
                        <Card key={priority} title={`${PRIORITY_LABEL[priority]} (${grouped[priority].length})`}>
                            <div className="space-y-3">
                                {grouped[priority].map(s => (
                                    <SuggestionRow key={s.id} suggestion={s} status={suggestionStatus[s.id]} onSet={onSet} />
                                ))}
                            </div>
                        </Card>
                    )
                ))}
                {total === 0 && (
                    <Card>
                        <p className="text-sm text-fg-muted">No suggestions — your resume looks solid!</p>
                    </Card>
                )}
            </div>
        </div>
    );
}

const ImprovementsPage = () => (
    <ProtectedRoute>
        <ImprovementsContent />
    </ProtectedRoute>
);

export default ImprovementsPage;
