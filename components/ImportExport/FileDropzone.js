'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, FileType2, FileJson } from 'lucide-react';
import { ACCEPTED_MIME_MAP, MAX_UPLOAD_BYTES } from '@/lib/import/validation';

const FORMAT_BADGES = [
    { icon: FileText, label: 'PDF' },
    { icon: FileType2, label: 'DOCX' },
    { icon: FileJson, label: 'JSON' },
];

// Drag & drop + browse upload zone. Client-side validation gives instant
// feedback; the server re-validates everything (size, MIME, magic bytes).
const FileDropzone = ({ onFile, disabled = false, progress = null, busyLabel = 'Processing…' }) => {
    const onDrop = useCallback(
        (accepted, rejections) => {
            if (rejections.length > 0) {
                const rejection = rejections[0];
                const code = rejection.errors?.[0]?.code;
                if (code === 'file-too-large') {
                    onFile(null, 'File is too large. The maximum upload size is 5 MB.');
                } else if (code === 'file-invalid-type') {
                    onFile(null, 'Unsupported file format. Please upload a PDF, DOCX, or JSON file.');
                } else {
                    onFile(null, rejection.errors?.[0]?.message || 'This file cannot be uploaded.');
                }
                return;
            }
            if (accepted.length > 0) onFile(accepted[0], null);
        },
        [onFile]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: ACCEPTED_MIME_MAP,
        maxSize: MAX_UPLOAD_BYTES,
        multiple: false,
        disabled,
    });

    const busy = disabled && progress !== null;

    return (
        <div
            {...getRootProps({
                role: 'button',
                'aria-label': 'Upload a resume file: drag and drop or press Enter to browse. Supported formats: PDF, DOCX, JSON. Maximum size 5 megabytes.',
                'aria-disabled': disabled,
            })}
            className={`relative flex min-h-[16rem] cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-8 text-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                isDragActive
                    ? 'border-accent bg-accent/10'
                    : disabled
                      ? 'cursor-not-allowed border-line bg-surface-2 opacity-70'
                      : 'border-line-strong bg-surface hover:border-accent hover:bg-accent/5'
            }`}
        >
            <input {...getInputProps()} aria-hidden="true" />

            <span className={`grid h-16 w-16 place-items-center rounded-2xl transition-colors ${isDragActive ? 'bg-accent/15 text-accent' : 'bg-surface-2 text-accent'}`}>
                <UploadCloud className="h-8 w-8" aria-hidden="true" />
            </span>

            {busy ? (
                <div className="w-full max-w-xs" role="status" aria-live="polite">
                    <p className="mb-2 text-sm font-semibold text-fg">{progress < 100 ? `Uploading… ${progress}%` : busyLabel}</p>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
                        <div
                            className="h-full rounded-full bg-accent transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            ) : (
                <>
                    <div>
                        <p className="text-base font-semibold text-fg">
                            {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume here'}
                        </p>
                        <p className="mt-1 text-sm text-fg-muted">
                            or <span className="font-semibold text-accent underline">browse files</span>
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2.5">
                        {FORMAT_BADGES.map(({ icon: Icon, label }) => (
                            <span
                                key={label}
                                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-2 px-3 py-1 text-xs font-semibold text-fg-muted"
                            >
                                <Icon className="h-3.5 w-3.5" aria-hidden="true" /> {label}
                            </span>
                        ))}
                    </div>
                    <p className="text-xs text-fg-subtle">Maximum file size: 5 MB. Files are parsed in memory and never stored.</p>
                </>
            )}
        </div>
    );
};

export default FileDropzone;
