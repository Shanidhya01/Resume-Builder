/**
 * Lightweight, dependency-free dashboard metrics (Phase 8, Feature 1).
 * Mirrors the completion heuristic used by lib/ats/analysis.js so the numbers
 * agree, without running the full (heavier) ATS analysis for every resume.
 */

export function computeCompletion(resume = {}) {
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

export function aggregateStats(resumes = []) {
    const total = resumes.length;
    const publicCount = resumes.filter(r => r.isPublic).length;
    const views = resumes.reduce((sum, r) => sum + (r.viewCount || 0), 0);
    const downloads = resumes.reduce((sum, r) => sum + (r.downloadCount || 0), 0);
    const shares = resumes.reduce((sum, r) => sum + (r.shareCount || 0), 0);
    const avgCompletion = total
        ? Math.round(resumes.reduce((sum, r) => sum + computeCompletion(r), 0) / total)
        : 0;
    return { total, publicCount, views, downloads, shares, avgCompletion };
}
