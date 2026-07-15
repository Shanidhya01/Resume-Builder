'use client';

import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaCheckCircle, FaExclamationCircle, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';

const ToastContext = createContext(null);

const TONE_ICON = {
    success: FaCheckCircle,
    error: FaExclamationCircle,
    warning: FaExclamationTriangle,
    info: FaInfoCircle,
};

// Theme-aware tones (dark: variants now resolve since next-themes toggles .dark).
const TONE_STYLE = {
    success: 'border-green-500/30 bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-200',
    error: 'border-red-500/30 bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-200',
    warning: 'border-amber-500/30 bg-amber-50 text-amber-800 dark:bg-amber-500/10 dark:text-amber-200',
    info: 'border-blue-500/30 bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-200',
};

const DEFAULT_DURATION_MS = 3500;

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const idRef = useRef(0);
    const timers = useRef(new Map());

    const dismiss = useCallback(id => {
        const timer = timers.current.get(id);
        if (timer) {
            clearTimeout(timer);
            timers.current.delete(id);
        }
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    /**
     * showToast(message, options)
     *   tone:     'success' | 'error' | 'warning' | 'info'
     *   duration: ms before auto-dismiss (0 = sticky)
     *   action:   { label, onClick } — renders a button; also used for undo
     */
    const showToast = useCallback(
        (message, { tone = 'info', duration = DEFAULT_DURATION_MS, action = null } = {}) => {
            idRef.current += 1;
            const id = idRef.current;
            setToasts(prev => [...prev, { id, message, tone, action }]);
            if (duration > 0) {
                const timer = setTimeout(() => dismiss(id), duration);
                timers.current.set(id, timer);
            }
            return id;
        },
        [dismiss],
    );

    // Convenience helpers for the common tones.
    const helpers = useMemo(
        () => ({
            success: (m, o) => showToast(m, { ...o, tone: 'success' }),
            error: (m, o) => showToast(m, { ...o, tone: 'error' }),
            warning: (m, o) => showToast(m, { ...o, tone: 'warning' }),
            info: (m, o) => showToast(m, { ...o, tone: 'info' }),
        }),
        [showToast],
    );

    const value = useMemo(() => ({ showToast, dismiss, ...helpers }), [showToast, dismiss, helpers]);

    return (
        <ToastContext.Provider value={value}>
            {children}
            <div
                aria-live="polite"
                aria-atomic="false"
                className="pointer-events-none fixed inset-x-0 bottom-4 z-[200] flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:left-auto sm:right-6 sm:items-end"
            >
                <AnimatePresence initial={false}>
                    {toasts.map(toast => {
                        const Icon = TONE_ICON[toast.tone] || FaInfoCircle;
                        return (
                            <motion.div
                                key={toast.id}
                                layout
                                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 24, scale: 0.96 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                role="status"
                                className={`pointer-events-auto flex w-full max-w-sm items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-medium shadow-2xl backdrop-blur-md ${
                                    TONE_STYLE[toast.tone] || TONE_STYLE.info
                                }`}
                            >
                                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                                <span className="flex-1">{toast.message}</span>
                                {toast.action && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            toast.action.onClick?.();
                                            dismiss(toast.id);
                                        }}
                                        className="shrink-0 rounded-md border border-current/30 px-2 py-0.5 text-xs font-bold uppercase tracking-wide hover:bg-current/10"
                                    >
                                        {toast.action.label}
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => dismiss(toast.id)}
                                    aria-label="Dismiss notification"
                                    className="shrink-0 rounded-md px-1.5 py-0.5 text-xs opacity-60 hover:bg-current/10 hover:opacity-100"
                                >
                                    ✕
                                </button>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within a ToastProvider.');
    return ctx;
};
