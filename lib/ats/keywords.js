// Keyword extraction and matching. Deterministic, no AI calls — used to power
// Feature 4 (Keyword Intelligence) and the keyword-match section score.

import { words, splitSkills, STOPWORDS, resumeToText } from './textUtils';

export const INDUSTRY_KEYWORDS = [
    'javascript', 'typescript', 'python', 'java', 'react', 'next.js', 'node.js', 'redux', 'graphql',
    'rest api', 'microservices', 'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'ci/cd', 'git',
    'agile', 'scrum', 'sql', 'nosql', 'mongodb', 'postgresql', 'testing', 'unit testing', 'automation',
    'machine learning', 'data analysis', 'leadership', 'cross-functional', 'stakeholder management',
    'communication', 'problem solving', 'project management', 'cloud computing', 'security',
];

function normalizedWords(text) {
    return words(text)
        .map(w => w.toLowerCase())
        .filter(w => w.length > 2 && !STOPWORDS.has(w));
}

export function extractKeywords(text, { limit = 40 } = {}) {
    const freq = new Map();
    normalizedWords(text).forEach(w => freq.set(w, (freq.get(w) || 0) + 1));
    return [...freq.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([keyword, count]) => ({ keyword, count }));
}

export function getResumeSkillsList(resume = {}) {
    return splitSkills(resume?.skills?.skills).map(s => s.toLowerCase());
}

// Compares resume content against a job description and returns everything Feature 3 + 4 need.
export function analyzeKeywords(resume = {}, jobDescription = '') {
    const resumeText = resumeToText(resume).toLowerCase();
    const resumeSkills = getResumeSkillsList(resume);
    const resumeKeywords = extractKeywords(resumeText);
    const resumeKeywordSet = new Set(resumeKeywords.map(k => k.keyword));

    const overused = resumeKeywords.filter(k => k.count >= 6).map(k => k.keyword);
    const skillCounts = new Map();
    resumeSkills.forEach(s => skillCounts.set(s, (skillCounts.get(s) || 0) + 1));
    const duplicateKeywords = [...skillCounts.entries()].filter(([, c]) => c > 1).map(([s]) => s);

    const unusedSkills = resumeSkills.filter(skill => !resumeText.includes(skill));

    const suggestedIndustryKeywords = INDUSTRY_KEYWORDS.filter(
        kw => !resumeText.includes(kw) && !resumeSkills.includes(kw)
    ).slice(0, 10);

    let matched = [];
    let missing = [];
    let matchPercent = null;
    let jdKeywords = [];

    if (jobDescription && jobDescription.trim().length > 0) {
        const jdText = jobDescription.toLowerCase();
        const jdKeywordList = extractKeywords(jdText, { limit: 30 });
        jdKeywords = jdKeywordList;

        matched = jdKeywordList.filter(k => resumeText.includes(k.keyword) || resumeSkills.includes(k.keyword)).map(k => k.keyword);
        missing = jdKeywordList.filter(k => !resumeText.includes(k.keyword) && !resumeSkills.includes(k.keyword)).map(k => k.keyword);
        matchPercent = jdKeywordList.length > 0 ? Math.round((matched.length / jdKeywordList.length) * 100) : 0;
    }

    return {
        matchPercent,
        matchedKeywords: matched,
        missingKeywords: missing,
        jdKeywords: jdKeywords.map(k => k.keyword),
        overusedKeywords: overused,
        duplicateKeywords,
        unusedSkills,
        suggestedIndustryKeywords,
        topResumeKeywords: resumeKeywords.slice(0, 15).map(k => k.keyword),
    };
}
