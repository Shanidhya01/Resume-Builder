'use client';

import Link from 'next/link';
import { Upload, LayoutTemplate, BarChart3, Download, ArrowUpRight } from 'lucide-react';

const ACTIONS = [
    { href: '/dashboard/import', label: 'Import', desc: 'PDF, DOCX or JSON', icon: Upload },
    { href: '/templates', label: 'Templates', desc: 'Browse designs', icon: LayoutTemplate },
    { href: '/dashboard/analytics', label: 'Analytics', desc: 'ATS & quality', icon: BarChart3 },
    { href: '/dashboard/export', label: 'Export', desc: 'Download or backup', icon: Download },
];

const QuickActions = () => (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {ACTIONS.map(({ href, label, desc, icon: Icon }) => (
            <Link
                key={href}
                href={href}
                className="group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-line bg-surface p-4 shadow-ds-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-ds-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
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
