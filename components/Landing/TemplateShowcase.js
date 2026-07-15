'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LayoutTemplate, ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import Badge from '@/components/UI/Badge';
import Button from '@/components/UI/Button';
import templates from '@/config/templates';
import { Section, SectionHeading, Reveal } from './shared';

export default function TemplateShowcase() {
    const trackRef = useRef(null);

    const scrollBy = dir => {
        const el = trackRef.current;
        if (!el) return;
        el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: 'smooth' });
    };

    return (
        <Section id="templates">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <div className="max-w-xl">
                    <Reveal><span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1 text-xs font-semibold text-fg-muted shadow-ds-sm"><LayoutTemplate className="h-3.5 w-3.5 text-accent" /> Templates</span></Reveal>
                    <Reveal delay={0.05}><h2 className="mt-4 text-3xl font-bold tracking-tight text-fg sm:text-4xl">Designs that pass and impress</h2></Reveal>
                    <Reveal delay={0.1}><p className="mt-3 text-base text-fg-muted">Six professionally crafted layouts, each tuned for a target ATS score and role.</p></Reveal>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => scrollBy(-1)} aria-label="Previous templates" className="flex h-10 w-10 items-center justify-center rounded-xl border border-line text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg">
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button onClick={() => scrollBy(1)} aria-label="Next templates" className="flex h-10 w-10 items-center justify-center rounded-xl border border-line text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg">
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div
                ref={trackRef}
                className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
                {templates.map(t => (
                    <div key={t.id} className="group w-64 shrink-0 snap-start">
                        <div className="relative overflow-hidden rounded-2xl border border-line bg-surface shadow-ds-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-ds-lg">
                            <div className="relative aspect-[3/4] overflow-hidden bg-surface-2">
                                <Image
                                    src={t.thumbnail}
                                    alt={`${t.name} resume template`}
                                    fill
                                    sizes="256px"
                                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                <div className="absolute inset-x-0 bottom-0 translate-y-2 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                                    <Button as={Link} href="/templates" variant="secondary" size="sm" fullWidth rightIcon={<ArrowUpRight className="h-3.5 w-3.5" />}>
                                        Live preview
                                    </Button>
                                </div>
                                <div className="absolute right-2 top-2">
                                    <Badge tone={t.atsScore >= 90 ? 'success' : t.atsScore >= 80 ? 'accent' : 'warning'} size="sm">ATS {t.atsScore}</Badge>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="text-sm font-semibold text-fg">{t.name}</h3>
                                <p className="mt-0.5 truncate text-xs text-fg-muted">{t.recommendedRoles.slice(0, 2).join(' · ')}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 text-center">
                <Button as={Link} href="/templates" variant="outline" size="lg" rightIcon={<ArrowUpRight className="h-4 w-4" />}>
                    Browse all templates
                </Button>
            </div>
        </Section>
    );
}
