'use client';

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import Avatar from '@/components/UI/Avatar';
import { Section, SectionHeading } from './shared';

const REVIEWS = [
    { name: 'Priya Sharma', role: 'Software Engineer', company: 'Stripe', rating: 5, quote: 'The ATS score jumped from 61 to 94 after two rounds of AI suggestions. I had three callbacks the same week.' },
    { name: 'Daniel Okafor', role: 'Product Manager', company: 'Notion', rating: 5, quote: 'The editor feels like a real design tool. I built a recruiter-ready resume in one sitting and shared a public link instantly.' },
    { name: 'Mei Lin', role: 'UX Designer', company: 'Figma', rating: 5, quote: 'The Creative template plus the AI rewrites made my bullets actually sound impactful. Best free tool I have used.' },
    { name: 'Carlos Mendes', role: 'Data Analyst', company: 'Spotify', rating: 5, quote: 'Keyword matching told me exactly what my resume was missing for each role. Genuinely a competitive edge.' },
    { name: 'Aisha Rahman', role: 'Marketing Lead', company: 'Airbnb', rating: 5, quote: 'Import from my old PDF, one-click cleanup, done. The whole thing felt premium and fast.' },
];

export default function Testimonials() {
    const [i, setI] = useState(0);
    const n = REVIEWS.length;

    const go = useCallback(dir => setI(prev => (prev + dir + n) % n), [n]);

    useEffect(() => {
        const id = setInterval(() => setI(prev => (prev + 1) % n), 6000);
        return () => clearInterval(id);
    }, [n]);

    const r = REVIEWS[i];

    return (
        <Section id="testimonials">
            <SectionHeading eyebrow="Loved by job seekers" eyebrowIcon={Star} title="Results people can feel" />

            <div className="relative mx-auto mt-12 max-w-3xl">
                <div className="overflow-hidden rounded-3xl border border-line bg-surface p-8 shadow-ds-lg sm:p-12">
                    <Quote className="h-9 w-9 text-accent/30" />
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -16 }}
                            transition={{ duration: 0.35 }}
                        >
                            <div className="mt-3 flex gap-0.5">
                                {[...Array(r.rating)].map((_, s) => <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                            </div>
                            <p className="mt-4 text-lg font-medium leading-relaxed text-fg text-balance">“{r.quote}”</p>
                            <div className="mt-6 flex items-center gap-3">
                                <Avatar name={r.name} size="md" />
                                <div>
                                    <p className="text-sm font-semibold text-fg">{r.name}</p>
                                    <p className="text-xs text-fg-muted">{r.role} · {r.company}</p>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="mt-6 flex items-center justify-center gap-4">
                    <button onClick={() => go(-1)} aria-label="Previous testimonial" className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg">
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <div className="flex gap-1.5">
                        {REVIEWS.map((_, d) => (
                            <button
                                key={d}
                                onClick={() => setI(d)}
                                aria-label={`Go to testimonial ${d + 1}`}
                                className={`h-2 rounded-full transition-all ${d === i ? 'w-6 bg-accent' : 'w-2 bg-line-strong hover:bg-fg-subtle'}`}
                            />
                        ))}
                    </div>
                    <button onClick={() => go(1)} aria-label="Next testimonial" className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg">
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </Section>
    );
}
