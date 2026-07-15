import { cn } from '@/lib/cn';

/** Separator — a thin themed divider (horizontal by default). */
const Separator = ({ orientation = 'horizontal', className = '' }) => (
    <div
        role="separator"
        aria-orientation={orientation}
        className={cn(
            'shrink-0 bg-line',
            orientation === 'vertical' ? 'h-full w-px' : 'h-px w-full',
            className,
        )}
    />
);

export default Separator;
