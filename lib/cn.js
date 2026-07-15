import { twMerge } from 'tailwind-merge';

/**
 * Join class names and de-duplicate conflicting Tailwind utilities.
 * Falsy values are ignored, so `cn('a', cond && 'b')` works as expected.
 */
export function cn(...inputs) {
    return twMerge(inputs.filter(Boolean).join(' '));
}

export default cn;
