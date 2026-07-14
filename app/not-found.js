import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center text-white">
            <h1 className="text-4xl font-bold">404 — Page not found</h1>
            <p className="max-w-md text-slate-300">
                The page you&apos;re looking for doesn&apos;t exist or may have been moved.
            </p>
            <Link
                href="/"
                className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2.5 font-semibold text-white transition hover:scale-105"
            >
                Go home
            </Link>
        </div>
    );
}
