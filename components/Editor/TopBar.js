'use client';

import { Undo2, Redo2, History, Download, Eye, Pencil } from 'lucide-react';
import SharePanel from '@/components/Share/SharePanel';

const STATUS_CONFIG = {
    idle: { label: 'Saved', color: 'bg-emerald-500' },
    saving: { label: 'Saving…', color: 'bg-amber-500 animate-pulse' },
    saved: { label: 'Saved', color: 'bg-emerald-500' },
    error: { label: 'Sync error', color: 'bg-red-500' },
};

export const SaveStatusPill = ({ status, onRetry }) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.idle;
    return (
        <div className="flex items-center gap-2 rounded-full border border-line bg-surface-2/70 px-3 py-1.5 text-xs font-medium text-fg-muted">
            <span className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${config.color}`} />
            <span>{config.label}</span>
            {status === 'error' && (
                <button onClick={onRetry} className="font-semibold text-accent underline underline-offset-2">
                    Retry
                </button>
            )}
        </div>
    );
};

const ToolbarButton = ({ onClick, disabled, title, ariaLabel, children }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        title={title}
        aria-label={ariaLabel}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
        {children}
    </button>
);

/**
 * Sticky top editor bar: identity + sync status on the left, history/share/
 * download actions on the right. All handlers are passed straight through
 * from the existing `useAutoSave`/`useUndoRedo` hooks in the page — this
 * component owns no autosave/history logic of its own.
 */
const TopBar = ({
    resumeName,
    resumeMeta,
    uid,
    onResumeMetaUpdate,
    saveStatus,
    onRetrySave,
    undo,
    redo,
    canUndo,
    canRedo,
    onHistoryClick,
    previewMode,
    onTogglePreviewMode,
    download,
}) => {
    return (
        <div className="sticky top-16 z-30 flex flex-wrap items-center justify-between gap-3 border-b border-line bg-surface/90 px-4 py-3 shadow-ds-sm backdrop-blur-xl md:px-6">
            <div className="flex min-w-0 items-center gap-3">
                <h1 className="truncate text-sm font-semibold text-fg md:text-base">{resumeName || 'Untitled Resume'}</h1>
                <SaveStatusPill status={saveStatus} onRetry={onRetrySave} />
            </div>

            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={onTogglePreviewMode}
                    className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:hidden"
                >
                    {previewMode ? <Pencil className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    {previewMode ? 'Edit' : 'Preview'}
                </button>

                <div className="flex items-center gap-1">
                    <ToolbarButton onClick={undo} disabled={!canUndo} title="Undo (Ctrl+Z)" ariaLabel="Undo">
                        <Undo2 className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Shift+Z)" ariaLabel="Redo">
                        <Redo2 className="h-4 w-4" />
                    </ToolbarButton>
                    <button
                        type="button"
                        onClick={onHistoryClick}
                        title="Version history"
                        className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                        <History className="h-3.5 w-3.5" /> <span className="hidden sm:inline">History</span>
                    </button>
                </div>

                <div className="h-6 w-px bg-line" aria-hidden="true" />

                {resumeMeta && <SharePanel resume={resumeMeta} uid={uid} onUpdate={onResumeMetaUpdate} />}

                {download?.url && (
                    <a
                        href={download.url}
                        download={download.filename}
                        aria-label="Download resume as PDF"
                        className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-accent-fg shadow-ds-sm transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                    >
                        <Download className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Download</span>
                    </a>
                )}
            </div>
        </div>
    );
};

export default TopBar;
