'use client';

import { useEffect } from 'react';

// Shared modal accessibility behavior: focuses `initialFocusRef` on open,
// traps Tab navigation within `containerRef`, closes on Escape, and restores
// focus to whatever triggered the modal on close.
export default function useModalA11y({ containerRef, initialFocusRef, onClose }) {
    useEffect(() => {
        initialFocusRef?.current?.focus();
        const previouslyFocused = document.activeElement;

        const handleKeyDown = e => {
            if (e.key === 'Escape') {
                onClose();
                return;
            }
            if (e.key !== 'Tab' || !containerRef.current) return;

            const focusable = containerRef.current.querySelectorAll('button, a[href], input, [tabindex]:not([tabindex="-1"])');
            if (focusable.length === 0) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = previousOverflow;
            previouslyFocused?.focus?.();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [onClose]);
}
