import { cn } from '@/lib/cn';

/**
 * Skeleton — shimmering placeholder. Uses a moving gradient (via the `shimmer`
 * keyframe) layered on the surface-2 token so it reads in light + dark.
 */
const Skeleton = ({ className = '' }) => (
    <div
        aria-hidden="true"
        className={cn(
            'relative overflow-hidden rounded-lg bg-surface-2',
            'bg-[linear-gradient(90deg,transparent,rgb(var(--fg)/0.06),transparent)] bg-[length:200%_100%] animate-shimmer',
            className,
        )}
    />
);

export const SkeletonGrid = ({ count = 6 }) => (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="space-y-4 rounded-2xl border border-line bg-surface p-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <div className="flex gap-2 pt-2">
                    <Skeleton className="h-9 flex-1" />
                    <Skeleton className="h-9 w-9" />
                    <Skeleton className="h-9 w-9" />
                </div>
            </div>
        ))}
    </div>
);

export default Skeleton;
