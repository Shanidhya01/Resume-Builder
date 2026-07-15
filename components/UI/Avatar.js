'use client';

import { cn } from '@/lib/cn';

const SIZES = { sm: 'h-7 w-7 text-xs', md: 'h-9 w-9 text-sm', lg: 'h-11 w-11 text-base' };

function initials(name = '', email = '') {
    const src = (name || email || '?').trim();
    const parts = src.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return src.slice(0, 2).toUpperCase();
}

/** Avatar — image with graceful initials fallback. */
const Avatar = ({ src, name, email, size = 'md', className = '' }) => {
    const base = cn(
        'inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full',
        'bg-accent/10 font-semibold text-accent ring-1 ring-line',
        SIZES[size] || SIZES.md,
        className,
    );

    if (src) {
        // eslint-disable-next-line @next/next/no-img-element
        return <img src={src} alt={name || email || 'User avatar'} className={cn(base, 'object-cover')} referrerPolicy="no-referrer" />;
    }
    return (
        <span className={base} aria-hidden="true">
            {initials(name, email)}
        </span>
    );
};

export default Avatar;
