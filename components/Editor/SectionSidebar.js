'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
    User,
    FileText,
    GraduationCap,
    Briefcase,
    FolderGit2,
    Wrench,
    Award,
    Languages,
    LayoutGrid,
    Linkedin,
    Github,
} from 'lucide-react';
import ResumeFields from '@/config/ResumeFields';
import { useToast } from '@/context/ToastContext';

// Icon per resume section — falls back to a generic doc icon.
export const TAB_ICONS = {
    contact: User,
    summary: FileText,
    education: GraduationCap,
    experience: Briefcase,
    projects: FolderGit2,
    skills: Wrench,
    certificates: Award,
    languages: Languages,
};

const STUB_ENTRIES = [
    { key: 'custom-sections', label: 'Custom Sections', icon: LayoutGrid, message: 'Custom sections are coming soon.' },
    { key: 'import-linkedin', label: 'Import LinkedIn', icon: Linkedin, message: 'LinkedIn import is coming soon.' },
    { key: 'import-github', label: 'Import GitHub', icon: Github, message: 'GitHub import is coming soon.' },
];

/**
 * Vertical section navigation. Keeps the existing URL-driven tab state
 * (`?tab=`) so deep-linking and the back button keep working exactly as
 * before — only the visual presentation changes from horizontal pills to a
 * sidebar rail. `collapsed` renders icon-only (tablet breakpoint).
 */
const SectionSidebar = ({ activeTab, collapsed = false }) => {
    const tabs = Object.keys(ResumeFields);
    const { resumeId } = useParams();
    const basePath = resumeId ? `/editor/${resumeId}` : '/editor';
    const { info } = useToast();

    return (
        <nav aria-label="Resume sections" className="w-full">
            <ul className="flex flex-col gap-1">
                {tabs.map(tab => {
                    const Icon = TAB_ICONS[tab] || FileText;
                    const active = activeTab === tab;
                    return (
                        <li key={tab}>
                            <Link
                                href={`${basePath}?tab=${tab}`}
                                aria-current={active ? 'page' : undefined}
                                title={collapsed ? tab : undefined}
                                className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium capitalize transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                                    active
                                        ? 'bg-accent text-accent-fg shadow-ds-sm'
                                        : 'text-fg-muted hover:bg-surface-2 hover:text-fg'
                                } ${collapsed ? 'justify-center px-2' : ''}`}
                            >
                                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                                {!collapsed && <span className="truncate">{tab}</span>}
                            </Link>
                        </li>
                    );
                })}
            </ul>

            <div className={`my-3 border-t border-line ${collapsed ? 'mx-1' : ''}`} />

            <ul className="flex flex-col gap-1">
                {STUB_ENTRIES.map(({ key, label, icon: Icon, message }) => (
                    <li key={key}>
                        <button
                            type="button"
                            onClick={() => info(message)}
                            title={collapsed ? label : 'Coming soon'}
                            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-fg-subtle transition-colors hover:bg-surface-2 hover:text-fg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                                collapsed ? 'justify-center px-2' : ''
                            }`}
                        >
                            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                            {!collapsed && (
                                <span className="flex flex-1 items-center justify-between gap-2 truncate">
                                    {label}
                                    <span className="shrink-0 rounded-full bg-surface-3 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-fg-subtle">
                                        Soon
                                    </span>
                                </span>
                            )}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default SectionSidebar;
