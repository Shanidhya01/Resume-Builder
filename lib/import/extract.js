// Server-only text extraction for the import pipeline. Parsers are loaded
// lazily (and are marked serverExternalPackages in next.config.mjs) so they
// cost nothing until the first import request. Files are processed entirely
// in memory — nothing is ever written to disk or any storage bucket.

export class ExtractionError extends Error {
    constructor(message, status = 422) {
        super(message);
        this.name = 'ExtractionError';
        this.status = status;
    }
}

const MAX_PDF_PAGES = 20;

let pdfjsPromise;
const loadPdfjs = () => {
    // The legacy build works in Node without a DOM; the modern build assumes browser globals.
    if (!pdfjsPromise) pdfjsPromise = import('pdfjs-dist/legacy/build/pdf.js').then(mod => mod.default ?? mod);
    return pdfjsPromise;
};

let mammothPromise;
const loadMammoth = () => {
    if (!mammothPromise) mammothPromise = import('mammoth').then(mod => mod.default ?? mod);
    return mammothPromise;
};

export async function extractPdfText(buffer) {
    const pdfjs = await loadPdfjs();

    let doc;
    try {
        doc = await pdfjs.getDocument({
            data: new Uint8Array(buffer),
            useSystemFonts: true,
            disableFontFace: true,
            isEvalSupported: false,
        }).promise;
    } catch (err) {
        if (err?.name === 'PasswordException') {
            throw new ExtractionError('This PDF is password-protected. Please remove the password and try again.');
        }
        throw new ExtractionError('Could not read this PDF. The file may be corrupted.');
    }

    try {
        const pageCount = Math.min(doc.numPages, MAX_PDF_PAGES);
        const pageTexts = [];

        for (let i = 1; i <= pageCount; i++) {
            const page = await doc.getPage(i);
            const content = await page.getTextContent();
            // Rebuild line breaks from text-item metadata so the AI parser sees
            // the resume's visual structure, not one endless line.
            let line = '';
            const lines = [];
            for (const item of content.items) {
                if (typeof item.str === 'string') line += item.str;
                if (item.hasEOL) {
                    lines.push(line);
                    line = '';
                }
            }
            if (line) lines.push(line);
            pageTexts.push(lines.join('\n'));
        }

        const text = pageTexts.join('\n\n').trim();
        if (!text) {
            throw new ExtractionError(
                'No selectable text found in this PDF. Scanned/image-only resumes are not supported — please export a text-based PDF.'
            );
        }
        return { text, pages: doc.numPages };
    } finally {
        await doc.destroy().catch(() => {});
    }
}

export async function extractDocxText(buffer) {
    const mammoth = await loadMammoth();

    let result;
    try {
        result = await mammoth.extractRawText({ buffer });
    } catch (err) {
        throw new ExtractionError('Could not read this DOCX file. The file may be corrupted.');
    }

    const text = (result?.value || '').trim();
    if (!text) {
        throw new ExtractionError('This DOCX file contains no readable text.');
    }
    return { text, pages: null };
}
