'use client';

const colorFor = value => {
    if (value >= 80) return 'from-emerald-500 to-emerald-400';
    if (value >= 60) return 'from-blue-500 to-indigo-400';
    if (value >= 40) return 'from-amber-500 to-orange-400';
    return 'from-red-600 to-red-400';
};

const ProgressBar = ({ label, value = 0 }) => (
    <div>
        <div className="mb-1 flex items-center justify-between text-xs text-fg-muted">
            <span className="capitalize">{label}</span>
            <span className="font-semibold text-fg">{Math.round(value)}</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2">
            <div
                className={`h-full rounded-full bg-gradient-to-r ${colorFor(value)} transition-all duration-500`}
                style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
            />
        </div>
    </div>
);

export default ProgressBar;
