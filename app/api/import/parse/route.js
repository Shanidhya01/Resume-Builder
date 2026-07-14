// POST /api/import/parse — converts extracted resume text into structured
// resume data via OpenRouter. Results are memoized in-memory by text hash so
// re-parsing the same upload (e.g. after a page refresh mid-review) is free.

import { createHash } from 'crypto';
import { NextResponse } from 'next/server';
import { checkRateLimit, getClientIp } from '@/lib/ai/rateLimit';
import { generateAIResponse, OpenRouterError, AIParseError, AIValidationError } from '@/lib/ai';
import { sanitizeExtractedText, MAX_EXTRACTED_CHARS } from '@/lib/import/validation';

export const runtime = 'nodejs';

const RATE_OPTIONS = { maxRequests: 6 };
const CACHE_TTL_MS = 10 * 60 * 1000;
const CACHE_MAX_ENTRIES = 50;

const parseCache = new Map();

const cacheGet = key => {
    const hit = parseCache.get(key);
    if (!hit) return null;
    if (Date.now() - hit.time > CACHE_TTL_MS) {
        parseCache.delete(key);
        return null;
    }
    return hit.result;
};

const cacheSet = (key, result) => {
    if (parseCache.size >= CACHE_MAX_ENTRIES) {
        const oldest = parseCache.keys().next().value;
        parseCache.delete(oldest);
    }
    parseCache.set(key, { time: Date.now(), result });
};

export async function POST(request) {
    const ip = getClientIp(request);
    const rate = checkRateLimit(`import-parse:${ip}`, RATE_OPTIONS);
    if (!rate.allowed) {
        return NextResponse.json(
            { error: 'Too many parse requests. Please wait a moment and try again.' },
            { status: 429 }
        );
    }

    let body;
    try {
        body = await request.json();
    } catch (err) {
        return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
    }

    const text = sanitizeExtractedText(typeof body?.text === 'string' ? body.text.slice(0, MAX_EXTRACTED_CHARS * 2) : '');
    if (!text || text.length < 50) {
        return NextResponse.json({ error: 'Not enough resume text to parse (minimum 50 characters).' }, { status: 400 });
    }

    const cacheKey = createHash('sha256').update(text).digest('hex');
    const cached = cacheGet(cacheKey);
    if (cached) {
        return NextResponse.json({ ...cached, cached: true });
    }

    try {
        const result = await generateAIResponse({
            feature: 'resumeImport',
            input: { text },
            maxTokens: 3000,
            temperature: 0.2,
        });
        cacheSet(cacheKey, result);
        return NextResponse.json(result);
    } catch (err) {
        if (err instanceof AIValidationError || err instanceof AIParseError) {
            return NextResponse.json(
                { error: 'The AI could not turn this file into a structured resume. Please try again or use a cleaner file.' },
                { status: 502 }
            );
        }
        if (err instanceof OpenRouterError) {
            return NextResponse.json({ error: err.message }, { status: err.status || 502 });
        }
        console.error('Import parse failed:', err);
        return NextResponse.json({ error: 'Unexpected server error.' }, { status: 500 });
    }
}
