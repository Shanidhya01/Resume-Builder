import { normalizeImportedResume, computeMissingFields, computeHeuristicConfidence, isResumeEmpty } from '@/lib/import/normalize';

export class AIValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'AIValidationError';
    }
}

const isString = v => typeof v === 'string';
const isStringArray = v => Array.isArray(v) && v.every(isString);
const isNumberInRange = (v, min, max) => typeof v === 'number' && v >= min && v <= max;

const requireString = (data, key) => {
    if (!data || !isString(data[key])) {
        throw new AIValidationError(`Expected AI response to include string field "${key}".`);
    }
};

const requireStringArray = (data, key) => {
    if (!data || !isStringArray(data[key])) {
        throw new AIValidationError(`Expected AI response to include a string array field "${key}".`);
    }
};

export function validateSummaryResponse(data) {
    requireString(data, 'summary');
    return data;
}

export function validateExperienceResponse(data) {
    requireStringArray(data, 'bullets');
    return data;
}

export function validateProjectsResponse(data) {
    requireStringArray(data, 'bullets');
    return data;
}

export function validateSkillsResponse(data) {
    requireStringArray(data, 'skills');
    return data;
}

export function validateRewriteResponse(data) {
    requireString(data, 'rewritten');
    return data;
}

export function validateGrammarResponse(data) {
    requireString(data, 'corrected');
    if (data.changes != null && !isStringArray(data.changes)) {
        throw new AIValidationError('Expected "changes" to be a string array if present.');
    }
    if (data.changes == null) data.changes = [];
    return data;
}

export function validateReviewResponse(data) {
    if (!data || !isNumberInRange(data.score, 0, 100)) {
        throw new AIValidationError('Expected AI response to include a numeric "score" between 0-100.');
    }
    requireStringArray(data, 'strengths');
    requireStringArray(data, 'weaknesses');
    requireStringArray(data, 'suggestions');
    return data;
}

export function validateCoverLetterResponse(data) {
    requireString(data, 'coverLetter');
    return data;
}

export function validateAtsResponse(data) {
    if (!data || !isNumberInRange(data.score, 0, 100)) {
        throw new AIValidationError('Expected AI response to include a numeric "score" between 0-100.');
    }
    requireStringArray(data, 'issues');
    requireStringArray(data, 'suggestions');
    return data;
}

export function validateJobMatchResponse(data) {
    if (!data || !isNumberInRange(data.score, 0, 100)) {
        throw new AIValidationError('Expected AI response to include a numeric "score" between 0-100.');
    }
    requireStringArray(data, 'matchedKeywords');
    requireStringArray(data, 'missingKeywords');
    requireStringArray(data, 'suggestions');
    return data;
}

export function validateJdInsightsResponse(data) {
    requireStringArray(data, 'recommendedSkills');
    requireStringArray(data, 'recommendedProjects');
    requireStringArray(data, 'recommendedCertifications');
    requireStringArray(data, 'recommendedChanges');
    return data;
}

const toStringArray = value => (Array.isArray(value) ? value.filter(v => typeof v === 'string') : []);

export function validateResumeImportResponse(data) {
    if (!data || typeof data !== 'object') {
        throw new AIValidationError('Expected AI response to be an object.');
    }
    // The model sometimes returns the resume at the top level instead of under "resume".
    const resume = normalizeImportedResume(data.resume && typeof data.resume === 'object' ? data.resume : data);
    if (isResumeEmpty(resume)) {
        throw new AIValidationError('AI could not extract any resume content from the text.');
    }

    const heuristic = computeHeuristicConfidence(resume);
    const reported = typeof data.confidence === 'number' && data.confidence >= 0 && data.confidence <= 100 ? data.confidence : null;

    return {
        resume,
        confidence: reported === null ? heuristic : Math.round((reported + heuristic) / 2),
        missingFields: toStringArray(data.missingFields).length ? toStringArray(data.missingFields) : computeMissingFields(resume),
        suggestions: toStringArray(data.suggestions),
    };
}

export function validateResumeCleanupResponse(data) {
    if (!data || typeof data !== 'object') {
        throw new AIValidationError('Expected AI response to be an object.');
    }
    const resume = normalizeImportedResume(data.resume && typeof data.resume === 'object' ? data.resume : data);
    if (isResumeEmpty(resume)) {
        throw new AIValidationError('AI cleanup returned an empty resume.');
    }
    return {
        resume,
        changes: toStringArray(data.changes),
        missingSkills: toStringArray(data.missingSkills),
        atsRecommendations: toStringArray(data.atsRecommendations),
    };
}

export const validators = {
    summary: validateSummaryResponse,
    experience: validateExperienceResponse,
    projects: validateProjectsResponse,
    skills: validateSkillsResponse,
    rewrite: validateRewriteResponse,
    grammar: validateGrammarResponse,
    review: validateReviewResponse,
    coverLetter: validateCoverLetterResponse,
    ats: validateAtsResponse,
    jobMatch: validateJobMatchResponse,
    jdInsights: validateJdInsightsResponse,
    resumeImport: validateResumeImportResponse,
    resumeCleanup: validateResumeCleanupResponse,
};
