'use client';

import { forwardRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';

/**
 * Button — the primary interactive primitive of the design system.
 *
 * Variants map to semantic tokens so they adapt to light/dark and the accent
 * picker automatically. Every press has a subtle spring via framer-motion
 * (disabled when the OS requests reduced motion — handled by MotionConfig).
 *
 * Props: variant, size, loading, disabled, leftIcon, rightIcon, fullWidth, as.
 */
const VARIANTS = {
    primary:
        'bg-accent text-accent-fg shadow-ds-sm hover:bg-accent-hover border border-transparent',
    secondary:
        'bg-surface-2 text-fg hover:bg-surface-3 border border-line',
    outline:
        'bg-surface text-fg hover:bg-surface-2 border border-line-strong',
    ghost:
        'bg-transparent text-fg-muted hover:bg-surface-2 hover:text-fg border border-transparent',
    danger:
        'bg-red-600 text-white hover:bg-red-500 border border-transparent shadow-ds-sm',
    success:
        'bg-emerald-600 text-white hover:bg-emerald-500 border border-transparent shadow-ds-sm',
    gradient:
        'bg-gradient-to-r from-accent to-indigo-500 text-white shadow-ds-md hover:shadow-ds-lg border border-transparent',
};

const SIZES = {
    xs: 'h-7 px-2.5 text-xs gap-1.5 rounded-lg',
    sm: 'h-8 px-3 text-xs gap-1.5 rounded-lg',
    md: 'h-10 px-4 text-sm gap-2 rounded-xl',
    lg: 'h-11 px-5 text-sm gap-2 rounded-xl',
    xl: 'h-12 px-6 text-base gap-2.5 rounded-2xl',
    icon: 'h-10 w-10 rounded-xl',
    'icon-sm': 'h-8 w-8 rounded-lg',
};

const Button = forwardRef(function Button(
    {
        as: Comp = 'button',
        variant = 'primary',
        size = 'md',
        loading = false,
        disabled = false,
        leftIcon = null,
        rightIcon = null,
        fullWidth = false,
        className = '',
        children,
        ...props
    },
    ref,
) {
    const isDisabled = disabled || loading;
    // Memoise so `motion.create` doesn't produce a new component type each
    // render (which would remount the button and lose focus/state).
    const MotionComp = useMemo(() => motion.create(Comp), [Comp]);

    return (
        <MotionComp
            ref={ref}
            whileTap={isDisabled ? undefined : { scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            disabled={Comp === 'button' ? isDisabled : undefined}
            aria-disabled={isDisabled || undefined}
            aria-busy={loading || undefined}
            className={cn(
                'relative inline-flex select-none items-center justify-center font-semibold',
                'transition-colors duration-200',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas',
                'disabled:cursor-not-allowed disabled:opacity-50',
                fullWidth && 'w-full',
                VARIANTS[variant] || VARIANTS.primary,
                SIZES[size] || SIZES.md,
                className,
            )}
            {...props}
        >
            {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {!loading && leftIcon}
            {children}
            {!loading && rightIcon}
        </MotionComp>
    );
});

export default Button;
