'use client';

import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { PanelLeftClose, PanelLeftOpen, Menu, X } from 'lucide-react';
import DASHBOARD_NAV_TABS from './dashboardNavTabs';
import useSidebarCollapsed from '@/hooks/useSidebarCollapsed';
import useModalA11y from '@/hooks/useModalA11y';
import { cn } from '@/lib/cn';

const NavList = ({ collapsed, pathname, onNavigate }) => (
    <nav aria-label="Dashboard sections" className="flex flex-1 flex-col gap-1 overflow-y-auto px-2 py-3">
        {DASHBOARD_NAV_TABS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
                <Link
                    key={href}
                    href={href}
                    onClick={onNavigate}
                    aria-current={isActive ? 'page' : undefined}
                    title={collapsed ? label : undefined}
                    className={cn(
                        'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                        isActive ? 'text-accent-fg' : 'text-fg-muted hover:bg-surface-2 hover:text-fg',
                        collapsed && 'justify-center px-2',
                    )}
                >
                    {isActive && (
                        <motion.span
                            layoutId="dashboard-sidebar-active"
                            className="absolute inset-0 -z-10 rounded-xl bg-accent shadow-ds-sm"
                            transition={{ type: 'spring', stiffness: 500, damping: 34 }}
                        />
                    )}
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {!collapsed && <span className="truncate">{label}</span>}
                </Link>
            );
        })}
    </nav>
);

const MobileDrawer = ({ pathname, onClose }) => {
    const containerRef = useRef(null);
    const closeButtonRef = useRef(null);
    useModalA11y({ containerRef, initialFocusRef: closeButtonRef, onClose });

    return createPortal(
        <div className="fixed inset-0 z-[90] flex md:hidden" role="dialog" aria-modal="true" aria-label="Dashboard navigation">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <motion.div
                ref={containerRef}
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: 'spring', stiffness: 420, damping: 38 }}
                className="relative flex h-full w-64 flex-col border-r border-line bg-surface/95 shadow-ds-xl backdrop-blur-xl"
            >
                <div className="flex items-center justify-between border-b border-line px-4 py-3.5">
                    <span className="text-sm font-semibold text-fg">Dashboard</span>
                    <button
                        ref={closeButtonRef}
                        type="button"
                        onClick={onClose}
                        aria-label="Close navigation"
                        className="rounded-lg p-1.5 text-fg-muted hover:bg-surface-2 hover:text-fg"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
                <NavList collapsed={false} pathname={pathname} onNavigate={onClose} />
            </motion.div>
        </div>,
        document.body,
    );
};

/**
 * Vertical dashboard navigation — desktop: collapsible glass rail (width
 * persisted via useSidebarCollapsed/localStorage). Mobile: off-canvas drawer
 * triggered by a fixed hamburger button. Mounted by app/dashboard/layout.js
 * for every /dashboard/* page, and standalone by app/improvements/page.js
 * (outside the /dashboard route segment).
 */
const DashboardSidebar = () => {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useSidebarCollapsed();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <>
            <aside
                className={cn(
                    'sticky top-16 hidden h-[calc(100vh-4rem)] shrink-0 flex-col border-r border-line bg-surface/70 backdrop-blur-xl transition-[width] duration-300 ease-out md:flex',
                    collapsed ? 'w-16' : 'w-64',
                )}
            >
                <NavList collapsed={collapsed} pathname={pathname} onNavigate={undefined} />
                <div className="border-t border-line p-2">
                    <button
                        type="button"
                        onClick={() => setCollapsed(c => !c)}
                        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        className="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg"
                    >
                        {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
                        {!collapsed && 'Collapse'}
                    </button>
                </div>
            </aside>

            <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Open dashboard navigation"
                className="fixed bottom-4 left-4 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-fg shadow-ds-lg md:hidden"
            >
                <Menu className="h-5 w-5" />
            </button>

            <AnimatePresence>
                {mobileOpen && <MobileDrawer pathname={pathname} onClose={() => setMobileOpen(false)} />}
            </AnimatePresence>
        </>
    );
};

export default DashboardSidebar;
