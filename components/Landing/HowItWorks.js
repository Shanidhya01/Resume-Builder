'use client';

import { motion } from 'framer-motion';
import { FilePlus2, Wand2, Target, Share2, Route } from 'lucide-react';
import { Section, SectionHeading, Reveal } from './shared';

const STEPS = [
    { icon: FilePlus2, title: 'Create your resume', desc: 'Start from a template or import an existing PDF, DOCX or JSON in seconds.' },
    { icon: Wand2, title: 'Improve with AI', desc: 'Let the assistant sharpen bullets, write summaries, and fix grammar.' },
    { icon: Target, title: 'Optimize ATS score', desc: 'Paste a job description and close keyword gaps until you score green.' },
    { icon: Share2, title: 'Share & export', desc: 'Publish a live link with analytics, or export a recruiter-ready PDF.' },
];

export default function HowItWorks() {
    return (
        <Section id="how-it-works">
            <SectionHeading
                eyebrow="How it works"
                eyebrowIcon={Route}
                title="From blank page to interview-ready"
                subtitle="Four steps. No learning curve. Most people finish a polished resume in under fifteen minutes."
            />

            <div className="relative mt-16">
                {/* Connecting line (desktop) */}
                <div className="absolute left-0 right-0 top-7 hidden h-px bg-line lg:block" aria-hidden="true" />
                <ol className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
                    {STEPS.map((s, i) => (
                        <Reveal key={s.title} delay={i * 0.1} as="li" className="relative">
                            <div className="flex items-center gap-4 lg:block">
                                <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-line bg-surface shadow-ds-sm">
                                    <s.icon className="h-6 w-6 text-accent" />
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        whileInView={{ scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 + 0.2, type: 'spring', stiffness: 400, damping: 20 }}
                                        className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-fg"
                                    >
                                        {i + 1}
                                    </motion.span>
                                </div>
                                <div className="lg:mt-5">
                                    <h3 className="text-base font-semibold text-fg">{s.title}</h3>
                                    <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{s.desc}</p>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </ol>
            </div>
        </Section>
    );
}
