import { NextResponse } from 'next/server';
import { rateLimitPublic, resolveSlugFromBody } from '@/lib/publicRequest';
import { recordShare } from '@/lib/publicResumes.server';

export const runtime = 'nodejs';

export async function POST(request) {
    const limited = rateLimitPublic(request, 'share');
    if (limited) return limited;

    const { resume, error } = await resolveSlugFromBody(request);
    if (error) return error;

    try {
        await recordShare(resume.id);
        return NextResponse.json({ ok: true });
    } catch (err) {
        return NextResponse.json({ error: 'Could not record share.' }, { status: 500 });
    }
}
