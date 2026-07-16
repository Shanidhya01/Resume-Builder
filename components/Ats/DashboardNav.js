'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

const TABS = [
    { href: '/dashboard', label: 'Overview' },
    { href: '/dashboard/import', label: 'Import' },
    { href: '/dashboard/export', label: 'Export & Backup' },
    { href: '/dashboard/history', label: 'History' },
    { href: '/dashboard/analytics', label: 'Analytics' },
    { href: '/dashboard/job-match', label: 'Job Match' },
    { href: '/dashboard/keywords', label: 'Keywords' },
    { href: '/dashboard/recruiter', label: 'Recruiter Preview' },
    { href: '/dashboard/comparison', label: 'Comparison' },
    { href: '/improvements', label: 'Improvements' },
];

const DashboardNav = () => {
    const pathname = usePathname();

    return (
        <nav aria-label="Dashboard sections" className="mb-8 flex gap-1.5 overflow-x-auto pb-2">
            {TABS.map(tab => {
                const isActive = pathname === tab.href;
                return (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        aria-current={isActive ? 'page' : undefined}
                        className={cn(
                            'relative whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                            isActive ? 'text-accent-fg' : 'text-fg-muted hover:bg-surface-2 hover:text-fg',
                        )}
                    >
                        {isActive && (
                            <motion.span
                                layoutId="dashnav-active"
                                className="absolute inset-0 -z-10 rounded-full bg-accent"
                                transition={{ type: 'spring', stiffness: 500, damping: 34 }}
                            />
                        )}
                        {tab.label}
                    </Link>
                );
            })}
        </nav>
    );
};

export default DashboardNav;
