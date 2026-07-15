import Link from 'next/link';
import { FileX2 } from 'lucide-react';

export default function PublicResumeNotFound() {
    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-canvas px-6 text-center text-fg">
            <span className="grid h-16 w-16 place-items-center rounded-2xl border border-line bg-surface-2 text-accent">
                <FileX2 className="h-8 w-8" aria-hidden="true" />
            </span>
            <h1 className="text-3xl font-bold">This resume isn&apos;t available</h1>
            <p className="max-w-md text-fg-muted">
                The link may be incorrect, or the owner has made this resume private or disabled sharing.
            </p>
            <Link
                href="/"
                className="rounded-xl bg-accent px-5 py-2.5 font-semibold text-accent-fg shadow-ds-sm transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
            >
                Go to HireReady
            </Link>
        </div>
    );
}
