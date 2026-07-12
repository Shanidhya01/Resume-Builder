'use client';

import { memo, useCallback, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { HiSparkles } from 'react-icons/hi';
import { IoMdCheckmarkCircle } from 'react-icons/io';
import templates from '@/config/templates';
import { setTemplate } from '@/store/slices/resumeSlice';
import TemplatePreviewModal from '@/components/Resume/TemplatePreviewModal';

const AtsBadge = memo(function AtsBadge({ score }) {
    const tone = score >= 90 ? 'text-green-300 border-green-500/30 bg-green-500/10' : score >= 75 ? 'text-yellow-300 border-yellow-500/30 bg-yellow-500/10' : 'text-orange-300 border-orange-500/30 bg-orange-500/10';
    return (
        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${tone}`}>
            <IoMdCheckmarkCircle className="h-3.5 w-3.5" />
            {score}% ATS
        </span>
    );
});

// Memoized so opening the preview modal (which only changes `previewIndex`
// state in the parent) doesn't re-render all six cards — only the card whose
// `isSelected`/`onPreview` props actually changed re-renders.
const TemplateCard = memo(function TemplateCard({ template, index, isSelected, onPreview, onUse }) {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className={`relative flex flex-col bg-white/5 backdrop-blur-lg border rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 ${
                isSelected ? 'border-purple-400 ring-2 ring-purple-400/50' : 'border-white/10 hover:shadow-purple-500/30'
            }`}
        >
            {isSelected && (
                <span className="absolute top-3 right-3 z-10 rounded-full bg-purple-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                    Selected
                </span>
            )}

            <button
                type="button"
                onClick={() => onPreview(index)}
                aria-label={`Preview ${template.name} template`}
                className="relative w-full h-56 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
            >
                <Image
                    src={template.thumbnail}
                    alt={`${template.name} resume template thumbnail`}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
            </button>

            <div className="flex flex-1 flex-col p-6 text-left">
                <div className="mb-2 flex items-center justify-between gap-2">
                    <h3 className="text-xl font-semibold text-white">{template.name}</h3>
                    <AtsBadge score={template.atsScore} />
                </div>

                <p className="mb-4 text-sm text-slate-300">{template.description}</p>

                <div className="mb-5 flex flex-wrap gap-2">
                    {template.recommendedRoles.slice(0, 3).map(role => (
                        <span
                            key={role}
                            className="bg-white/10 border border-white/10 text-slate-300 text-xs px-2.5 py-1 rounded-full"
                        >
                            {role}
                        </span>
                    ))}
                </div>

                <div className="mt-auto flex gap-3">
                    <button
                        type="button"
                        onClick={() => onPreview(index)}
                        aria-label={`Open full preview for ${template.name}`}
                        className="flex-1 rounded-xl border border-white/20 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                    >
                        Preview
                    </button>
                    <button
                        type="button"
                        onClick={() => onUse(template.id)}
                        aria-label={`Use ${template.name} template`}
                        className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-2.5 text-sm font-semibold text-white transition hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
                    >
                        Use Template
                    </button>
                </div>
            </div>
        </motion.div>
    );
});

export default function TemplatesPage() {
    const dispatch = useDispatch();
    const router = useRouter();
    const selectedTemplate = useSelector(state => state.resume.selectedTemplate);
    const [previewIndex, setPreviewIndex] = useState(null);

    const useTemplate = useCallback(
        templateId => {
            dispatch(setTemplate(templateId));
            router.push('/editor');
        },
        [dispatch, router],
    );

    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
            {/* Background animation */}
            <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-sm font-medium text-white/90">
                    <HiSparkles className="w-4 h-4 text-yellow-400" />
                    <span>Choose Your Perfect Template</span>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>

                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl sm:text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                >
                    Pick Your Resume Template
                </motion.h1>
                <p className="text-slate-300 max-w-2xl mx-auto mb-12 sm:mb-16">
                    Six distinct layouts — each with its own structure, typography, and section arrangement — all
                    100% free and customizable.
                </p>

                {/* Template Grid */}
                <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {templates.map((template, index) => (
                        <TemplateCard
                            key={template.id}
                            template={template}
                            index={index}
                            isSelected={template.id === selectedTemplate}
                            onPreview={setPreviewIndex}
                            onUse={useTemplate}
                        />
                    ))}
                </div>
            </div>

            {previewIndex !== null && (
                <TemplatePreviewModal
                    templates={templates}
                    activeIndex={previewIndex}
                    onClose={() => setPreviewIndex(null)}
                    onSelectTemplate={setPreviewIndex}
                    onUseTemplate={useTemplate}
                />
            )}

            {/* Bottom gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent" aria-hidden="true"></div>
        </div>
    );
}
