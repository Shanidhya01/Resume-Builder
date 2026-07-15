'use client';

import { useId } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

/**
 * Tabs — segmented tab bar with an animated active indicator (shared layoutId).
 *
 * Controlled: pass `value`, `onChange`, and `tabs` = [{ value, label, icon }].
 * Variant `pill` (default) uses a sliding background; `underline` slides a bar.
 */
export default function Tabs({ tabs = [], value, onChange, variant = 'pill', className = '' }) {
    const groupId = useId();

    if (variant === 'underline') {
        return (
            <div role="tablist" className={cn('flex items-center gap-1 border-b border-line', className)}>
                {tabs.map(t => {
                    const active = t.value === value;
                    return (
                        <button
                            key={t.value}
                            role="tab"
                            aria-selected={active}
                            onClick={() => onChange(t.value)}
                            className={cn(
                                'relative px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none',
                                active ? 'text-fg' : 'text-fg-muted hover:text-fg',
                            )}
                        >
                            <span className="flex items-center gap-1.5">
                                {t.icon && <t.icon className="h-4 w-4" />}
                                {t.label}
                            </span>
                            {active && (
                                <motion.span
                                    layoutId={`${groupId}-underline`}
                                    className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-accent"
                                    transition={{ type: 'spring', stiffness: 500, damping: 34 }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>
        );
    }

    return (
        <div role="tablist" className={cn('inline-flex items-center gap-1 rounded-xl border border-line bg-surface-2 p-1', className)}>
            {tabs.map(t => {
                const active = t.value === value;
                return (
                    <button
                        key={t.value}
                        role="tab"
                        aria-selected={active}
                        onClick={() => onChange(t.value)}
                        className={cn(
                            'relative rounded-lg px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                            active ? 'text-fg' : 'text-fg-muted hover:text-fg',
                        )}
                    >
                        {active && (
                            <motion.span
                                layoutId={`${groupId}-pill`}
                                className="absolute inset-0 rounded-lg bg-surface shadow-ds-sm"
                                transition={{ type: 'spring', stiffness: 500, damping: 34 }}
                            />
                        )}
                        <span className="relative flex items-center gap-1.5">
                            {t.icon && <t.icon className="h-4 w-4" />}
                            {t.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
