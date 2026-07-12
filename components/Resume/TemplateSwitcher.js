'use client';

import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import templates from '@/config/templates';
import { setTemplate } from '@/store/slices/resumeSlice';

// Compact, keyboard-navigable template picker used inside the editor so a
// template can be swapped without leaving the page or reloading.
const TemplateSwitcher = () => {
    const dispatch = useDispatch();
    const selectedTemplate = useSelector(state => state.resume.selectedTemplate);

    return (
        <div role="radiogroup" aria-label="Choose resume template" className="flex flex-wrap gap-2">
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
                        className={`group relative flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-1 ${
                            isSelected
                                ? 'border-[#6F42C1] bg-[#6F42C1]/10 text-[#6F42C1] shadow-sm'
                                : 'border-gray-300 bg-white text-gray-600 hover:border-[#6F42C1]/50 hover:bg-[#6F42C1]/5'
                        }`}
                    >
                        <span className="relative h-8 w-6 overflow-hidden rounded border border-black/10">
                            <Image src={template.thumbnail} alt="" fill sizes="24px" className="object-cover" />
                        </span>
                        {template.name}
                    </button>
                );
            })}
        </div>
    );
};

export default TemplateSwitcher;
