import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center gap-5 px-6 text-center">
            <p className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-7xl font-black text-transparent md:text-8xl">
                404
            </p>
            <h1 className="text-2xl font-bold text-fg md:text-3xl">Page not found</h1>
            <p className="max-w-md text-sm text-fg-muted">
                The page you&apos;re looking for doesn&apos;t exist or may have been moved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                    href="/"
                    className="rounded-xl bg-accent px-5 py-2.5 font-semibold text-accent-fg transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
                >
                    Go home
                </Link>
                <Link
                    href="/dashboard"
                    className="rounded-xl border border-line px-5 py-2.5 font-semibold text-fg transition hover:bg-surface-2"
                >
                    Dashboard
                </Link>
            </div>
        </div>
    );
}
