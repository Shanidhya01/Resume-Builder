import { configureStore } from '@reduxjs/toolkit';
import resumeSlice from './slices/resumeSlice';

const STORAGE_KEY = 'reduxState';
const STORAGE_VERSION = 1;

const defaultResumeShape = {
    contact: {},
    summary: {},
    education: [],
    experience: [],
    projects: [],
    skills: {},
    certificates: [],
    languages: [],
    saved: false,
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
        } else if (!expectedIsArray && key !== 'saved' && isPlainObject(value)) {
            sanitized[key] = value;
        } else if (key === 'saved' && typeof value === 'boolean') {
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
        if (!isPlainObject(parsed) || parsed.version !== STORAGE_VERSION) {
            return { resume: defaultResumeShape };
        }

        return { resume: sanitizeResumeState(parsed.resume) };
    } catch (err) {
        console.warn('Resume Builder: could not read saved resume, starting fresh.', err);
        return undefined;
    }
};

const store = configureStore({
    devTools: process.env.NODE_ENV !== 'production',
    preloadedState: loadState(),
    reducer: {
        resume: resumeSlice,
    },
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
        const payload = { version: STORAGE_VERSION, resume: store.getState().resume };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (err) {
        console.warn('Resume Builder: could not save resume to local storage.', err);
    }
});

store.subscribe(saveState);

export default store;
