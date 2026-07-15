'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView } from 'framer-motion';
import { cn } from '@/lib/cn';

/**
 * Landing-page shared building blocks. Everything here is presentational and
 * animation-only; all motion respects `prefers-reduced-motion` via the global
 * MotionConfig (context/ThemeProvider.js).
 */

/** Scroll-reveal wrapper: fades + slides children in the first time they enter. */
export function Reveal({ children, delay = 0, y = 24, className = '', as = 'div' }) {
    const Comp = motion[as] || motion.div;
    return (
        <Comp
            initial={{ opacity: 0, y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay, ease: [0.21, 0.5, 0.31, 1] }}
            className={className}
        >
            {children}
        </Comp>
    );
}

/** Count-up number that animates the first time it scrolls into view. */
export function Counter({ value, prefix = '', suffix = '', decimals = 0, duration = 1.8, className = '' }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-60px' });
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        if (!inView) return;
        const controls = animate(0, value, {
            duration,
            ease: 'easeOut',
            onUpdate: v => setDisplay(v),
        });
        return () => controls.stop();
    }, [inView, value, duration]);

    const formatted = display.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });

    return (
        <span ref={ref} className={className}>
            {prefix}
            {formatted}
            {suffix}
        </span>
    );
}

/** Small pill used above section headings. */
export function Eyebrow({ icon: Icon, children, className = '' }) {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-fg-muted shadow-ds-sm',
                className,
            )}
        >
            {Icon && <Icon className="h-3.5 w-3.5 text-accent" />}
            {children}
        </span>
    );
}

/** Centered section header (eyebrow + title + subtitle). */
export function SectionHeading({ eyebrow, eyebrowIcon, title, subtitle, className = '' }) {
    return (
        <div className={cn('mx-auto max-w-2xl text-center', className)}>
            {eyebrow && (
                <Reveal>
                    <Eyebrow icon={eyebrowIcon}>{eyebrow}</Eyebrow>
                </Reveal>
            )}
            <Reveal delay={0.05}>
                <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight text-fg sm:text-4xl">{title}</h2>
            </Reveal>
            {subtitle && (
                <Reveal delay={0.1}>
                    <p className="mx-auto mt-4 max-w-xl text-balance text-base leading-relaxed text-fg-muted">{subtitle}</p>
                </Reveal>
            )}
        </div>
    );
}

/** Subtle glass surface used for floating accents. */
export function GlassCard({ children, className = '' }) {
    return (
        <div
            className={cn(
                'rounded-2xl border border-line/80 bg-surface/70 shadow-ds-lg backdrop-blur-xl',
                className,
            )}
        >
            {children}
        </div>
    );
}

/** Section container with consistent vertical rhythm + max width. */
export function Section({ id, children, className = '' }) {
    return (
        <section id={id} className={cn('mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-28', className)}>
            {children}
        </section>
    );
}
