// Feature 1 (readability sub-score) + Feature 2 (readability score on the dashboard).
// Uses a Flesch Reading Ease approximation — deterministic, no AI call needed.

import { sentences, words, syllableCount, resumeToText } from './textUtils';

export function fleschReadingEase(text) {
    const sArr = sentences(text);
    const wArr = words(text);
    if (sArr.length === 0 || wArr.length === 0) return { score: 0, sentenceCount: 0, wordCount: 0 };

    const syllables = wArr.reduce((sum, w) => sum + syllableCount(w), 0);
    const avgSentenceLength = wArr.length / sArr.length;
    const avgSyllablesPerWord = syllables / wArr.length;

    const raw = 206.835 - 1.015 * avgSentenceLength - 84.6 * avgSyllablesPerWord;
    const score = Math.max(0, Math.min(100, Math.round(raw)));

    return { score, sentenceCount: sArr.length, wordCount: wArr.length, avgSentenceLength: Math.round(avgSentenceLength * 10) / 10 };
}

export function analyzeReadability(resume = {}) {
    const text = resumeToText(resume);
    const result = fleschReadingEase(text);

    let label = 'Difficult';
    if (result.score >= 70) label = 'Easy';
    else if (result.score >= 50) label = 'Fairly Easy';
    else if (result.score >= 30) label = 'Moderate';

    return { ...result, label };
}
