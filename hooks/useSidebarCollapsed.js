'use client';

import { useCallback, useSyncExternalStore } from 'react';

const STORAGE_KEY = 'dashboardSidebarCollapsed';
const listeners = new Set();
let cached = null;

const read = () => {
    if (typeof window === 'undefined') return false;
    if (cached === null) cached = window.localStorage.getItem(STORAGE_KEY) === 'true';
    return cached;
};

const write = value => {
    cached = value;
    if (typeof window !== 'undefined') window.localStorage.setItem(STORAGE_KEY, String(value));
    listeners.forEach(listener => listener());
};

const subscribe = onChange => {
    listeners.add(onChange);
    return () => listeners.delete(onChange);
};

// Persisted sidebar collapse state via useSyncExternalStore (same pattern as
// useIsDesktop) — a lazy-initialized useState reading localStorage directly
// would mismatch between the server's render (no localStorage) and the
// client's first render, and syncing it via a setState-in-effect trips the
// react-hooks/set-state-in-effect lint rule. Server snapshot is `false`
// (expanded) so SSR and the initial client render agree.
export default function useSidebarCollapsed() {
    const collapsed = useSyncExternalStore(subscribe, read, () => false);
    const setCollapsed = useCallback(value => write(typeof value === 'function' ? value(read()) : value), []);
    return [collapsed, setCollapsed];
}
