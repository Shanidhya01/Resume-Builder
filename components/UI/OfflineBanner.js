'use client';

import { useSyncExternalStore } from 'react';
import { FiWifiOff } from 'react-icons/fi';
import { AnimatePresence, motion } from 'framer-motion';

function subscribe(callback) {
    window.addEventListener('online', callback);
    window.addEventListener('offline', callback);
    return () => {
        window.removeEventListener('online', callback);
        window.removeEventListener('offline', callback);
    };
}

const getSnapshot = () => (typeof navigator === 'undefined' ? true : navigator.onLine);
const getServerSnapshot = () => true;

/**
 * Global connectivity banner (Phase 8, Feature 12). Reads online status via
 * useSyncExternalStore so the initial SSR snapshot (online) matches the client
 * without hydration warnings.
 */
const OfflineBanner = () => {
    const online = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    return (
        <AnimatePresence>
            {!online && (
                <motion.div
                    initial={{ y: -48, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -48, opacity: 0 }}
                    role="status"
                    aria-live="assertive"
                    className="fixed inset-x-0 top-0 z-[300] flex items-center justify-center gap-2 bg-amber-500 px-4 py-2 text-sm font-semibold text-amber-950 shadow-lg"
                >
                    <FiWifiOff className="h-4 w-4" aria-hidden="true" />
                    You&apos;re offline. Changes will be saved when your connection returns.
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default OfflineBanner;
