// Markdown exporter — produces a clean, ATS-friendly single-document markdown resume.

import { formatRange, splitLines, contactLinks } from './shared';

export function resumeToMarkdown(resume) {
    const { contact = {}, summary = {}, experience = [], education = [], projects = [], skills = {}, certificates = [], languages = [] } = resume;
    const parts = [];

    parts.push(`# ${contact.name || 'Resume'}`);
    if (contact.title) parts.push(`**${contact.title}**`);
    const links = contactLinks(contact);
    if (links.length) parts.push(links.join(' · '));

    if (summary.summary) {
        parts.push('## Summary', summary.summary);
    }

    if (experience.length) {
        parts.push('## Experience');
        for (const entry of experience) {
            const heading = [entry.role, entry.company].filter(Boolean).join(' — ');
            const meta = [formatRange(entry.start, entry.end), entry.location].filter(Boolean).join(' · ');
            parts.push(`### ${heading}`);
            if (meta) parts.push(`*${meta}*`);
            const bullets = splitLines(entry.description).map(line => `- ${line}`);
            if (bullets.length) parts.push(bullets.join('\n'));
        }
    }

    if (projects.length) {
        parts.push('## Projects');
        for (const entry of projects) {
            parts.push(`### ${entry.url ? `[${entry.title}](${entry.url})` : entry.title}`);
            const bullets = splitLines(entry.description).map(line => `- ${line}`);
            if (bullets.length) parts.push(bullets.join('\n'));
        }
    }

    if (education.length) {
        parts.push('## Education');
        for (const entry of education) {
            const heading = [entry.degree, entry.institution].filter(Boolean).join(' — ');
            const meta = [formatRange(entry.start, entry.end), entry.location, entry.gpa ? `GPA: ${entry.gpa}` : ''].filter(Boolean).join(' · ');
            parts.push(`### ${heading}`);
            if (meta) parts.push(`*${meta}*`);
        }
    }

    if (skills.skills) {
        parts.push('## Skills', splitLines(skills.skills).join('\n\n'));
    }

    if (certificates.length) {
        parts.push('## Certifications');
        parts.push(
            certificates
                .map(cert => `- ${[cert.title, cert.issuer, cert.date ? formatRange(cert.date, cert.date).split(' - ')[0] : ''].filter(Boolean).join(' — ')}`)
                .join('\n')
        );
    }

    if (languages.length) {
        parts.push('## Languages');
        parts.push(languages.map(l => `- ${[l.language, l.proficiency].filter(Boolean).join(' — ')}`).join('\n'));
    }

    return parts.join('\n\n') + '\n';
}
