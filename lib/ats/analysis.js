// Top-level orchestrator — the only entry point UI/Redux code should call directly.
// Combines every lib/ats/* module into one analysis result and derives Feature 2 & 8
// (dashboard summary stats, strengths/weaknesses/insights) without any extra AI calls.

import { computeAtsScore, scoreToGrade } from './score';
import { analyzeBullets } from './quality';
import { analyzeGrammar } from './grammar';
import { buildRecommendations, groupByPriority } from './recommendations';
import { analyzeRecruiterView } from './recruiter';
import { words } from './textUtils';

function completionPercent(resume = {}) {
    const checks = [
        !!resume.contact?.name,
        !!resume.contact?.email,
        !!(resume.summary?.summary || '').trim(),
        (resume.experience || []).length > 0,
        (resume.projects || []).length > 0,
        (resume.education || []).length > 0,
        !!(resume.skills?.skills || '').trim(),
        (resume.certificates || []).length > 0,
    ];
    const complete = checks.filter(Boolean).length;
    return Math.round((complete / checks.length) * 100);
}

function buildInsights({ sectionStatus, bulletAnalysis, keywordAnalysis, grammar, overall }) {
    const strengths = [];
    const weaknesses = [];
    const opportunities = [];

    Object.entries(sectionStatus).forEach(([section, info]) => {
        if (info.status === 'Excellent') strengths.push(`${section} section is well-structured.`);
        if (info.status === 'Missing') weaknesses.push(`${section} section is missing.`);
    });

    if (bulletAnalysis.strongBullets.length > 0) {
        strengths.push(`${bulletAnalysis.strongBullets.length} bullet point(s) demonstrate strong, quantified impact.`);
    }
    if (bulletAnalysis.weakBullets.length > 0) {
        weaknesses.push(`${bulletAnalysis.weakBullets.length} bullet point(s) use weak verbs or lack measurable impact.`);
        opportunities.push('Rewrite weak bullet points with strong action verbs and quantified results.');
    }
    if (keywordAnalysis.matchPercent != null && keywordAnalysis.matchPercent < 70) {
        opportunities.push('Tailor resume keywords more closely to the target job description.');
    }
    if (grammar.issueCount === 0) strengths.push('No grammar or punctuation issues detected.');
    else opportunities.push('Fix detected grammar/style issues for a more polished resume.');

    const recruiterTips = [
        'Keep the most relevant experience in the top third of the page.',
        'Use consistent date formats across all sections.',
    ];
    const industryTips = keywordAnalysis.suggestedIndustryKeywords.length
        ? [`Consider adding these in-demand keywords: ${keywordAnalysis.suggestedIndustryKeywords.slice(0, 5).join(', ')}.`]
        : [];
    const atsTips = [
        'Avoid tables, images, and multi-column layouts for maximum ATS parsing compatibility.',
        'Use standard section headings (Experience, Education, Skills) so ATS parsers recognize them.',
    ];

    return {
        topStrengths: strengths.slice(0, 5),
        topWeaknesses: weaknesses.slice(0, 5),
        biggestOpportunities: opportunities.slice(0, 5),
        recruiterTips,
        industryTips,
        atsTips,
        recruiterImpression: overall >= 80 ? 'Positive' : overall >= 60 ? 'Neutral' : 'Needs work',
    };
}

export function runAtsAnalysis(resume = {}, jobDescription = '') {
    const scoreResult = computeAtsScore(resume, jobDescription);
    const bulletAnalysis = analyzeBullets(resume);
    const grammar = analyzeGrammar(resume);
    const recruiter = analyzeRecruiterView(resume);
    const completion = completionPercent(resume);

    const merged = { ...scoreResult, bulletAnalysis, grammar, completion };
    const recommendations = buildRecommendations(merged);
    const insights = buildInsights(merged);

    return {
        overall: scoreResult.overall,
        grade: scoreToGrade(scoreResult.overall),
        sectionScores: scoreResult.sectionScores,
        sectionStatus: scoreResult.sectionStatus,
        readability: scoreResult.readability,
        keywordAnalysis: scoreResult.keywordAnalysis,
        bulletAnalysis,
        grammar,
        recruiter,
        completion,
        insights,
        recommendations,
        recommendationsByPriority: groupByPriority(recommendations),
        wordCount: words(JSON.stringify(resume)).length,
        analyzedAt: Date.now(),
    };
}
