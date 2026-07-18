'use client';

import { createElement, useEffect, useMemo, useRef, useState } from 'react';
import { usePDF } from '@react-pdf/renderer';
import { Document, Page, pdfjs } from 'react-pdf';
import { Loader2 } from 'lucide-react';
import { loadTemplateComponent } from '@/components/Resume/templates/registry';

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.js', import.meta.url).toString();

// Module-level cache keyed by resume id, storing the last generated blob URL
// alongside the content snapshot it was built from — so re-rendering the
// dashboard (e.g. after a rename) doesn't regenerate a thumbnail whose actual
// resume content hasn't changed. Never persisted (matches the app's
// "Firestore only, no Storage" constraint) — just an in-memory cache for the
// lifetime of the tab.
const thumbnailCache = new Map();

function useTemplateComponent(templateId, enabled) {
    const [loaded, setLoaded] = useState(null);

    useEffect(() => {
        if (!enabled) return undefined;
        let cancelled = false;
        loadTemplateComponent(templateId).then(resolved => {
            if (!cancelled) setLoaded({ id: templateId, Component: resolved });
        });
        return () => {
            cancelled = true;
        };
    }, [templateId, enabled]);

    return loaded?.id === templateId ? loaded.Component : null;
}

/**
 * Real react-pdf-rendered preview of a resume, cropped to a card-sized
 * window. Only starts rendering once the card scrolls into view
 * (IntersectionObserver) — with many resumes on a dashboard, mounting
 * react-pdf for all of them at once would be a real perf cost, so this
 * defers the work exactly like a lazy-loaded image.
 */
const ResumeThumbnail = ({ resume, template }) => {
    const wrapperRef = useRef(null);
    const [visible, setVisible] = useState(false);
    const [width, setWidth] = useState(320);

    useEffect(() => {
        const el = wrapperRef.current;
        if (!el || typeof IntersectionObserver === 'undefined') {
            setVisible(true);
            return undefined;
        }
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '200px' },
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const el = wrapperRef.current;
        if (!el || typeof ResizeObserver === 'undefined') return undefined;
        const observer = new ResizeObserver(() => setWidth(el.clientWidth));
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const { selectedTemplate, saved: _saved, ...content } = resume;
    const contentKey = useMemo(() => JSON.stringify(content), [content]);
    const cacheKey = `${resume.id}:${selectedTemplate}:${contentKey}`;
    const cached = thumbnailCache.get(resume.id);
    const needsRender = visible && cached?.key !== cacheKey;

    const TemplateComponent = useTemplateComponent(selectedTemplate, needsRender);
    const pdfDocument = useMemo(() => {
        if (!TemplateComponent) return null;
        return createElement(TemplateComponent, { data: content });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [TemplateComponent, contentKey]);

    const [instance, updateInstance] = usePDF({ document: pdfDocument ?? undefined });

    useEffect(() => {
        if (pdfDocument) updateInstance(pdfDocument);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pdfDocument]);

    useEffect(() => {
        if (instance.url && !instance.loading && !instance.error) {
            thumbnailCache.set(resume.id, { key: cacheKey, url: instance.url });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [instance.url, instance.loading, instance.error]);

    const resolvedUrl = cached?.key === cacheKey ? cached.url : instance.url && !instance.loading && !instance.error ? instance.url : null;

    return (
        <div ref={wrapperRef} className="relative h-36 w-full overflow-hidden bg-canvas">
            {!resolvedUrl ? (
                <div
                    className="flex h-full w-full items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${template.primaryColor}, ${template.secondaryColor})` }}
                >
                    {visible && <Loader2 className="h-5 w-5 animate-spin text-white/70" aria-label="Generating preview" />}
                </div>
            ) : (
                <Document file={resolvedUrl} loading={null} error={null}>
                    <Page pageNumber={1} renderTextLayer={false} renderAnnotationLayer={false} width={width} className="mx-auto" />
                </Document>
            )}
        </div>
    );
};

export default ResumeThumbnail;
