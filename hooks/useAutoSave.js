'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { updateResume, saveVersionSnapshot } from '@/lib/resumes';

const SAVE_DEBOUNCE_MS = 1200;
const VERSION_SNAPSHOT_INTERVAL_MS = 2 * 60 * 1000;
const MAX_RETRIES = 3;

// The exact set of content fields persisted to Firestore. The transient Redux
// `saved` flag is deliberately excluded so it never counts as a content change.
const extractFields = data => ({
    selectedTemplate: data.selectedTemplate,
    contact: data.contact,
    summary: data.summary,
    education: data.education,
    experience: data.experience,
    projects: data.projects,
    skills: data.skills,
    certificates: data.certificates,
    languages: data.languages,
});

/**
 * Debounced Firestore autosave for the resume editor.
 *
 * `enabled` MUST be false until the editor has hydrated Redux from Firestore for
 * this exact resumeId. This is the guard that fixes the "resume disappears after
 * refresh" bug: without it the hook would debounce-save the empty initial Redux
 * state (or a previous resume's leftover state) straight over the real document
 * before the Firestore read finished loading, wiping the content.
 *
 * Change detection compares a JSON snapshot of the content fields, so:
 *   - the freshly-hydrated (unchanged) resume is never written back,
 *   - only genuine edits trigger a save, and
 *   - the vestigial `saved` flag flipping can neither skip nor spuriously fire a save.
 */
const useAutoSave = (resumeId, resumeData, uid, enabled) => {
    const [status, setStatus] = useState('idle');
    const timerRef = useRef(null);
    const retryCountRef = useRef(0);
    const lastVersionSnapshotAtRef = useRef(0);
    const lastSavedRef = useRef(null); // serialized content last persisted to Firestore
    const baselineIdRef = useRef(null); // resumeId we've captured a baseline for
    const pendingRef = useRef(null); // { fields, serialized } queued for the next save

    const performSave = useCallback(async () => {
        const pending = pendingRef.current;
        if (!resumeId || !uid || !pending) return;

        // Hoisted inner function so the retry timeout can re-run this exact save
        // attempt without the callback referencing itself.
        async function attempt() {
            setStatus('saving');
            try {
                await updateResume(resumeId, pending.fields, uid);

                const now = Date.now();
                if (now - lastVersionSnapshotAtRef.current >= VERSION_SNAPSHOT_INTERVAL_MS) {
                    await saveVersionSnapshot(resumeId, pending.fields);
                    lastVersionSnapshotAtRef.current = now;
                }

                lastSavedRef.current = pending.serialized;
                retryCountRef.current = 0;
                setStatus('saved');
            } catch (err) {
                console.warn('Resume Builder: autosave failed.', err);
                if (retryCountRef.current < MAX_RETRIES) {
                    const delay = 1000 * 2 ** retryCountRef.current;
                    retryCountRef.current += 1;
                    setTimeout(attempt, delay);
                } else {
                    setStatus('error');
                }
            }
        }

        await attempt();
    }, [resumeId, uid]);

    useEffect(() => {
        if (!enabled || !resumeId || !uid) return undefined;

        const fields = extractFields(resumeData);
        const serialized = JSON.stringify(fields);

        // The first time this resume becomes editable, capture the hydrated
        // content as the baseline instead of saving it back.
        if (baselineIdRef.current !== resumeId) {
            baselineIdRef.current = resumeId;
            lastSavedRef.current = serialized;
            return undefined;
        }

        // Nothing actually changed — don't touch Firestore.
        if (serialized === lastSavedRef.current) return undefined;

        pendingRef.current = { fields, serialized };
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            retryCountRef.current = 0;
            performSave();
        }, SAVE_DEBOUNCE_MS);

        return () => clearTimeout(timerRef.current);
    }, [resumeData, resumeId, uid, enabled, performSave]);

    // Best-effort flush of a debounced-but-unsaved edit when the tab is hidden,
    // the page is being unloaded, or this editor unmounts (in-app navigation).
    // Without this, anything typed within the debounce interval is stranded in
    // the pending timer and lost on a quick refresh/navigation — a real cause of
    // "created a resume, refreshed, it's empty." Tab-switch and in-app navigation
    // are fully covered; on a hard browser refresh the async write may not finish
    // in time, but the exposure shrinks from the full 1.2s debounce to the gap
    // between the last keystroke and the unload event firing.
    useEffect(() => {
        if (!enabled) return undefined;
        const flush = () => {
            const pending = pendingRef.current;
            if (!pending || pending.serialized === lastSavedRef.current) return;
            clearTimeout(timerRef.current);
            retryCountRef.current = 0;
            performSave();
        };
        const onVisibility = () => {
            if (document.visibilityState === 'hidden') flush();
        };
        document.addEventListener('visibilitychange', onVisibility);
        window.addEventListener('pagehide', flush);
        return () => {
            document.removeEventListener('visibilitychange', onVisibility);
            window.removeEventListener('pagehide', flush);
            flush();
        };
    }, [enabled, performSave]);

    const retry = useCallback(() => {
        retryCountRef.current = 0;
        performSave();
    }, [performSave]);

    return { status, retry };
};

export default useAutoSave;
