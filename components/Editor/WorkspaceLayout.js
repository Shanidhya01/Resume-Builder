'use client';

import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { GripVertical } from 'lucide-react';
import useIsDesktop from '@/hooks/useIsDesktop';

/**
 * The editor's split workspace. Desktop (>= md) gets a draggable
 * react-resizable-panels split (width persisted to localStorage via
 * `autoSaveId`); below that, resizing isn't a meaningful affordance so we
 * fall back to a single stacked pane toggled by `previewMode`.
 *
 * `left`/`right` are rendered exactly once per breakpoint branch — never
 * both at once — so the (expensive) PDF preview and dnd-kit-powered form
 * never double-mount.
 */
const WorkspaceLayout = ({ left, right, previewMode = false }) => {
    const isDesktop = useIsDesktop();

    if (!isDesktop) {
        return (
            <div className="min-h-0 flex-1">
                <div className={previewMode ? 'block' : 'hidden'}>{right}</div>
                <div className={previewMode ? 'hidden' : 'block'}>{left}</div>
            </div>
        );
    }

    return (
        <PanelGroup direction="horizontal" autoSaveId="editor-workspace-split" className="min-h-0 flex-1">
            <Panel id="editor-form" order={1} defaultSize={55} minSize={32} className="min-h-0 overflow-y-auto pr-3">
                {left}
            </Panel>
            <PanelResizeHandle className="group relative mx-1 flex w-3 shrink-0 cursor-col-resize items-center justify-center outline-none">
                <span className="pointer-events-none absolute inset-y-2 left-1/2 w-px -translate-x-1/2 rounded-full bg-line transition-colors group-hover:bg-accent group-data-[resize-handle-active]:bg-accent" />
                <span className="pointer-events-none relative z-10 flex h-8 w-4 items-center justify-center rounded-md border border-line bg-surface text-fg-subtle opacity-0 shadow-ds-sm transition-opacity group-hover:opacity-100 group-data-[resize-handle-active]:opacity-100">
                    <GripVertical className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
            </PanelResizeHandle>
            <Panel id="editor-preview" order={2} defaultSize={45} minSize={26} className="min-h-0 overflow-y-auto pl-3">
                {right}
            </Panel>
        </PanelGroup>
    );
};

export default WorkspaceLayout;
