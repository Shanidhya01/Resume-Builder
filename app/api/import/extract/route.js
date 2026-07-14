// POST /api/import/extract — accepts a PDF or DOCX upload (multipart/form-data,
// field "file") and returns the extracted plain text. The file lives only in
// this request's memory: it is validated, parsed, and discarded. Nothing is
// written to disk, Firebase Storage, or any other persistent store.

import { NextResponse } from 'next/server';
import { checkRateLimit, getClientIp } from '@/lib/ai/rateLimit';
import { validateUpload, sanitizeExtractedText, FileValidationError, MAX_UPLOAD_BYTES } from '@/lib/import/validation';
import { extractPdfText, extractDocxText, ExtractionError } from '@/lib/import/extract';

export const runtime = 'nodejs';

// 10 extractions per minute per IP — parsing is CPU-heavy relative to the AI proxy routes.
const RATE_OPTIONS = { maxRequests: 10 };

export async function POST(request) {
    const ip = getClientIp(request);
    const rate = checkRateLimit(`import-extract:${ip}`, RATE_OPTIONS);
    if (!rate.allowed) {
        return NextResponse.json(
            { error: 'Too many import requests. Please wait a moment and try again.' },
            { status: 429 }
        );
    }

    const contentLength = Number(request.headers.get('content-length') || 0);
    if (contentLength > MAX_UPLOAD_BYTES * 1.1) {
        return NextResponse.json({ error: 'File is too large. The maximum upload size is 5 MB.' }, { status: 413 });
    }

    let file;
    try {
        const formData = await request.formData();
        file = formData.get('file');
    } catch (err) {
        return NextResponse.json({ error: 'Expected a multipart/form-data upload.' }, { status: 400 });
    }

    if (!file || typeof file.arrayBuffer !== 'function') {
        return NextResponse.json({ error: 'No file was uploaded. Attach the resume as the "file" field.' }, { status: 400 });
    }

    try {
        const bytes = new Uint8Array(await file.arrayBuffer());
        const format = validateUpload({ fileName: file.name, mimeType: file.type, bytes });

        if (format === 'json') {
            // JSON backups are parsed client-side; they never need this route.
            return NextResponse.json({ error: 'JSON backups are imported directly in the browser.' }, { status: 400 });
        }

        const extracted = format === 'pdf' ? await extractPdfText(bytes) : await extractDocxText(Buffer.from(bytes));
        const text = sanitizeExtractedText(extracted.text);

        if (!text) {
            return NextResponse.json({ error: 'No readable text could be extracted from this file.' }, { status: 422 });
        }

        return NextResponse.json({
            text,
            format,
            fileName: file.name,
            pages: extracted.pages,
            chars: text.length,
        });
    } catch (err) {
        if (err instanceof FileValidationError || err instanceof ExtractionError) {
            return NextResponse.json({ error: err.message }, { status: err.status });
        }
        console.error('Import extraction failed:', err);
        return NextResponse.json({ error: 'Could not process this file. Please try a different one.' }, { status: 500 });
    }
}
