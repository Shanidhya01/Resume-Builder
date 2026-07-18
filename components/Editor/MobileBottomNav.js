'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import ResumeFields from '@/config/ResumeFields';
import { TAB_ICONS } from './SectionSidebar';

/**
 * Mobile-only (<md) fixed bottom nav — icon-only reuse of the same
 * `ResumeFields` tab list/URL-driven state as `SectionSidebar`.
 */
const MobileBottomNav = ({ activeTab }) => {
    const tabs = Object.keys(ResumeFields);
    const { resumeId } = useParams();
    const basePath = resumeId ? `/editor/${resumeId}` : '/editor';

    return (
        <nav
            aria-label="Resume sections"
            className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-0.5 overflow-x-auto border-t border-line bg-surface/95 px-2 py-2 shadow-ds-lg backdrop-blur-xl md:hidden"
        >
            {tabs.map(tab => {
                const Icon = TAB_ICONS[tab] || null;
                const active = activeTab === tab;
                return (
                    <Link
                        key={tab}
                        href={`${basePath}?tab=${tab}`}
                        aria-current={active ? 'page' : undefined}
                        className={`flex shrink-0 flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-[10px] font-medium capitalize transition-colors ${
                            active ? 'text-accent' : 'text-fg-muted'
                        }`}
                    >
                        {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
                        {tab}
                    </Link>
                );
            })}
        </nav>
    );
};

export default MobileBottomNav;
