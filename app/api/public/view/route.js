import { NextResponse } from 'next/server';
import { rateLimitPublic, resolveSlugFromBody, hashVisitor } from '@/lib/publicRequest';
import { recordView } from '@/lib/publicResumes.server';

export const runtime = 'nodejs';

export async function POST(request) {
    const limited = rateLimitPublic(request, 'view');
    if (limited) return limited;

    const { resume, error } = await resolveSlugFromBody(request);
    if (error) return error;

    try {
        await recordView(resume.id, hashVisitor(request, resume.id));
        return NextResponse.json({ ok: true });
    } catch (err) {
        return NextResponse.json({ error: 'Could not record view.' }, { status: 500 });
    }
}
