// SEO-friendly public resume URLs: /r/{readable-prefix}-{slug}
//
// The Firestore `slug` field (lib/publicResumes.js) stays the single source
// of truth and is never rewritten. This module only builds/parses the
// human-readable wrapper around it, so it must stay free of any Firestore or
// server-only imports — it runs on both the client (Share dialog/panel, to
// build links) and the server (the /r/[slug] route, to parse them).

// Strips punctuation/emoji, collapses whitespace and hyphens, lowercases,
// and caps length — never mid-word where avoidable.
export const slugifyText = (text, maxLen = 40) => {
    if (!text || typeof text !== 'string') return '';

    const slug = text
        .normalize('NFKD')
        .replace(/[̀-ͯ]/g, '') // diacritics
        .toLowerCase()
        .replace(/[‘’']/g, '') // apostrophes: "o'brien" -> "obrien"
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

    if (slug.length <= maxLen) return slug;
    // Trim to maxLen without cutting a word in half, when a hyphen is nearby.
    const truncated = slug.slice(0, maxLen);
    const lastHyphen = truncated.lastIndexOf('-');
    return (lastHyphen > 0 ? truncated.slice(0, lastHyphen) : truncated).replace(/-$/, '');
};

// Fallback priority: resume title -> owner's full name -> "resume".
export const getReadablePrefix = resume => {
    const title = slugifyText(resume?.name);
    if (title) return title;

    const fullName = slugifyText(resume?.contact?.name);
    if (fullName) return fullName;

    return 'resume';
};

// Builds the SEO-friendly path segment for /r/{path}. The real Firestore
// slug is always the trailing token; never stored anywhere, only appended.
export const buildPublicSlugPath = (resume, slug) => {
    if (!slug) return '';
    const prefix = getReadablePrefix(resume);
    return prefix ? `${prefix}-${slug}` : slug;
};

// Parses a /r/{param} route segment back into slug candidates, most likely
// first. Handles both legacy bare slugs (/r/y5GaSLpa) and SEO-prefixed ones
// (/r/john-doe-y5GaSLpa). Random slugs never contain hyphens, so the last
// token is the common case; custom slugs (lib/publicResumes.js setCustomSlug)
// may themselves contain hyphens, so progressively longer tail chunks are
// tried too. Firestore lookup stops at the first match — see
// lib/publicResumes.server.js.
export const extractSlugCandidates = param => {
    if (!param || typeof param !== 'string') return [];

    const tokens = param.split('-').filter(Boolean);
    const candidates = [];
    const add = candidate => {
        if (candidate && !candidates.includes(candidate)) candidates.push(candidate);
    };

    add(param); // legacy bare slug (or a hyphenated custom slug with no prefix)
    for (let i = tokens.length - 1; i >= 1; i -= 1) {
        add(tokens.slice(i).join('-'));
    }

    return candidates;
};
