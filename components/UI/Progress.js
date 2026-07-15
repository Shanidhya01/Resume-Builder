'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

const clamp = v => Math.max(0, Math.min(100, v || 0));

const TONES = {
    accent: 'bg-accent',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
};

/** Linear progress bar (animated). */
export const Progress = ({ value = 0, tone = 'accent', className = '', barClassName = '' }) => (
    <div
        role="progressbar"
        aria-valuenow={clamp(value)}
        aria-valuemin={0}
        aria-valuemax={100}
        className={cn('h-1.5 w-full overflow-hidden rounded-full bg-surface-2', className)}
    >
        <motion.div
            className={cn('h-full rounded-full', TONES[tone] || TONES.accent, barClassName)}
            initial={{ width: 0 }}
            animate={{ width: `${clamp(value)}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        />
    </div>
);

/**
 * Circular progress ring (animated). Colour auto-derives from the value
 * unless a `tone` is provided.
 */
export const ProgressRing = ({ value = 0, size = 72, stroke = 6, tone, label, className = '' }) => {
    const v = clamp(value);
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    const auto = v >= 80 ? 'text-emerald-500' : v >= 55 ? 'text-accent' : v >= 30 ? 'text-amber-500' : 'text-red-500';
    const color = tone ? { accent: 'text-accent', success: 'text-emerald-500', warning: 'text-amber-500', danger: 'text-red-500' }[tone] : auto;

    return (
        <div className={cn('relative inline-flex items-center justify-center', className)} style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
                <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} className="stroke-surface-2" fill="none" />
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={r}
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    fill="none"
                    className={cn('stroke-current', color)}
                    strokeDasharray={c}
                    initial={{ strokeDashoffset: c }}
                    animate={{ strokeDashoffset: c - (v / 100) * c }}
                    transition={{ duration: 0.9, ease: 'easeOut' }}
                />
            </svg>
            <span className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={cn('text-lg font-bold', color)}>{label ?? Math.round(v)}</span>
            </span>
        </div>
    );
};

export default Progress;
