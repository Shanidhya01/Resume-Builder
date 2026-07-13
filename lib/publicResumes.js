import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    increment,
    serverTimestamp,
    writeBatch,
    collection,
    getCountFromServer,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { getResume } from '@/lib/resumes';

const RESUMES_COLLECTION = 'resumes';
const SLUGS_COLLECTION = 'publicSlugs';

const SLUG_ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const RANDOM_SLUG_LENGTH = 8;

// Route segments this app already owns — a custom slug can never shadow one.
const RESERVED_SLUGS = new Set([
    'r', 'api', 'app', 'dashboard', 'editor', 'templates', 'about', 'account',
    'login', 'register', 'forgot-password', 'improvements', 'favicon.ico',
    'robots.txt', 'sitemap.xml', '_next', 'static', 'admin', 'new', 'null', 'undefined',
]);

const resumeDocRef = id => doc(db, RESUMES_COLLECTION, id);
const slugDocRef = slug => doc(db, SLUGS_COLLECTION, slug);
const visitorsRef = id => collection(db, RESUMES_COLLECTION, id, 'visitors');

const assertOwner = (resume, uid) => {
    if (!resume || resume.ownerId !== uid) {
        throw new Error('You do not have permission to access this resume.');
    }
};

// Isomorphic CSPRNG: Web Crypto is available globally in both browsers and
// modern Node (this app targets Node 18+/Next.js), so no extra dependency
// or server/client branching is needed.
const randomSlug = (length = RANDOM_SLUG_LENGTH) => {
    const bytes = new Uint8Array(length);
    globalThis.crypto.getRandomValues(bytes);
    let slug = '';
    for (let i = 0; i < length; i += 1) {
        slug += SLUG_ALPHABET[bytes[i] % SLUG_ALPHABET.length];
    }
    return slug;
};

// Custom slugs: lowercase letters, numbers, single hyphens between segments.
const CUSTOM_SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export const validateCustomSlug = slug => {
    if (typeof slug !== 'string') return 'Slug is required.';
    if (slug.length < 3 || slug.length > 40) return 'Slug must be 3-40 characters.';
    if (!CUSTOM_SLUG_PATTERN.test(slug)) {
        return 'Only lowercase letters, numbers, and hyphens are allowed (no leading/trailing or double hyphens).';
    }
    if (RESERVED_SLUGS.has(slug)) return 'This URL is reserved. Please choose another.';
    return null;
};

export const isSlugAvailable = async slug => {
    const snap = await getDoc(slugDocRef(slug));
    return !snap.exists();
};

const findFreeRandomSlug = async () => {
    let slug = randomSlug();
    for (let attempt = 0; attempt < 5 && !(await isSlugAvailable(slug)); attempt += 1) {
        slug = randomSlug();
    }
    return slug;
};

// Resolves a public slug to its resume, re-checking `isPublic` at read time
// so a resume made private is inaccessible immediately, not just unlisted.
export const resolvePublicResumeBySlug = async slug => {
    const slugSnap = await getDoc(slugDocRef(slug));
    if (!slugSnap.exists()) return null;

    const { resumeId } = slugSnap.data();
    const resumeSnap = await getDoc(resumeDocRef(resumeId));
    if (!resumeSnap.exists()) return null;

    const resume = { id: resumeSnap.id, ...resumeSnap.data() };
    if (!resume.isPublic) return null;

    return resume;
};

const claimSlug = (batch, slug, resumeId, uid) => {
    batch.set(slugDocRef(slug), { resumeId, ownerId: uid, createdAt: serverTimestamp() });
};

// Publishes a resume: reuses its existing slug if it still owns one and it's
// still free, otherwise generates a fresh random slug.
export const publishResume = async (resumeId, uid) => {
    const existing = await getResume(resumeId);
    assertOwner(existing, uid);

    let slug = existing.slug || null;
    if (slug && !(await isSlugAvailable(slug))) slug = null;
    if (!slug) slug = await findFreeRandomSlug();

    const batch = writeBatch(db);
    claimSlug(batch, slug, resumeId, uid);
    batch.update(resumeDocRef(resumeId), {
        isPublic: true,
        slug,
        createdPublicAt: existing.createdPublicAt || serverTimestamp(),
        updatedPublicAt: serverTimestamp(),
        viewCount: existing.viewCount || 0,
        downloadCount: existing.downloadCount || 0,
        shareCount: existing.shareCount || 0,
    });
    await batch.commit();

    return slug;
};

export const unpublishResume = async (resumeId, uid) => {
    const existing = await getResume(resumeId);
    assertOwner(existing, uid);

    const batch = writeBatch(db);
    if (existing.slug) batch.delete(slugDocRef(existing.slug));
    batch.update(resumeDocRef(resumeId), { isPublic: false, updatedPublicAt: serverTimestamp() });
    await batch.commit();
};

export const regenerateSlug = async (resumeId, uid) => {
    const existing = await getResume(resumeId);
    assertOwner(existing, uid);

    const slug = await findFreeRandomSlug();

    const batch = writeBatch(db);
    if (existing.slug) batch.delete(slugDocRef(existing.slug));
    claimSlug(batch, slug, resumeId, uid);
    batch.update(resumeDocRef(resumeId), {
        slug,
        customSlug: null,
        isPublic: true,
        updatedPublicAt: serverTimestamp(),
    });
    await batch.commit();

    return slug;
};

// Sets a custom slug. If the desired slug is unavailable, silently falls
// back to a fresh random slug instead of failing outright (per spec).
// Returns { slug, isCustom, requested } so the UI can toast the outcome.
export const setCustomSlug = async (resumeId, uid, desiredSlug) => {
    const formatError = validateCustomSlug(desiredSlug);

    const existing = await getResume(resumeId);
    assertOwner(existing, uid);

    let slug;
    let isCustom = false;

    if (!formatError && (existing.slug === desiredSlug || (await isSlugAvailable(desiredSlug)))) {
        slug = desiredSlug;
        isCustom = true;
    } else {
        slug = await findFreeRandomSlug();
    }

    const batch = writeBatch(db);
    if (existing.slug && existing.slug !== slug) batch.delete(slugDocRef(existing.slug));
    if (existing.slug !== slug) claimSlug(batch, slug, resumeId, uid);
    batch.update(resumeDocRef(resumeId), {
        slug,
        customSlug: isCustom ? slug : null,
        isPublic: true,
        updatedPublicAt: serverTimestamp(),
    });

    try {
        await batch.commit();
    } catch (err) {
        // Someone else claimed it between the availability check and the commit.
        const fallback = await findFreeRandomSlug();
        const retryBatch = writeBatch(db);
        if (existing.slug) retryBatch.delete(slugDocRef(existing.slug));
        claimSlug(retryBatch, fallback, resumeId, uid);
        retryBatch.update(resumeDocRef(resumeId), {
            slug: fallback,
            customSlug: null,
            isPublic: true,
            updatedPublicAt: serverTimestamp(),
        });
        await retryBatch.commit();
        return { slug: fallback, isCustom: false, requested: desiredSlug };
    }

    return { slug, isCustom, requested: desiredSlug };
};

// --- Public-facing analytics writes (called from rate-limited API routes) ---

export const recordView = async (resumeId, visitorId) => {
    await updateDoc(resumeDocRef(resumeId), {
        viewCount: increment(1),
        lastViewed: serverTimestamp(),
        updatedPublicAt: serverTimestamp(),
    });
    if (visitorId) {
        await setDoc(doc(visitorsRef(resumeId), visitorId), { lastSeen: serverTimestamp() }, { merge: true });
    }
};

export const recordDownload = async resumeId => {
    await updateDoc(resumeDocRef(resumeId), {
        downloadCount: increment(1),
        updatedPublicAt: serverTimestamp(),
    });
};

export const recordShare = async resumeId => {
    await updateDoc(resumeDocRef(resumeId), {
        shareCount: increment(1),
        updatedPublicAt: serverTimestamp(),
    });
};

// --- Owner-facing analytics read ---

export const getPublicAnalytics = async (resumeId, uid) => {
    const existing = await getResume(resumeId);
    assertOwner(existing, uid);

    let uniqueVisitors = 0;
    try {
        const countSnap = await getCountFromServer(visitorsRef(resumeId));
        uniqueVisitors = countSnap.data().count;
    } catch {
        uniqueVisitors = 0;
    }

    return {
        isPublic: !!existing.isPublic,
        slug: existing.slug || null,
        customSlug: existing.customSlug || null,
        viewCount: existing.viewCount || 0,
        downloadCount: existing.downloadCount || 0,
        shareCount: existing.shareCount || 0,
        uniqueVisitors,
        lastViewed: existing.lastViewed || null,
        createdPublicAt: existing.createdPublicAt || null,
    };
};

export { RESERVED_SLUGS };
