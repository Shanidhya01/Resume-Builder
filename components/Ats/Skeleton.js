'use client';

export const ChartSkeleton = ({ height = 220 }) => (
    <div
        role="status"
        aria-label="Loading chart"
        className="w-full animate-pulse rounded-lg bg-surface-2"
        style={{ height }}
    />
);

export const CardSkeleton = () => (
    <div role="status" aria-label="Loading" className="animate-pulse rounded-2xl border border-line bg-surface p-5">
        <div className="mb-3 h-4 w-1/3 rounded bg-surface-3" />
        <div className="space-y-2">
            <div className="h-3 w-full rounded bg-surface-2" />
            <div className="h-3 w-5/6 rounded bg-surface-2" />
            <div className="h-3 w-2/3 rounded bg-surface-2" />
        </div>
    </div>
);

export const DashboardSkeleton = () => (
    <div className="mx-auto mt-10 max-w-screen-xl px-4 pb-16 md:mt-12" aria-busy="true" aria-live="polite">
        <div className="mb-8 h-8 w-64 animate-pulse rounded bg-surface-2" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <CardSkeleton key={i} />
            ))}
        </div>
    </div>
);
