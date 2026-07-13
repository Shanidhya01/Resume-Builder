import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGithub, FaTwitter, FaGlobe, FaRss } from 'react-icons/fa';
import formatDate from '@/utils/formatDate';

const splitLines = text => (text ?? '').split('\n').filter(line => line.trim());
const splitSkills = text => (text ?? '').split(/[\n,]/).map(s => s.trim()).filter(Boolean);

const CONTACT_LINKS = [
    { key: 'linkedin', label: 'LinkedIn', icon: FaLinkedin, hrefPrefix: 'https://' },
    { key: 'github', label: 'GitHub', icon: FaGithub, hrefPrefix: 'https://' },
    { key: 'twitter', label: 'Twitter', icon: FaTwitter, hrefPrefix: 'https://' },
    { key: 'portfolio', label: 'Portfolio', icon: FaGlobe, hrefPrefix: 'https://' },
    { key: 'blogs', label: 'Blog', icon: FaRss, hrefPrefix: 'https://' },
];

const normalizeUrl = (value, prefix) => {
    if (!value) return null;
    return /^https?:\/\//i.test(value) ? value : `${prefix}${value}`;
};

const SectionTitle = ({ children }) => (
    <h2 className="mb-3 border-b-2 border-purple-500/40 pb-1.5 text-sm font-bold uppercase tracking-widest text-purple-700 print:border-slate-400 print:text-slate-800">
        {children}
    </h2>
);

const EntryHeader = ({ title, subtitle, meta, location }) => (
    <div className="mb-1 flex flex-col justify-between gap-0.5 sm:flex-row sm:items-baseline">
        <div>
            <span className="font-semibold text-slate-900">{title}</span>
            {subtitle && <span className="text-slate-600"> · {subtitle}</span>}
        </div>
        <div className="shrink-0 text-xs text-slate-500">
            {meta}
            {location ? ` · ${location}` : ''}
        </div>
    </div>
);

const BulletList = ({ text }) => {
    const lines = splitLines(text);
    if (lines.length === 0) return null;
    return (
        <ul className="ml-5 list-disc space-y-0.5 text-sm text-slate-700">
            {lines.map((line, i) => (
                <li key={i}>{line}</li>
            ))}
        </ul>
    );
};

const PublicResumeView = ({ resume }) => {
    const { contact = {}, summary = {}, experience = [], projects = [], education = [], skills = {}, certificates = [], languages = [] } = resume;

    const skillList = splitSkills(skills.skills);
    const links = CONTACT_LINKS.map(({ key, label, icon: Icon, hrefPrefix }) => {
        const href = normalizeUrl(contact[key], hrefPrefix);
        if (!href) return null;
        return (
            <a
                key={key}
                href={href}
                target="_blank"
                rel="noopener noreferrer nofollow"
                aria-label={label}
                className="flex items-center gap-1.5 rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 transition-colors hover:border-purple-400 hover:text-purple-700 print:border-slate-400"
            >
                <Icon className="h-3 w-3" aria-hidden="true" />
                {label}
            </a>
        );
    }).filter(Boolean);

    return (
        <article className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 text-slate-800 shadow-xl sm:p-10 print:max-w-none print:rounded-none print:border-0 print:p-0 print:shadow-none">
            <header className="mb-8 border-b border-slate-200 pb-6 text-center print:text-left">
                <h1 className="text-3xl font-black text-slate-900 sm:text-4xl">{contact.name || 'Untitled Resume'}</h1>
                {contact.title && <p className="mt-1 text-lg font-medium text-purple-700 print:text-slate-700">{contact.title}</p>}

                <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-slate-600 print:justify-start">
                    {contact.email && (
                        <span className="flex items-center gap-1.5">
                            <FaEnvelope className="h-3.5 w-3.5" aria-hidden="true" /> {contact.email}
                        </span>
                    )}
                    {contact.phone && (
                        <span className="flex items-center gap-1.5">
                            <FaPhone className="h-3.5 w-3.5" aria-hidden="true" /> {contact.phone}
                        </span>
                    )}
                    {contact.address && (
                        <span className="flex items-center gap-1.5">
                            <FaMapMarkerAlt className="h-3.5 w-3.5" aria-hidden="true" /> {contact.address}
                        </span>
                    )}
                </div>

                {links.length > 0 && (
                    <div className="mt-4 flex flex-wrap items-center justify-center gap-2 print:justify-start">{links}</div>
                )}
            </header>

            <div className="space-y-7">
                {summary.summary && (
                    <section aria-labelledby="summary-heading">
                        <SectionTitle>Summary</SectionTitle>
                        <p className="text-sm leading-relaxed text-slate-700">{summary.summary}</p>
                    </section>
                )}

                {experience.length > 0 && (
                    <section aria-labelledby="experience-heading">
                        <SectionTitle>Experience</SectionTitle>
                        <div className="space-y-4">
                            {experience.map((entry, i) => (
                                <div key={i}>
                                    <EntryHeader
                                        title={entry.role}
                                        subtitle={entry.company}
                                        meta={`${formatDate(entry.start)} - ${formatDate(entry.end) || 'Present'}`}
                                        location={entry.location}
                                    />
                                    <BulletList text={entry.description} />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {projects.length > 0 && (
                    <section aria-labelledby="projects-heading">
                        <SectionTitle>Projects</SectionTitle>
                        <div className="space-y-4">
                            {projects.map((entry, i) => (
                                <div key={i}>
                                    <EntryHeader title={entry.title} />
                                    {entry.url && (
                                        <a
                                            href={normalizeUrl(entry.url, 'https://')}
                                            target="_blank"
                                            rel="noopener noreferrer nofollow"
                                            className="mb-1 block text-xs text-purple-700 underline print:text-slate-600"
                                        >
                                            {entry.url}
                                        </a>
                                    )}
                                    <BulletList text={entry.description} />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {education.length > 0 && (
                    <section aria-labelledby="education-heading">
                        <SectionTitle>Education</SectionTitle>
                        <div className="space-y-3">
                            {education.map((entry, i) => (
                                <EntryHeader
                                    key={i}
                                    title={entry.degree}
                                    subtitle={entry.gpa ? `${entry.institution} (${entry.gpa})` : entry.institution}
                                    meta={`${formatDate(entry.start)} - ${formatDate(entry.end)}`}
                                    location={entry.location}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {skillList.length > 0 && (
                    <section aria-labelledby="skills-heading">
                        <SectionTitle>Skills</SectionTitle>
                        <div className="flex flex-wrap gap-2">
                            {skillList.map((skill, i) => (
                                <span
                                    key={i}
                                    className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-800 print:border print:border-slate-300 print:bg-transparent"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                {certificates.length > 0 && (
                    <section aria-labelledby="certificates-heading">
                        <SectionTitle>Certificates</SectionTitle>
                        <div className="space-y-2">
                            {certificates.map((entry, i) => (
                                <EntryHeader key={i} title={entry.title} subtitle={entry.issuer} meta={formatDate(entry.date)} />
                            ))}
                        </div>
                    </section>
                )}

                {languages.length > 0 && (
                    <section aria-labelledby="languages-heading">
                        <SectionTitle>Languages</SectionTitle>
                        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-700">
                            {languages.map((entry, i) => (
                                <span key={i}>
                                    <span className="font-semibold">{entry.language}</span>
                                    {entry.proficiency ? ` — ${entry.proficiency}` : ''}
                                </span>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </article>
    );
};

export default PublicResumeView;
