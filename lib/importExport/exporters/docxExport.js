// DOCX exporter — builds a Word document with the `docx` package. The library
// is dynamically imported so its ~300 KB never loads until the first DOCX export.

import { formatRange, splitLines, contactLinks } from './shared';

export async function resumeToDocxBlob(resume) {
    const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, TabStopType, TabStopPosition } = await import('docx');

    const { contact = {}, summary = {}, experience = [], education = [], projects = [], skills = {}, certificates = [], languages = [] } = resume;
    const children = [];

    children.push(
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: contact.name || 'Resume', bold: true, size: 48 })],
        })
    );
    if (contact.title) {
        children.push(
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: contact.title, size: 26, color: '4B5563' })],
            })
        );
    }
    const links = contactLinks(contact);
    if (links.length) {
        children.push(
            new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 240 },
                children: [new TextRun({ text: links.join('  ·  '), size: 18, color: '4B5563' })],
            })
        );
    }

    const heading = text =>
        new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 240, after: 100 },
            children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 22 })],
            border: { bottom: { style: 'single', size: 6, color: 'D1D5DB' } },
        });

    const titleDateRow = (title, date) =>
        new Paragraph({
            tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
            spacing: { before: 120 },
            children: [
                new TextRun({ text: title, bold: true, size: 22 }),
                ...(date ? [new TextRun({ text: `\t${date}`, size: 18, color: '6B7280' })] : []),
            ],
        });

    const subtitleRow = (subtitle, right) =>
        new Paragraph({
            tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
            children: [
                new TextRun({ text: subtitle, italics: true, size: 20, color: '374151' }),
                ...(right ? [new TextRun({ text: `\t${right}`, size: 18, color: '6B7280' })] : []),
            ],
        });

    const bullets = description =>
        splitLines(description).map(
            line =>
                new Paragraph({
                    bullet: { level: 0 },
                    children: [new TextRun({ text: line, size: 20 })],
                })
        );

    if (summary.summary) {
        children.push(heading('Summary'), new Paragraph({ children: [new TextRun({ text: summary.summary, size: 20 })] }));
    }

    if (experience.length) {
        children.push(heading('Experience'));
        for (const entry of experience) {
            children.push(titleDateRow(entry.role || '', formatRange(entry.start, entry.end)));
            if (entry.company || entry.location) children.push(subtitleRow(entry.company || '', entry.location || ''));
            children.push(...bullets(entry.description));
        }
    }

    if (projects.length) {
        children.push(heading('Projects'));
        for (const entry of projects) {
            children.push(titleDateRow(entry.title || '', ''));
            if (entry.url) children.push(subtitleRow(entry.url, ''));
            children.push(...bullets(entry.description));
        }
    }

    if (education.length) {
        children.push(heading('Education'));
        for (const entry of education) {
            children.push(titleDateRow(entry.degree || '', formatRange(entry.start, entry.end)));
            const sub = [entry.institution, entry.gpa ? `GPA: ${entry.gpa}` : ''].filter(Boolean).join(' — ');
            if (sub || entry.location) children.push(subtitleRow(sub, entry.location || ''));
        }
    }

    if (skills.skills) {
        children.push(heading('Skills'));
        for (const line of splitLines(skills.skills)) {
            children.push(new Paragraph({ children: [new TextRun({ text: line, size: 20 })] }));
        }
    }

    if (certificates.length) {
        children.push(heading('Certifications'));
        for (const cert of certificates) {
            children.push(
                new Paragraph({
                    bullet: { level: 0 },
                    children: [new TextRun({ text: [cert.title, cert.issuer].filter(Boolean).join(' — '), size: 20 })],
                })
            );
        }
    }

    if (languages.length) {
        children.push(heading('Languages'));
        for (const lang of languages) {
            children.push(
                new Paragraph({
                    bullet: { level: 0 },
                    children: [new TextRun({ text: [lang.language, lang.proficiency].filter(Boolean).join(' — '), size: 20 })],
                })
            );
        }
    }

    const doc = new Document({
        sections: [{ properties: {}, children }],
        styles: {
            default: { document: { run: { font: 'Calibri' } } },
        },
    });

    return Packer.toBlob(doc);
}
