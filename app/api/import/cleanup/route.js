// POST /api/import/cleanup — AI post-processing for imported resumes: grammar
// fixes, date/bullet normalization, missing-skill detection, and ATS
// recommendations. Facts are preserved; only presentation is cleaned.

import { NextResponse } from 'next/server';
import { checkRateLimit, getClientIp } from '@/lib/ai/rateLimit';
import { generateAIResponse, OpenRouterError, AIParseError, AIValidationError } from '@/lib/ai';
import { normalizeImportedResume, isResumeEmpty } from '@/lib/import/normalize';

export const runtime = 'nodejs';

const RATE_OPTIONS = { maxRequests: 6 };

export async function POST(request) {
    const ip = getClientIp(request);
    const rate = checkRateLimit(`import-cleanup:${ip}`, RATE_OPTIONS);
    if (!rate.allowed) {
        return NextResponse.json(
            { error: 'Too many cleanup requests. Please wait a moment and try again.' },
            { status: 429 }
        );
    }

    let body;
    try {
        body = await request.json();
    } catch (err) {
        return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
    }

    const resume = normalizeImportedResume(body?.resume);
    if (isResumeEmpty(resume)) {
        return NextResponse.json({ error: 'No resume content to clean up.' }, { status: 400 });
    }

    try {
        const result = await generateAIResponse({
            feature: 'resumeCleanup',
            input: { resume },
            maxTokens: 3000,
            temperature: 0.2,
        });
        return NextResponse.json(result);
    } catch (err) {
        if (err instanceof AIValidationError || err instanceof AIParseError) {
            return NextResponse.json({ error: 'AI cleanup returned an unexpected response. Your resume was left unchanged.' }, { status: 502 });
        }
        if (err instanceof OpenRouterError) {
            return NextResponse.json({ error: err.message }, { status: err.status || 502 });
        }
        console.error('Import cleanup failed:', err);
        return NextResponse.json({ error: 'Unexpected server error.' }, { status: 500 });
    }
}
