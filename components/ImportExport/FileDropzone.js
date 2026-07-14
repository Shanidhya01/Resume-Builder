'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaFileUpload, FaFilePdf, FaFileWord, FaFileCode } from 'react-icons/fa';
import { ACCEPTED_MIME_MAP, MAX_UPLOAD_BYTES } from '@/lib/import/validation';

const FORMAT_BADGES = [
    { icon: FaFilePdf, label: 'PDF' },
    { icon: FaFileWord, label: 'DOCX' },
    { icon: FaFileCode, label: 'JSON' },
];

// Drag & drop + browse upload zone. Client-side validation gives instant
// feedback; the server re-validates everything (size, MIME, magic bytes).
const FileDropzone = ({ onFile, disabled = false, progress = null, busyLabel = 'Processing...' }) => {
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
            className={`relative flex min-h-[16rem] cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-8 text-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 ${
                isDragActive
                    ? 'border-purple-400 bg-purple-500/10'
                    : disabled
                      ? 'cursor-not-allowed border-slate-600/40 bg-slate-900/30 opacity-70'
                      : 'border-purple-500/40 bg-slate-900/40 hover:border-purple-400 hover:bg-purple-500/5'
            }`}
        >
            <input {...getInputProps()} aria-hidden="true" />

            <FaFileUpload className={`h-10 w-10 ${isDragActive ? 'text-purple-300' : 'text-purple-400'}`} aria-hidden="true" />

            {busy ? (
                <div className="w-full max-w-xs" role="status" aria-live="polite">
                    <p className="mb-2 text-sm font-semibold text-white">{progress < 100 ? `Uploading... ${progress}%` : busyLabel}</p>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-700" aria-hidden="true">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            ) : (
                <>
                    <div>
                        <p className="text-base font-semibold text-white">
                            {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume here'}
                        </p>
                        <p className="mt-1 text-sm text-slate-400">
                            or <span className="font-semibold text-purple-300 underline">browse files</span>
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        {FORMAT_BADGES.map(({ icon: Icon, label }) => (
                            <span
                                key={label}
                                className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/20 px-3 py-1 text-xs font-semibold text-slate-300"
                            >
                                <Icon aria-hidden="true" /> {label}
                            </span>
                        ))}
                    </div>
                    <p className="text-xs text-slate-500">Maximum file size: 5 MB. Files are parsed in memory and never stored.</p>
                </>
            )}
        </div>
    );
};

export default FileDropzone;
