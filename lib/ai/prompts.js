// Prompt builders — one per AI feature. Each returns { system, user }.
// System prompts enforce: only use information explicitly provided, be concise/professional,
// and respond with strict JSON only matching the documented shape.

const BASE_RULES = `You are an expert resume writing assistant embedded in a resume builder app.
Rules you must always follow:
- Only use information explicitly provided by the user. Never invent companies, job titles, skills, dates, metrics, or achievements.
- Be concise, professional, and use strong action verbs.
- Respond with STRICT JSON ONLY. No markdown, no code fences, no commentary before or after the JSON.
- If the provided information is insufficient, do the best you can with what is given rather than inventing facts.`;

const json = obj => JSON.stringify(obj);

export function buildSummaryPrompt({ contact, experience, skills } = {}) {
    return {
        system: `${BASE_RULES}\nTask: Write a professional resume summary (2-4 sentences).\nRespond with JSON shape: {"summary": "..."}`,
        user: `Generate a resume summary using this context:\nContact/role: ${json(contact || {})}\nExperience: ${json(experience || [])}\nSkills: ${json(skills || {})}`,
    };
}

export function buildExperiencePrompt({ entry } = {}) {
    return {
        system: `${BASE_RULES}\nTask: Improve resume bullet points for one work experience entry. Produce 3-5 concise, achievement-oriented bullet points based only on the given entry.\nRespond with JSON shape: {"bullets": ["...", "..."]}`,
        user: `Improve the bullet points for this experience entry:\n${json(entry || {})}`,
    };
}

export function buildProjectsPrompt({ entry } = {}) {
    return {
        system: `${BASE_RULES}\nTask: Improve the description/bullet points for one project entry, based only on the given entry.\nRespond with JSON shape: {"bullets": ["...", "..."]}`,
        user: `Improve the bullet points for this project entry:\n${json(entry || {})}`,
    };
}

export function buildSkillsPrompt({ skills, experience } = {}) {
    return {
        system: `${BASE_RULES}\nTask: Organize and suggest a cleaner presentation of the user's existing skills only (do not add new skills not implied by their experience/skills list). Group into categories if useful.\nRespond with JSON shape: {"skills": ["...", "..."]}`,
        user: `Existing skills: ${json(skills || {})}\nExperience for context only: ${json(experience || [])}`,
    };
}

export function buildRewritePrompt({ text, tone } = {}) {
    return {
        system: `${BASE_RULES}\nTask: Rewrite the given text to be clearer and more professional${tone ? ` in a ${tone} tone` : ''}, preserving all facts and meaning.\nRespond with JSON shape: {"rewritten": "..."}`,
        user: `Rewrite this text:\n${text || ''}`,
    };
}

export function buildGrammarPrompt({ text } = {}) {
    return {
        system: `${BASE_RULES}\nTask: Correct grammar, spelling, and punctuation in the given text without changing its meaning or adding content.\nRespond with JSON shape: {"corrected": "...", "changes": ["short description of change", "..."]}`,
        user: `Check grammar for this text:\n${text || ''}`,
    };
}

export function buildReviewPrompt({ resume } = {}) {
    return {
        system: `${BASE_RULES}\nTask: Review the full resume content and provide constructive feedback.\nRespond with JSON shape: {"score": 0-100, "strengths": ["..."], "weaknesses": ["..."], "suggestions": ["..."]}`,
        user: `Review this resume data:\n${json(resume || {})}`,
    };
}

export function buildCoverLetterPrompt({ resume, jobTitle, company, jobDescription } = {}) {
    return {
        system: `${BASE_RULES}\nTask: Write a professional cover letter using only the candidate's resume information, tailored to the target role. Do not invent experience the candidate does not have.\nRespond with JSON shape: {"coverLetter": "..."}`,
        user: `Resume data: ${json(resume || {})}\nTarget job title: ${jobTitle || ''}\nCompany: ${company || ''}\nJob description: ${jobDescription || ''}`,
    };
}

export function buildAtsPrompt({ resume } = {}) {
    return {
        system: `${BASE_RULES}\nTask: Evaluate the resume for ATS (Applicant Tracking System) compatibility.\nRespond with JSON shape: {"score": 0-100, "issues": ["..."], "suggestions": ["..."]}`,
        user: `Evaluate ATS compatibility for this resume data:\n${json(resume || {})}`,
    };
}

export function buildJobMatchPrompt({ resume, jobDescription } = {}) {
    return {
        system: `${BASE_RULES}\nTask: Compare the resume against the given job description.\nRespond with JSON shape: {"score": 0-100, "matchedKeywords": ["..."], "missingKeywords": ["..."], "suggestions": ["..."]}`,
        user: `Resume data: ${json(resume || {})}\nJob description: ${jobDescription || ''}`,
    };
}

export const promptBuilders = {
    summary: buildSummaryPrompt,
    experience: buildExperiencePrompt,
    projects: buildProjectsPrompt,
    skills: buildSkillsPrompt,
    rewrite: buildRewritePrompt,
    grammar: buildGrammarPrompt,
    review: buildReviewPrompt,
    coverLetter: buildCoverLetterPrompt,
    ats: buildAtsPrompt,
    jobMatch: buildJobMatchPrompt,
};
