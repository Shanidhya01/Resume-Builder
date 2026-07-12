'use client';

import { useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { aiRequestStart, aiRequestSuccess, aiRequestError } from '@/store/slices/aiSlice';

const FEATURE_ROUTES = {
    summary: '/api/ai/summary',
    experience: '/api/ai/experience',
    projects: '/api/ai/projects',
    skills: '/api/ai/skills',
    rewrite: '/api/ai/rewrite',
    grammar: '/api/ai/grammar',
    review: '/api/ai/review',
    coverLetter: '/api/ai/cover-letter',
    ats: '/api/ai/ats',
    jobMatch: '/api/ai/job-match',
    jdInsights: '/api/ai/jd-insights',
};

const CACHE_TTL_MS = 2000;
const responseCache = new Map();

const hashInput = (feature, body) => `${feature}:${JSON.stringify(body)}`;

export default function useAI() {
    const dispatch = useDispatch();
    const loading = useSelector(state => state.ai.loading);
    const error = useSelector(state => state.ai.error);
    const lastResponse = useSelector(state => state.ai.lastResponse);
    const history = useSelector(state => state.ai.history);
    const inFlightRef = useRef({});

    const run = useCallback(
        async (feature, body, { inputSummary } = {}) => {
            const route = FEATURE_ROUTES[feature];
            if (!route) throw new Error(`Unknown AI feature "${feature}"`);

            const cacheKey = hashInput(feature, body);
            const cached = responseCache.get(cacheKey);
            if (cached && Date.now() - cached.time < CACHE_TTL_MS) {
                return cached.result;
            }

            if (inFlightRef.current[feature]) return null;
            inFlightRef.current[feature] = true;

            dispatch(aiRequestStart({ feature }));
            try {
                const res = await fetch(route, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                });
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data?.error || 'AI request failed.');
                }
                responseCache.set(cacheKey, { time: Date.now(), result: data });
                dispatch(aiRequestSuccess({ feature, result: data, inputSummary }));
                return data;
            } catch (err) {
                dispatch(aiRequestError({ feature, error: err.message || 'AI request failed.' }));
                return null;
            } finally {
                inFlightRef.current[feature] = false;
            }
        },
        [dispatch]
    );

    return { run, loading, error, lastResponse, history };
}
