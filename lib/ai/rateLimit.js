// Simple in-memory sliding-window rate limiter, keyed by IP.
// Single-instance Next.js app — no Redis needed.

const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 20;

const buckets = new Map();

export function checkRateLimit(key) {
    const now = Date.now();
    const timestamps = (buckets.get(key) || []).filter(ts => now - ts < WINDOW_MS);

    if (timestamps.length >= MAX_REQUESTS) {
        buckets.set(key, timestamps);
        const retryAfterMs = WINDOW_MS - (now - timestamps[0]);
        return { allowed: false, retryAfterMs };
    }

    timestamps.push(now);
    buckets.set(key, timestamps);
    return { allowed: true };
}

export function getClientIp(request) {
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) return forwarded.split(',')[0].trim();
    const realIp = request.headers.get('x-real-ip');
    if (realIp) return realIp;
    return 'unknown';
}
