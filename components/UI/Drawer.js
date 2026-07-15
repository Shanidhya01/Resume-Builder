'use client';

import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';
import useModalA11y from '@/hooks/useModalA11y';
import { useMounted } from '@/hooks/useMounted';

const SIDES = {
    right: { className: 'right-0 top-0 h-full w-full max-w-md border-l', from: { x: '100%' }, to: { x: 0 } },
    left: { className: 'left-0 top-0 h-full w-full max-w-md border-r', from: { x: '-100%' }, to: { x: 0 } },
    bottom: { className: 'bottom-0 left-0 w-full max-h-[85vh] rounded-t-2xl border-t', from: { y: '100%' }, to: { y: 0 } },
};

/**
 * Drawer — slide-in panel (right/left/bottom) rendered in a portal, animated
 * with framer-motion and made accessible via useModalA11y.
 */
export default function Drawer({ open, onClose, title, side = 'right', children, footer, className = '' }) {
    const mounted = useMounted();
    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {open && <DrawerInner onClose={onClose} title={title} side={side} footer={footer} className={className}>{children}</DrawerInner>}
        </AnimatePresence>,
        document.body,
    );
}

function DrawerInner({ onClose, title, side, footer, className, children }) {
    const panelRef = useRef(null);
    const closeRef = useRef(null);
    useModalA11y({ containerRef: panelRef, initialFocusRef: closeRef, onClose });
    const cfg = SIDES[side] || SIDES.right;

    return (
        <div className="fixed inset-0 z-[200]">
            <motion.div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden="true"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
            />
            <motion.div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-label={typeof title === 'string' ? title : 'Panel'}
                initial={cfg.from}
                animate={cfg.to}
                exit={cfg.from}
                transition={{ type: 'spring', stiffness: 360, damping: 34 }}
                className={cn('absolute flex flex-col bg-surface shadow-ds-xl border-line', cfg.className, className)}
            >
                <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
                    <h2 className="text-base font-semibold text-fg">{title}</h2>
                    <button
                        ref={closeRef}
                        onClick={onClose}
                        aria-label="Close panel"
                        className="rounded-lg p-1.5 text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>
                {footer && <div className="border-t border-line px-5 py-3">{footer}</div>}
            </motion.div>
        </div>
    );
}
