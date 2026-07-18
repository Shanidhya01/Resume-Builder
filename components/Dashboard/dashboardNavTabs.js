import { LayoutDashboard, Upload, Download, History, BarChart3, Target, Hash, Eye, GitCompare, Sparkles } from 'lucide-react';

// Single source of truth for dashboard-family navigation, consumed by
// DashboardSidebar (mounted via app/dashboard/layout.js) and by
// app/improvements/page.js, which lives outside the /dashboard route
// segment and so mounts the sidebar standalone.
const DASHBOARD_NAV_TABS = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/import', label: 'Import', icon: Upload },
    { href: '/dashboard/export', label: 'Export & Backup', icon: Download },
    { href: '/dashboard/history', label: 'History', icon: History },
    { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/dashboard/job-match', label: 'Job Match', icon: Target },
    { href: '/dashboard/keywords', label: 'Keywords', icon: Hash },
    { href: '/dashboard/recruiter', label: 'Recruiter Preview', icon: Eye },
    { href: '/dashboard/comparison', label: 'Comparison', icon: GitCompare },
    { href: '/improvements', label: 'Improvements', icon: Sparkles },
];

export default DASHBOARD_NAV_TABS;
