import { cn } from '@/lib/cn';

/** Kbd — styled keyboard key hint (e.g. ⌘ K). */
const Kbd = ({ children, className = '' }) => (
    <kbd
        className={cn(
            'inline-flex h-5 min-w-5 items-center justify-center rounded border border-line bg-surface-2 px-1.5',
            'font-mono text-[10px] font-medium text-fg-muted',
            className,
        )}
    >
        {children}
    </kbd>
);

export default Kbd;
