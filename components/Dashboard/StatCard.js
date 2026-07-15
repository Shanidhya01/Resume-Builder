'use client';

import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Progress } from '@/components/UI/Progress';

/**
 * StatCard — compact metric tile for the dashboard overview. Theme-aware, with
 * an optional progress bar, hint line and delta indicator.
 */
const StatCard = ({ icon: Icon, label, value, hint, progress = null, delta = null, accent = false, className = '' }) => {
    const deltaUp = typeof delta === 'number' ? delta >= 0 : null;
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className={cn(
                'group rounded-2xl border bg-surface p-4 shadow-ds-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-ds-md',
                accent ? 'border-accent/40 ring-1 ring-accent/20' : 'border-line',
                className,
            )}
        >
            <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-fg-subtle">{label}</span>
                {Icon && (
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent transition-transform group-hover:scale-110">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                )}
            </div>
            <div className="mt-2 flex items-baseline gap-2">
                <p className="text-2xl font-bold tracking-tight text-fg">{value}</p>
                {deltaUp !== null && (
                    <span className={cn('inline-flex items-center gap-0.5 text-xs font-semibold', deltaUp ? 'text-emerald-500' : 'text-red-500')}>
                        {deltaUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        {Math.abs(delta)}%
                    </span>
                )}
            </div>
            {hint && <p className="mt-0.5 text-xs text-fg-muted">{hint}</p>}
            {progress != null && <Progress value={progress} className="mt-3" />}
        </motion.div>
    );
};

export default StatCard;
