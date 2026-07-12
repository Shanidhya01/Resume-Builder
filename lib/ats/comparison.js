// Feature 10: Resume Comparison — diffs two resume snapshots (e.g. current vs. a previous
// saved version) and the ATS analyses computed for each.

import { getResumeSkillsList } from './keywords';

export function compareResumes(currentResume, previousResume, currentAnalysis, previousAnalysis) {
    const currentSkills = new Set(getResumeSkillsList(currentResume));
    const previousSkills = new Set(getResumeSkillsList(previousResume));

    const addedSkills = [...currentSkills].filter(s => !previousSkills.has(s));
    const removedSkills = [...previousSkills].filter(s => !currentSkills.has(s));

    const atsDifference = (currentAnalysis?.overall ?? 0) - (previousAnalysis?.overall ?? 0);

    const currentKeywords = new Set(currentAnalysis?.keywordAnalysis?.topResumeKeywords || []);
    const previousKeywords = new Set(previousAnalysis?.keywordAnalysis?.topResumeKeywords || []);
    const addedKeywords = [...currentKeywords].filter(k => !previousKeywords.has(k));
    const removedKeywords = [...previousKeywords].filter(k => !currentKeywords.has(k));

    const sectionDifference = {};
    Object.keys(currentAnalysis?.sectionScores || {}).forEach(key => {
        sectionDifference[key] = (currentAnalysis.sectionScores[key] || 0) - (previousAnalysis?.sectionScores?.[key] || 0);
    });

    return {
        addedSkills,
        removedSkills,
        atsDifference,
        addedKeywords,
        removedKeywords,
        sectionDifference,
        qualityDifference: sectionDifference,
    };
}
