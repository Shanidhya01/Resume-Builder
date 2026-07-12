// Shared request helpers for app/api/ai/* routes.
// These routes are intentionally unauthenticated — they only proxy prompts to OpenRouter
// and never read or write Firestore/user data, so verifying a Firebase ID token here
// would add complexity without a corresponding data-access risk to mitigate.

import { NextResponse } from 'next/server';
import { checkRateLimit, getClientIp } from './rateLimit';
import { generateAIResponse, OpenRouterError, AIParseError, AIValidationError } from './index';

const MAX_INPUT_LENGTH = 8000;

export function sanitizeString(value) {
    if (typeof value !== 'string') return '';
    return value.trim().slice(0, MAX_INPUT_LENGTH);
}

export function sanitizeDeep(value, depth = 0) {
    if (depth > 6) return value;
    if (typeof value === 'string') return sanitizeString(value);
    if (Array.isArray(value)) return value.map(v => sanitizeDeep(v, depth + 1));
    if (value && typeof value === 'object') {
        const out = {};
        for (const key of Object.keys(value)) {
            out[key] = sanitizeDeep(value[key], depth + 1);
        }
        return out;
    }
    return value;
}

export async function handleAIRoute(request, { feature, buildInput }) {
    const ip = getClientIp(request);
    const rate = checkRateLimit(`ai:${ip}`);
    if (!rate.allowed) {
        return NextResponse.json(
            { error: 'Too many AI requests. Please wait a moment and try again.' },
            { status: 429 }
        );
    }

    let body;
    try {
        body = await request.json();
    } catch (err) {
        return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
    }

    let input;
    try {
        input = buildInput(sanitizeDeep(body || {}));
    } catch (err) {
        return NextResponse.json({ error: err.message || 'Invalid request.' }, { status: 400 });
    }

    try {
        const result = await generateAIResponse({ feature, input });
        return NextResponse.json(result);
    } catch (err) {
        if (err instanceof AIValidationError || err instanceof AIParseError) {
            return NextResponse.json({ error: 'AI returned an unexpected response. Please try again.' }, { status: 502 });
        }
        if (err instanceof OpenRouterError) {
            return NextResponse.json({ error: err.message }, { status: err.status || 502 });
        }
        return NextResponse.json({ error: 'Unexpected server error.' }, { status: 500 });
    }
}
