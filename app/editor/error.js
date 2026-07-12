'use client';

import { useEffect } from 'react';

export default function EditorError({ error, reset }) {
    useEffect(() => {
        console.error('Editor error:', error);
    }, [error]);

    return (
        <div className="mx-auto mt-16 max-w-xl px-4 text-center text-white">
            <h2 className="text-2xl font-bold">The editor ran into a problem</h2>
            <p className="mt-2 text-slate-300">
                This is usually caused by unexpected resume data. Resetting will reload just this section.
            </p>
            <button
                type="button"
                onClick={() => reset()}
                className="mt-6 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2.5 font-semibold text-white transition hover:scale-105"
            >
                Reload editor
            </button>
        </div>
    );
}
