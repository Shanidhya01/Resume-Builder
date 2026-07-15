'use client';

import Link from 'next/link';
import { FileText, Github, Twitter, Linkedin } from 'lucide-react';

const COLUMNS = [
    {
        title: 'Product',
        links: [
            { label: 'Features', href: '#features' },
            { label: 'Templates', href: '/templates' },
            { label: 'Live Demo', href: '#demo' },
            { label: 'ATS Analysis', href: '#ats' },
        ],
    },
    {
        title: 'Resources',
        links: [
            { label: 'How it works', href: '#how-it-works' },
            { label: 'FAQ', href: '#faq' },
            { label: 'Documentation', href: 'https://github.com/Shanidhya01/Resume-Builder#readme' },
            { label: 'GitHub', href: 'https://github.com/Shanidhya01/Resume-Builder' },
        ],
    },
    {
        title: 'Company',
        links: [
            { label: 'About', href: '/about' },
            { label: 'Privacy', href: '/about#privacy' },
            { label: 'Terms', href: '/about#terms' },
            { label: 'Contact', href: 'mailto:hello@hireready.app' },
        ],
    },
];

const SOCIALS = [
    { icon: Github, href: 'https://github.com/Shanidhya01/Resume-Builder', label: 'GitHub' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
];

export default function Footer() {
    return (
        <footer className="border-t border-line bg-surface/40">
            <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
                <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
                    <div>
                        <Link href="/" className="flex items-center gap-2.5">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-fg shadow-ds-sm">
                                <FileText className="h-4 w-4" strokeWidth={2.4} />
                            </span>
                            <span className="text-[15px] font-semibold tracking-tight text-fg">HireReady</span>
                        </Link>
                        <p className="mt-4 max-w-xs text-sm leading-relaxed text-fg-muted">
                            The free, open-source resume builder with an AI assistant and real-time ATS scoring.
                        </p>
                        <div className="mt-5 flex gap-2">
                            {SOCIALS.map(s => (
                                <a
                                    key={s.label}
                                    href={s.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={s.label}
                                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-line text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg"
                                >
                                    <s.icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {COLUMNS.map(col => (
                        <div key={col.title}>
                            <h3 className="text-sm font-semibold text-fg">{col.title}</h3>
                            <ul className="mt-4 space-y-3">
                                {col.links.map(link => (
                                    <li key={link.label}>
                                        <Link href={link.href} className="text-sm text-fg-muted transition-colors hover:text-fg">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-line pt-6 sm:flex-row">
                    <p className="text-xs text-fg-muted">© {new Date().getFullYear()} HireReady. Free &amp; open source.</p>
                    <p className="text-xs text-fg-subtle">Built with Next.js, Tailwind &amp; Framer Motion.</p>
                </div>
            </div>
        </footer>
    );
}
