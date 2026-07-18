'use client';

import { Search, X } from 'lucide-react';

const FILTERS = [
    { value: 'all', label: 'All' },
    { value: 'published', label: 'Published' },
    { value: 'private', label: 'Private' },
    { value: 'recent', label: 'Recent (7d)' },
];

const SORTS = [
    { value: 'updated', label: 'Last Edited' },
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'views', label: 'Most Viewed' },
];

const selectClass =
    'rounded-xl border border-line bg-surface px-3 py-2 text-sm text-fg outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent';

/**
 * Pure client-side search/filter/sort controls over the already-loaded
 * `resumes` array — no Firestore query changes. State is owned by the
 * caller (DashboardContent) since both the "Recently Edited" and "All
 * Resumes" sections need to react to the same filtered/sorted list.
 */
const SearchFilterSortBar = ({ search, onSearchChange, filter, onFilterChange, sort, onSortChange, resultCount }) => (
    <div className="sticky top-16 z-10 mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-surface/90 p-3 shadow-ds-sm backdrop-blur-xl">
        <div className="relative flex-1 min-w-[180px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-subtle" aria-hidden="true" />
            <input
                type="search"
                value={search}
                onChange={e => onSearchChange(e.target.value)}
                placeholder="Search resumes by name…"
                aria-label="Search resumes"
                className="w-full rounded-xl border border-line bg-surface-2 py-2 pl-9 pr-8 text-sm text-fg outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
            />
            {search && (
                <button
                    type="button"
                    onClick={() => onSearchChange('')}
                    aria-label="Clear search"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-fg-subtle hover:bg-surface-3 hover:text-fg"
                >
                    <X className="h-3.5 w-3.5" />
                </button>
            )}
        </div>

        <select value={filter} onChange={e => onFilterChange(e.target.value)} aria-label="Filter resumes" className={selectClass}>
            {FILTERS.map(f => (
                <option key={f.value} value={f.value}>
                    {f.label}
                </option>
            ))}
        </select>

        <select value={sort} onChange={e => onSortChange(e.target.value)} aria-label="Sort resumes" className={selectClass}>
            {SORTS.map(s => (
                <option key={s.value} value={s.value}>
                    Sort: {s.label}
                </option>
            ))}
        </select>

        <span className="ml-auto text-xs text-fg-muted">
            {resultCount} resume{resultCount !== 1 ? 's' : ''}
        </span>
    </div>
);

export default SearchFilterSortBar;
