import { Loader2 } from 'lucide-react';

const Loader = () => {
    return (
        <div className="relative flex min-h-[calc(100vh-6rem)] items-center justify-center overflow-hidden bg-canvas">
            <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
            <div
                className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-3xl"
                style={{ background: 'radial-gradient(circle, rgb(var(--accent)) 0%, transparent 70%)' }}
                aria-hidden="true"
            />
            <div className="relative z-10 flex flex-col items-center gap-5" role="status" aria-live="polite">
                <Loader2 className="h-12 w-12 animate-spin text-accent" aria-hidden="true" />
                <span className="text-sm font-medium tracking-wide text-fg-muted">Loading, please wait…</span>
            </div>
        </div>
    );
};

export default Loader;
