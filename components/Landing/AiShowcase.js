'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Wand2, Sparkles, FileText, SpellCheck, ListChecks, Mail } from 'lucide-react';
import { Section, Reveal, Eyebrow } from './shared';

const CAPS = [
    { icon: FileText, label: 'Rewrite bullets' },
    { icon: SpellCheck, label: 'Fix grammar' },
    { icon: ListChecks, label: 'Improve impact' },
    { icon: Sparkles, label: 'Generate summary' },
    { icon: Mail, label: 'Cover letters' },
];

const FULL = 'Led the platform migration to a microservices architecture, cutting average page load time by 40% and enabling 3× faster deploys across the engineering org.';

function useTypewriter(text, start, speed = 18) {
    const [out, setOut] = useState('');
    useEffect(() => {
        if (!start) return;
        let i = 0;
        const id = setInterval(() => {
            i += 1;
            setOut(text.slice(0, i));
            if (i >= text.length) clearInterval(id);
        }, speed);
        return () => clearInterval(id);
    }, [text, start, speed]);
    return out;
}

export default function AiShowcase() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-100px' });
    const typed = useTypewriter(FULL, inView);
    const done = typed.length >= FULL.length;

    return (
        <Section id="ai">
            <div className="grid items-center gap-12 lg:grid-cols-2">
                <div className="lg:order-2">
                    <Reveal><Eyebrow icon={Wand2}>AI assistant</Eyebrow></Reveal>
                    <Reveal delay={0.05}><h2 className="mt-4 text-3xl font-bold tracking-tight text-fg sm:text-4xl">A writing partner that knows resumes</h2></Reveal>
                    <Reveal delay={0.1}><p className="mt-4 text-base leading-relaxed text-fg-muted">Turn plain descriptions into sharp, quantified achievements. Fix grammar, generate summaries, and draft cover letters — all in context, all in one click.</p></Reveal>
                    <Reveal delay={0.15}>
                        <div className="mt-6 flex flex-wrap gap-2">
                            {CAPS.map(c => (
                                <span key={c.label} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-medium text-fg-muted">
                                    <c.icon className="h-3.5 w-3.5 text-accent" /> {c.label}
                                </span>
                            ))}
                        </div>
                    </Reveal>
                </div>

                <Reveal delay={0.1} className="lg:order-1">
                    <div ref={ref} className="overflow-hidden rounded-3xl border border-line bg-surface shadow-ds-lg">
                        <div className="flex items-center gap-2 border-b border-line bg-surface-2/50 px-4 py-3">
                            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-accent text-accent-fg"><Wand2 className="h-3.5 w-3.5" /></span>
                            <span className="text-sm font-semibold text-fg">AI Assistant</span>
                        </div>
                        <div className="space-y-4 p-5">
                            {/* User message */}
                            <div className="flex justify-end">
                                <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-accent px-4 py-2.5 text-sm text-accent-fg">
                                    Rewrite this: “worked on migrating our app and made it faster”
                                </div>
                            </div>
                            {/* AI message (typing) */}
                            <div className="flex justify-start">
                                <div className="max-w-[85%] rounded-2xl rounded-bl-sm border border-line bg-surface-2 px-4 py-3 text-sm text-fg">
                                    {typed}
                                    {!done && (
                                        <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.6, repeat: Infinity }} className="ml-0.5 inline-block h-4 w-0.5 -translate-y-0.5 bg-accent align-middle" />
                                    )}
                                    {done && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-3 flex items-center gap-2 border-t border-line pt-3 text-xs text-fg-muted"
                                        >
                                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 font-medium text-emerald-500">+2 strong verbs</span>
                                            <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 font-medium text-accent">quantified</span>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </Reveal>
            </div>
        </Section>
    );
}
