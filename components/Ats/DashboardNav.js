'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
    { href: '/dashboard', label: 'Overview' },
    { href: '/dashboard/analytics', label: 'Analytics' },
    { href: '/dashboard/job-match', label: 'Job Match' },
    { href: '/dashboard/keywords', label: 'Keywords' },
    { href: '/dashboard/recruiter', label: 'Recruiter Preview' },
    { href: '/dashboard/comparison', label: 'Comparison' },
    { href: '/improvements', label: 'Improvement Center' },
];

const DashboardNav = () => {
    const pathname = usePathname();

    return (
        <nav aria-label="Dashboard sections" className="mb-8 -mt-2 flex gap-2 overflow-x-auto pb-2">
            {TABS.map(tab => {
                const isActive = pathname === tab.href;
                return (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        aria-current={isActive ? 'page' : undefined}
                        className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 ${
                            isActive
                                ? 'border-purple-400 bg-purple-500/20 text-white'
                                : 'border-purple-500/20 text-slate-300 hover:bg-purple-500/10 hover:text-white'
                        }`}
                    >
                        {tab.label}
                    </Link>
                );
            })}
        </nav>
    );
};

export default DashboardNav;
