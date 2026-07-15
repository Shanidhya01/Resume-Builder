'use client';

import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';
import { cn } from '@/lib/cn';

const TONES = {
    info: { icon: Info, cls: 'border-accent/30 bg-accent/5 text-fg', iconCls: 'text-accent' },
    success: { icon: CheckCircle2, cls: 'border-emerald-500/30 bg-emerald-500/5 text-fg', iconCls: 'text-emerald-500' },
    warning: { icon: AlertTriangle, cls: 'border-amber-500/30 bg-amber-500/5 text-fg', iconCls: 'text-amber-500' },
    danger: { icon: XCircle, cls: 'border-red-500/30 bg-red-500/5 text-fg', iconCls: 'text-red-500' },
};

/** Alert — inline contextual message with tone-coded icon. */
const Alert = ({ tone = 'info', title, children, className = '' }) => {
    const { icon: Icon, cls, iconCls } = TONES[tone] || TONES.info;
    return (
        <div role="alert" className={cn('flex gap-3 rounded-xl border p-4', cls, className)}>
            <Icon className={cn('mt-0.5 h-5 w-5 shrink-0', iconCls)} aria-hidden="true" />
            <div className="min-w-0 text-sm">
                {title && <p className="font-semibold text-fg">{title}</p>}
                {children && <div className={cn('text-fg-muted', title && 'mt-0.5')}>{children}</div>}
            </div>
        </div>
    );
};

export default Alert;
