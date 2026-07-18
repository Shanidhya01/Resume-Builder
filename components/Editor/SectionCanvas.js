'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Editor from '@/components/Editor';

/**
 * Animates the transition between resume sections. `tab` is derived from the
 * URL in the page component, so a sidebar click triggers a real Next.js
 * navigation → new `tab` prop → new `motion.div` key → exit/enter animation.
 * `Editor`'s internal single/multi/summary branch is untouched.
 */
const SectionCanvas = ({ tab }) => (
    <AnimatePresence mode="wait">
        <motion.div
            key={tab}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
        >
            <Editor tab={tab} />
        </motion.div>
    </AnimatePresence>
);

export default SectionCanvas;
