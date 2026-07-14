'use client';

import { useRef } from 'react';
import { FaCodeBranch, FaCopy, FaExchangeAlt } from 'react-icons/fa';
import useModalA11y from '@/hooks/useModalA11y';
import Badge from '@/components/Ats/Badge';

const ACTIONS = [
    {
        id: 'merge',
        icon: FaCodeBranch,
        label: 'Merge',
        description: 'Combine both — keeps everything in the existing resume and adds new entries and skills from the import.',
    },
    {
        id: 'replace',
        icon: FaExchangeAlt,
        label: 'Replace',
        description: 'Overwrite the existing resume with the imported content. A version snapshot is saved first so you can undo.',
    },
    {
        id: 'keep-both',
        icon: FaCopy,
        label: 'Keep Both',
        description: 'Save the import as a brand-new resume and leave the existing one untouched.',
    },
];

// Shown when the imported resume looks like one the user already has.
// `matches` comes from detectDuplicates() — strongest match first.
const DuplicateResolver = ({ matches, onResolve, onCancel, busy = false }) => {
    const containerRef = useRef(null);
    const initialFocusRef = useRef(null);
    useModalA11y({ containerRef, initialFocusRef, onClose: onCancel });

    const top = matches[0];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
            <div
                ref={containerRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="duplicate-resolver-title"
                className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-purple-500/30 bg-slate-900 p-6 shadow-2xl"
            >
                <h3 id="duplicate-resolver-title" className="mb-1 text-lg font-semibold text-white">
                    Possible duplicate detected
                </h3>
                <p className="mb-4 text-sm text-slate-400">
                    This import looks {top.score}% similar to <span className="font-semibold text-white">&ldquo;{top.name}&rdquo;</span>.
                </p>

                <div className="mb-5 rounded-lg border border-purple-500/15 bg-slate-950/50 p-3">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-purple-300">Why it matched</p>
                    <ul className="flex flex-wrap gap-1.5">
                        {top.reasons.map(reason => (
                            <li key={reason}>
                                <Badge tone="medium">{reason}</Badge>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="space-y-3">
                    {ACTIONS.map(({ id, icon: Icon, label, description }, index) => (
                        <button
                            key={id}
                            ref={index === 0 ? initialFocusRef : undefined}
                            type="button"
                            disabled={busy}
                            onClick={() => onResolve(id, top)}
                            className="flex w-full items-start gap-3 rounded-xl border border-purple-500/20 p-4 text-left transition-colors hover:border-purple-400 hover:bg-purple-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 disabled:opacity-50"
                        >
                            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-purple-300" aria-hidden="true" />
                            <span>
                                <span className="block text-sm font-semibold text-white">{label}</span>
                                <span className="block text-xs text-slate-400">{description}</span>
                            </span>
                        </button>
                    ))}
                </div>

                <div className="mt-5 flex justify-end">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={busy}
                        className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/5 disabled:opacity-50"
                    >
                        Back to review
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DuplicateResolver;
