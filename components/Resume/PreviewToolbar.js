'use client';

import { Download, Maximize2, Printer, ZoomIn, ZoomOut, ScanLine, Rows3 } from 'lucide-react';

const ToolbarIconButton = ({ onClick, disabled, active, title, ariaLabel, children }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        title={title}
        aria-label={ariaLabel || title}
        aria-pressed={active}
        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
            active ? 'bg-accent/15 text-accent' : 'text-fg-muted hover:bg-surface-2 hover:text-fg'
        }`}
    >
        {children}
    </button>
);

/**
 * Floating glass toolbar for the live PDF preview. Purely presentational —
 * every action is a callback prop wired up in `Preview.js`, which owns the
 * actual zoom/fit/PDF-generation state.
 */
const PreviewToolbar = ({
    zoomPercent,
    onZoomIn,
    onZoomOut,
    canZoomIn,
    canZoomOut,
    zoomMode,
    onFitWidth,
    onFitPage,
    onFullscreen,
    onPrint,
    downloadUrl,
    downloadFilename,
    disabled,
}) => (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-line bg-surface/70 px-2 py-1.5 shadow-ds-sm backdrop-blur-xl">
        <div className="flex items-center gap-0.5">
            <ToolbarIconButton onClick={onZoomOut} disabled={disabled || !canZoomOut} title="Zoom out">
                <ZoomOut className="h-4 w-4" />
            </ToolbarIconButton>
            <span className="w-11 text-center text-xs font-medium tabular-nums text-fg-muted">{zoomPercent}%</span>
            <ToolbarIconButton onClick={onZoomIn} disabled={disabled || !canZoomIn} title="Zoom in">
                <ZoomIn className="h-4 w-4" />
            </ToolbarIconButton>

            <div className="mx-1 h-5 w-px bg-line" aria-hidden="true" />

            <ToolbarIconButton onClick={onFitWidth} disabled={disabled} active={zoomMode === 'fitWidth'} title="Fit width">
                <Rows3 className="h-4 w-4 rotate-90" />
            </ToolbarIconButton>
            <ToolbarIconButton onClick={onFitPage} disabled={disabled} active={zoomMode === 'fitPage'} title="Fit page">
                <ScanLine className="h-4 w-4" />
            </ToolbarIconButton>
        </div>

        <div className="flex items-center gap-0.5">
            <ToolbarIconButton onClick={onFullscreen} disabled={disabled} title="Fullscreen preview">
                <Maximize2 className="h-4 w-4" />
            </ToolbarIconButton>
            <ToolbarIconButton onClick={onPrint} disabled={disabled} title="Print">
                <Printer className="h-4 w-4" />
            </ToolbarIconButton>
            {downloadUrl && (
                <a
                    href={downloadUrl}
                    download={downloadFilename}
                    aria-label="Download resume as PDF"
                    title="Download"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                    <Download className="h-4 w-4" />
                </a>
            )}
        </div>
    </div>
);

export default PreviewToolbar;
