'use client';

import { useTheme } from 'next-themes';
import { AnimatePresence, motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useMounted } from '@/hooks/useMounted';

/**
 * ThemeToggle — light/dark switch with a cross-fading icon. Renders a neutral
 * placeholder until mounted so SSR and client markup match (next-themes).
 */
const ThemeToggle = ({ className = '' }) => {
    const mounted = useMounted();
    const { resolvedTheme, setTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';

    const base = cn(
        'relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-line',
        'text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
        className,
    );

    if (!mounted) return <span className={base} aria-hidden="true" />;

    return (
        <button
            type="button"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className={base}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.span
                    key={isDark ? 'sun' : 'moon'}
                    initial={{ y: 12, opacity: 0, rotate: -30 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: -12, opacity: 0, rotate: 30 }}
                    transition={{ duration: 0.18 }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </motion.span>
            </AnimatePresence>
        </button>
    );
};

export default ThemeToggle;
