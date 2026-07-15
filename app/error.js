'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { FiAlertTriangle, FiHome, FiRefreshCw } from 'react-icons/fi';

export default function GlobalError({ error, reset }) {
    useEffect(() => {
        console.error('Unhandled application error:', error);
    }, [error]);

    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center gap-5 px-6 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
                <FiAlertTriangle className="h-8 w-8" />
            </span>
            <h1 className="text-2xl font-bold text-fg md:text-3xl">Something went wrong</h1>
            <p className="max-w-md text-sm text-fg-muted">
                An unexpected error occurred while rendering this page. You can try again, or head back home.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                    type="button"
                    onClick={() => reset()}
                    className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 font-semibold text-accent-fg transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
                >
                    <FiRefreshCw className="h-4 w-4" /> Try again
                </button>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 rounded-xl border border-line px-5 py-2.5 font-semibold text-fg transition hover:bg-surface-2"
                >
                    <FiHome className="h-4 w-4" /> Go home
                </Link>
            </div>
        </div>
    );
}
