export class AIParseError extends Error {
    constructor(message) {
        super(message);
        this.name = 'AIParseError';
    }
}

const stripCodeFences = text => {
    const trimmed = text.trim();
    const fenceMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
    return fenceMatch ? fenceMatch[1] : trimmed;
};

const extractJsonBlock = text => {
    const objectStart = text.indexOf('{');
    const arrayStart = text.indexOf('[');
    let start = -1;
    let open = '{';
    let close = '}';

    if (objectStart === -1 && arrayStart === -1) return null;
    if (objectStart === -1) {
        start = arrayStart;
        open = '[';
        close = ']';
    } else if (arrayStart === -1) {
        start = objectStart;
    } else {
        start = Math.min(objectStart, arrayStart);
        if (start === arrayStart) {
            open = '[';
            close = ']';
        }
    }

    const end = text.lastIndexOf(close);
    if (end === -1 || end <= start) return null;
    return text.slice(start, end + 1);
};

export function parseAIResponse(rawText) {
    if (typeof rawText !== 'string' || !rawText.trim()) {
        throw new AIParseError('AI returned an empty response.');
    }

    const cleaned = stripCodeFences(rawText);

    try {
        return JSON.parse(cleaned);
    } catch (err) {
        const extracted = extractJsonBlock(cleaned);
        if (extracted) {
            try {
                return JSON.parse(extracted);
            } catch (err2) {
                // fall through
            }
        }
        throw new AIParseError('Could not parse AI response as JSON.');
    }
}
