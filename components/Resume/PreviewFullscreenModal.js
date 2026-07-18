'use client';

import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X, Download, Printer } from 'lucide-react';
import useModalA11y from '@/hooks/useModalA11y';

/**
 * True in-page fullscreen preview, replacing the old `window.open()` popup.
 * Displays the already-generated PDF blob (`url`) in an `<iframe>` — no
 * change to how the PDF itself is produced (`usePDF` in `Preview.js`).
 */
const PreviewFullscreenModal = ({ url, filename, onClose }) => {
    const containerRef = useRef(null);
    const closeButtonRef = useRef(null);

    useModalA11y({ containerRef, initialFocusRef: closeButtonRef, onClose });

    const handlePrint = () => {
        const win = window.open(url, '_blank');
        win?.addEventListener('load', () => win.print());
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={onClose}>
            <motion.div
                ref={containerRef}
                role="dialog"
                aria-modal="true"
                aria-label="Fullscreen resume preview"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.18 }}
                onClick={e => e.stopPropagation()}
                className="flex h-full w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-ds-xl"
            >
                <div className="flex items-center justify-between border-b border-line bg-surface-2/60 px-4 py-2.5">
                    <span className="text-sm font-semibold text-fg">Resume Preview</span>
                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            onClick={handlePrint}
                            title="Print"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-surface-3 hover:text-fg"
                        >
                            <Printer className="h-4 w-4" />
                        </button>
                        <a
                            href={url}
                            download={filename}
                            title="Download"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-surface-3 hover:text-fg"
                        >
                            <Download className="h-4 w-4" />
                        </a>
                        <button
                            ref={closeButtonRef}
                            type="button"
                            onClick={onClose}
                            aria-label="Close fullscreen preview"
                            title="Close (Esc)"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-surface-3 hover:text-fg"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
                <iframe src={url} title="Resume preview" className="min-h-0 flex-1 bg-canvas" />
            </motion.div>
        </div>,
        document.body,
    );
};

export default PreviewFullscreenModal;
