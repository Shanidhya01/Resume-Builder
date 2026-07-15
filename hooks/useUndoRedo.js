'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { restoreContent } from '@/store/slices/resumeSlice';

const CONTENT_KEYS = [
    'contact',
    'summary',
    'education',
    'experience',
    'projects',
    'skills',
    'certificates',
    'languages',
    'selectedTemplate',
];

const MAX_HISTORY = 50;

function serialize(resume) {
    const subset = {};
    CONTENT_KEYS.forEach(k => {
        subset[k] = resume?.[k];
    });
    return JSON.stringify(subset);
}

/**
 * Lightweight, dependency-free undo/redo for the resume editor (Phase 8,
 * Feature 2). Snapshots content after a short idle period and restores via the
 * `restoreContent` reducer (which marks the resume unsaved so undo is
 * autosaved). Restores are debounced/guarded so they don't re-enter history.
 */
export default function useUndoRedo(resume) {
    const dispatch = useDispatch();
    const past = useRef([]);
    const future = useRef([]);
    const lastSnapshot = useRef(serialize(resume));
    const isRestoring = useRef(false);
    // canUndo/canRedo are state (not read from refs during render) so the rule
    // against reading refs in render is satisfied; they're set from callbacks only.
    const [flags, setFlags] = useState({ canUndo: false, canRedo: false });

    const syncFlags = useCallback(
        () => setFlags({ canUndo: past.current.length > 0, canRedo: future.current.length > 0 }),
        [],
    );

    useEffect(() => {
        const current = serialize(resume);
        if (current === lastSnapshot.current) return undefined;

        // A programmatic restore just landed — sync baseline, don't record it.
        if (isRestoring.current) {
            lastSnapshot.current = current;
            isRestoring.current = false;
            return undefined;
        }

        // Debounce so a burst of keystrokes becomes one undo step.
        const timer = setTimeout(() => {
            past.current.push(lastSnapshot.current);
            if (past.current.length > MAX_HISTORY) past.current.shift();
            future.current = [];
            lastSnapshot.current = current;
            syncFlags();
        }, 600);

        return () => clearTimeout(timer);
    }, [resume, syncFlags]);

    const undo = useCallback(() => {
        if (past.current.length === 0) return;
        const previous = past.current.pop();
        future.current.push(lastSnapshot.current);
        lastSnapshot.current = previous;
        isRestoring.current = true;
        dispatch(restoreContent(JSON.parse(previous)));
        syncFlags();
    }, [dispatch, syncFlags]);

    const redo = useCallback(() => {
        if (future.current.length === 0) return;
        const next = future.current.pop();
        past.current.push(lastSnapshot.current);
        lastSnapshot.current = next;
        isRestoring.current = true;
        dispatch(restoreContent(JSON.parse(next)));
        syncFlags();
    }, [dispatch, syncFlags]);

    return { undo, redo, canUndo: flags.canUndo, canRedo: flags.canRedo };
}
