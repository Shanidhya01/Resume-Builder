// Feature 7: lightweight deterministic grammar/spelling/tone heuristics.
// This intentionally does NOT call the AI — it's a fast, free pre-pass. The existing
// `grammar` AI feature (lib/ai/prompts.js) can still be invoked per-field for a deeper rewrite.

import { splitLines, resumeToText } from './textUtils';

const DOUBLE_SPACE = /  +/;
const REPEATED_WORD = /\b(\w+)\s+\1\b/i;
const MISSING_SPACE_AFTER_PUNCT = /[,.;:][A-Za-z]/;
const FIRST_PERSON_PRONOUNS = /\b(I|me|my|mine|we|us|our)\b/;
const ENDS_WITH_PUNCT_EXCEPT_PERIOD = /[,;:]$/;
const STARTS_LOWERCASE = /^[a-z]/;

function checkLine(line, source) {
    const issues = [];
    if (DOUBLE_SPACE.test(line)) issues.push({ type: 'punctuation', message: 'Contains multiple consecutive spaces.' });
    if (REPEATED_WORD.test(line)) issues.push({ type: 'repetition', message: 'Contains a repeated word.' });
    if (MISSING_SPACE_AFTER_PUNCT.test(line)) issues.push({ type: 'punctuation', message: 'Missing space after punctuation.' });
    if (FIRST_PERSON_PRONOUNS.test(line)) issues.push({ type: 'tone', message: 'Avoid first-person pronouns ("I", "my", "we") in resume bullets.' });
    if (STARTS_LOWERCASE.test(line)) issues.push({ type: 'grammar', message: 'Sentence should start with a capital letter.' });
    if (ENDS_WITH_PUNCT_EXCEPT_PERIOD.test(line)) issues.push({ type: 'punctuation', message: 'Line ends with an unexpected punctuation mark.' });
    if (issues.length > 0) return { source, line, issues };
    return null;
}

export function analyzeGrammar(resume = {}) {
    const findings = [];

    const scanField = (source, text) => {
        if (!text) return;
        const result = checkLine(text.trim(), source);
        if (result) findings.push(result);
    };

    scanField('summary', resume?.summary?.summary);
    (resume.experience || []).forEach((entry, i) =>
        splitLines(entry.description).forEach(line => {
            const r = checkLine(line, `experience[${i}]`);
            if (r) findings.push(r);
        })
    );
    (resume.projects || []).forEach((entry, i) =>
        splitLines(entry.description).forEach(line => {
            const r = checkLine(line, `projects[${i}]`);
            if (r) findings.push(r);
        })
    );

    const wholeText = resumeToText(resume);
    const repetitionMatches = wholeText.match(new RegExp(REPEATED_WORD, 'gi')) || [];

    const totalIssues = findings.reduce((sum, f) => sum + f.issues.length, 0);
    const score = Math.max(0, 100 - totalIssues * 6 - repetitionMatches.length * 3);

    return { score, findings, repetitionCount: repetitionMatches.length, issueCount: totalIssues };
}
