// Unified export entry point. Every format is generated on demand in the
// browser and immediately downloaded — exported files are never stored.
// Heavy generators (react-pdf, docx) are lazy-loaded inside their modules.

import { triggerDownload, safeFileName } from './shared';
import { toPortableResume } from '@/lib/importExport/backup';

export const EXPORT_FORMATS = [
    { id: 'pdf', label: 'PDF', extension: 'pdf', description: 'Print-ready PDF rendered with your selected template.' },
    { id: 'docx', label: 'DOCX', extension: 'docx', description: 'Editable Microsoft Word document.' },
    { id: 'html', label: 'HTML', extension: 'html', description: 'Self-contained web page, ready to host anywhere.' },
    { id: 'markdown', label: 'Markdown', extension: 'md', description: 'Plain-text markdown for GitHub, Notion, or editing.' },
    { id: 'json', label: 'JSON', extension: 'json', description: 'Structured backup you can re-import at any time.' },
];

export async function exportResume(format, resume) {
    const baseName = resume.contact?.name || resume.name || 'resume';

    switch (format) {
        case 'pdf': {
            const { resumeToPdfBlob } = await import('./pdfExport');
            const blob = await resumeToPdfBlob(resume);
            triggerDownload(blob, safeFileName(baseName, 'pdf'));
            return;
        }
        case 'docx': {
            const { resumeToDocxBlob } = await import('./docxExport');
            const blob = await resumeToDocxBlob(resume);
            triggerDownload(blob, safeFileName(baseName, 'docx'));
            return;
        }
        case 'html': {
            const { resumeToHtml } = await import('./html');
            const blob = new Blob([resumeToHtml(resume)], { type: 'text/html;charset=utf-8' });
            triggerDownload(blob, safeFileName(baseName, 'html'));
            return;
        }
        case 'markdown': {
            const { resumeToMarkdown } = await import('./markdown');
            const blob = new Blob([resumeToMarkdown(resume)], { type: 'text/markdown;charset=utf-8' });
            triggerDownload(blob, safeFileName(baseName, 'md'));
            return;
        }
        case 'json': {
            const payload = {
                format: 'hireready-resume',
                version: 1,
                exportedAt: new Date().toISOString(),
                ...toPortableResume(resume),
            };
            const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' });
            triggerDownload(blob, safeFileName(baseName, 'json'));
            return;
        }
        default:
            throw new Error(`Unknown export format "${format}".`);
    }
}

export { triggerDownload, safeFileName };
