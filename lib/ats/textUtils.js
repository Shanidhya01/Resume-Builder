// Shared low-level text helpers used across the ATS engine. Pure functions, no React/Redux deps.

export const splitLines = text => (text ?? '').split('\n').map(l => l.trim()).filter(Boolean);

export const splitSkills = text =>
    (text ?? '')
        .split(/[\n,]/)
        .map(s => s.trim())
        .filter(Boolean);

export const words = text => (text ?? '').match(/[A-Za-z][A-Za-z'-]*/g) || [];

export const sentences = text =>
    (text ?? '')
        .split(/(?<=[.!?])\s+/)
        .map(s => s.trim())
        .filter(Boolean);

export const syllableCount = word => {
    const w = word.toLowerCase().replace(/[^a-z]/g, '');
    if (!w) return 0;
    const matches = w.match(/[aeiouy]+/g);
    let count = matches ? matches.length : 1;
    if (w.endsWith('e') && count > 1) count -= 1;
    return Math.max(count, 1);
};

// Flattens the whole resume object into a single lowercase text blob for keyword/readability scanning.
export function resumeToText(resume = {}) {
    const parts = [];
    const { contact = {}, summary = {}, education = [], experience = [], projects = [], skills = {}, certificates = [] } = resume;

    if (contact.title) parts.push(contact.title);
    if (summary.summary) parts.push(summary.summary);
    education.forEach(e => parts.push(e.degree, e.institution));
    experience.forEach(e => parts.push(e.role, e.company, e.description));
    projects.forEach(p => parts.push(p.title, p.description));
    if (skills.skills) parts.push(skills.skills);
    certificates.forEach(c => parts.push(c.title, c.issuer));

    return parts.filter(Boolean).join('\n');
}

export function getBullets(resume = {}) {
    const bullets = [];
    (resume.experience || []).forEach((entry, entryIndex) => {
        splitLines(entry.description).forEach((text, i) =>
            bullets.push({ section: 'experience', entryIndex, index: i, text, context: entry.role || entry.company || '' })
        );
    });
    (resume.projects || []).forEach((entry, entryIndex) => {
        splitLines(entry.description).forEach((text, i) =>
            bullets.push({ section: 'projects', entryIndex, index: i, text, context: entry.title || '' })
        );
    });
    return bullets;
}

export const STOPWORDS = new Set(
    ('a an the and or but if of to in on for with at by from as is are was were be been being this that these those ' +
        'it its it\'s he she they we you i your our their his her not no so than then there here up down out over under ' +
        'again further once do does did doing have has had having will would shall should can could may might must ' +
        'about into through during before after above below between both each few more most other some such only own ' +
        'same too very s t just don now').split(' ')
);
