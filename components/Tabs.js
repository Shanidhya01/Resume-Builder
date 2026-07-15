'use client';

import ResumeFields from '@/config/ResumeFields';
import Link from 'next/link';
import {
    User,
    FileText,
    GraduationCap,
    Briefcase,
    FolderGit2,
    Wrench,
    Award,
    Languages,
} from 'lucide-react';

// Icon per resume section — falls back to a generic doc icon.
const TAB_ICONS = {
    contact: User,
    summary: FileText,
    education: GraduationCap,
    experience: Briefcase,
    projects: FolderGit2,
    skills: Wrench,
    certificates: Award,
    languages: Languages,
};

/**
 * Section navigation for the editor. Horizontally-scrollable on mobile,
 * wrapped pill group on larger screens. Links preserve the existing
 * `/editor/?tab=` routing behaviour.
 */
const Tabs = ({ activeTab }) => {
    const tabs = Object.keys(ResumeFields);

    return (
        <nav aria-label="Resume sections" className="w-full">
            <div className="flex w-full gap-1.5 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible md:pb-0">
                {tabs.map(tab => {
                    const Icon = TAB_ICONS[tab] || FileText;
                    const active = activeTab === tab;
                    return (
                        <Link
                            key={tab}
                            href={`/editor/?tab=${tab}`}
                            aria-current={active ? 'page' : undefined}
                            className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                                active
                                    ? 'bg-accent text-accent-fg shadow-ds-sm'
                                    : 'border border-line bg-surface text-fg-muted hover:bg-surface-2 hover:text-fg'
                            }`}
                        >
                            <Icon className="h-4 w-4" aria-hidden="true" />
                            {tab}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default Tabs;
