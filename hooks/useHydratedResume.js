'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '@/context/AuthContext';
import { listResumesForUser } from '@/lib/resumes';
import { loadResume } from '@/store/slices/resumeSlice';

/**
 * Guarantees the Redux resume slice is hydrated from Firestore before analytics
 * pages read it. Redux is only transient UI state and is empty after a hard
 * refresh, so these pages must not compute from it blindly — otherwise a refresh
 * shows an all-zeros analysis of an empty resume.
 *
 * Firestore is the source of truth: if the slice was already hydrated this
 * session (the editor sets `resume.id`), we reuse it — during active editing it
 * is actually fresher than Firestore because of debounced autosave. Otherwise we
 * fetch the user's most-recently-updated resume and hydrate the slice from it.
 *
 * Returns a status the caller gates rendering on: loading | ready | empty | error.
 */
export default function useHydratedResume() {
    const dispatch = useDispatch();
    const { user } = useAuth();
    const hydratedId = useSelector(state => state.resume.id);
    // Only mutated inside async callbacks (never synchronously in the effect
    // body) so React's set-state-in-effect rule stays satisfied.
    const [fetchPhase, setFetchPhase] = useState('idle'); // idle | empty | error
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        if (hydratedId || !user?.uid) return undefined;
        let cancelled = false;
        listResumesForUser(user.uid)
            .then(list => {
                if (cancelled) return;
                if (!list.length) {
                    setFetchPhase('empty');
                    return;
                }
                // hydratedId flips truthy on the next render → derived status 'ready'.
                dispatch(loadResume(list[0]));
            })
            .catch(() => {
                if (!cancelled) setFetchPhase('error');
            });
        return () => {
            cancelled = true;
        };
    }, [hydratedId, user?.uid, dispatch, reloadKey]);

    const retry = useCallback(() => {
        setFetchPhase('idle');
        setReloadKey(k => k + 1);
    }, []);

    const status = hydratedId
        ? 'ready'
        : fetchPhase === 'empty'
          ? 'empty'
          : fetchPhase === 'error'
            ? 'error'
            : 'loading';

    return { status, retry };
}
