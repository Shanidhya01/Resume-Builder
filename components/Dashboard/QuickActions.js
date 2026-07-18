'use client';

import Link from 'next/link';
import { Upload, LayoutTemplate, BarChart3, Download, Sparkles, ArrowUpRight, Loader2 } from 'lucide-react';

const ACTIONS = [
    { href: '/dashboard/import', label: 'Import', desc: 'PDF, DOCX or JSON', icon: Upload },
    { href: '/templates', label: 'Templates', desc: 'Browse designs', icon: LayoutTemplate },
    { href: '/dashboard/analytics', label: 'Analytics', desc: 'ATS & quality', icon: BarChart3 },
    { href: '/dashboard/export', label: 'Export', desc: 'Download or backup', icon: Download },
];

const tileClass =
    'group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-line bg-surface p-4 text-left shadow-ds-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-ds-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent';

/**
 * Dashboard quick-action tiles. `onAiGenerate`/`aiGenerating` are optional —
 * when provided, a 5th "AI Generate" tile renders as a button (since it must
 * create a resume first, unlike the other tiles which are plain links) and
 * calls back into DashboardContent, which reuses the existing `createResume`
 * flow exactly like the "New Resume" button does.
 */
const QuickActions = ({ onAiGenerate, aiGenerating = false }) => (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {onAiGenerate && (
            <button type="button" onClick={onAiGenerate} disabled={aiGenerating} className={`${tileClass} disabled:cursor-not-allowed disabled:opacity-60`}>
                <ArrowUpRight className="absolute right-3 top-3 h-4 w-4 text-fg-subtle opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-indigo-500 text-white">
                    {aiGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" aria-hidden="true" />}
                </span>
                <div>
                    <span className="block text-sm font-semibold text-fg">AI Generate</span>
                    <span className="block text-xs text-fg-muted">{aiGenerating ? 'Creating…' : 'Start with AI'}</span>
                </div>
            </button>
        )}
        {ACTIONS.map(({ href, label, desc, icon: Icon }) => (
            <Link key={href} href={href} className={tileClass}>
                <ArrowUpRight className="absolute right-3 top-3 h-4 w-4 text-fg-subtle opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-fg">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                    <span className="block text-sm font-semibold text-fg">{label}</span>
                    <span className="block text-xs text-fg-muted">{desc}</span>
                </div>
            </Link>
        ))}
    </div>
);

export default QuickActions;
