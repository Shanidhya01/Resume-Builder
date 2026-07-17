// Shared Firestore error helpers: friendly user-facing messages, transient-error
// detection, and a retry-once wrapper. Firestore's WebChannel/long-polling
// transport can intermittently fail (blocked networks, dropped connections)
// with retryable codes like `unavailable`; these helpers keep those failures
// from surfacing as raw "client is offline" text or silently corrupting the UI.

const TRANSIENT_CODES = new Set([
    'unavailable',
    'deadline-exceeded',
    'internal',
    'aborted',
    'cancelled',
    'resource-exhausted',
]);

export const isTransientFirestoreError = err => {
    if (!err) return false;
    if (TRANSIENT_CODES.has(err.code)) return true;
    return /offline|unavailable|network|timeout/i.test(err.message || '');
};

// Runs `fn`, retrying once (by default) after a short pause when it fails with a
// transient/connectivity error. Non-transient errors (e.g. permission-denied)
// throw immediately — retrying them is pointless.
export async function withFirestoreRetry(fn, { retries = 1, delayMs = 700 } = {}) {
    let lastErr;
    for (let attempt = 0; attempt <= retries; attempt += 1) {
        try {
            return await fn();
        } catch (err) {
            lastErr = err;
            if (attempt === retries || !isTransientFirestoreError(err)) throw err;
            await new Promise(resolve => setTimeout(resolve, delayMs));
        }
    }
    throw lastErr;
}

export const friendlyFirestoreError = err => {
    const code = err?.code;
    if (code === 'permission-denied') {
        return 'You do not have permission to do that. Please sign in again and retry.';
    }
    if (code === 'not-found') {
        return 'That resume could not be found. It may have been deleted.';
    }
    if (isTransientFirestoreError(err)) {
        return 'Unable to connect to the database. Please check your internet connection and try again.';
    }
    return err?.message || 'Something went wrong. Please try again.';
};

// Log detailed diagnostics in development only — production users see the
// friendly message, not raw Firestore internals.
export const logDev = (...args) => {
    if (process.env.NODE_ENV !== 'production') {
        console.error(...args);
    }
};
