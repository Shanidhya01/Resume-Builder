// Thin wrapper around the OpenRouter chat-completions endpoint.
// Server-only: relies on process.env.OPENROUTER_API_KEY which must never be exposed to the client.

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = 'openai/gpt-oss-20b:free';
const REQUEST_TIMEOUT_MS = 30000;
const MAX_RETRIES = 2;

export class OpenRouterError extends Error {
    constructor(message, status) {
        super(message);
        this.name = 'OpenRouterError';
        this.status = status || 502;
    }
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const shouldRetry = status => status === 429 || (status >= 500 && status < 600);

export async function callOpenRouter({ messages, temperature = 0.5, maxTokens = 1000, responseFormat = true }) {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
        throw new OpenRouterError('AI service is not configured (missing OPENROUTER_API_KEY).', 500);
    }

    const model = process.env.OPENROUTER_MODEL || DEFAULT_MODEL;

    const body = {
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
    };

    if (responseFormat) {
        body.response_format = { type: 'json_object' };
    }

    let lastError;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

        try {
            const res = await fetch(OPENROUTER_URL, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
                signal: controller.signal,
            });

            clearTimeout(timer);

            if (!res.ok) {
                if (shouldRetry(res.status) && attempt < MAX_RETRIES) {
                    await sleep(2 ** attempt * 500);
                    continue;
                }
                const text = await res.text().catch(() => '');
                throw new OpenRouterError(`OpenRouter request failed (${res.status}): ${text.slice(0, 300)}`, res.status);
            }

            const data = await res.json();
            const content = data?.choices?.[0]?.message?.content;
            if (!content) {
                throw new OpenRouterError('OpenRouter returned an empty response.', 502);
            }
            return content;
        } catch (err) {
            clearTimeout(timer);
            lastError = err;

            if (err.name === 'AbortError') {
                lastError = new OpenRouterError('AI request timed out.', 504);
                if (attempt < MAX_RETRIES) {
                    await sleep(2 ** attempt * 500);
                    continue;
                }
                break;
            }

            if (err instanceof OpenRouterError) {
                if (shouldRetry(err.status) && attempt < MAX_RETRIES) {
                    await sleep(2 ** attempt * 500);
                    continue;
                }
                break;
            }

            // Network-level failure — retry.
            if (attempt < MAX_RETRIES) {
                await sleep(2 ** attempt * 500);
                continue;
            }
            break;
        }
    }

    throw lastError instanceof OpenRouterError ? lastError : new OpenRouterError('AI request failed.', 502);
}
