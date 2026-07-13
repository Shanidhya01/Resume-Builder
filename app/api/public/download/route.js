import { NextResponse } from 'next/server';
import { rateLimitPublic, resolveSlugFromBody } from '@/lib/publicRequest';
import { recordDownload } from '@/lib/publicResumes';

export async function POST(request) {
    const limited = rateLimitPublic(request, 'download');
    if (limited) return limited;

    const { resume, error } = await resolveSlugFromBody(request);
    if (error) return error;

    try {
        await recordDownload(resume.id);
        return NextResponse.json({ ok: true });
    } catch (err) {
        return NextResponse.json({ error: 'Could not record download.' }, { status: 500 });
    }
}
