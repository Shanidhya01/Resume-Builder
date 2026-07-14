'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { updateResume, saveVersionSnapshot } from '@/lib/resumes';

const SAVE_DEBOUNCE_MS = 1200;
const VERSION_SNAPSHOT_INTERVAL_MS = 2 * 60 * 1000;
const MAX_RETRIES = 3;

const useAutoSave = (resumeId, resumeData, uid) => {
    const [status, setStatus] = useState('idle');
    const timerRef = useRef(null);
    const retryCountRef = useRef(0);
    const lastVersionSnapshotAtRef = useRef(0);
    const lastDataRef = useRef(null);

    const performSave = useCallback(async () => {
        if (!resumeId || !uid) return;

        // Hoisted inner function so the retry timeout can re-run this exact
        // save attempt (same data closure) without the callback referencing itself.
        async function attempt() {
            setStatus('saving');
            try {
                const { selectedTemplate, contact, summary, education, experience, projects, skills, certificates, languages } = resumeData;
                const fields = { selectedTemplate, contact, summary, education, experience, projects, skills, certificates, languages };

                await updateResume(resumeId, fields, uid);

                const now = Date.now();
                if (now - lastVersionSnapshotAtRef.current >= VERSION_SNAPSHOT_INTERVAL_MS) {
                    await saveVersionSnapshot(resumeId, fields);
                    lastVersionSnapshotAtRef.current = now;
                }

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
    }, [resumeId, resumeData, uid]);

    useEffect(() => {
        if (!resumeId || !uid) return undefined;
        if (lastDataRef.current === resumeData) return undefined;
        lastDataRef.current = resumeData;

        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            retryCountRef.current = 0;
            performSave();
        }, SAVE_DEBOUNCE_MS);

        return () => clearTimeout(timerRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resumeData, resumeId, uid]);

    const retry = useCallback(() => {
        retryCountRef.current = 0;
        performSave();
    }, [performSave]);

    return { status, retry };
};

export default useAutoSave;
