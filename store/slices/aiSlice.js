import { createSlice } from '@reduxjs/toolkit';

const HISTORY_LIMIT = 20;

const initialState = {
    loading: {},
    error: {},
    lastResponse: {},
    history: [],
};

const aiSlice = createSlice({
    name: 'ai',
    initialState,
    reducers: {
        aiRequestStart: (state, action) => {
            const { feature } = action.payload;
            state.loading[feature] = true;
            state.error[feature] = null;
        },
        aiRequestSuccess: (state, action) => {
            const { feature, result, inputSummary } = action.payload;
            state.loading[feature] = false;
            state.error[feature] = null;
            state.lastResponse[feature] = result;

            state.history.unshift({
                feature,
                timestamp: Date.now(),
                inputSummary: inputSummary || '',
                output: result,
            });
            if (state.history.length > HISTORY_LIMIT) {
                state.history.length = HISTORY_LIMIT;
            }
        },
        aiRequestError: (state, action) => {
            const { feature, error } = action.payload;
            state.loading[feature] = false;
            state.error[feature] = error;
        },
        aiClearResult: (state, action) => {
            const { feature } = action.payload;
            state.lastResponse[feature] = null;
            state.error[feature] = null;
        },
    },
});

export const { aiRequestStart, aiRequestSuccess, aiRequestError, aiClearResult } = aiSlice.actions;
export default aiSlice.reducer;
