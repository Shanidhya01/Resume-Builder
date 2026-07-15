'use client';

import { createElement, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Loader2, Download, Maximize2, ZoomIn, ZoomOut } from 'lucide-react';
import { usePDF } from '@react-pdf/renderer';
import { Document, Page, pdfjs } from 'react-pdf';
import { loadTemplateComponent } from './templates/registry';
import { getTemplateById } from '@/config/templates';
import Button from '@/components/UI/Button';

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.js', import.meta.url).toString();

const MIN_ZOOM = 0.6;
const MAX_ZOOM = 1.6;
const ZOOM_STEP = 0.2;

const Loader = () => (
    <div className="flex min-h-[24rem] w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-accent" />
    </div>
);

const openPreviewWindow = url => {
    window.open(
        url,
        'Resume Preview',
        `toolbar=no, location=no, menubar=no, scrollbars=no, status=no, titlebar=no, resizable=no, width=600, height=800, left=${window.innerWidth / 2 - 300}, top=100`,
    );
};

// Resolves the code-split PDF component for the currently selected template.
// Kept as a hook so Preview and any future consumer (e.g. a print route)
// share the same load/cache behavior. The loaded component is stored together
// with the template id it belongs to, so switching templates yields `null`
// (not a stale component) until the new one resolves — without any
// synchronous state reset inside the effect.
function useTemplateComponent(templateId) {
    const [loaded, setLoaded] = useState(null); // { id, Component }

    useEffect(() => {
        let cancelled = false;

        loadTemplateComponent(templateId).then(resolved => {
            if (!cancelled) setLoaded({ id: templateId, Component: resolved });
        });

        return () => {
            cancelled = true;
        };
    }, [templateId]);

    return loaded?.id === templateId ? loaded.Component : null;
}

const Preview = () => {
    const parentRef = useRef(null);
    const resumeData = useSelector(state => state.resume);
    const { selectedTemplate, saved, ...content } = resumeData;

    const TemplateComponent = useTemplateComponent(selectedTemplate);

    // The resume content object is recreated on every render (destructured from
    // the Redux state above), so the memo keys off a stable serialization of it.
    const contentKey = JSON.stringify(content);
    const pdfDocument = useMemo(() => {
        if (!TemplateComponent) return null;
        return createElement(TemplateComponent, { data: content });
        // `contentKey` stands in for `content` — same data, stable identity.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [TemplateComponent, contentKey]);

    const [instance, updateInstance] = usePDF({ document: pdfDocument ?? undefined });

    useEffect(() => {
        if (pdfDocument && saved) updateInstance(pdfDocument);
    }, [saved, pdfDocument, updateInstance]);

    useEffect(() => {
        if (pdfDocument) updateInstance(pdfDocument);
        // Force a refresh whenever the resolved template component itself changes,
        // independent of the `saved` flag, so switching templates updates instantly.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [TemplateComponent]);

    // Measured via ResizeObserver so the render never reads the ref directly;
    // also keeps the rendered PDF page in step with viewport resizes.
    const [pageWidth, setPageWidth] = useState(null);
    const [zoom, setZoom] = useState(1);

    useEffect(() => {
        const el = parentRef.current;
        if (!el || typeof ResizeObserver === 'undefined') return undefined;

        const observer = new ResizeObserver(() => {
            setPageWidth(el.clientWidth - 16);
        });
        observer.observe(el);

        return () => observer.disconnect();
    }, []);

    const templateMeta = getTemplateById(selectedTemplate);
    const isReady = pdfDocument && !instance.loading;
    const renderWidth = pageWidth != null ? Math.round(pageWidth * zoom) : undefined;

    return (
        <div className="w-full md:max-w-[24rem] 2xl:max-w-[28rem]">
            <div className="relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-ds-sm">
                {/* Toolbar */}
                <div className="flex items-center justify-between gap-2 border-b border-line bg-surface-2/60 px-3 py-2">
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                            Live
                        </span>
                        {templateMeta && (
                            <span className="rounded-full border border-line bg-surface px-2.5 py-1 text-xs font-semibold text-fg-muted">
                                {templateMeta.name}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-0.5">
                        <button
                            type="button"
                            onClick={() => setZoom(z => Math.max(MIN_ZOOM, +(z - ZOOM_STEP).toFixed(2)))}
                            disabled={zoom <= MIN_ZOOM}
                            aria-label="Zoom out"
                            className="rounded-lg p-1.5 text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                        >
                            <ZoomOut className="h-4 w-4" />
                        </button>
                        <span className="w-9 text-center text-xs tabular-nums text-fg-muted">{Math.round(zoom * 100)}%</span>
                        <button
                            type="button"
                            onClick={() => setZoom(z => Math.min(MAX_ZOOM, +(z + ZOOM_STEP).toFixed(2)))}
                            disabled={zoom >= MAX_ZOOM}
                            aria-label="Zoom in"
                            className="rounded-lg p-1.5 text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                        >
                            <ZoomIn className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* PDF viewport */}
                <div ref={parentRef} className="relative flex max-h-[70vh] min-h-[24rem] w-full items-start justify-center overflow-auto bg-canvas p-4 md:p-6">
                    {instance.error ? (
                        <div className="flex flex-col items-center gap-2 py-10 text-center text-sm text-red-600 dark:text-red-400">
                            <p className="font-semibold">Couldn&apos;t generate the PDF preview.</p>
                            <p className="text-red-500">Please check your resume fields and try again.</p>
                        </div>
                    ) : !isReady ? (
                        <Loader />
                    ) : (
                        <Document
                            loading={<Loader />}
                            file={instance.url}
                            error={
                                <p className="py-10 text-center text-sm text-red-600 dark:text-red-400">
                                    Couldn&apos;t render the PDF preview.
                                </p>
                            }
                        >
                            <Page
                                pageNumber={1}
                                renderTextLayer={false}
                                renderAnnotationLayer={false}
                                loading={<Loader />}
                                width={renderWidth}
                                className="overflow-hidden rounded-lg shadow-ds-md ring-1 ring-line"
                            />
                        </Document>
                    )}
                </div>

                {/* Actions */}
                {isReady && !instance.error && (
                    <div className="flex justify-center gap-2.5 border-t border-line bg-surface px-4 py-3">
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => openPreviewWindow(instance.url)}
                            aria-label="Open full-size PDF preview in a new window"
                            leftIcon={<Maximize2 className="h-4 w-4" />}
                        >
                            Fullscreen
                        </Button>
                        <Button
                            as="a"
                            href={instance.url}
                            download={`${resumeData.contact?.name || 'resume'}.pdf`}
                            size="sm"
                            aria-label="Download resume as PDF"
                            leftIcon={<Download className="h-4 w-4" />}
                        >
                            Download
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Preview;
