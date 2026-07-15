'use client';

import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';
import { MotionConfig } from 'framer-motion';
import { useEffect, useSyncExternalStore } from 'react';
import {
    ACCENT_COLORS,
    FONT_FAMILIES,
    FONT_SCALES,
    SPACING_OPTIONS,
    THEME_PRESETS,
    DEFAULT_PREFERENCES,
    PREFERENCES_STORAGE_KEY,
} from '@/config/themePresets';

/**
 * Preferences live in a tiny module-level external store read via
 * useSyncExternalStore. This gives a stable SSR snapshot (defaults) and the
 * persisted client snapshot without any setState-in-effect (Phase 8, Feature 4).
 */
function readStoredPreferences() {
    if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
    try {
        const raw = window.localStorage.getItem(PREFERENCES_STORAGE_KEY);
        if (!raw) return DEFAULT_PREFERENCES;
        return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
    } catch {
        return DEFAULT_PREFERENCES;
    }
}

const listeners = new Set();
let clientState = null; // lazily hydrated from localStorage on first client read

function getSnapshot() {
    if (clientState === null) clientState = readStoredPreferences();
    return clientState;
}

function getServerSnapshot() {
    return DEFAULT_PREFERENCES;
}

function subscribe(cb) {
    listeners.add(cb);
    return () => listeners.delete(cb);
}

function commit(next) {
    clientState = next;
    try {
        window.localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(next));
    } catch {
        /* private mode / quota — non-fatal */
    }
    listeners.forEach(l => l());
}

function updatePreferences(patch) {
    commit({ ...getSnapshot(), ...patch });
}

function ThemeEffects() {
    const { resolvedTheme } = useTheme();
    const prefs = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    // Apply preferences as CSS custom properties on <html>. Syncing to an
    // external system (the DOM) is a legitimate effect.
    useEffect(() => {
        const root = document.documentElement;
        const isDark = resolvedTheme === 'dark';

        const accent = ACCENT_COLORS[prefs.accent] || ACCENT_COLORS.blue;
        root.style.setProperty('--accent', isDark ? accent.darkRgb : accent.rgb);
        root.style.setProperty('--accent-fg', isDark ? '9 9 11' : '255 255 255');

        const font = FONT_FAMILIES[prefs.fontFamily] || FONT_FAMILIES.geist;
        root.style.setProperty('--app-font', font.stack);

        const scale = FONT_SCALES[prefs.fontScale] || FONT_SCALES.md;
        root.style.setProperty('--app-font-scale', String(scale.value));

        const spacing = SPACING_OPTIONS[prefs.spacing] || SPACING_OPTIONS.normal;
        root.style.setProperty('--resume-spacing', spacing.value);
        root.dataset.density = prefs.density || 'comfortable';
    }, [prefs, resolvedTheme]);

    return null;
}

export function ThemeProvider({ children }) {
    return (
        <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <MotionConfig reducedMotion="user">
                <ThemeEffects />
                {children}
            </MotionConfig>
        </NextThemesProvider>
    );
}

/**
 * Read + mutate user preferences from anywhere under ThemeProvider.
 */
export function usePreferences() {
    const prefs = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    return {
        prefs,
        setPref: (key, value) => updatePreferences({ [key]: value }),
        setManyPrefs: patch => updatePreferences(patch),
        applyPreset: presetKey => {
            const preset = THEME_PRESETS[presetKey];
            if (!preset) return;
            updatePreferences({
                preset: presetKey,
                accent: preset.accent,
                fontFamily: preset.fontFamily,
                fontScale: preset.fontScale,
                spacing: preset.spacing,
            });
        },
        resetPreferences: () => commit({ ...DEFAULT_PREFERENCES }),
    };
}
