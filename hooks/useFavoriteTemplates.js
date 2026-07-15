'use client';

import { useSyncExternalStore, useCallback } from 'react';

/**
 * Favorite templates — a tiny localStorage-backed store exposed through
 * useSyncExternalStore so reads are hydration-safe (no setState-in-effect).
 * This is presentation state only; it never touches resume/business data.
 */
const KEY = 'hireready:favorite-templates:v1';
const listeners = new Set();
let cache = null; // parsed Set, lazily hydrated on the client

function read() {
    if (cache) return cache;
    if (typeof window === 'undefined') return (cache = new Set());
    try {
        const raw = window.localStorage.getItem(KEY);
        cache = new Set(raw ? JSON.parse(raw) : []);
    } catch {
        cache = new Set();
    }
    return cache;
}

function emit() {
    listeners.forEach(l => l());
}

function subscribe(cb) {
    listeners.add(cb);
    return () => listeners.delete(cb);
}

// Stable snapshot: return the same reference until the set actually changes.
let snapshot = null;
function getSnapshot() {
    const set = read();
    if (!snapshot || snapshot._set !== set) {
        snapshot = Array.from(set);
        snapshot._set = set;
    }
    return snapshot;
}

const EMPTY = [];
function getServerSnapshot() {
    return EMPTY;
}

export function useFavoriteTemplates() {
    const ids = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    const toggle = useCallback(id => {
        const set = new Set(read());
        if (set.has(id)) set.delete(id);
        else set.add(id);
        cache = set;
        try {
            window.localStorage.setItem(KEY, JSON.stringify(Array.from(set)));
        } catch {
            /* storage unavailable — favorites stay in-memory for this session */
        }
        emit();
    }, []);

    return { favorites: ids, toggle, isFavorite: id => ids.includes(id) };
}
