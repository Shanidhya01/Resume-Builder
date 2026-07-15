'use client';

import { memo, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

const MIN_ZOOM = 1;
const MAX_ZOOM = 2;
const ZOOM_STEP = 0.25;

// Full-size template preview: zoom, cycle to the next/previous template, and
// keyboard navigation (Escape / Arrow keys). Focus is moved into the dialog
// on open and returned to the trigger element on close.
const FOCUSABLE_SELECTOR =
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

const TemplatePreviewModal = ({ templates, activeIndex, onClose, onSelectTemplate, onUseTemplate }) => {
    const [zoom, setZoom] = useState(1);
    const dialogRef = useRef(null);
    const closeButtonRef = useRef(null);
    const triggerElementRef = useRef(typeof document !== 'undefined' ? document.activeElement : null);

    const template = templates[activeIndex];

    useEffect(() => {
        // Snapshot the trigger element at mount so the cleanup returns focus to
        // it even if focus moved around while the dialog was open.
        const triggerElement = triggerElementRef.current;
        closeButtonRef.current?.focus();
        return () => {
            triggerElement?.focus?.();
        };
    }, []);

    // Navigating to another template also resets the zoom level.
    const goToTemplate = index => {
        setZoom(1);
        onSelectTemplate(index);
    };

    useEffect(() => {
        const handleKeyDown = e => {
            if (e.key === 'Escape') {
                onClose();
                return;
            }
            if (e.key === 'ArrowRight') {
                setZoom(1);
                onSelectTemplate((activeIndex + 1) % templates.length);
            }
            if (e.key === 'ArrowLeft') {
                setZoom(1);
                onSelectTemplate((activeIndex - 1 + templates.length) % templates.length);
            }

            // Focus trap: keep Tab/Shift+Tab cycling within the dialog.
            if (e.key === 'Tab') {
                const focusable = dialogRef.current?.querySelectorAll(FOCUSABLE_SELECTOR);
                if (!focusable || focusable.length === 0) return;

                const first = focusable[0];
                const last = focusable[focusable.length - 1];

                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeIndex, templates.length, onClose, onSelectTemplate]);

    if (!template) return null;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label={`${template.name} template preview`}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                ref={dialogRef}
                className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-ds-xl"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-line px-5 py-4">
                    <div>
                        <h2 className="text-lg font-bold text-fg">{template.name}</h2>
                        <p className="text-xs text-fg-muted">{activeIndex + 1} of {templates.length}</p>
                    </div>
                    <button
                        ref={closeButtonRef}
                        type="button"
                        onClick={onClose}
                        aria-label="Close template preview"
                        className="rounded-lg p-2 text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Image viewport */}
                <div className="relative flex-1 overflow-auto bg-canvas p-6">
                    <div
                        className="relative mx-auto aspect-[210/297] w-full max-w-md transition-transform duration-200"
                        style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
                    >
                        <Image
                            src={template.thumbnail}
                            alt={`${template.name} resume template preview`}
                            fill
                            sizes="480px"
                            className="rounded-lg border border-line object-cover shadow-ds-lg"
                            priority
                        />
                    </div>
                </div>

                {/* Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-4">
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => goToTemplate((activeIndex - 1 + templates.length) % templates.length)}
                            aria-label="Previous template"
                            className="rounded-lg p-2 text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            type="button"
                            onClick={() => goToTemplate((activeIndex + 1) % templates.length)}
                            aria-label="Next template"
                            className="rounded-lg p-2 text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setZoom(z => Math.max(MIN_ZOOM, +(z - ZOOM_STEP).toFixed(2)))}
                            disabled={zoom <= MIN_ZOOM}
                            aria-label="Zoom out"
                            className="rounded-lg p-2 text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                        >
                            <ZoomOut size={18} />
                        </button>
                        <span className="w-10 text-center text-xs text-fg-muted">{Math.round(zoom * 100)}%</span>
                        <button
                            type="button"
                            onClick={() => setZoom(z => Math.min(MAX_ZOOM, +(z + ZOOM_STEP).toFixed(2)))}
                            disabled={zoom >= MAX_ZOOM}
                            aria-label="Zoom in"
                            className="rounded-lg p-2 text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                        >
                            <ZoomIn size={18} />
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={() => onUseTemplate(template.id)}
                        className="rounded-xl bg-accent px-5 py-2 text-sm font-semibold text-accent-fg shadow-ds-sm transition-colors hover:bg-accent-hover"
                    >
                        Use this template
                    </button>
                </div>
            </div>
        </div>
    );
};

export default memo(TemplatePreviewModal);
