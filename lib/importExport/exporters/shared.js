// Shared helpers for all export formats.

import formatDate from '@/utils/formatDate';

export const formatRange = (start, end) => {
    const from = formatDate(start);
    const to = end ? formatDate(end) : 'Present';
    if (!from && !end) return '';
    return `${from || ''} - ${to}`.trim();
};

export const splitLines = text => (text ?? '').split('\n').map(l => l.trim()).filter(Boolean);

export const safeFileName = (name, extension) => {
    const base = (name || 'resume')
        .replace(/[^a-zA-Z0-9-_ ]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .slice(0, 60) || 'resume';
    return `${base}.${extension}`;
};

// Triggers a browser download for an in-memory Blob and releases the URL.
export const triggerDownload = (blob, fileName) => {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export const contactLinks = contact => {
    const c = contact || {};
    return [c.email, c.phone, c.address, c.linkedin, c.github, c.portfolio, c.blogs, c.twitter].filter(Boolean);
};
