'use client';

// Theme-aware status pills — colours read correctly in light and dark.
const STATUS_STYLES = {
    Excellent: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    Good: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
    'Needs Improvement': 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
    Missing: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30',
    critical: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30',
    high: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30',
    medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
    low: 'bg-surface-2 text-fg-muted border-line',
};

const Badge = ({ children, tone }) => (
    <span
        className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${
            STATUS_STYLES[tone] || STATUS_STYLES[children] || 'bg-accent/10 text-accent border-accent/25'
        }`}
    >
        {children}
    </span>
);

export default Badge;
