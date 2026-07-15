'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HelpCircle, Plus } from 'lucide-react';
import { Section, SectionHeading, Reveal } from './shared';

const FAQS = [
    { q: 'Is HireReady really free?', a: 'Yes. The full editor, AI assistant, ATS analysis, templates, and public sharing are free to use. It is also open source on GitHub.' },
    { q: 'How does the AI assistant work?', a: 'It rewrites bullet points, drafts summaries and cover letters, fixes grammar, and suggests stronger, quantified phrasing — all in the context of your resume and target role.' },
    { q: 'What is an ATS score and why does it matter?', a: 'Applicant Tracking Systems parse and rank resumes before a human sees them. Our score checks keyword coverage, formatting, and readability against a job description so you can optimize before applying.' },
    { q: 'Can I import my existing resume?', a: 'Absolutely. Import from PDF, DOCX or JSON and we will structure it automatically. You can then export to PDF, DOCX, HTML or Markdown at any time.' },
    { q: 'Are public resumes private by default?', a: 'Yes. Nothing is public until you explicitly enable sharing. When you do, you get a live link and QR code, and you can turn it off anytime.' },
    { q: 'Who can see my data?', a: 'Your resumes are stored securely in your account and are never sold or shared. Public sharing is fully opt-in and revocable, and you can delete your data whenever you like.' },
];

function Item({ faq, isOpen, onToggle }) {
    return (
        <div className="border-b border-line">
            <button
                onClick={onToggle}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
            >
                <span className="text-base font-medium text-fg">{faq.q}</span>
                <motion.span animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.2 }} className="shrink-0 text-fg-muted">
                    <Plus className="h-5 w-5" />
                </motion.span>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <p className="pb-5 pr-9 text-sm leading-relaxed text-fg-muted">{faq.a}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function Faq() {
    const [open, setOpen] = useState(0);
    return (
        <Section id="faq">
            <SectionHeading eyebrow="FAQ" eyebrowIcon={HelpCircle} title="Questions, answered" />
            <Reveal delay={0.1} className="mx-auto mt-12 max-w-3xl">
                <div className="rounded-3xl border border-line bg-surface px-6 shadow-ds-sm sm:px-8">
                    {FAQS.map((faq, i) => (
                        <Item key={faq.q} faq={faq} isOpen={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
                    ))}
                </div>
            </Reveal>
        </Section>
    );
}
