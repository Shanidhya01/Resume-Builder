// Normalizes AI-parsed (or user-supplied JSON) resume data into the exact
// schema used by the Redux store, Firestore documents, and PDF templates.
// Everything is coerced defensively — the AI response and imported JSON are
// untrusted input, so unexpected shapes must degrade to empty fields, never throw.

const MAX_FIELD_CHARS = 2000;
const MAX_LIST_ITEMS = 30;

const asString = value => {
    if (typeof value === 'string') return value.trim().slice(0, MAX_FIELD_CHARS);
    if (typeof value === 'number') return String(value);
    return '';
};

// Bullet lists arrive as arrays or newline-joined strings; templates render
// them by splitting on '\n', so arrays are joined back into that format.
const asMultiline = value => {
    if (Array.isArray(value)) {
        return value
            .slice(0, MAX_LIST_ITEMS)
            .map(asString)
            .filter(Boolean)
            .map(line => line.replace(/^[-•*]\s*/, ''))
            .join('\n');
    }
    return asString(value);
};

const asArray = value => (Array.isArray(value) ? value.slice(0, MAX_LIST_ITEMS) : []);

const MONTHS = {
    jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
    jul: '07', aug: '08', sep: '09', sept: '09', oct: '10', nov: '11', dec: '12',
};

// Coerces free-form date strings ("Jan 2022", "01/2022", "2022-01", "2022")
// into the "YYYY-MM" format expected by the editor's month inputs.
// "Present"/"Current"/unparseable values become '' so nothing invalid is stored.
export const normalizeMonth = value => {
    const raw = asString(value);
    if (!raw) return '';
    if (/present|current|now|ongoing/i.test(raw)) return '';

    let m = raw.match(/^(\d{4})-(\d{2})/);
    if (m) return `${m[1]}-${m[2]}`;

    m = raw.match(/^([a-zA-Z]{3,9})\.?,?\s+(\d{4})/);
    if (m) {
        const month = MONTHS[m[1].slice(0, 4).toLowerCase()] || MONTHS[m[1].slice(0, 3).toLowerCase()];
        if (month) return `${m[2]}-${month}`;
    }

    m = raw.match(/^(\d{1,2})[\/.-](\d{4})/);
    if (m) {
        const month = Math.min(Math.max(parseInt(m[1], 10), 1), 12);
        return `${m[2]}-${String(month).padStart(2, '0')}`;
    }

    m = raw.match(/(\d{4})/);
    if (m) return `${m[1]}-01`;

    return '';
};

const normalizeContact = raw => {
    const contact = raw && typeof raw === 'object' ? raw : {};
    const out = {};
    for (const key of ['name', 'title', 'email', 'phone', 'address', 'linkedin', 'github', 'blogs', 'twitter', 'portfolio']) {
        const value = asString(contact[key]);
        if (value) out[key] = value;
    }
    return out;
};

const normalizeSkills = raw => {
    if (Array.isArray(raw)) {
        const flat = raw.slice(0, MAX_LIST_ITEMS).map(asString).filter(Boolean);
        return flat.length ? { skills: flat.join(', ') } : {};
    }
    if (raw && typeof raw === 'object') {
        // Either our own shape ({ skills: "..." }) or AI-grouped categories.
        if ('skills' in raw) {
            const value = asMultiline(raw.skills);
            return value ? { skills: value } : {};
        }
        const lines = Object.entries(raw)
            .slice(0, MAX_LIST_ITEMS)
            .map(([category, items]) => {
                const list = Array.isArray(items) ? items.map(asString).filter(Boolean).join(', ') : asString(items);
                return list ? `${asString(category)}: ${list}` : '';
            })
            .filter(Boolean);
        return lines.length ? { skills: lines.join('\n') } : {};
    }
    const value = asString(raw);
    return value ? { skills: value } : {};
};

const normalizeSummary = raw => {
    const value = typeof raw === 'object' && raw !== null ? asMultiline(raw.summary) : asMultiline(raw);
    return value ? { summary: value } : {};
};

// Awards/achievements have no dedicated section in the app schema, so they are
// folded into certificates — the {title, issuer, date} shape fits both and every
// template already renders it.
const normalizeCertificates = (certificates, awards, achievements) => {
    const entries = [];

    for (const cert of asArray(certificates)) {
        if (!cert || typeof cert !== 'object') continue;
        const entry = {
            title: asString(cert.title || cert.name),
            issuer: asString(cert.issuer || cert.organization),
            date: normalizeMonth(cert.date || cert.issued),
        };
        if (entry.title) entries.push(entry);
    }

    for (const extra of [...asArray(awards), ...asArray(achievements)]) {
        if (typeof extra === 'string') {
            const title = asString(extra);
            if (title) entries.push({ title, issuer: '', date: '' });
        } else if (extra && typeof extra === 'object') {
            const entry = {
                title: asString(extra.title || extra.name || extra.award),
                issuer: asString(extra.issuer || extra.organization),
                date: normalizeMonth(extra.date || extra.year),
            };
            if (entry.title) entries.push(entry);
        }
    }

    return entries.slice(0, MAX_LIST_ITEMS);
};

export function normalizeImportedResume(raw) {
    const data = raw && typeof raw === 'object' ? raw : {};

    return {
        contact: normalizeContact(data.contact || data.personalInformation || data.basics),
        summary: normalizeSummary(data.summary),
        education: asArray(data.education)
            .map(entry => ({
                degree: asString(entry?.degree),
                institution: asString(entry?.institution || entry?.school),
                start: normalizeMonth(entry?.start || entry?.startDate),
                end: normalizeMonth(entry?.end || entry?.endDate),
                location: asString(entry?.location),
                gpa: asString(entry?.gpa),
            }))
            .filter(entry => entry.degree || entry.institution),
        experience: asArray(data.experience || data.work)
            .map(entry => ({
                role: asString(entry?.role || entry?.title || entry?.position),
                company: asString(entry?.company || entry?.employer),
                location: asString(entry?.location),
                start: normalizeMonth(entry?.start || entry?.startDate),
                end: normalizeMonth(entry?.end || entry?.endDate),
                description: asMultiline(entry?.description || entry?.bullets || entry?.highlights),
            }))
            .filter(entry => entry.role || entry.company),
        projects: asArray(data.projects)
            .map(entry => ({
                title: asString(entry?.title || entry?.name),
                url: asString(entry?.url || entry?.link),
                description: asMultiline(entry?.description || entry?.bullets || entry?.highlights),
            }))
            .filter(entry => entry.title),
        skills: normalizeSkills(data.skills),
        certificates: normalizeCertificates(data.certificates || data.certifications, data.awards, data.achievements),
        languages: asArray(data.languages)
            .map(entry => {
                if (typeof entry === 'string') return { language: asString(entry), proficiency: '' };
                return {
                    language: asString(entry?.language || entry?.name),
                    proficiency: asString(entry?.proficiency || entry?.fluency),
                };
            })
            .filter(entry => entry.language),
    };
}

const SECTION_LABELS = {
    contact: 'Personal Information',
    summary: 'Summary',
    experience: 'Experience',
    education: 'Education',
    projects: 'Projects',
    skills: 'Skills',
    certificates: 'Certifications',
    languages: 'Languages',
};

export function computeMissingFields(resume) {
    const missing = [];
    if (!resume.contact?.name) missing.push('Full Name');
    if (!resume.contact?.email) missing.push('Email');
    if (!resume.contact?.phone) missing.push('Phone');
    if (!resume.summary?.summary) missing.push(SECTION_LABELS.summary);
    if (!resume.experience?.length) missing.push(SECTION_LABELS.experience);
    if (!resume.education?.length) missing.push(SECTION_LABELS.education);
    if (!resume.projects?.length) missing.push(SECTION_LABELS.projects);
    if (!resume.skills?.skills) missing.push(SECTION_LABELS.skills);
    if (!resume.certificates?.length) missing.push(SECTION_LABELS.certificates);
    if (!resume.languages?.length) missing.push(SECTION_LABELS.languages);
    return missing;
}

// Heuristic confidence used as a floor/fallback when the AI's self-reported
// confidence is missing or implausible.
export function computeHeuristicConfidence(resume) {
    let score = 0;
    if (resume.contact?.name) score += 15;
    if (resume.contact?.email) score += 10;
    if (resume.contact?.phone) score += 5;
    if (resume.summary?.summary) score += 10;
    if (resume.experience?.length) score += 25;
    if (resume.education?.length) score += 15;
    if (resume.skills?.skills) score += 10;
    if (resume.projects?.length) score += 5;
    if (resume.certificates?.length) score += 3;
    if (resume.languages?.length) score += 2;
    return Math.min(score, 100);
}

export function isResumeEmpty(resume) {
    return computeHeuristicConfidence(resume) === 0;
}
