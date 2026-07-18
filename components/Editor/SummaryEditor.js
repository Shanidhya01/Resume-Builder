'use client';

import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { List } from 'lucide-react';
import { updateResumeValue } from '@/store/slices/resumeSlice';

const MAX_LENGTH = 600;

// The PDF renderer displays the summary as plain text (no markdown/HTML
// parsing), so the only formatting affordance that survives to the document
// is inserting a literal bullet character — no bold/italic, which would just
// render as raw asterisks.
const insertBulletAtLineStart = (value, selectionStart) => {
    const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
    return value.slice(0, lineStart) + '• ' + value.slice(lineStart);
};

/**
 * Enhanced editor for the `summary` tab: auto-growing textarea, a bullet
 * insert affordance, and a character counter. Still stores a plain string
 * via the same `updateResumeValue` action `SingleEditor` uses elsewhere —
 * zero schema change.
 */
const SummaryEditor = () => {
    const dispatch = useDispatch();
    const value = useSelector(state => state.resume.summary?.summary) || '';
    const textareaRef = useRef(null);

    const resize = () => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = 'auto';
        el.style.height = `${el.scrollHeight}px`;
    };

    useEffect(resize, [value]);

    const handleChange = e => {
        dispatch(updateResumeValue({ tab: 'summary', name: 'summary', value: e.target.value }));
    };

    const handleInsertBullet = () => {
        const el = textareaRef.current;
        if (!el) return;
        const nextValue = insertBulletAtLineStart(value, el.selectionStart ?? value.length);
        dispatch(updateResumeValue({ tab: 'summary', name: 'summary', value: nextValue }));
        requestAnimationFrame(() => el.focus());
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="p-1">
            <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="summary" className="text-xs text-fg-muted md:text-sm">
                    Professional Summary
                </label>
                <button
                    type="button"
                    onClick={handleInsertBullet}
                    className="flex items-center gap-1.5 rounded-lg border border-line px-2 py-1 text-xs font-medium text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    title="Insert bullet point"
                >
                    <List className="h-3.5 w-3.5" /> Bullet
                </button>
            </div>

            <textarea
                id="summary"
                ref={textareaRef}
                value={value}
                onChange={handleChange}
                maxLength={MAX_LENGTH}
                placeholder="Brief summary of your skills and experience..."
                rows={6}
                className="block max-h-[28rem] min-h-[10rem] w-full resize-none overflow-hidden rounded-xl border border-line bg-surface-2 p-3 text-sm leading-relaxed text-fg shadow-sm outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent md:text-base"
            />

            <div className="mt-1.5 flex justify-end">
                <span className="text-xs tabular-nums text-fg-subtle">
                    {value.length} / {MAX_LENGTH}
                </span>
            </div>
        </motion.div>
    );
};

export default SummaryEditor;
