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
};
