'use client';

import { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};

/**
 * Returns false during SSR and the first client render, then true — without
 * calling setState in an effect. Use to gate rendering of client-only UI
 * (e.g. theme-dependent icons) to avoid hydration mismatches.
 */
export function useMounted() {
    return useSyncExternalStore(
        emptySubscribe,
        () => true, // client snapshot
        () => false, // server snapshot
    );
}

export default useMounted;
