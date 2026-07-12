const Skeleton = ({ className = '' }) => (
    <div className={`animate-pulse rounded-lg bg-gradient-to-r from-slate-800/60 via-purple-900/30 to-slate-800/60 ${className}`}></div>
);

export const SkeletonGrid = ({ count = 6 }) => (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="rounded-xl border border-purple-500/20 p-4 space-y-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
            </div>
        ))}
    </div>
);

export default Skeleton;
