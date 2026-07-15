'use client';

import { Target, Check, Lightbulb, TrendingUp } from 'lucide-react';
import { ProgressRing, Progress } from '@/components/UI/Progress';
import { Section, Reveal, Eyebrow } from './shared';

const BREAKDOWN = [
    { label: 'Keyword match', value: 88 },
    { label: 'Formatting', value: 96 },
    { label: 'Readability', value: 91 },
    { label: 'Section coverage', value: 82 },
];

const TIPS = [
    'Add “Kubernetes” and “GraphQL” — both appear in the job description.',
    'Lead 3 bullets with measurable outcomes (%, $, time saved).',
    'Move the Skills section above Education for this role.',
    'Shorten the summary to 2 lines for faster recruiter scanning.',
];

export default function AtsShowcase() {
    return (
        <Section id="ats">
            <div className="grid items-center gap-12 lg:grid-cols-2">
                <div>
                    <Reveal><Eyebrow icon={Target}>ATS intelligence</Eyebrow></Reveal>
                    <Reveal delay={0.05}><h2 className="mt-4 text-3xl font-bold tracking-tight text-fg sm:text-4xl">Beat the bots before a human ever reads it</h2></Reveal>
                    <Reveal delay={0.1}><p className="mt-4 text-base leading-relaxed text-fg-muted">Paste any job description and get an instant, explainable score — with the exact keywords, formatting fixes, and recruiter tips to push it higher.</p></Reveal>

                    <Reveal delay={0.15}>
                        <ul className="mt-6 space-y-3">
                            {TIPS.map(tip => (
                                <li key={tip} className="flex items-start gap-3 text-sm text-fg-muted">
                                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                                        <Lightbulb className="h-3 w-3" />
                                    </span>
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </Reveal>
                </div>

                <Reveal delay={0.1}>
                    <div className="rounded-3xl border border-line bg-surface p-6 shadow-ds-lg sm:p-8">
                        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
                            <ProgressRing value={92} size={128} stroke={9} />
                            <div className="flex-1">
                                <p className="flex items-center gap-1.5 text-sm font-semibold text-emerald-500"><TrendingUp className="h-4 w-4" /> +37 pts vs. first draft</p>
                                <p className="mt-1 text-sm text-fg-muted">Your resume matches this Senior Engineer role with an excellent overall score.</p>
                            </div>
                        </div>

                        <div className="mt-6 space-y-3.5">
                            {BREAKDOWN.map(b => (
                                <div key={b.label}>
                                    <div className="mb-1 flex justify-between text-xs">
                                        <span className="text-fg-muted">{b.label}</span>
                                        <span className="font-semibold text-fg">{b.value}%</span>
                                    </div>
                                    <Progress value={b.value} tone={b.value >= 90 ? 'success' : 'accent'} />
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 flex flex-wrap gap-2 border-t border-line pt-5">
                            {['React', 'TypeScript', 'AWS', 'CI/CD', 'Leadership'].map(k => (
                                <span key={k} className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                    <Check className="h-3 w-3" /> {k}
                                </span>
                            ))}
                        </div>
                    </div>
                </Reveal>
            </div>
        </Section>
    );
}
