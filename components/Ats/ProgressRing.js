'use client';

const colorFor = value => {
    if (value >= 80) return '#34d399';
    if (value >= 60) return '#a78bfa';
    if (value >= 40) return '#fbbf24';
    return '#f87171';
};

const ProgressRing = ({ value = 0, size = 96, strokeWidth = 8, label }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (Math.max(0, Math.min(100, value)) / 100) * circumference;

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} className="-rotate-90">
                    <circle cx={size / 2} cy={size / 2} r={radius} stroke="#1e293b" strokeWidth={strokeWidth} fill="none" />
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
                    <span className="text-2xl font-black text-white">{Math.round(value)}</span>
                </div>
            </div>
            {label && <span className="text-xs text-slate-400">{label}</span>}
        </div>
    );
};

export default ProgressRing;
