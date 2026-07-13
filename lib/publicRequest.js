// Shared request helpers for app/api/public/* routes (server-only — uses
// Node's crypto module, so this must never be imported from a client component).

import { createHash } from 'crypto';
import { NextResponse } from 'next/server';
import { checkRateLimit, getClientIp } from '@/lib/ai/rateLimit';
import { resolvePublicResumeBySlug } from '@/lib/publicResumes';

const VISITOR_HASH_SALT = process.env.VISITOR_HASH_SALT || 'hireready-public-resume';

export { getClientIp };

export function rateLimitPublic(request, bucket) {
    const ip = getClientIp(request);
    const rate = checkRateLimit(`public:${bucket}:${ip}`);
    if (!rate.allowed) {
        return NextResponse.json({ error: 'Too many requests. Please slow down.' }, { status: 429 });
    }
    return null;
}

// One-way hash of the visitor's IP, scoped to the resume and rotated daily —
// lets us count unique visitors without ever storing a raw IP address.
export function hashVisitor(request, resumeId) {
    const ip = getClientIp(request);
    const day = new Date().toISOString().slice(0, 10);
    return createHash('sha256').update(`${VISITOR_HASH_SALT}:${resumeId}:${ip}:${day}`).digest('hex');
}

export async function resolveSlugFromBody(request) {
    let body;
    try {
        body = await request.json();
    } catch {
        return { error: NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 }) };
    }

    const slug = typeof body?.slug === 'string' ? body.slug.trim() : '';
    if (!slug) {
        return { error: NextResponse.json({ error: 'A "slug" field is required.' }, { status: 400 }) };
    }

    let resume;
    try {
        resume = await resolvePublicResumeBySlug(slug);
    } catch {
        return { error: NextResponse.json({ error: 'Could not reach the database. Please try again.' }, { status: 503 }) };
    }
    if (!resume) {
        return { error: NextResponse.json({ error: 'Resume not found.' }, { status: 404 }) };
    }

    return { resume };
}
