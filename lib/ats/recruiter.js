// Feature 11: Recruiter Preview — simulates a first-pass recruiter skim.

import { words, resumeToText } from './textUtils';

const AVG_READING_WPM = 220;

export function analyzeRecruiterView(resume = {}) {
    const text = resumeToText(resume);
    const wordCount = words(text).length;
    const estimatedReadingSeconds = Math.max(15, Math.round((wordCount / AVG_READING_WPM) * 60));

    const contact = resume.contact || {};
    const missingRecruiterInfo = [];
    if (!contact.name) missingRecruiterInfo.push('Full name');
    if (!contact.email) missingRecruiterInfo.push('Email');
    if (!contact.phone) missingRecruiterInfo.push('Phone number');
    if (!contact.title) missingRecruiterInfo.push('Job title / headline');
    if (!(resume.summary?.summary || '').trim()) missingRecruiterInfo.push('Professional summary');
    if (!(resume.experience || []).length) missingRecruiterInfo.push('Work experience');

    const importantSections = ['header', 'summary', 'experience', 'skills'].filter(key => {
        if (key === 'header') return !!contact.name;
        if (key === 'summary') return !!(resume.summary?.summary || '').trim();
        if (key === 'experience') return (resume.experience || []).length > 0;
        if (key === 'skills') return !!(resume.skills?.skills || '').trim();
        return false;
    });

    let firstImpression = 'Neutral — resume is readable but could be more compelling at a glance.';
    if (missingRecruiterInfo.length >= 3) firstImpression = 'Weak — key identifying or summary information is missing, likely to be skipped.';
    else if (missingRecruiterInfo.length === 0 && (resume.experience || []).length > 0) firstImpression = 'Strong — all essential information is present and easy to find.';

    // Rough proxy for visual hierarchy: are section lengths reasonable and is there a template selected.
    let visualHierarchyScore = 60;
    if (resume.selectedTemplate) visualHierarchyScore += 15;
    if (contact.title) visualHierarchyScore += 10;
    if ((resume.summary?.summary || '').length > 0) visualHierarchyScore += 15;
    visualHierarchyScore = Math.min(100, visualHierarchyScore);

    return {
        estimatedReadingSeconds,
        importantSections,
        firstImpression,
        missingRecruiterInfo,
        visualHierarchyScore,
    };
}
