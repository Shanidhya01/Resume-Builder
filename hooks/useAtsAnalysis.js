'use client';

import { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { runAtsAnalysis } from '@/lib/ats/analysis';
import { setAnalysis } from '@/store/slices/atsSlice';

// Cheap, deterministic hash of the resume so we only recompute analysis when
// resume content actually changes — avoids re-running the ATS engine on every render.
function hashResume(resume) {
    const str = JSON.stringify(resume);
    let h = 0;
    for (let i = 0; i < str.length; i++) {
        h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
    }
    return String(h);
}

// Runs (and caches in Redux) the deterministic ATS analysis for the current resume.
// Safe to call from multiple components — recomputation only happens when the resume changes.
export default function useAtsAnalysis() {
    const dispatch = useDispatch();
    const resume = useSelector(state => state.resume);
    const { analysis, analyzedResumeHash } = useSelector(state => state.ats);

    const resumeHash = useMemo(() => hashResume(resume), [resume]);

    useEffect(() => {
        if (resumeHash === analyzedResumeHash && analysis) return;
        const result = runAtsAnalysis(resume);
        dispatch(setAnalysis({ analysis: result, resumeHash }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resumeHash]);

    return analysis;
}
