// Duplicate detection between an imported resume and the user's existing
// resumes, plus section-aware merging. Pure functions — no Firestore access.

const normalize = value => (typeof value === 'string' ? value.trim().toLowerCase() : '');

const tokenize = value =>
    normalize(value)
        .split(/[^a-z0-9+#.]+/)
        .filter(token => token.length > 1);

// Jaccard similarity over word tokens — cheap and good enough for
// "is this the same job/project" comparisons.
const tokenSimilarity = (a, b) => {
    const setA = new Set(tokenize(a));
    const setB = new Set(tokenize(b));
    if (setA.size === 0 || setB.size === 0) return 0;
    let overlap = 0;
    for (const token of setA) {
        if (setB.has(token)) overlap++;
    }
    return overlap / (setA.size + setB.size - overlap);
};

const sameExperience = (a, b) =>
    normalize(a.company) && normalize(a.company) === normalize(b.company) &&
    (tokenSimilarity(a.role, b.role) >= 0.5 || normalize(a.start) === normalize(b.start));

const sameProject = (a, b) => tokenSimilarity(a.title, b.title) >= 0.6;

const sameEducation = (a, b) =>
    normalize(a.institution) && normalize(a.institution) === normalize(b.institution) &&
    tokenSimilarity(a.degree, b.degree) >= 0.4;

const skillList = skills =>
    (skills?.skills || '')
        .split(/[,\n]/)
        .map(s => s.replace(/^[^:]+:\s*/, '').trim())
        .flatMap(s => s.split(',').map(x => x.trim()))
        .filter(Boolean);

// Compares an imported resume against one existing resume.
// Returns { score: 0-100, reasons: [...] } — score ≥ 50 is treated as a likely duplicate.
export function compareWithExisting(imported, existing) {
    const reasons = [];
    let score = 0;

    const importedName = normalize(imported.contact?.name);
    const existingName = normalize(existing.contact?.name);
    if (importedName && importedName === existingName) {
        score += 20;
        reasons.push('Same candidate name');
    }
    const importedEmail = normalize(imported.contact?.email);
    if (importedEmail && importedEmail === normalize(existing.contact?.email)) {
        score += 15;
        reasons.push('Same email address');
    }

    const expMatches = (imported.experience || []).filter(entry =>
        (existing.experience || []).some(other => sameExperience(entry, other))
    ).length;
    if (expMatches > 0) {
        score += Math.min(expMatches * 15, 30);
        reasons.push(`${expMatches} duplicate experience ${expMatches === 1 ? 'entry' : 'entries'}`);
    }

    const projMatches = (imported.projects || []).filter(entry =>
        (existing.projects || []).some(other => sameProject(entry, other))
    ).length;
    if (projMatches > 0) {
        score += Math.min(projMatches * 10, 20);
        reasons.push(`${projMatches} duplicate ${projMatches === 1 ? 'project' : 'projects'}`);
    }

    const importedSkills = new Set(skillList(imported.skills).map(normalize));
    const existingSkills = skillList(existing.skills).map(normalize);
    const skillOverlap = existingSkills.filter(s => importedSkills.has(s)).length;
    if (importedSkills.size > 0 && existingSkills.length > 0) {
        const ratio = skillOverlap / Math.min(importedSkills.size, existingSkills.length);
        if (ratio >= 0.6) {
            score += 15;
            reasons.push(`${Math.round(ratio * 100)}% overlapping skills`);
        }
    }

    return { score: Math.min(score, 100), reasons };
}

// Scans every existing resume and returns likely duplicates, strongest first.
export function detectDuplicates(imported, existingResumes) {
    return (existingResumes || [])
        .map(existing => {
            const { score, reasons } = compareWithExisting(imported, existing);
            return { id: existing.id, name: existing.name, score, reasons, resume: existing };
        })
        .filter(match => match.score >= 50)
        .sort((a, b) => b.score - a.score);
}

const mergeStrings = (a, b) => a || b || '';

// Merges an imported resume INTO an existing one: existing content wins on
// conflicts, imported entries are appended when they aren't duplicates, and
// skills become the union of both lists.
export function mergeResumes(existing, imported) {
    const mergedContact = { ...imported.contact };
    for (const [key, value] of Object.entries(existing.contact || {})) {
        if (value) mergedContact[key] = value;
    }

    const mergeEntries = (existingEntries, importedEntries, isSame) => [
        ...(existingEntries || []),
        ...(importedEntries || []).filter(entry => !(existingEntries || []).some(other => isSame(entry, other))),
    ];

    const existingSkills = skillList(existing.skills);
    const seen = new Set(existingSkills.map(normalize));
    const mergedSkills = [...existingSkills];
    for (const skill of skillList(imported.skills)) {
        if (!seen.has(normalize(skill))) {
            seen.add(normalize(skill));
            mergedSkills.push(skill);
        }
    }

    return {
        contact: mergedContact,
        summary: { summary: mergeStrings(existing.summary?.summary, imported.summary?.summary) },
        experience: mergeEntries(existing.experience, imported.experience, sameExperience),
        education: mergeEntries(existing.education, imported.education, sameEducation),
        projects: mergeEntries(existing.projects, imported.projects, sameProject),
        skills: mergedSkills.length ? { skills: mergedSkills.join(', ') } : {},
        certificates: mergeEntries(existing.certificates, imported.certificates, (a, b) => tokenSimilarity(a.title, b.title) >= 0.7),
        languages: mergeEntries(existing.languages, imported.languages, (a, b) => normalize(a.language) === normalize(b.language)),
    };
}
