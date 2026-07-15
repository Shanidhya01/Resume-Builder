'use client';

const colorFor = value => {
    if (value >= 80) return '#10b981'; // emerald-500
    if (value >= 60) return '#3b82f6'; // blue-500
    if (value >= 40) return '#f59e0b'; // amber-500
    return '#ef4444'; // red-500
};

const ProgressRing = ({ value = 0, size = 96, strokeWidth = 8, label }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (Math.max(0, Math.min(100, value)) / 100) * circumference;

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} className="-rotate-90">
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="rgb(var(--surface-3))"
                        strokeWidth={strokeWidth}
                        fill="none"
                    />
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={colorFor(value)}
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="transition-all duration-700"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-black text-fg">{Math.round(value)}</span>
                </div>
            </div>
            {label && <span className="text-xs text-fg-muted">{label}</span>}
        </div>
    );
};

export default ProgressRing;
