'use client';

import { useState, useId } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/cn';

const SIDES = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

/**
 * Tooltip — hover/focus label. Wraps a single interactive child. Purely
 * presentational (uses aria-describedby); not for critical content.
 */
export default function Tooltip({ label, side = 'top', children, className = '' }) {
    const [open, setOpen] = useState(false);
    const id = useId();

    if (!label) return children;

    return (
        <span
            className="relative inline-flex"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
        >
            <span aria-describedby={open ? id : undefined}>{children}</span>
            <AnimatePresence>
                {open && (
                    <motion.span
                        role="tooltip"
                        id={id}
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.92 }}
                        transition={{ duration: 0.12 }}
                        className={cn(
                            'pointer-events-none absolute z-[300] whitespace-nowrap rounded-lg border border-line-strong bg-surface px-2.5 py-1.5',
                            'text-xs font-medium text-fg shadow-ds-lg',
                            SIDES[side] || SIDES.top,
                            className,
                        )}
                    >
                        {label}
                    </motion.span>
                )}
            </AnimatePresence>
        </span>
    );
}
