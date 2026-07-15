'use client';

import { cn } from '@/lib/cn';

/**
 * Badge — compact status/label pill. `tone` selects colour; `dot` prepends a
 * status dot; `size` controls density.
 */
const TONES = {
    neutral: { pill: 'bg-surface-2 text-fg-muted border-line', dot: 'bg-fg-subtle' },
    accent: { pill: 'bg-accent/10 text-accent border-accent/25', dot: 'bg-accent' },
    success: { pill: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25', dot: 'bg-emerald-500' },
    warning: { pill: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25', dot: 'bg-amber-500' },
    danger: { pill: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/25', dot: 'bg-red-500' },
    info: { pill: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25', dot: 'bg-blue-500' },
};

const SIZES = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-0.5 text-xs',
};

const Badge = ({ children, tone = 'neutral', size = 'md', dot = false, className = '', ...props }) => {
    const t = TONES[tone] || TONES.neutral;
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 rounded-full border font-semibold',
                SIZES[size] || SIZES.md,
                t.pill,
                className,
            )}
            {...props}
        >
            {dot && <span className={cn('h-1.5 w-1.5 rounded-full', t.dot)} aria-hidden="true" />}
            {children}
        </span>
    );
};

export default Badge;
