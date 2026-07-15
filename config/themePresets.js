/**
 * Theme customization options (Phase 8, Feature 4).
 *
 * Accent colours are stored as space-separated RGB channels so they can be
 * dropped straight into the `--accent` CSS variable that Tailwind's semantic
 * `accent` token reads (see globals.scss / tailwind.config.js).
 */

export const ACCENT_COLORS = {
    teal: { label: 'Teal', rgb: '13 148 136', darkRgb: '45 212 191', hex: '#0d9488' },
    blue: { label: 'Blue', rgb: '37 99 235', darkRgb: '96 165 250', hex: '#2563eb' },
    violet: { label: 'Violet', rgb: '124 58 237', darkRgb: '167 139 250', hex: '#7c3aed' },
    rose: { label: 'Rose', rgb: '225 29 72', darkRgb: '251 113 133', hex: '#e11d48' },
    amber: { label: 'Amber', rgb: '217 119 6', darkRgb: '251 191 36', hex: '#d97706' },
    emerald: { label: 'Emerald', rgb: '5 150 105', darkRgb: '52 211 153', hex: '#059669' },
    indigo: { label: 'Indigo', rgb: '79 70 229', darkRgb: '129 140 248', hex: '#4f46e5' },
    slate: { label: 'Slate', rgb: '71 85 105', darkRgb: '148 163 184', hex: '#475569' },
};

export const FONT_FAMILIES = {
    geist: { label: 'Geist (default)', stack: "var(--font-geist-sans), system-ui, sans-serif" },
    inter: { label: 'System UI', stack: "system-ui, -apple-system, 'Segoe UI', sans-serif" },
    georgia: { label: 'Georgia (serif)', stack: "Georgia, 'Times New Roman', serif" },
    mono: { label: 'Geist Mono', stack: "var(--font-geist-mono), ui-monospace, monospace" },
};

export const FONT_SCALES = {
    sm: { label: 'Small', value: 0.94 },
    md: { label: 'Default', value: 1 },
    lg: { label: 'Large', value: 1.08 },
};

export const SPACING_OPTIONS = {
    compact: { label: 'Compact', value: '0.75' },
    normal: { label: 'Normal', value: '1' },
    relaxed: { label: 'Relaxed', value: '1.25' },
};

export const DENSITY_OPTIONS = {
    compact: { label: 'Compact' },
    comfortable: { label: 'Comfortable' },
};

/** One-click presets that set several preferences at once. */
export const THEME_PRESETS = {
    default: { label: 'HireReady', accent: 'blue', fontFamily: 'geist', fontScale: 'md', spacing: 'normal' },
    professional: { label: 'Professional', accent: 'indigo', fontFamily: 'geist', fontScale: 'md', spacing: 'normal' },
    elegant: { label: 'Elegant', accent: 'slate', fontFamily: 'georgia', fontScale: 'md', spacing: 'relaxed' },
    vibrant: { label: 'Vibrant', accent: 'violet', fontFamily: 'geist', fontScale: 'md', spacing: 'normal' },
    minimal: { label: 'Minimal', accent: 'emerald', fontFamily: 'geist', fontScale: 'sm', spacing: 'compact' },
};

export const DEFAULT_PREFERENCES = {
    preset: 'default',
    accent: 'blue',
    fontFamily: 'geist',
    fontScale: 'md',
    spacing: 'normal',
    density: 'comfortable',
    autosave: true,
    notifications: true,
    publicByDefault: false,
};

export const PREFERENCES_STORAGE_KEY = 'hireready:preferences:v1';
