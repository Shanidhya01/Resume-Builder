'use client';

import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';

const ToastContext = createContext(null);

const TONE_ICON = {
    success: FaCheckCircle,
    error: FaExclamationCircle,
    info: FaInfoCircle,
};

const TONE_STYLE = {
    success: 'border-green-500/30 bg-green-500/10 text-green-200',
    error: 'border-red-500/30 bg-red-500/10 text-red-200',
    info: 'border-purple-500/30 bg-purple-500/10 text-purple-200',
};

const DEFAULT_DURATION_MS = 3500;

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const idRef = useRef(0);

    const dismiss = useCallback(id => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const showToast = useCallback((message, { tone = 'info', duration = DEFAULT_DURATION_MS } = {}) => {
        idRef.current += 1;
        const id = idRef.current;
        setToasts(prev => [...prev, { id, message, tone }]);
        if (duration > 0) {
            setTimeout(() => dismiss(id), duration);
        }
        return id;
    }, [dismiss]);

    const value = useMemo(() => ({ showToast, dismiss }), [showToast, dismiss]);

    return (
        <ToastContext.Provider value={value}>
            {children}
            <div
                aria-live="polite"
                aria-atomic="true"
                className="pointer-events-none fixed inset-x-0 bottom-4 z-[200] flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:items-end sm:right-6 sm:left-auto"
            >
                {toasts.map(toast => {
                    const Icon = TONE_ICON[toast.tone] || FaInfoCircle;
                    return (
                        <div
                            key={toast.id}
                            role="status"
                            className={`pointer-events-auto flex w-full max-w-sm items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-medium shadow-2xl backdrop-blur-md animate-fadeInUp ${TONE_STYLE[toast.tone] || TONE_STYLE.info}`}
                        >
                            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                            <span className="flex-1">{toast.message}</span>
                            <button
                                type="button"
                                onClick={() => dismiss(toast.id)}
                                aria-label="Dismiss notification"
                                className="shrink-0 rounded-md px-1.5 py-0.5 text-xs text-white/60 hover:bg-white/10 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>
                    );
                })}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within a ToastProvider.');
    return ctx;
};
