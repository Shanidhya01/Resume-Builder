import { createSlice } from '@reduxjs/toolkit';
import { DEFAULT_TEMPLATE_ID, isValidTemplateId } from '@/config/templates';

const defaultResume = {
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

const resumeSlice = createSlice({
    name: 'resume',
    initialState: defaultResume,
    reducers: {
        updateResumeValue: (state, action) => {
            const { tab, name, value, index } = action.payload;
            if (index != null) {
                state[tab][index][name] = value;
            } else {
                state[tab][name] = value;
            }

            state.saved = false;
        },

        addNewIndex: (state, action) => {
            const { tab } = action.payload;
            state[tab].push({});
            state.saved = false;
        },

        deleteIndex: (state, action) => {
            const { index, tab } = action.payload;
            if (!Array.isArray(state[tab]) || index < 0 || index >= state[tab].length) return;
            state[tab].splice(index, 1);
            state.saved = false;
        },

        moveIndex: (state, action) => {
            const { index, tab, dir } = action.payload;
            const newIndex = dir === 'up' ? index - 1 : index + 1;

            if (!Array.isArray(state[tab])) return;
            if (newIndex < 0 || newIndex >= state[tab].length || index < 0 || index >= state[tab].length) return;

            const temp = state[tab][index];
            state[tab][index] = state[tab][newIndex];
            state[tab][newIndex] = temp;
            state.saved = false;
        },

        reorderList: (state, action) => {
            const { tab, from, to } = action.payload;
            if (!Array.isArray(state[tab])) return;
            const len = state[tab].length;
            if (from < 0 || from >= len || to < 0 || to >= len || from === to) return;
            const [moved] = state[tab].splice(from, 1);
            state[tab].splice(to, 0, moved);
            state.saved = false;
        },

        saveResume: state => {
            state.saved = true;
        },

        setTemplate: (state, action) => {
            const templateId = action.payload;
            if (!isValidTemplateId(templateId)) return;
            state.selectedTemplate = templateId;
            state.saved = false;
        },

        loadResume: (state, action) => {
            const data = action.payload || {};
            return {
                ...defaultResume,
                ...data,
                selectedTemplate: isValidTemplateId(data.selectedTemplate) ? data.selectedTemplate : DEFAULT_TEMPLATE_ID,
                saved: true,
            };
        },

        // Restore a previous content snapshot for undo/redo. Unlike loadResume,
        // this marks the resume unsaved so the change is autosaved to Firestore.
        restoreContent: (state, action) => {
            const data = action.payload || {};
            return {
                ...defaultResume,
                ...data,
                selectedTemplate: isValidTemplateId(data.selectedTemplate)
                    ? data.selectedTemplate
                    : state.selectedTemplate,
                saved: false,
            };
        },
    },
});

export const { updateResumeValue, addNewIndex, deleteIndex, saveResume, moveIndex, reorderList, setTemplate, loadResume, restoreContent } = resumeSlice.actions;
export default resumeSlice.reducer;
