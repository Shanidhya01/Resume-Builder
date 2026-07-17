import 'server-only';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '@/lib/firebaseAdmin';
import { extractSlugCandidates } from '@/lib/publicSlug';

// Server-side public-resume operations, executed with the Firebase Admin SDK.
// These run in the /r/[slug] server component and the app/api/public/* routes.
// Admin runs with full privileges and BYPASSES Firestore security rules, so:
//   - reads must still enforce `isPublic` in code (done below), and
//   - anonymous analytics writes no longer need a public rule — only this
//     trusted server code can increment counters.
// The owner-facing publish/slug/analytics-read operations stay in
// lib/publicResumes.js on the CLIENT SDK (authenticated as the owner).

const RESUMES = 'resumes';
const SLUGS = 'publicSlugs';

// The exact fields the public page/PDF needs, coerced to plain JSON. This is
// deliberately explicit: Admin Firestore returns Timestamp class instances for
// createdAt/updatedAt/lastViewed/etc., and passing those into a Client
// Component ("only plain objects can be passed to Client Components") throws.
// Returning a hand-built plain object guarantees serializability.
const serializePublicResume = (id, data) => ({
    id,
    name: data.name ?? null,
    selectedTemplate: data.selectedTemplate ?? null,
    contact: data.contact ?? {},
    summary: data.summary ?? {},
    education: data.education ?? [],
    experience: data.experience ?? [],
    projects: data.projects ?? [],
    skills: data.skills ?? {},
    certificates: data.certificates ?? [],
    languages: data.languages ?? [],
    isPublic: !!data.isPublic,
    slug: data.slug ?? null,
});

// Resolves a public slug to its resume, re-checking `isPublic` at read time so a
// resume made private is inaccessible immediately, not just unlisted. Returns a
// plain serializable object, or null when the slug/resume is missing or private.
//
// `param` is whatever came after /r/ — either a bare Firestore slug
// (legacy links, e.g. "y5GaSLpa") or an SEO-prefixed one (e.g.
// "john-doe-y5GaSLpa"). extractSlugCandidates tries the full param first,
// then progressively shorter trailing chunks, so both forms — and hyphenated
// custom slugs — resolve to the same resume without any schema change.
export const resolvePublicResumeBySlug = async param => {
    const db = getAdminDb();

    for (const candidate of extractSlugCandidates(param)) {
        const slugSnap = await db.collection(SLUGS).doc(candidate).get();
        if (!slugSnap.exists) continue;

        const { resumeId } = slugSnap.data();
        if (!resumeId) continue;

        const resumeSnap = await db.collection(RESUMES).doc(resumeId).get();
        if (!resumeSnap.exists) continue;

        const data = resumeSnap.data();
        if (!data.isPublic) continue;

        return serializePublicResume(resumeSnap.id, data);
    }

    return null;
};

export const recordView = async (resumeId, visitorId) => {
    const db = getAdminDb();
    await db.collection(RESUMES).doc(resumeId).update({
        viewCount: FieldValue.increment(1),
        lastViewed: FieldValue.serverTimestamp(),
        updatedPublicAt: FieldValue.serverTimestamp(),
    });
    if (visitorId) {
        await db
            .collection(RESUMES)
            .doc(resumeId)
            .collection('visitors')
            .doc(visitorId)
            .set({ lastSeen: FieldValue.serverTimestamp() }, { merge: true });
    }
};

export const recordDownload = async resumeId => {
    const db = getAdminDb();
    await db.collection(RESUMES).doc(resumeId).update({
        downloadCount: FieldValue.increment(1),
        updatedPublicAt: FieldValue.serverTimestamp(),
    });
};

export const recordShare = async resumeId => {
    const db = getAdminDb();
    await db.collection(RESUMES).doc(resumeId).update({
        shareCount: FieldValue.increment(1),
        updatedPublicAt: FieldValue.serverTimestamp(),
    });
};
