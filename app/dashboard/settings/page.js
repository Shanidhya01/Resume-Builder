'use client';

import { useTheme } from 'next-themes';
import { FiMonitor, FiMoon, FiRotateCcw, FiSun } from 'react-icons/fi';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import { useMounted } from '@/hooks/useMounted';
import DashboardNav from '@/components/Ats/DashboardNav';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import { usePreferences } from '@/context/ThemeProvider';
import { useToast } from '@/context/ToastContext';
import { cn } from '@/lib/cn';
import {
    ACCENT_COLORS,
    FONT_FAMILIES,
    FONT_SCALES,
    SPACING_OPTIONS,
    DENSITY_OPTIONS,
    THEME_PRESETS,
} from '@/config/themePresets';

/* ---- small local building blocks (theme-aware) ---- */

const Field = ({ label, hint, children }) => (
    <div className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
            <p className="text-sm font-semibold text-fg">{label}</p>
            {hint && <p className="mt-0.5 text-xs text-fg-muted">{hint}</p>}
        </div>
        <div className="shrink-0">{children}</div>
    </div>
);

const Segmented = ({ options, value, onChange, ariaLabel }) => (
    <div role="radiogroup" aria-label={ariaLabel} className="inline-flex rounded-xl border border-line bg-surface-2 p-1">
        {options.map(opt => {
            const active = value === opt.value;
            return (
                <button
                    key={opt.value}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => onChange(opt.value)}
                    className={cn(
                        'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
                        active ? 'bg-accent text-accent-fg shadow-sm' : 'text-fg-muted hover:text-fg',
                    )}
                >
                    {opt.icon}
                    {opt.label}
                </button>
            );
        })}
    </div>
);

const Toggle = ({ checked, onChange, label }) => (
    <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
            'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas',
            checked ? 'bg-accent' : 'bg-surface-2 border border-line',
        )}
    >
        <span
            className={cn(
                'inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform',
                checked ? 'translate-x-5' : 'translate-x-0.5',
            )}
        />
    </button>
);

/* ---- page ---- */

const SettingsContent = () => {
    const { theme, setTheme } = useTheme();
    const { prefs, setPref, applyPreset, resetPreferences } = usePreferences();
    const { success } = useToast();
    const mounted = useMounted();

    const handleReset = () => {
        resetPreferences();
        success('Preferences reset to defaults.');
    };

    return (
        <div className="mx-auto mt-10 max-w-screen-xl px-4 pb-16 md:mt-12">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-fg md:text-3xl">Settings</h1>
                <p className="mt-1 text-sm text-fg-muted">Personalize the look, feel, and defaults of your workspace.</p>
            </div>

            <DashboardNav />

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Appearance */}
                <Card title="Appearance" subtitle="Theme and accent colour" className="lg:col-span-2">
                    <div className="divide-y divide-line">
                        <Field label="Color mode" hint="Choose light, dark, or match your system.">
                            <Segmented
                                ariaLabel="Color mode"
                                value={mounted ? theme : 'dark'}
                                onChange={setTheme}
                                options={[
                                    { value: 'light', label: 'Light', icon: <FiSun className="h-3.5 w-3.5" /> },
                                    { value: 'dark', label: 'Dark', icon: <FiMoon className="h-3.5 w-3.5" /> },
                                    { value: 'system', label: 'System', icon: <FiMonitor className="h-3.5 w-3.5" /> },
                                ]}
                            />
                        </Field>

                        <Field label="Accent colour" hint="Used for buttons, links, and highlights.">
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(ACCENT_COLORS).map(([key, c]) => (
                                    <button
                                        key={key}
                                        type="button"
                                        aria-label={c.label}
                                        aria-pressed={prefs.accent === key}
                                        title={c.label}
                                        onClick={() => setPref('accent', key)}
                                        className={cn(
                                            'h-7 w-7 rounded-full ring-2 ring-offset-2 ring-offset-surface transition-transform hover:scale-110',
                                            prefs.accent === key ? 'ring-fg' : 'ring-transparent',
                                        )}
                                        style={{ backgroundColor: c.hex }}
                                    />
                                ))}
                            </div>
                        </Field>

                        <Field label="Preset" hint="Apply a curated set of appearance options at once.">
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(THEME_PRESETS).map(([key, p]) => (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => applyPreset(key)}
                                        className={cn(
                                            'rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors',
                                            prefs.preset === key
                                                ? 'border-accent bg-accent/10 text-accent'
                                                : 'border-line text-fg-muted hover:text-fg',
                                        )}
                                    >
                                        {p.label}
                                    </button>
                                ))}
                            </div>
                        </Field>
                    </div>
                </Card>

                {/* Typography & layout */}
                <Card title="Typography & Layout" subtitle="Resume and app density">
                    <div className="divide-y divide-line">
                        <Field label="Font family">
                            <select
                                value={prefs.fontFamily}
                                onChange={e => setPref('fontFamily', e.target.value)}
                                className="rounded-lg border border-line bg-surface-2 px-3 py-1.5 text-sm text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                            >
                                {Object.entries(FONT_FAMILIES).map(([key, f]) => (
                                    <option key={key} value={key}>
                                        {f.label}
                                    </option>
                                ))}
                            </select>
                        </Field>
                        <Field label="Font size">
                            <Segmented
                                ariaLabel="Font size"
                                value={prefs.fontScale}
                                onChange={v => setPref('fontScale', v)}
                                options={Object.entries(FONT_SCALES).map(([key, s]) => ({ value: key, label: s.label }))}
                            />
                        </Field>
                        <Field label="Spacing">
                            <Segmented
                                ariaLabel="Spacing"
                                value={prefs.spacing}
                                onChange={v => setPref('spacing', v)}
                                options={Object.entries(SPACING_OPTIONS).map(([key, s]) => ({ value: key, label: s.label }))}
                            />
                        </Field>
                        <Field label="Density">
                            <Segmented
                                ariaLabel="Density"
                                value={prefs.density}
                                onChange={v => setPref('density', v)}
                                options={Object.entries(DENSITY_OPTIONS).map(([key, d]) => ({ value: key, label: d.label }))}
                            />
                        </Field>
                    </div>
                </Card>

                {/* Preferences */}
                <Card title="Preferences" subtitle="Editor, notifications, and sharing">
                    <div className="divide-y divide-line">
                        <Field label="Autosave" hint="Automatically save edits to the cloud while you type.">
                            <Toggle label="Autosave" checked={prefs.autosave} onChange={v => setPref('autosave', v)} />
                        </Field>
                        <Field label="Notifications" hint="Show toast notifications for actions and errors.">
                            <Toggle
                                label="Notifications"
                                checked={prefs.notifications}
                                onChange={v => setPref('notifications', v)}
                            />
                        </Field>
                        <Field label="Publish new resumes publicly" hint="Default the public-sharing switch to on for new resumes.">
                            <Toggle
                                label="Public by default"
                                checked={prefs.publicByDefault}
                                onChange={v => setPref('publicByDefault', v)}
                            />
                        </Field>
                    </div>
                </Card>
            </div>

            <div className="mt-6 flex justify-end">
                <Button variant="outline" leftIcon={<FiRotateCcw className="h-4 w-4" />} onClick={handleReset}>
                    Reset to defaults
                </Button>
            </div>

            <p className="mt-4 text-center text-xs text-fg-muted">
                Preferences are saved to this browser. Cloud-synced preferences are planned for a later phase.
            </p>
        </div>
    );
};

const SettingsPage = () => (
    <ProtectedRoute>
        <SettingsContent />
    </ProtectedRoute>
);

export default SettingsPage;
