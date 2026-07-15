'use client';

import { useEffect } from 'react';

export default function EditorError({ error, reset }) {
    useEffect(() => {
        console.error('Editor error:', error);
    }, [error]);

    return (
        <div className="mx-auto mt-16 max-w-xl px-4 text-center">
            <h2 className="text-2xl font-bold text-fg">The editor ran into a problem</h2>
            <p className="mt-2 text-fg-muted">
                This is usually caused by unexpected resume data. Resetting will reload just this section.
            </p>
            <button
                type="button"
                onClick={() => reset()}
                className="mt-6 rounded-xl bg-accent px-5 py-2.5 font-semibold text-accent-fg transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
            >
                Reload editor
            </button>
        </div>
    );
}
