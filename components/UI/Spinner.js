'use client';

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';

const SIZES = { sm: 'h-4 w-4', md: 'h-5 w-5', lg: 'h-8 w-8' };

/** Spinner — accessible loading indicator. */
const Spinner = ({ size = 'md', className = '', label = 'Loading' }) => (
    <span role="status" aria-live="polite" className={cn('inline-flex text-accent', className)}>
        <Loader2 className={cn('animate-spin', SIZES[size] || SIZES.md)} aria-hidden="true" />
        <span className="sr-only">{label}</span>
    </span>
);

export default Spinner;
