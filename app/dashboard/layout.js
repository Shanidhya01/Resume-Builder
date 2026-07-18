import DashboardSidebar from '@/components/Dashboard/DashboardSidebar';

// Shared chrome for every /dashboard/* page: the collapsible sidebar nav
// (replacing the old per-page horizontal DashboardNav mount) plus a flex
// row so page content sits to the right of it.
export default function DashboardLayout({ children }) {
    return (
        <div className="flex">
            <DashboardSidebar />
            <div className="min-w-0 flex-1">{children}</div>
        </div>
    );
}
