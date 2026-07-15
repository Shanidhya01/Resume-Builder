'use client';

import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';
import useModalA11y from '@/hooks/useModalA11y';
import { useMounted } from '@/hooks/useMounted';

const SIZES = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
};

/**
 * Modal — accessible, animated dialog rendered in a portal.
 *
 * Handles focus trap, Escape-to-close, scroll lock and backdrop click via the
 * shared useModalA11y hook. Controlled by the `open` prop.
 */
export default function Modal({
    open,
    onClose,
    title,
    description,
    children,
    footer,
    size = 'md',
    showClose = true,
    className = '',
}) {
    const mounted = useMounted();
    const panelRef = useRef(null);
    const closeRef = useRef(null);

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {open && (
                <ModalInner
                    onClose={onClose}
                    title={title}
                    description={description}
                    footer={footer}
                    size={size}
                    showClose={showClose}
                    className={className}
                    panelRef={panelRef}
                    closeRef={closeRef}
                >
                    {children}
                </ModalInner>
            )}
        </AnimatePresence>,
        document.body,
    );
}

function ModalInner({ onClose, title, description, footer, size, showClose, className, children, panelRef, closeRef }) {
    useModalA11y({ containerRef: panelRef, initialFocusRef: closeRef, onClose });

    return (
        <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
        >
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden="true"
            />
            <motion.div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-label={typeof title === 'string' ? title : undefined}
                initial={{ opacity: 0, scale: 0.96, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 4 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className={cn(
                    'relative z-10 w-full overflow-hidden rounded-2xl border border-line bg-surface shadow-ds-xl',
                    SIZES[size] || SIZES.md,
                    className,
                )}
            >
                {(title || showClose) && (
                    <div className="flex items-start justify-between gap-4 px-6 pt-5">
                        <div className="min-w-0">
                            {title && <h2 className="text-lg font-semibold text-fg">{title}</h2>}
                            {description && <p className="mt-1 text-sm text-fg-muted">{description}</p>}
                        </div>
                        {showClose && (
                            <button
                                ref={closeRef}
                                onClick={onClose}
                                aria-label="Close dialog"
                                className="-mr-1.5 -mt-1 rounded-lg p-1.5 text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                )}
                <div className="px-6 py-5">{children}</div>
                {footer && (
                    <div className="flex justify-end gap-3 border-t border-line bg-surface-2/50 px-6 py-4">
                        {footer}
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
}
