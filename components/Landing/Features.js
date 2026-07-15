'use client';

import { Wand2, Target, LayoutTemplate, Share2, ArrowLeftRight, Cloud, Eye, FileCheck2, Sparkles } from 'lucide-react';
import { Section, SectionHeading, Reveal } from './shared';

const FEATURES = [
    { icon: Wand2, title: 'AI Resume Assistant', desc: 'Rewrite bullets, generate summaries, and fix grammar with context-aware AI.' },
    { icon: Target, title: 'ATS Analysis', desc: 'Real-time scoring against job descriptions with keyword gap detection.' },
    { icon: LayoutTemplate, title: 'Premium Templates', desc: 'Six recruiter-approved layouts, each tuned for a specific ATS score.' },
    { icon: Share2, title: 'Public Sharing', desc: 'Share a live resume link with QR code, view counts, and analytics.' },
    { icon: ArrowLeftRight, title: 'Import & Export', desc: 'Bring in PDF, DOCX or JSON — export to PDF, DOCX, HTML or Markdown.' },
    { icon: Cloud, title: 'Cloud Sync', desc: 'Every edit saved to the cloud with full version history and undo/redo.' },
    { icon: Eye, title: 'Real-time Preview', desc: 'See your resume update instantly as you type, pixel-perfect to the PDF.' },
    { icon: FileCheck2, title: 'Recruiter-ready PDFs', desc: 'Clean, selectable-text PDFs that parse flawlessly in tracking systems.' },
];

export default function Features() {
    return (
        <Section id="features">
            <SectionHeading
                eyebrow="Everything you need"
                eyebrowIcon={Sparkles}
                title="One workspace, end to end"
                subtitle="From first draft to a shared, recruiter-ready resume — every step lives in a single fast, modern tool."
            />

            <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {FEATURES.map((f, i) => (
                    <Reveal key={f.title} delay={(i % 4) * 0.06}>
                        <div className="group relative h-full overflow-hidden rounded-2xl border border-line bg-surface p-5 shadow-ds-sm transition-all duration-300 hover:-translate-y-1 hover:border-line-strong hover:shadow-ds-lg">
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/[0.06] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            <div className="relative">
                                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/15 transition-transform duration-300 group-hover:scale-110">
                                    <f.icon className="h-5 w-5" />
                                </span>
                                <h3 className="mt-4 text-base font-semibold text-fg">{f.title}</h3>
                                <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{f.desc}</p>
                            </div>
                        </div>
                    </Reveal>
                ))}
            </div>
        </Section>
    );
}
