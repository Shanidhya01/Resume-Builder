'use client';

import { FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from './Button';

/** EmptyState — friendly zero-data placeholder with an optional primary action. */
const EmptyState = ({ title, description, actionLabel, onAction, icon: Icon = FileText, secondaryAction }) => (
    <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-line bg-surface/60 px-6 py-16 text-center"
    >
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent ring-1 ring-accent/20">
            <Icon className="h-7 w-7" aria-hidden="true" />
        </span>
        <div>
            <h3 className="text-lg font-semibold text-fg">{title}</h3>
            {description && <p className="mx-auto mt-1 max-w-sm text-sm text-fg-muted">{description}</p>}
        </div>
        {(actionLabel && onAction) || secondaryAction ? (
            <div className="mt-1 flex flex-wrap items-center justify-center gap-3">
                {actionLabel && onAction && (
                    <Button variant="primary" size="md" onClick={onAction}>
                        {actionLabel}
                    </Button>
                )}
                {secondaryAction}
            </div>
        ) : null}
    </motion.div>
);

export default EmptyState;
