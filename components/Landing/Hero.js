'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, Play, Sparkles, Star, CheckCircle2, FileText, Wand2, ShieldCheck } from 'lucide-react';
import Button from '@/components/UI/Button';
import { ProgressRing } from '@/components/UI/Progress';

const TRUST = ['ATS-friendly', 'No credit card', 'Open source', 'Free forever'];

export default function Hero() {
    const reduce = useReducedMotion();
    const ref = useRef(null);
    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const sx = useSpring(mx, { stiffness: 120, damping: 20 });
    const sy = useSpring(my, { stiffness: 120, damping: 20 });

    const onMove = e => {
        if (reduce || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
    };
    const onLeave = () => {
        mx.set(0);
        my.set(0);
    };

    // Depth layers (different parallax magnitudes). Inlined so the hook call
    // order is stable (rules-of-hooks); magnitude 0 when reduced motion is on.
    const m = reduce ? 0 : 1;
    const layerMain = useTransform([sx, sy], ([x, y]) => `translate3d(${x * 18 * m}px, ${y * 18 * m}px, 0)`);
    const layerAts = useTransform([sx, sy], ([x, y]) => `translate3d(${x * 42 * m}px, ${y * 42 * m}px, 0)`);
    const layerAi = useTransform([sx, sy], ([x, y]) => `translate3d(${x * 60 * m}px, ${y * 60 * m}px, 0)`);
    const layerGlow = useTransform([sx, sy], ([x, y]) => `translate3d(${x * -26 * m}px, ${y * -26 * m}px, 0)`);

    return (
        <section ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className="relative overflow-hidden">
            {/* Background: grid + animated accent aurora */}
            <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.5] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" aria-hidden="true" />
            <motion.div style={{ transform: layerGlow }} className="pointer-events-none absolute inset-0" aria-hidden="true">
                <div className="absolute -top-32 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-accent/20 blur-[120px] animate-gradient-x" />
                <div className="absolute right-0 top-40 h-80 w-80 rounded-full bg-indigo-500/15 blur-[100px]" />
            </motion.div>

            <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 pb-24 pt-16 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:pt-24">
                {/* Copy */}
                <div className="text-center lg:text-left">
                    <motion.span
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-fg-muted shadow-ds-sm"
                    >
                        <span className="flex items-center gap-1.5 text-accent"><Sparkles className="h-3.5 w-3.5" /> AI-powered</span>
                        <span className="h-1 w-1 rounded-full bg-fg-subtle" />
                        <span>Free &amp; open source</span>
                    </motion.span>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.05 }}
                        className="mt-6 text-balance text-4xl font-bold tracking-tight text-fg sm:text-5xl lg:text-6xl"
                    >
                        Build a resume that{' '}
                        <span className="bg-gradient-to-r from-accent to-indigo-500 bg-clip-text text-transparent">gets interviews</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.12 }}
                        className="mx-auto mt-5 max-w-xl text-balance text-base leading-relaxed text-fg-muted sm:text-lg lg:mx-0"
                    >
                        Craft ATS-optimized resumes with an AI writing assistant, real-time scoring, premium templates,
                        and one-click sharing — all in a fast, modern editor.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.19 }}
                        className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start"
                    >
                        <Button as={Link} href="/register" variant="primary" size="xl" fullWidth className="sm:w-auto" rightIcon={<ArrowRight className="h-4 w-4" />}>
                            Start Building Free
                        </Button>
                        <Button as="a" href="#demo" variant="outline" size="xl" fullWidth className="sm:w-auto" leftIcon={<Play className="h-4 w-4" />}>
                            View Live Demo
                        </Button>
                    </motion.div>

                    <motion.ul
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.28 }}
                        className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 lg:justify-start"
                    >
                        {TRUST.map(t => (
                            <li key={t} className="flex items-center gap-1.5 text-sm text-fg-muted">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> {t}
                            </li>
                        ))}
                    </motion.ul>
                </div>

                {/* Product preview cluster */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.94, y: 24 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.15, ease: [0.21, 0.5, 0.31, 1] }}
                    className="relative mx-auto w-full max-w-lg"
                >
                    {/* Main editor window */}
                    <motion.div style={{ transform: layerMain }} className="relative">
                        <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-ds-xl">
                            {/* Window chrome */}
                            <div className="flex items-center gap-2 border-b border-line bg-surface-2/60 px-4 py-3">
                                <span className="h-3 w-3 rounded-full bg-red-400/80" />
                                <span className="h-3 w-3 rounded-full bg-amber-400/80" />
                                <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
                                <span className="ml-3 inline-flex items-center gap-1.5 rounded-md bg-surface px-2 py-1 text-[11px] font-medium text-fg-muted">
                                    <FileText className="h-3 w-3 text-accent" /> Senior_Engineer.pdf
                                </span>
                            </div>
                            {/* Fake resume body */}
                            <div className="space-y-4 p-5">
                                <div>
                                    <div className="h-4 w-40 rounded bg-fg/80" />
                                    <div className="mt-1.5 h-2.5 w-56 rounded bg-fg-subtle/50" />
                                </div>
                                <div className="h-px w-full bg-line" />
                                {[
                                    { label: 'Experience', lines: [92, 80, 68] },
                                    { label: 'Projects', lines: [88, 72] },
                                ].map(block => (
                                    <div key={block.label} className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-sm bg-accent" />
                                            <span className="text-[11px] font-semibold uppercase tracking-wide text-fg-muted">{block.label}</span>
                                        </div>
                                        {block.lines.map((w, i) => (
                                            <div key={i} className="h-2 rounded bg-surface-3" style={{ width: `${w}%` }} />
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Floating ATS score card (parallax outer, float inner) */}
                    <motion.div style={{ transform: layerAts }} className="absolute -right-4 -top-6 sm:-right-8">
                        <motion.div
                            animate={reduce ? undefined : { y: [0, -10, 0] }}
                            transition={reduce ? undefined : { duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                            className="rounded-2xl border border-line bg-surface/90 p-3 shadow-ds-lg backdrop-blur-xl"
                        >
                            <div className="flex items-center gap-3">
                                <ProgressRing value={92} size={54} stroke={5} label="92" />
                                <div>
                                    <p className="flex items-center gap-1 text-xs font-semibold text-fg"><ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> ATS Score</p>
                                    <p className="text-[11px] text-fg-muted">Excellent match</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Floating AI assistant card (parallax outer, float inner) */}
                    <motion.div style={{ transform: layerAi }} className="absolute -bottom-8 -left-3 max-w-[15rem] sm:-left-8">
                        <motion.div
                            animate={reduce ? undefined : { y: [0, 12, 0] }}
                            transition={reduce ? undefined : { duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
                            className="rounded-2xl border border-line bg-surface/90 p-3 shadow-ds-lg backdrop-blur-xl"
                        >
                            <div className="flex items-start gap-2.5">
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-fg">
                                    <Wand2 className="h-3.5 w-3.5" />
                                </span>
                                <div>
                                    <p className="text-[11px] font-semibold text-fg">AI suggestion</p>
                                    <p className="mt-0.5 text-[11px] leading-snug text-fg-muted">
                                        “Led migration cutting load time <span className="font-semibold text-emerald-500">40%</span>.”
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Rating chip */}
                    <motion.div
                        style={{ transform: layerAts }}
                        className="absolute -bottom-5 right-2 flex items-center gap-1 rounded-full border border-line bg-surface/90 px-2.5 py-1 shadow-ds-md backdrop-blur-xl"
                    >
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
