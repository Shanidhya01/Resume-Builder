import { createSlice } from '@reduxjs/toolkit';

const HISTORY_LIMIT = 30;

const initialState = {
    // Cached deterministic analysis result from lib/ats/analysis.js
    analysis: null,
    analyzedResumeHash: null,
    lastAnalyzedAt: null,

    // Job description analyzer (Feature 3)
    jobDescription: '',
    jdAnalysis: null,
    jdInsights: null,
    jdLoading: false,
    jdError: null,

    // Improvement Center (Feature 9) — per-suggestion-id user decision
    suggestionStatus: {}, // { [id]: 'accepted' | 'rejected' | 'completed' }

    // Resume comparison (Feature 10) — last snapshot kept for diffing against current
    previousSnapshot: null, // { resume, analysis, savedAt }

    // Analytics (Feature 12)
    history: [], // [{ timestamp, overall, completion }]
    totalAiGenerations: 0,
    totalResumeEdits: 0,
};

const atsSlice = createSlice({
    name: 'ats',
    initialState,
    reducers: {
        setAnalysis: (state, action) => {
            const { analysis, resumeHash } = action.payload;
            state.analysis = analysis;
            state.analyzedResumeHash = resumeHash;
            state.lastAnalyzedAt = Date.now();

            state.history.unshift({ timestamp: Date.now(), overall: analysis.overall, completion: analysis.completion });
            if (state.history.length > HISTORY_LIMIT) state.history.length = HISTORY_LIMIT;
        },
        setJobDescription: (state, action) => {
            state.jobDescription = action.payload;
        },
        setJdAnalysis: (state, action) => {
            state.jdAnalysis = action.payload;
        },
        jdInsightsStart: state => {
            state.jdLoading = true;
            state.jdError = null;
        },
        jdInsightsSuccess: (state, action) => {
            state.jdLoading = false;
            state.jdInsights = action.payload;
            state.totalAiGenerations += 1;
        },
        jdInsightsError: (state, action) => {
            state.jdLoading = false;
            state.jdError = action.payload;
        },
        setSuggestionStatus: (state, action) => {
            const { id, status } = action.payload;
            if (status == null) {
                delete state.suggestionStatus[id];
            } else {
                state.suggestionStatus[id] = status;
            }
        },
        snapshotPrevious: (state, action) => {
            state.previousSnapshot = { resume: action.payload.resume, analysis: action.payload.analysis, savedAt: Date.now() };
        },
        incrementResumeEdits: state => {
            state.totalResumeEdits += 1;
        },
        resetAts: () => initialState,
    },
});

export const {
    setAnalysis,
    setJobDescription,
    setJdAnalysis,
    jdInsightsStart,
    jdInsightsSuccess,
    jdInsightsError,
    setSuggestionStatus,
    snapshotPrevious,
    incrementResumeEdits,
    resetAts,
} = atsSlice.actions;

export default atsSlice.reducer;
