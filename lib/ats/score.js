// Feature 1: Advanced ATS Score — overall + per-section breakdown, each 0-100.

import { analyzeSections } from './quality';
import { analyzeReadability } from './readability';
import { analyzeKeywords } from './keywords';

const STATUS_SCORE = { Excellent: 100, Good: 75, 'Needs Improvement': 45, Missing: 0 };

function formattingScore(resume = {}) {
    let score = 100;
    const contact = resume.contact || {};
    if (!contact.name) score -= 20;
    if (!contact.email) score -= 15;
    if (!contact.phone) score -= 10;
    if (!resume.selectedTemplate) score -= 5;
    const longEntries = [...(resume.experience || []), ...(resume.projects || [])].filter(
        e => (e.description || '').length > 1200
    );
    score -= longEntries.length * 5;
    return Math.max(0, Math.min(100, score));
}

// Weights sum to 1 across the 10 scored dimensions.
const WEIGHTS = {
    header: 0.1,
    summary: 0.1,
    experience: 0.2,
    projects: 0.1,
    education: 0.05,
    skills: 0.1,
    certificates: 0.05,
    formatting: 0.1,
    keywordMatch: 0.1,
    readability: 0.1,
};

export function computeAtsScore(resume = {}, jobDescription = '') {
    const sectionStatus = analyzeSections(resume);
    const readability = analyzeReadability(resume);
    const keywordAnalysis = analyzeKeywords(resume, jobDescription);

    const sectionScores = {
        header: STATUS_SCORE[sectionStatus.header.status],
        summary: STATUS_SCORE[sectionStatus.summary.status],
        experience: STATUS_SCORE[sectionStatus.experience.status],
        projects: STATUS_SCORE[sectionStatus.projects.status],
        education: STATUS_SCORE[sectionStatus.education.status],
        skills: STATUS_SCORE[sectionStatus.skills.status],
        certificates: STATUS_SCORE[sectionStatus.certificates.status],
        formatting: formattingScore(resume),
        keywordMatch: keywordAnalysis.matchPercent != null ? keywordAnalysis.matchPercent : 70,
        readability: readability.score,
    };

    const overall = Math.round(
        Object.entries(WEIGHTS).reduce((sum, [key, weight]) => sum + sectionScores[key] * weight, 0)
    );

    return { overall, sectionScores, sectionStatus, readability, keywordAnalysis };
}

export function scoreToGrade(score) {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
}
