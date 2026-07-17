'use client';

import { useEffect, useRef } from 'react';

// Shared modal accessibility behavior: focuses `initialFocusRef` on open,
// traps Tab navigation within `containerRef`, closes on Escape, and restores
// focus to whatever triggered the modal on close.
//
// The setup runs exactly ONCE per mount. `onClose` is read through a ref so a
// caller passing an inline `() => ...` (a new function every render) can't make
// this effect tear down and re-run on every render — that re-runs `focus()` and
// the body-overflow toggle each render, which steals clicks and makes the modal
// visibly flicker.
export default function useModalA11y({ containerRef, initialFocusRef, onClose }) {
    const onCloseRef = useRef(onClose);
    // Keep the ref pointed at the latest onClose without making the setup effect
    // depend on it (that dependency is what caused the flicker).
    useEffect(() => {
        onCloseRef.current = onClose;
    });

    useEffect(() => {
        // Capture the trigger element BEFORE we move focus into the modal, so we
        // can restore focus to it on close.
        const previouslyFocused = document.activeElement;
        initialFocusRef?.current?.focus();

        const handleKeyDown = e => {
            if (e.key === 'Escape') {
                onCloseRef.current?.();
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
        // Run once per mount. onClose is read via ref; container/focus refs are
        // stable. Re-running on every render is exactly the flicker bug this avoids.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
}
