// File validation for the resume import pipeline. Shared constants are used by
// both the client dropzone (fast feedback) and the server extract route (the
// actual security boundary — never trust the client-side checks alone).

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB
export const MAX_EXTRACTED_CHARS = 20000;

export const SUPPORTED_FORMATS = {
    pdf: {
        label: 'PDF',
        extensions: ['.pdf'],
        mimeTypes: ['application/pdf'],
    },
    docx: {
        label: 'DOCX',
        extensions: ['.docx'],
        mimeTypes: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    },
    json: {
        label: 'JSON',
        extensions: ['.json'],
        mimeTypes: ['application/json'],
    },
};

export const ACCEPTED_MIME_MAP = Object.fromEntries(
    Object.values(SUPPORTED_FORMATS).map(({ mimeTypes, extensions }) => [mimeTypes[0], extensions])
);

export class FileValidationError extends Error {
    constructor(message, status = 400) {
        super(message);
        this.name = 'FileValidationError';
        this.status = status;
    }
}

const extensionOf = name => {
    const dot = (name || '').lastIndexOf('.');
    return dot === -1 ? '' : name.slice(dot).toLowerCase();
};

// Determines the format from name + declared MIME type. Returns 'pdf' | 'docx' | 'json'.
export function detectFormat(fileName, mimeType) {
    const ext = extensionOf(fileName);
    for (const [format, spec] of Object.entries(SUPPORTED_FORMATS)) {
        if (spec.extensions.includes(ext) || spec.mimeTypes.includes(mimeType)) return format;
    }
    return null;
}

// Magic-byte checks — the declared MIME type is attacker-controlled, the first
// bytes of the file are not. DOCX is a ZIP container, so it must start with "PK".
const hasPdfMagic = bytes => bytes.length >= 5 && bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46 && bytes[4] === 0x2d; // %PDF-
const hasZipMagic = bytes => bytes.length >= 4 && bytes[0] === 0x50 && bytes[1] === 0x4b && (bytes[2] === 0x03 || bytes[2] === 0x05 || bytes[2] === 0x07);

export function validateUpload({ fileName, mimeType, bytes }) {
    if (!bytes || bytes.length === 0) {
        throw new FileValidationError('The uploaded file is empty.');
    }
    if (bytes.length > MAX_UPLOAD_BYTES) {
        throw new FileValidationError('File is too large. The maximum upload size is 5 MB.', 413);
    }

    const format = detectFormat(fileName, mimeType);
    if (!format) {
        throw new FileValidationError('Unsupported file format. Please upload a PDF, DOCX, or JSON file.', 415);
    }

    if (format === 'pdf' && !hasPdfMagic(bytes)) {
        throw new FileValidationError('This file does not look like a valid PDF. It may be corrupted or renamed.', 422);
    }
    if (format === 'docx' && !hasZipMagic(bytes)) {
        throw new FileValidationError('This file does not look like a valid DOCX document. It may be corrupted or renamed.', 422);
    }

    return format;
}

// Strips control characters and zero-width/bidi characters (prompt-injection
// and spoofing vectors), collapses excessive whitespace, and caps the length.
const isDisallowedCodePoint = code =>
    (code < 0x20 && code !== 0x09 && code !== 0x0a && code !== 0x0d) || // C0 controls except tab/newline/CR
    code === 0x7f || // DEL
    (code >= 0x200b && code <= 0x200f) || // zero-width + directional marks
    (code >= 0x202a && code <= 0x202e) || // bidi embedding/override
    (code >= 0x2060 && code <= 0x2069) || // word joiner + invisible operators + bidi isolates
    code === 0xfeff; // BOM / zero-width no-break space

export function sanitizeExtractedText(text) {
    if (typeof text !== 'string') return '';
    let cleaned = '';
    for (const ch of text) {
        if (!isDisallowedCodePoint(ch.codePointAt(0))) cleaned += ch;
    }
    return cleaned
        .replace(/\r\n?/g, '\n')
        .replace(/[ \t]+\n/g, '\n')
        .replace(/\n{4,}/g, '\n\n\n')
        .trim()
        .slice(0, MAX_EXTRACTED_CHARS);
}
