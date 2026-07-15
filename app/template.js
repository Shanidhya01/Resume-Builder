'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

/**
 * App Router `template.js` re-mounts on every navigation, so a subtle fade/rise
 * here gives global page transitions (Phase 8, Feature 6). Kept short and
 * transform-light to avoid jank; respects reduced motion via the global
 * MotionConfig in ThemeProvider.
 *
 * Public resume pages (/r/*) are rendered without the motion wrapper so their
 * content is never opacity:0 for non-JS crawlers — SEO there is a core feature.
 */
export default function Template({ children }) {
    const pathname = usePathname();

    if (pathname?.startsWith('/r/')) return children;

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
        >
            {children}
        </motion.div>
    );
}
