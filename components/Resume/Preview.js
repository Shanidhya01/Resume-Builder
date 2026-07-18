'use client';

import { createElement, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Loader2 } from 'lucide-react';
import { usePDF } from '@react-pdf/renderer';
import { Document, Page, pdfjs } from 'react-pdf';
import { loadTemplateComponent } from './templates/registry';
import { getTemplateById } from '@/config/templates';
import PreviewToolbar from './PreviewToolbar';
import PreviewFullscreenModal from './PreviewFullscreenModal';

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.js', import.meta.url).toString();

const MIN_ZOOM = 0.6;
const MAX_ZOOM = 1.6;
const ZOOM_STEP = 0.2;
const REFRESH_DEBOUNCE_MS = 400;
// US Letter aspect ratio (height / width), used to approximate "fit page".
const PAGE_ASPECT = 11 / 8.5;

const Loader = () => (
    <div className="flex min-h-[24rem] w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-accent" />
    </div>
);

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

/**
 * `onReady` is an optional callback invoked with `{url, filename, error}`
 * whenever the generated PDF instance changes — lets the page-level TopBar
 * mirror the Download button without lifting the whole `usePDF` instance.
 */
const Preview = ({ onReady }) => {
    const parentRef = useRef(null);
    const resumeData = useSelector(state => state.resume);
    // `saved` was only ever a proxy for "content changed" driven by a now-removed
    // local-save timer; excluded from `content` so it never dirties the PDF diff.
    const { selectedTemplate, saved: _saved, ...content } = resumeData;

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

    // Refresh the rendered PDF whenever the underlying content actually
    // changes (debounced so rapid typing doesn't thrash PDF regeneration).
    // Previously this was gated on a vestigial `saved` flag that was only
    // ever flipped by a local 10s save-interval timer; that timer has been
    // removed, so the refresh now fires directly off content changes.
    useEffect(() => {
        if (!pdfDocument) return undefined;
        const timer = setTimeout(() => updateInstance(pdfDocument), REFRESH_DEBOUNCE_MS);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contentKey]);

    useEffect(() => {
        if (pdfDocument) updateInstance(pdfDocument);
        // Force a refresh whenever the resolved template component itself changes,
        // independent of content, so switching templates updates instantly.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [TemplateComponent]);

    // Measured via ResizeObserver so the render never reads the ref directly;
    // also keeps the rendered PDF page in step with viewport resizes.
    const [pageWidth, setPageWidth] = useState(null);
    const [containerHeight, setContainerHeight] = useState(null);
    const [customZoom, setCustomZoom] = useState(1);
    const [zoomMode, setZoomMode] = useState('fitWidth'); // 'fitWidth' | 'fitPage' | 'custom'
    const [fullscreenOpen, setFullscreenOpen] = useState(false);

    useEffect(() => {
        const el = parentRef.current;
        if (!el || typeof ResizeObserver === 'undefined') return undefined;

        const observer = new ResizeObserver(() => {
            setPageWidth(el.clientWidth - 16);
            setContainerHeight(el.clientHeight - 16);
        });
        observer.observe(el);

        return () => observer.disconnect();
    }, []);

    // Derived rather than synced via effect: fit-width/fit-page zoom is a pure
    // function of the current mode + measured container size, so it's computed
    // directly during render instead of being mirrored into its own state.
    const zoom =
        zoomMode === 'fitWidth'
            ? 1
            : zoomMode === 'fitPage' && pageWidth && containerHeight
              ? Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, containerHeight / (pageWidth * PAGE_ASPECT)))
              : customZoom;

    const templateMeta = getTemplateById(selectedTemplate);
    const isReady = pdfDocument && !instance.loading;
    const renderWidth = pageWidth != null ? Math.round(pageWidth * zoom) : undefined;
    const filename = `${resumeData.contact?.name || 'resume'}.pdf`;

    useEffect(() => {
        onReady?.({
            url: isReady && !instance.error ? instance.url : null,
            filename,
            error: instance.error || null,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isReady, instance.url, instance.error, filename]);

    const zoomOut = () => {
        setCustomZoom(Math.max(MIN_ZOOM, +(zoom - ZOOM_STEP).toFixed(2)));
        setZoomMode('custom');
    };
    const zoomIn = () => {
        setCustomZoom(Math.min(MAX_ZOOM, +(zoom + ZOOM_STEP).toFixed(2)));
        setZoomMode('custom');
    };
    const handlePrint = () => {
        if (!instance.url) return;
        const win = window.open(instance.url, '_blank');
        win?.addEventListener('load', () => win.print());
    };

    return (
        <div className="flex w-full flex-col gap-3 md:max-w-[26rem] 2xl:max-w-[30rem]">
            <PreviewToolbar
                zoomPercent={Math.round(zoom * 100)}
                onZoomIn={zoomIn}
                onZoomOut={zoomOut}
                canZoomIn={zoom < MAX_ZOOM}
                canZoomOut={zoom > MIN_ZOOM}
                zoomMode={zoomMode}
                onFitWidth={() => setZoomMode('fitWidth')}
                onFitPage={() => setZoomMode('fitPage')}
                onFullscreen={() => setFullscreenOpen(true)}
                onPrint={handlePrint}
                downloadUrl={isReady && !instance.error ? instance.url : null}
                downloadFilename={filename}
                disabled={!isReady || !!instance.error}
            />

            <div className="relative flex flex-col overflow-hidden rounded-2xl border border-line bg-gradient-to-b from-surface-2/40 to-surface shadow-ds-md">
                <div className="flex items-center gap-2 border-b border-line bg-surface-2/60 px-3 py-2">
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

                {/* PDF viewport */}
                <div
                    ref={parentRef}
                    className="relative flex max-h-[75vh] min-h-[24rem] w-full items-start justify-center overflow-auto bg-canvas p-4 md:p-6"
                >
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
                                className="overflow-hidden rounded-lg shadow-ds-lg ring-1 ring-line transition-[width] duration-200 ease-out"
                            />
                        </Document>
                    )}
                </div>
            </div>

            {fullscreenOpen && isReady && !instance.error && (
                <PreviewFullscreenModal url={instance.url} filename={filename} onClose={() => setFullscreenOpen(false)} />
            )}
        </div>
    );
};

export default Preview;
