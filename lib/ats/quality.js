// Feature 5 (Section Intelligence) + Feature 6 (Bullet Point Analyzer).

import { getBullets, words } from './textUtils';

export const WEAK_VERBS = [
    'worked', 'helped', 'did', 'was responsible for', 'responsible for', 'handled', 'assisted',
    'involved in', 'tasked with', 'in charge of', 'participated in', 'dealt with', 'made',
];

export const STRONG_VERBS = [
    'led', 'built', 'architected', 'launched', 'optimized', 'automated', 'delivered', 'designed',
    'implemented', 'reduced', 'increased', 'accelerated', 'engineered', 'spearheaded', 'streamlined',
    'drove', 'scaled', 'improved', 'championed', 'orchestrated',
];

const PASSIVE_REGEX = /\b(was|were|is|are|been|being)\s+\w+ed\b/i;
const NUMBER_REGEX = /\d/;
const IMPACT_WORDS = /\b(increase|decrease|reduce|improve|save|grow|boost|cut|accelerat|optimi[sz]e|revenue|efficiency|conversion|retention|latency|cost|users?|customers?|%|percent)\w*\b/i;

function suggestStrongerVerb(text) {
    const lower = text.toLowerCase();
    const weak = WEAK_VERBS.find(v => lower.startsWith(v) || lower.includes(` ${v} `));
    if (!weak) return null;
    const replacement = STRONG_VERBS[Math.floor(Math.random() * STRONG_VERBS.length) % STRONG_VERBS.length];
    return `Consider replacing "${weak}" with a stronger action verb like "${replacement.charAt(0).toUpperCase() + replacement.slice(1)}".`;
}

export function analyzeBullet(bullet) {
    const text = bullet.text || '';
    const wordCount = words(text).length;
    const issues = [];

    const lower = text.toLowerCase();
    const hasWeakVerb = WEAK_VERBS.some(v => lower.startsWith(v) || lower.includes(` ${v} `));
    if (hasWeakVerb) issues.push('weak_verb');

    if (PASSIVE_REGEX.test(text)) issues.push('passive_voice');
    if (wordCount > 0 && wordCount < 6) issues.push('too_short');
    if (wordCount > 30) issues.push('too_long');
    if (!NUMBER_REGEX.test(text)) issues.push('missing_numbers');
    if (!IMPACT_WORDS.test(text)) issues.push('missing_impact');

    const strength = issues.length === 0 ? 'strong' : issues.length <= 2 ? 'moderate' : 'weak';
    const suggestion = hasWeakVerb ? suggestStrongerVerb(text) : null;

    return { ...bullet, wordCount, issues, strength, suggestion };
}

export function analyzeBullets(resume) {
    const bullets = getBullets(resume).map(analyzeBullet);
    return {
        bullets,
        strongBullets: bullets.filter(b => b.strength === 'strong'),
        weakBullets: bullets.filter(b => b.strength === 'weak'),
        moderateBullets: bullets.filter(b => b.strength === 'moderate'),
    };
}

// Section Intelligence: rates each resume section Excellent / Good / Needs Improvement / Missing, with a reason.
export function analyzeSections(resume = {}) {
    const results = {};

    const rate = (key, present, checks) => {
        if (!present) {
            results[key] = { status: 'Missing', reason: 'This section is empty.' };
            return;
        }
        const failed = checks.filter(c => !c.ok);
        if (failed.length === 0) results[key] = { status: 'Excellent', reason: 'Well-structured and complete.' };
        else if (failed.length === 1) results[key] = { status: 'Good', reason: failed[0].reason };
        else results[key] = { status: 'Needs Improvement', reason: failed.map(f => f.reason).join(' ') };
    };

    const contact = resume.contact || {};
    rate('header', !!(contact.name && contact.email), [
        { ok: !!contact.phone, reason: 'Missing phone number.' },
        { ok: !!(contact.linkedin || contact.portfolio || contact.github), reason: 'Missing a professional link (LinkedIn/GitHub/Portfolio).' },
    ]);

    const summaryText = resume.summary?.summary || '';
    rate('summary', summaryText.trim().length > 0, [
        { ok: words(summaryText).length >= 20, reason: 'Summary is too short — aim for 2-4 sentences.' },
        { ok: words(summaryText).length <= 80, reason: 'Summary is too long — keep it concise.' },
    ]);

    const experience = resume.experience || [];
    rate('experience', experience.length > 0, [
        { ok: experience.every(e => (e.description || '').trim().length > 0), reason: 'Some experience entries are missing bullet points.' },
        { ok: experience.length >= 2 || experience.length === 0, reason: 'Add more experience entries if available.' },
    ]);

    const projects = resume.projects || [];
    rate('projects', projects.length > 0, [
        { ok: projects.every(p => (p.description || '').trim().length > 0), reason: 'Some projects are missing descriptions.' },
    ]);

    const education = resume.education || [];
    rate('education', education.length > 0, [
        { ok: education.every(e => e.degree && e.institution), reason: 'Some education entries are missing degree or institution.' },
    ]);

    const skillsList = (resume.skills?.skills || '').split(/[\n,]/).map(s => s.trim()).filter(Boolean);
    rate('skills', skillsList.length > 0, [
        { ok: skillsList.length >= 5, reason: 'List at least 5 relevant skills.' },
        { ok: skillsList.length <= 20, reason: 'Trim skills list — too many dilutes relevance.' },
    ]);

    const certificates = resume.certificates || [];
    rate('certificates', certificates.length > 0, [
        { ok: certificates.every(c => c.title && c.issuer), reason: 'Some certificates are missing a title or issuer.' },
    ]);

    return results;
}
