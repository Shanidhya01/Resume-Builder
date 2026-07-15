'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Sparkles,
    ShieldCheck,
    Zap,
    Eye,
    EyeOff,
    AlertCircle,
    CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/cn';

/* ------------------------------------------------------------------ *
 *  AuthShell — premium split layout used by login / register / reset  *
 *  Left: brand + value props (hidden < lg). Right: the form column.    *
 * ------------------------------------------------------------------ */
const HIGHLIGHTS = [
    { icon: Sparkles, title: 'AI-assisted writing', desc: 'Draft bullet points and summaries in seconds.' },
    { icon: ShieldCheck, title: 'ATS-ready by default', desc: 'Every template parses cleanly through recruiter software.' },
    { icon: Zap, title: 'Live preview', desc: 'See changes instantly across premium templates.' },
];

export function AuthShell({ children }) {
    return (
        <div className="grid min-h-[calc(100vh-3rem)] grid-cols-1 lg:grid-cols-[1.05fr_1fr]">
            {/* Brand / marketing panel */}
            <aside className="relative hidden overflow-hidden border-r border-line bg-surface lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
                <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
                <div
                    className="pointer-events-none absolute -left-24 top-1/3 h-96 w-96 rounded-full opacity-30 blur-3xl"
                    style={{ background: 'radial-gradient(circle, rgb(var(--accent)) 0%, transparent 70%)' }}
                    aria-hidden="true"
                />
                <div className="relative">
                    <Link href="/" className="inline-flex items-center gap-2 text-lg font-bold text-fg">
                        <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-accent-fg shadow-ds-md">
                            <Sparkles className="h-5 w-5" />
                        </span>
                        HireReady
                    </Link>
                </div>

                <div className="relative max-w-md">
                    <h2 className="text-3xl font-bold leading-tight tracking-tight text-fg xl:text-4xl">
                        The resume builder that gets you hired.
                    </h2>
                    <p className="mt-4 text-base text-fg-muted">
                        Build an ATS-optimized resume with live preview, AI assistance, and
                        recruiter-grade templates — all in one place.
                    </p>

                    <ul className="mt-10 space-y-5">
                        {HIGHLIGHTS.map(({ icon: Icon, title, desc }, i) => (
                            <motion.li
                                key={title}
                                initial={{ opacity: 0, x: -12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 + i * 0.1, duration: 0.4 }}
                                className="flex gap-4"
                            >
                                <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-surface-2 text-accent">
                                    <Icon className="h-5 w-5" />
                                </span>
                                <div>
                                    <p className="font-semibold text-fg">{title}</p>
                                    <p className="text-sm text-fg-muted">{desc}</p>
                                </div>
                            </motion.li>
                        ))}
                    </ul>
                </div>

                <div className="relative flex items-center gap-3 text-sm text-fg-muted">
                    <div className="flex -space-x-2">
                        {['A', 'M', 'R', 'K'].map((c, i) => (
                            <span
                                key={c}
                                className="grid h-8 w-8 place-items-center rounded-full border-2 border-surface bg-surface-2 text-xs font-semibold text-fg-muted"
                                style={{ zIndex: 4 - i }}
                            >
                                {c}
                            </span>
                        ))}
                    </div>
                    Trusted by job seekers landing roles at top companies.
                </div>
            </aside>

            {/* Form column */}
            <div className="flex items-center justify-center px-4 py-12 sm:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-md"
                >
                    {children}
                </motion.div>
            </div>
        </div>
    );
}

export function AuthHeading({ title, subtitle }) {
    return (
        <div className="mb-8">
            {/* Compact logo for mobile where the brand panel is hidden */}
            <Link href="/" className="mb-8 inline-flex items-center gap-2 font-bold text-fg lg:hidden">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-accent-fg">
                    <Sparkles className="h-4 w-4" />
                </span>
                HireReady
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-fg sm:text-3xl">{title}</h1>
            {subtitle && <p className="mt-2 text-sm text-fg-muted">{subtitle}</p>}
        </div>
    );
}

export function AuthError({ children }) {
    if (!children) return null;
    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-5 flex items-start gap-2 overflow-hidden rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500 dark:text-red-300"
            role="alert"
        >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{children}</span>
        </motion.div>
    );
}

export function AuthSuccess({ children }) {
    return (
        <div
            className="flex items-start gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-300"
            role="status"
        >
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{children}</span>
        </div>
    );
}

const fieldClass =
    'block h-11 w-full rounded-xl border border-line bg-surface-2 px-3.5 text-sm text-fg outline-none transition-colors placeholder:text-fg-subtle focus:border-accent focus:ring-2 focus:ring-accent/30';

export function AuthField({ label, id, hint, ...props }) {
    return (
        <div>
            <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-fg">
                {label}
            </label>
            <input id={id} className={fieldClass} {...props} />
            {hint && <p className="mt-1 text-xs text-fg-subtle">{hint}</p>}
        </div>
    );
}

/* Password field with show/hide toggle and optional strength meter. */
export function PasswordField({ label, id, value, showStrength = false, ...props }) {
    const [visible, setVisible] = useState(false);
    const strength = showStrength ? scorePassword(value) : null;

    return (
        <div>
            <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-fg">
                {label}
            </label>
            <div className="relative">
                <input
                    id={id}
                    type={visible ? 'text' : 'password'}
                    value={value}
                    className={cn(fieldClass, 'pr-11')}
                    {...props}
                />
                <button
                    type="button"
                    onClick={() => setVisible(v => !v)}
                    className="absolute inset-y-0 right-0 grid w-11 place-items-center text-fg-subtle transition-colors hover:text-fg"
                    aria-label={visible ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                >
                    {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
            </div>
            {showStrength && value && (
                <div className="mt-2">
                    <div className="flex gap-1" aria-hidden="true">
                        {[0, 1, 2, 3].map(i => (
                            <span
                                key={i}
                                className={cn(
                                    'h-1 flex-1 rounded-full transition-colors',
                                    i < strength.score ? strength.color : 'bg-surface-3',
                                )}
                            />
                        ))}
                    </div>
                    <p className={cn('mt-1 text-xs', strength.textColor)}>{strength.label}</p>
                </div>
            )}
        </div>
    );
}

export function AuthDivider({ children = 'OR' }) {
    return (
        <div className="my-6 flex items-center gap-3 text-xs font-medium text-fg-subtle">
            <div className="h-px flex-1 bg-line" />
            {children}
            <div className="h-px flex-1 bg-line" />
        </div>
    );
}

/* Lightweight, dependency-free password scorer (presentation only). */
function scorePassword(pw = '') {
    let score = 0;
    if (pw.length >= 6) score++;
    if (pw.length >= 10) score++;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
    if (/\d/.test(pw) || /[^A-Za-z0-9]/.test(pw)) score++;
    const levels = [
        { label: 'Too short', color: 'bg-red-500', textColor: 'text-red-500 dark:text-red-400' },
        { label: 'Weak', color: 'bg-red-500', textColor: 'text-red-500 dark:text-red-400' },
        { label: 'Fair', color: 'bg-amber-500', textColor: 'text-amber-500 dark:text-amber-400' },
        { label: 'Good', color: 'bg-blue-500', textColor: 'text-blue-500 dark:text-blue-400' },
        { label: 'Strong', color: 'bg-emerald-500', textColor: 'text-emerald-500 dark:text-emerald-400' },
    ];
    return { score, ...levels[score] };
}
