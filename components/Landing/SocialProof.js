'use client';

import { FileText, TrendingUp, Wand2, Share2, Users, Star } from 'lucide-react';
import { Counter, Reveal } from './shared';

const STATS = [
    { icon: FileText, value: 128, suffix: 'K+', label: 'Resumes created' },
    { icon: TrendingUp, value: 37, suffix: '%', label: 'Avg. ATS lift' },
    { icon: Wand2, value: 2.1, suffix: 'M', decimals: 1, label: 'AI suggestions' },
    { icon: Share2, value: 24, suffix: 'K+', label: 'Public resumes' },
    { icon: Users, value: 41, suffix: 'K+', label: 'Happy users' },
    { icon: Star, value: 1.2, suffix: 'K', decimals: 1, label: 'GitHub stars' },
];

export default function SocialProof() {
    return (
        <div className="border-y border-line bg-surface/40">
            <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px overflow-hidden px-4 py-2 sm:grid-cols-3 sm:px-6 lg:grid-cols-6">
                {STATS.map((s, i) => (
                    <Reveal key={s.label} delay={i * 0.06} className="px-4 py-6 text-center">
                        <s.icon className="mx-auto h-5 w-5 text-accent" />
                        <p className="mt-3 text-2xl font-bold tracking-tight text-fg sm:text-3xl">
                            <Counter value={s.value} suffix={s.suffix} decimals={s.decimals || 0} />
                        </p>
                        <p className="mt-1 text-xs text-fg-muted">{s.label}</p>
                    </Reveal>
                ))}
            </div>
        </div>
    );
}
