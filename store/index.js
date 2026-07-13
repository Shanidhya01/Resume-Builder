import { configureStore } from '@reduxjs/toolkit';
import resumeSlice from './slices/resumeSlice';
import aiSlice from './slices/aiSlice';
import atsSlice, { incrementResumeEdits } from './slices/atsSlice';
import { DEFAULT_TEMPLATE_ID, isValidTemplateId } from '@/config/templates';

const STORAGE_KEY = 'reduxState';
const STORAGE_VERSION = 2;

const defaultResumeShape = {
    contact: {},
    summary: {},
    education: [],
    experience: [],
    projects: [],
    skills: {},
    certificates: [],
    languages: [],
    selectedTemplate: DEFAULT_TEMPLATE_ID,
    saved: false,
};

const defaultAtsShape = {
    analysis: null,
    analyzedResumeHash: null,
    lastAnalyzedAt: null,
    jobDescription: '',
    jdAnalysis: null,
    jdInsights: null,
    jdLoading: false,
    jdError: null,
    suggestionStatus: {},
    previousSnapshot: null,
    history: [],
    totalAiGenerations: 0,
    totalResumeEdits: 0,
};

const isPlainObject = value => typeof value === 'object' && value !== null && !Array.isArray(value);

// Validates the persisted shape so a corrupted/older localStorage payload
// can never crash the app on load — unknown or malformed keys fall back to defaults.
const sanitizeResumeState = raw => {
    if (!isPlainObject(raw)) return defaultResumeShape;

    const sanitized = { ...defaultResumeShape };
    for (const key of Object.keys(defaultResumeShape)) {
        const value = raw[key];
        const expectedIsArray = Array.isArray(defaultResumeShape[key]);
        if (expectedIsArray && Array.isArray(value)) {
            sanitized[key] = value;
        } else if (key === 'saved' && typeof value === 'boolean') {
            sanitized[key] = value;
        } else if (key === 'selectedTemplate' && isValidTemplateId(value)) {
            sanitized[key] = value;
        } else if (!expectedIsArray && key !== 'saved' && key !== 'selectedTemplate' && isPlainObject(value)) {
            sanitized[key] = value;
        }
    }
    return sanitized;
};

const loadState = () => {
    if (typeof window === 'undefined') return undefined;

    try {
        const serialized = window.localStorage.getItem(STORAGE_KEY);
        if (!serialized) return undefined;

        const parsed = JSON.parse(serialized);
        if (!isPlainObject(parsed)) return { resume: defaultResumeShape };

        // Sanitizing (rather than discarding) on a version bump lets older
        // payloads pick up new fields' defaults without losing existing resume data.
        const preloaded = { resume: sanitizeResumeState(parsed.resume) };
        // Merge onto the slice's own defaults (not replace) — only the lightweight,
        // user-authored bits are persisted; analysis/loading state is recomputed fresh.
        const atsRaw = isPlainObject(parsed.ats) ? parsed.ats : {};
        preloaded.ats = {
            ...defaultAtsShape,
            suggestionStatus: isPlainObject(atsRaw.suggestionStatus) ? atsRaw.suggestionStatus : {},
            history: Array.isArray(atsRaw.history) ? atsRaw.history : [],
            totalAiGenerations: typeof atsRaw.totalAiGenerations === 'number' ? atsRaw.totalAiGenerations : 0,
            totalResumeEdits: typeof atsRaw.totalResumeEdits === 'number' ? atsRaw.totalResumeEdits : 0,
            previousSnapshot: isPlainObject(atsRaw.previousSnapshot) ? atsRaw.previousSnapshot : null,
        };
        return preloaded;
    } catch (err) {
        console.warn('Resume Builder: could not read saved resume, starting fresh.', err);
        return undefined;
    }
};

// Feeds atsSlice.totalResumeEdits (Analytics dashboard) without the resume slice
// needing to know about ats — only actions that actually mutate resume content count.
const RESUME_EDIT_ACTIONS = new Set([
    'resume/updateResumeValue',
    'resume/addNewIndex',
    'resume/deleteIndex',
    'resume/moveIndex',
    'resume/setTemplate',
]);

const trackResumeEdits = storeApi => next => action => {
    const result = next(action);
    if (RESUME_EDIT_ACTIONS.has(action.type)) {
        storeApi.dispatch(incrementResumeEdits());
    }
    return result;
};

const store = configureStore({
    devTools: process.env.NODE_ENV !== 'production',
    preloadedState: loadState(),
    reducer: {
        resume: resumeSlice,
        ai: aiSlice,
        ats: atsSlice,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(trackResumeEdits),
});

function debounce(func, timeout = 2500) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, timeout);
    };
}

const saveState = debounce(() => {
    if (typeof window === 'undefined') return;

    try {
        const atsState = store.getState().ats;
        const payload = {
            version: STORAGE_VERSION,
            resume: store.getState().resume,
            ats: {
                suggestionStatus: atsState.suggestionStatus,
                history: atsState.history,
                totalAiGenerations: atsState.totalAiGenerations,
                totalResumeEdits: atsState.totalResumeEdits,
                previousSnapshot: atsState.previousSnapshot,
            },
        };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (err) {
        console.warn('Resume Builder: could not save resume to local storage.', err);
    }
});

store.subscribe(saveState);

export default store;
