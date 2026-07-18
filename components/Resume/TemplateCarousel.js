'use client';

import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import templates from '@/config/templates';
import { setTemplate } from '@/store/slices/resumeSlice';

/**
 * In-editor template picker as a horizontally scrollable, snap carousel.
 * Same data/dispatch as the old `TemplateSwitcher` — only the presentation
 * changes (larger thumbnails, scroll-snap, chevron nav on desktop).
 */
const TemplateCarousel = () => {
    const dispatch = useDispatch();
    const selectedTemplate = useSelector(state => state.resume.selectedTemplate);
    const trackRef = useRef(null);

    const scrollBy = dir => {
        trackRef.current?.scrollBy({ left: dir * 220, behavior: 'smooth' });
    };

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => scrollBy(-1)}
                aria-label="Scroll templates left"
                className="absolute -left-2 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-surface shadow-ds-sm hover:bg-surface-2 md:flex"
            >
                <ChevronLeft className="h-4 w-4 text-fg-muted" />
            </button>

            <div
                ref={trackRef}
                role="radiogroup"
                aria-label="Choose resume template"
                className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-1 py-1"
                style={{ scrollbarWidth: 'thin' }}
            >
                {templates.map(template => {
                    const isSelected = template.id === selectedTemplate;
                    return (
                        <button
                            key={template.id}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            aria-label={`Use ${template.name} template`}
                            onClick={() => dispatch(setTemplate(template.id))}
                            className={`group relative flex shrink-0 snap-start flex-col gap-2 rounded-2xl border p-2 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-surface ${
                                isSelected
                                    ? 'border-accent bg-accent/5 shadow-ds-md'
                                    : 'border-line bg-surface hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-ds-sm'
                            }`}
                        >
                            <span className="relative block h-32 w-24 overflow-hidden rounded-lg border border-line bg-surface-2">
                                <Image src={template.thumbnail} alt="" fill sizes="96px" className="object-cover" />
                                {isSelected && (
                                    <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-accent-fg shadow-ds-sm">
                                        <Check className="h-3 w-3" />
                                    </span>
                                )}
                            </span>
                            <span className="text-xs font-semibold text-fg">{template.name}</span>
                        </button>
                    );
                })}
            </div>

            <button
                type="button"
                onClick={() => scrollBy(1)}
                aria-label="Scroll templates right"
                className="absolute -right-2 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-surface shadow-ds-sm hover:bg-surface-2 md:flex"
            >
                <ChevronRight className="h-4 w-4 text-fg-muted" />
            </button>
        </div>
    );
};

export default TemplateCarousel;
