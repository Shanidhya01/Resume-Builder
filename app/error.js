'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({ error, reset }) {
    useEffect(() => {
        console.error('Unhandled application error:', error);
    }, [error]);

    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center text-white">
            <h1 className="text-3xl font-bold">Something went wrong</h1>
            <p className="max-w-md text-slate-300">
                An unexpected error occurred while rendering this page. You can try again, or head back home.
            </p>
            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={() => reset()}
                    className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2.5 font-semibold text-white transition hover:scale-105"
                >
                    Try again
                </button>
                <Link
                    href="/"
                    className="rounded-xl border border-white/20 px-5 py-2.5 font-semibold text-slate-200 transition hover:bg-white/10"
                >
                    Go home
                </Link>
            </div>
        </div>
    );
}
