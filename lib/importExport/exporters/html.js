// HTML exporter — produces a self-contained, print-friendly HTML document.
// All resume values are escaped; the file has no external dependencies.

import { formatRange, splitLines, contactLinks } from './shared';

const escapeHtml = value =>
    String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

const bulletList = description => {
    const lines = splitLines(description);
    if (!lines.length) return '';
    return `<ul>${lines.map(line => `<li>${escapeHtml(line)}</li>`).join('')}</ul>`;
};

const section = (title, body) => (body ? `<section><h2>${escapeHtml(title)}</h2>${body}</section>` : '');

export function resumeToHtml(resume) {
    const { contact = {}, summary = {}, experience = [], education = [], projects = [], skills = {}, certificates = [], languages = [] } = resume;

    const experienceHtml = experience
        .map(
            entry => `<article>
  <div class="row"><h3>${escapeHtml(entry.role || '')}</h3><span class="date">${escapeHtml(formatRange(entry.start, entry.end))}</span></div>
  <div class="row"><p class="sub">${escapeHtml(entry.company || '')}</p><span class="date">${escapeHtml(entry.location || '')}</span></div>
  ${bulletList(entry.description)}
</article>`
        )
        .join('');

    const projectsHtml = projects
        .map(
            entry => `<article>
  <h3>${escapeHtml(entry.title || '')}${entry.url ? ` <a href="${escapeHtml(entry.url)}">${escapeHtml(entry.url)}</a>` : ''}</h3>
  ${bulletList(entry.description)}
</article>`
        )
        .join('');

    const educationHtml = education
        .map(
            entry => `<article>
  <div class="row"><h3>${escapeHtml(entry.degree || '')}</h3><span class="date">${escapeHtml(formatRange(entry.start, entry.end))}</span></div>
  <div class="row"><p class="sub">${escapeHtml(entry.institution || '')}${entry.gpa ? ` (${escapeHtml(entry.gpa)})` : ''}</p><span class="date">${escapeHtml(entry.location || '')}</span></div>
</article>`
        )
        .join('');

    const skillsHtml = splitLines(skills.skills)
        .map(line => `<p>${escapeHtml(line)}</p>`)
        .join('');

    const certificatesHtml = certificates.length
        ? `<ul>${certificates.map(cert => `<li>${escapeHtml([cert.title, cert.issuer].filter(Boolean).join(' — '))}</li>`).join('')}</ul>`
        : '';

    const languagesHtml = languages.length
        ? `<ul>${languages.map(l => `<li>${escapeHtml([l.language, l.proficiency].filter(Boolean).join(' — '))}</li>`).join('')}</ul>`
        : '';

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(contact.name || 'Resume')}</title>
<style>
  :root { color-scheme: light; }
  * { box-sizing: border-box; margin: 0; }
  body { font-family: Georgia, 'Times New Roman', serif; color: #1f2937; max-width: 800px; margin: 0 auto; padding: 40px 24px; line-height: 1.5; }
  header { text-align: center; border-bottom: 2px solid #1f2937; padding-bottom: 12px; margin-bottom: 20px; }
  h1 { font-size: 28px; letter-spacing: 0.5px; }
  .title { font-size: 15px; color: #4b5563; margin-top: 2px; }
  .links { font-size: 12px; color: #4b5563; margin-top: 6px; }
  h2 { font-size: 14px; text-transform: uppercase; letter-spacing: 1.5px; border-bottom: 1px solid #d1d5db; padding-bottom: 3px; margin: 18px 0 10px; }
  h3 { font-size: 14px; display: inline; }
  article { margin-bottom: 12px; }
  .row { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
  .sub { font-size: 13px; font-style: italic; color: #374151; }
  .date { font-size: 12px; color: #6b7280; white-space: nowrap; }
  ul { padding-left: 18px; margin-top: 4px; }
  li, p { font-size: 13px; }
  a { color: #1d4ed8; text-decoration: none; word-break: break-all; }
  @media print { body { padding: 0; } }
</style>
</head>
<body>
<header>
  <h1>${escapeHtml(contact.name || 'Resume')}</h1>
  ${contact.title ? `<p class="title">${escapeHtml(contact.title)}</p>` : ''}
  ${contactLinks(contact).length ? `<p class="links">${contactLinks(contact).map(escapeHtml).join(' · ')}</p>` : ''}
</header>
${section('Summary', summary.summary ? `<p>${escapeHtml(summary.summary)}</p>` : '')}
${section('Experience', experienceHtml)}
${section('Projects', projectsHtml)}
${section('Education', educationHtml)}
${section('Skills', skillsHtml)}
${section('Certifications', certificatesHtml)}
${section('Languages', languagesHtml)}
</body>
</html>`;
}
