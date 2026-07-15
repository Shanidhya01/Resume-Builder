'use client';

import { cn } from '@/lib/cn';

/**
 * Card — theme-aware surface container.
 *
 * Variants:
 *  - default:     hairline border + subtle shadow
 *  - elevated:    stronger shadow, for floating panels
 *  - interactive: lifts + accent border on hover (use for links/clickable)
 *  - ghost:       no border/shadow, just a surface tint
 *
 * Optional header (title + subtitle + action) and footer slots.
 */
const VARIANTS = {
    default: 'border border-line bg-surface shadow-ds-sm',
    elevated: 'border border-line bg-surface shadow-ds-lg',
    interactive:
        'border border-line bg-surface shadow-ds-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-ds-md',
    ghost: 'border border-transparent bg-surface-2',
};

const Card = ({
    title,
    subtitle,
    action,
    footer,
    children,
    variant = 'default',
    className = '',
    bodyClassName = '',
    padded = true,
    as: Comp = 'div',
    ...props
}) => (
    <Comp
        className={cn('rounded-2xl', VARIANTS[variant] || VARIANTS.default, className)}
        {...props}
    >
        {(title || action) && (
            <div className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
                <div className="min-w-0">
                    {title && <h3 className="truncate text-sm font-semibold text-fg">{title}</h3>}
                    {subtitle && <p className="mt-0.5 truncate text-xs text-fg-muted">{subtitle}</p>}
                </div>
                {action && <div className="shrink-0">{action}</div>}
            </div>
        )}
        <div className={cn(padded && 'p-5', bodyClassName)}>{children}</div>
        {footer && <div className="border-t border-line px-5 py-3">{footer}</div>}
    </Comp>
);

export default Card;
