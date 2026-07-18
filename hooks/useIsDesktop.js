'use client';

import { useSyncExternalStore } from 'react';

// Subscribes directly to a min-width media query via useSyncExternalStore —
// the idiomatic way to sync external browser state without a setState-in-effect
// (which both defeats React's concurrent rendering guarantees and trips the
// react-hooks/set-state-in-effect lint rule). Server snapshot defaults to
// `true` (desktop) so SSR and the initial client render agree; the real
// value takes over the moment the store is subscribed to on the client.
export default function useIsDesktop(breakpointPx = 768) {
    const subscribe = onChange => {
        const mql = window.matchMedia(`(min-width: ${breakpointPx}px)`);
        mql.addEventListener('change', onChange);
        return () => mql.removeEventListener('change', onChange);
    };
    const getSnapshot = () => window.matchMedia(`(min-width: ${breakpointPx}px)`).matches;
    const getServerSnapshot = () => true;

    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
