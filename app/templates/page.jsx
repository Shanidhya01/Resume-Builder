'use client';

import { memo, useCallback, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, Check, Eye, Sparkles, ShieldCheck } from 'lucide-react';
import templates from '@/config/templates';
import { setTemplate } from '@/store/slices/resumeSlice';
import { createResume } from '@/lib/resumes';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import TemplatePreviewModal from '@/components/Resume/TemplatePreviewModal';
import { useFavoriteTemplates } from '@/hooks/useFavoriteTemplates';
import Button from '@/components/UI/Button';
import Badge from '@/components/UI/Badge';
import EmptyState from '@/components/UI/EmptyState';

const CATEGORIES = [
    { id: 'all', label: 'All templates' },
    { id: 'featured', label: 'Featured' },
    { id: 'favorites', label: 'Favorites' },
    { id: 'single-column', label: 'Single column' },
    { id: 'two-column', label: 'Two column' },
    { id: 'sidebar', label: 'Sidebar' },
];

const FEATURED_MIN_ATS = 92;

function atsTone(score) {
    if (score >= 90) return 'success';
    if (score >= 75) return 'warning';
    return 'danger';
}

const TemplateCard = memo(function TemplateCard({ template, isSelected, isFavorite, isCreating, onPreview, onUse, onToggleFavorite }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            whileHover={{ y: -4 }}
            className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-surface shadow-ds-sm transition-shadow duration-300 hover:shadow-ds-lg ${
                isSelected ? 'border-accent ring-2 ring-accent/40' : 'border-line'
            }`}
        >
            {/* Thumbnail */}
            <button
                type="button"
                onClick={onPreview}
                aria-label={`Preview ${template.name} template`}
                className="relative aspect-[210/240] w-full overflow-hidden bg-surface-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
                <Image
                    src={template.thumbnail}
                    alt={`${template.name} resume template thumbnail`}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="absolute inset-x-0 bottom-3 mx-auto flex w-max items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-zinc-900 opacity-0 shadow-lg backdrop-blur transition-all duration-300 group-hover:opacity-100">
                    <Eye className="h-3.5 w-3.5" /> Quick preview
                </span>
            </button>

            {/* Badges over thumbnail */}
            <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-1.5">
                {isSelected && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-accent-fg shadow-md">
                        <Check className="h-3 w-3" /> Selected
                    </span>
                )}
                {template.atsScore >= FEATURED_MIN_ATS && (
                    <Badge tone="accent" size="sm" className="shadow-sm">
                        <Sparkles className="h-3 w-3" /> Featured
                    </Badge>
                )}
            </div>

            <button
                type="button"
                onClick={onToggleFavorite}
                aria-label={isFavorite ? `Remove ${template.name} from favorites` : `Add ${template.name} to favorites`}
                aria-pressed={isFavorite}
                className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-line bg-surface/90 text-fg-muted shadow-sm backdrop-blur transition-colors hover:text-amber-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
                <Star className={`h-4 w-4 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>

            {/* Body */}
            <div className="flex flex-1 flex-col p-5 text-left">
                <div className="mb-1.5 flex items-center justify-between gap-2">
                    <h3 className="text-base font-semibold text-fg">{template.name}</h3>
                    <Badge tone={atsTone(template.atsScore)} size="sm">
                        <ShieldCheck className="h-3 w-3" /> {template.atsScore}% ATS
                    </Badge>
                </div>
                <p className="mb-4 text-sm leading-relaxed text-fg-muted">{template.description}</p>

                <div className="mb-5 flex flex-wrap gap-1.5">
                    {template.recommendedRoles.slice(0, 3).map(role => (
                        <span key={role} className="rounded-full border border-line bg-surface-2 px-2.5 py-0.5 text-xs text-fg-muted">
                            {role}
                        </span>
                    ))}
                </div>

                <div className="mt-auto flex gap-2.5">
                    <Button variant="outline" size="md" fullWidth onClick={onPreview} disabled={isCreating}>Preview</Button>
                    <Button variant="primary" size="md" fullWidth onClick={onUse} loading={isCreating} disabled={isCreating}>
                        {isCreating ? 'Creating…' : 'Use template'}
                    </Button>
                </div>
            </div>
        </motion.div>
    );
});

export default function TemplatesPage() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { user } = useAuth();
    const { error: toastError } = useToast();
    const selectedTemplate = useSelector(state => state.resume.selectedTemplate);
    const { toggle: toggleFavorite, isFavorite } = useFavoriteTemplates();

    const [previewIndex, setPreviewIndex] = useState(null);
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('all');
    const [creatingTemplateId, setCreatingTemplateId] = useState(null);

    // "Use template" always creates a Firestore-backed resume seeded with the
    // chosen template, then opens the production editor. Guests are sent to
    // sign up first so their resume can be persisted to their account.
    const applyTemplate = useCallback(
        async templateId => {
            dispatch(setTemplate(templateId));

            if (!user) {
                router.push('/register');
                return;
            }

            setCreatingTemplateId(templateId);
            try {
                const id = await createResume(user.uid, 'Untitled Resume', templateId);
                router.push(`/editor/${id}`);
            } catch {
                setCreatingTemplateId(null);
                toastError('Could not create a resume from this template. Please try again.');
            }
        },
        [dispatch, router, user, toastError],
    );

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return templates.filter(t => {
            const matchesQuery =
                !q ||
                t.name.toLowerCase().includes(q) ||
                t.description.toLowerCase().includes(q) ||
                t.recommendedRoles.some(r => r.toLowerCase().includes(q));
            const matchesCategory =
                category === 'all' ||
                (category === 'featured' && t.atsScore >= FEATURED_MIN_ATS) ||
                (category === 'favorites' && isFavorite(t.id)) ||
                t.layoutType === category;
            return matchesQuery && matchesCategory;
        });
    }, [query, category, isFavorite]);

    // Map filtered items back to their original index for the preview modal.
    const openPreview = useCallback(id => {
        setPreviewIndex(templates.findIndex(t => t.id === id));
    }, []);

    return (
        <div className="relative overflow-hidden">
            <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
            <div
                className="pointer-events-none absolute left-1/2 top-0 h-96 w-[40rem] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
                style={{ background: 'radial-gradient(circle, rgb(var(--accent)) 0%, transparent 70%)' }}
                aria-hidden="true"
            />

            <div className="relative z-10 mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
                {/* Header */}
                <div className="mx-auto mb-10 max-w-2xl text-center">
                    <Badge tone="accent" size="md" className="mb-5">
                        <Sparkles className="h-3.5 w-3.5" /> Template gallery
                    </Badge>
                    <motion.h1
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-4xl font-extrabold tracking-tight text-fg sm:text-5xl"
                    >
                        Pick your resume template
                    </motion.h1>
                    <p className="mt-4 text-lg text-fg-muted">
                        Distinct layouts — each with its own structure, typography, and section arrangement.
                        All 100% free and customizable.
                    </p>
                </div>

                {/* Controls */}
                <div className="mb-8 flex flex-col gap-4">
                    <div className="relative mx-auto w-full max-w-md">
                        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-subtle" />
                        <input
                            type="search"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Search templates or roles…"
                            aria-label="Search templates"
                            className="h-11 w-full rounded-xl border border-line bg-surface pl-10 pr-4 text-sm text-fg outline-none transition-colors placeholder:text-fg-subtle focus:border-accent focus:ring-2 focus:ring-accent/30"
                        />
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-2">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setCategory(cat.id)}
                                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                                    category === cat.id
                                        ? 'border-accent bg-accent text-accent-fg'
                                        : 'border-line bg-surface text-fg-muted hover:bg-surface-2 hover:text-fg'
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                {filtered.length > 0 ? (
                    <motion.div layout className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <AnimatePresence mode="popLayout">
                            {filtered.map(template => (
                                <TemplateCard
                                    key={template.id}
                                    template={template}
                                    isSelected={template.id === selectedTemplate}
                                    isFavorite={isFavorite(template.id)}
                                    isCreating={creatingTemplateId === template.id}
                                    onPreview={() => openPreview(template.id)}
                                    onUse={() => applyTemplate(template.id)}
                                    onToggleFavorite={() => toggleFavorite(template.id)}
                                />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                ) : (
                    <EmptyState
                        icon={Search}
                        title="No templates found"
                        description="Try a different search term or category."
                        actionLabel="Clear filters"
                        onAction={() => { setQuery(''); setCategory('all'); }}
                    />
                )}
            </div>

            {previewIndex !== null && (
                <TemplatePreviewModal
                    templates={templates}
                    activeIndex={previewIndex}
                    onClose={() => setPreviewIndex(null)}
                    onSelectTemplate={setPreviewIndex}
                    onUseTemplate={applyTemplate}
                />
            )}
        </div>
    );
}
