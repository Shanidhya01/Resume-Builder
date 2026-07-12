'use client';

const STATUS_STYLES = {
    Excellent: 'bg-green-500/10 text-green-300 border-green-500/30',
    Good: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
    'Needs Improvement': 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30',
    Missing: 'bg-red-500/10 text-red-300 border-red-500/30',
    critical: 'bg-red-500/10 text-red-300 border-red-500/30',
    high: 'bg-orange-500/10 text-orange-300 border-orange-500/30',
    medium: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30',
    low: 'bg-slate-500/10 text-slate-300 border-slate-500/30',
};

const Badge = ({ children, tone }) => (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[tone] || STATUS_STYLES[children] || 'bg-purple-500/10 text-purple-300 border-purple-500/30'}`}>
        {children}
    </span>
);

export default Badge;
