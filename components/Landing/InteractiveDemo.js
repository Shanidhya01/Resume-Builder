'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { MousePointerClick, PencilRuler, Target, Wand2, Share2, LayoutTemplate, Check, X, Eye, Download, QrCode } from 'lucide-react';
import templates from '@/config/templates';
import Tabs from '@/components/UI/Tabs';
import Badge from '@/components/UI/Badge';
import { ProgressRing, Progress } from '@/components/UI/Progress';
import { Section, SectionHeading } from './shared';

const TABS = [
    { value: 'editor', label: 'Editor', icon: PencilRuler },
    { value: 'ats', label: 'ATS Score', icon: Target },
    { value: 'ai', label: 'AI Assistant', icon: Wand2 },
    { value: 'public', label: 'Public Page', icon: Share2 },
    { value: 'templates', label: 'Templates', icon: LayoutTemplate },
];

const fade = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: { duration: 0.28 },
};

export default function InteractiveDemo() {
    const [tab, setTab] = useState('editor');

    return (
        <Section id="demo">
            <SectionHeading
                eyebrow="Try it out"
                eyebrowIcon={MousePointerClick}
                title="Explore the product"
                subtitle="A live taste of the real thing — switch tabs to see the editor, scoring, AI, and sharing in action."
            />

            <div className="mt-12 overflow-hidden rounded-3xl border border-line bg-surface shadow-ds-lg">
                <div className="flex justify-center border-b border-line bg-surface-2/40 px-4 py-4">
                    <div className="max-w-full overflow-x-auto">
                        <Tabs tabs={TABS} value={tab} onChange={setTab} />
                    </div>
                </div>

                <div className="min-h-[22rem] p-5 sm:p-8">
                    <AnimatePresence mode="wait">
                        {tab === 'editor' && <motion.div key="editor" {...fade}><EditorDemo /></motion.div>}
                        {tab === 'ats' && <motion.div key="ats" {...fade}><AtsDemo /></motion.div>}
                        {tab === 'ai' && <motion.div key="ai" {...fade}><AiDemo /></motion.div>}
                        {tab === 'public' && <motion.div key="public" {...fade}><PublicDemo /></motion.div>}
                        {tab === 'templates' && <motion.div key="templates" {...fade}><TemplatesDemo /></motion.div>}
                    </AnimatePresence>
                </div>
            </div>
        </Section>
    );
}

function EditorDemo() {
    const fields = [
        { label: 'Full name', value: 'Alex Morgan' },
        { label: 'Role', value: 'Senior Software Engineer' },
        { label: 'Location', value: 'San Francisco, CA' },
    ];
    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
                <p className="text-sm font-semibold text-fg">Contact details</p>
                {fields.map(f => (
                    <div key={f.label}>
                        <label className="text-xs text-fg-muted">{f.label}</label>
                        <div className="mt-1 flex h-10 items-center rounded-lg border border-line bg-surface-2 px-3 text-sm text-fg">{f.value}</div>
                    </div>
                ))}
                <div>
                    <label className="text-xs text-fg-muted">Summary</label>
                    <div className="mt-1 rounded-lg border border-accent/40 bg-surface-2 p-3 text-sm text-fg ring-1 ring-accent/20">
                        Engineer with 8+ years building scalable web platforms
                        <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.7, repeat: Infinity }} className="ml-0.5 inline-block h-4 w-0.5 -translate-y-0.5 bg-accent align-middle" />
                    </div>
                </div>
            </div>
            <div className="rounded-2xl border border-line bg-canvas p-5">
                <div className="h-4 w-32 rounded bg-fg/80" />
                <div className="mt-1.5 h-2.5 w-48 rounded bg-fg-subtle/50" />
                <div className="my-4 h-px w-full bg-line" />
                {[['Experience', [92, 78, 64]], ['Education', [70, 52]]].map(([t, ls]) => (
                    <div key={t} className="mb-4">
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-accent">{t}</p>
                        {ls.map((w, i) => <div key={i} className="mb-1.5 h-2 rounded bg-surface-3" style={{ width: `${w}%` }} />)}
                    </div>
                ))}
            </div>
        </div>
    );
}

function AtsDemo() {
    const matched = ['React', 'TypeScript', 'CI/CD', 'AWS', 'Leadership'];
    const missing = ['Kubernetes', 'GraphQL', 'Terraform'];
    return (
        <div className="grid items-center gap-8 lg:grid-cols-[auto_1fr]">
            <div className="flex flex-col items-center gap-3">
                <ProgressRing value={92} size={140} stroke={10} />
                <Badge tone="success" dot>Strong match</Badge>
            </div>
            <div className="space-y-5">
                <div>
                    <p className="mb-2 text-sm font-semibold text-fg">Matched keywords</p>
                    <div className="flex flex-wrap gap-2">
                        {matched.map(k => (
                            <span key={k} className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                <Check className="h-3 w-3" /> {k}
                            </span>
                        ))}
                    </div>
                </div>
                <div>
                    <p className="mb-2 text-sm font-semibold text-fg">Missing keywords</p>
                    <div className="flex flex-wrap gap-2">
                        {missing.map(k => (
                            <span key={k} className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                                <X className="h-3 w-3" /> {k}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="space-y-2">
                    {[['Keyword coverage', 84], ['Formatting', 96], ['Readability', 90]].map(([l, v]) => (
                        <div key={l}>
                            <div className="mb-1 flex justify-between text-xs"><span className="text-fg-muted">{l}</span><span className="font-semibold text-fg">{v}%</span></div>
                            <Progress value={v} tone={v >= 90 ? 'success' : 'accent'} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function AiDemo() {
    const suggestions = [
        { before: 'Responsible for the team’s work on the app', after: 'Led a 6-engineer team to ship the app 3 weeks early' },
        { before: 'Did testing to improve quality', after: 'Introduced automated tests, cutting production bugs 45%' },
    ];
    return (
        <div className="mx-auto max-w-2xl space-y-4">
            {suggestions.map((s, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.15 }}
                    className="rounded-2xl border border-line bg-surface-2/50 p-4"
                >
                    <div className="flex items-center gap-2 text-xs font-semibold text-fg-muted">
                        <Wand2 className="h-3.5 w-3.5 text-accent" /> AI rewrite
                    </div>
                    <p className="mt-2 text-sm text-fg-muted line-through decoration-red-400/60">{s.before}</p>
                    <p className="mt-1.5 text-sm font-medium text-fg">
                        <span className="mr-1 text-emerald-500">→</span>{s.after}
                    </p>
                </motion.div>
            ))}
        </div>
    );
}

function PublicDemo() {
    return (
        <div className="grid items-center gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-line bg-canvas p-6">
                <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-lg font-bold text-accent-fg">AM</span>
                    <div>
                        <p className="text-base font-semibold text-fg">Alex Morgan</p>
                        <p className="text-xs text-fg-muted">Senior Software Engineer</p>
                    </div>
                </div>
                <div className="mt-4 space-y-2">
                    {[90, 76, 82, 60].map((w, i) => <div key={i} className="h-2 rounded bg-surface-3" style={{ width: `${w}%` }} />)}
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-fg-muted">
                    <span className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-2 py-1"><Eye className="h-3 w-3" /> 1,204 views</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-2 py-1"><Download className="h-3 w-3" /> 318 downloads</span>
                </div>
            </div>
            <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex h-32 w-32 items-center justify-center rounded-2xl border border-line bg-surface-2 text-fg-subtle">
                    <QrCode className="h-20 w-20" />
                </div>
                <p className="max-w-xs text-sm text-fg-muted">Scan to open the live public resume — trackable, always up to date, and SEO-friendly.</p>
                <code className="rounded-lg bg-surface-2 px-3 py-1.5 text-xs text-accent">hireready.app/r/alex-morgan</code>
            </div>
        </div>
    );
}

function TemplatesDemo() {
    const [idx, setIdx] = useState(0);
    const active = templates[idx];
    return (
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div className="flex flex-wrap gap-2">
                {templates.map((t, i) => (
                    <button
                        key={t.id}
                        onClick={() => setIdx(i)}
                        className={`rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                            i === idx ? 'border-accent bg-accent/10 text-accent' : 'border-line text-fg-muted hover:bg-surface-2 hover:text-fg'
                        }`}
                    >
                        {t.name}
                    </button>
                ))}
            </div>
            <div className="justify-self-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={active.id}
                        initial={{ opacity: 0, rotateY: -12, scale: 0.96 }}
                        animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                        exit={{ opacity: 0, rotateY: 12, scale: 0.96 }}
                        transition={{ duration: 0.35 }}
                        className="relative w-52 overflow-hidden rounded-xl border border-line bg-surface shadow-ds-lg"
                    >
                        <Image src={active.thumbnail} alt={`${active.name} template`} width={208} height={269} className="h-auto w-full" />
                        <div className="absolute right-2 top-2">
                            <Badge tone="accent" size="sm">ATS {active.atsScore}</Badge>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
