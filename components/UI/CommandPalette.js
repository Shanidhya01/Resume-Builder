'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Search, LayoutDashboard, FileText, LayoutTemplate, BarChart3, Sparkles,
    Settings, User, Upload, Download, Moon, Sun, Target, GitCompareArrows, CornerDownLeft,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { useMounted } from '@/hooks/useMounted';
import Kbd from './Kbd';

export const OPEN_COMMAND_PALETTE_EVENT = 'hireready:open-command-palette';

export function openCommandPalette() {
    window.dispatchEvent(new Event(OPEN_COMMAND_PALETTE_EVENT));
}

/**
 * CommandPalette — global ⌘K / Ctrl+K launcher for navigation and actions.
 * Mounted once (in the Header). Opens on the keyboard shortcut or via the
 * `openCommandPalette()` event helper.
 */
export default function CommandPalette({ authed = false }) {
    const mounted = useMounted();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onKey = e => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                setOpen(o => !o);
            }
        };
        const onEvt = () => setOpen(true);
        window.addEventListener('keydown', onKey);
        window.addEventListener(OPEN_COMMAND_PALETTE_EVENT, onEvt);
        return () => {
            window.removeEventListener('keydown', onKey);
            window.removeEventListener(OPEN_COMMAND_PALETTE_EVENT, onEvt);
        };
    }, []);

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>{open && <Palette authed={authed} onClose={() => setOpen(false)} />}</AnimatePresence>,
        document.body,
    );
}

function Palette({ authed, onClose }) {
    const router = useRouter();
    const { resolvedTheme, setTheme } = useTheme();
    const [query, setQuery] = useState('');
    const [active, setActive] = useState(0);
    const inputRef = useRef(null);
    const listRef = useRef(null);

    const commands = useMemo(() => {
        const nav = authed
            ? [
                  { id: 'dashboard', label: 'Go to Dashboard', icon: LayoutDashboard, run: () => router.push('/dashboard'), group: 'Navigate' },
                  { id: 'new-resume', label: 'New Resume', icon: FileText, run: () => router.push('/dashboard?create=true'), group: 'Actions' },
                  { id: 'templates', label: 'Browse Templates', icon: LayoutTemplate, run: () => router.push('/templates'), group: 'Navigate' },
                  { id: 'analytics', label: 'View Analytics', icon: BarChart3, run: () => router.push('/dashboard/analytics'), group: 'Navigate' },
                  { id: 'improvements', label: 'Improvement Center', icon: Sparkles, run: () => router.push('/improvements'), group: 'Navigate' },
                  { id: 'jobmatch', label: 'Job Match', icon: Target, run: () => router.push('/dashboard/job-match'), group: 'Navigate' },
                  { id: 'comparison', label: 'Compare Resumes', icon: GitCompareArrows, run: () => router.push('/dashboard/comparison'), group: 'Navigate' },
                  { id: 'settings', label: 'Open Settings', icon: Settings, run: () => router.push('/dashboard/settings'), group: 'Navigate' },
                  { id: 'account', label: 'Account', icon: User, run: () => router.push('/account'), group: 'Navigate' },
                  { id: 'import', label: 'Import a Resume', icon: Upload, run: () => router.push('/dashboard/import'), group: 'Actions' },
                  { id: 'export', label: 'Export / Backup', icon: Download, run: () => router.push('/dashboard/export'), group: 'Actions' },
              ]
            : [
                  { id: 'home', label: 'Home', icon: LayoutDashboard, run: () => router.push('/'), group: 'Navigate' },
                  { id: 'templates', label: 'Browse Templates', icon: LayoutTemplate, run: () => router.push('/templates'), group: 'Navigate' },
                  { id: 'login', label: 'Log in', icon: User, run: () => router.push('/login'), group: 'Navigate' },
              ];
        const isDark = resolvedTheme === 'dark';
        return [
            ...nav,
            { id: 'theme', label: isDark ? 'Switch to Light mode' : 'Switch to Dark mode', icon: isDark ? Sun : Moon, run: () => setTheme(isDark ? 'light' : 'dark'), group: 'Actions' },
        ];
    }, [authed, router, resolvedTheme, setTheme]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return commands;
        return commands.filter(c => c.label.toLowerCase().includes(q));
    }, [commands, query]);

    useEffect(() => { inputRef.current?.focus(); }, []);

    const runIndex = useCallback(
        i => {
            const cmd = filtered[i];
            if (!cmd) return;
            onClose();
            // defer so the overlay unmounts before navigation
            requestAnimationFrame(() => cmd.run());
        },
        [filtered, onClose],
    );

    const onKeyDown = e => {
        if (e.key === 'Escape') { onClose(); return; }
        if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(a + 1, filtered.length - 1)); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => Math.max(a - 1, 0)); }
        else if (e.key === 'Enter') { e.preventDefault(); runIndex(active); }
    };

    return (
        <motion.div
            className="fixed inset-0 z-[300] flex items-start justify-center p-4 pt-[12vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
        >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
            <motion.div
                role="dialog"
                aria-modal="true"
                aria-label="Command palette"
                initial={{ opacity: 0, scale: 0.97, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -4 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                onKeyDown={onKeyDown}
                className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-surface shadow-ds-xl"
            >
                <div className="flex items-center gap-3 border-b border-line px-4">
                    <Search className="h-4 w-4 shrink-0 text-fg-subtle" />
                    <input
                        ref={inputRef}
                        value={query}
                        onChange={e => { setQuery(e.target.value); setActive(0); }}
                        placeholder="Search commands…"
                        aria-label="Search commands"
                        className="h-12 w-full bg-transparent text-sm text-fg outline-none placeholder:text-fg-subtle"
                    />
                    <Kbd>Esc</Kbd>
                </div>
                <div ref={listRef} className="max-h-80 overflow-y-auto p-2">
                    {filtered.length === 0 ? (
                        <p className="px-3 py-8 text-center text-sm text-fg-muted">No matching commands</p>
                    ) : (
                        filtered.map((cmd, i) => {
                            const Icon = cmd.icon;
                            const isActive = i === active;
                            return (
                                <button
                                    key={cmd.id}
                                    type="button"
                                    onMouseMove={() => setActive(i)}
                                    onClick={() => runIndex(i)}
                                    className={cn(
                                        'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors',
                                        isActive ? 'bg-accent/10 text-fg' : 'text-fg-muted hover:bg-surface-2',
                                    )}
                                >
                                    <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-accent' : 'text-fg-subtle')} />
                                    <span className="flex-1 truncate font-medium">{cmd.label}</span>
                                    <span className="text-[10px] uppercase tracking-wide text-fg-subtle">{cmd.group}</span>
                                    {isActive && <CornerDownLeft className="h-3.5 w-3.5 text-fg-subtle" />}
                                </button>
                            );
                        })
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}
