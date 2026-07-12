'use client';

import { memo, useState } from 'react';
import Link from 'next/link';
import { FaEdit, FaCopy, FaTrash, FaPen } from 'react-icons/fa';
import { getTemplateById } from '@/config/templates';

const formatRelativeTime = timestamp => {
    if (!timestamp?.toMillis) return 'Unknown';
    const diffMs = Date.now() - timestamp.toMillis();
    const diffMin = Math.round(diffMs / 60000);
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.round(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDay = Math.round(diffHr / 24);
    return `${diffDay}d ago`;
};

const ResumeCard = ({ resume, onDuplicate, onDelete, onRename }) => {
    const [isRenaming, setIsRenaming] = useState(false);
    const [name, setName] = useState(resume.name);
    const template = getTemplateById(resume.selectedTemplate);

    const submitRename = () => {
        setIsRenaming(false);
        if (name.trim() && name.trim() !== resume.name) {
            onRename(resume.id, name.trim());
        } else {
            setName(resume.name);
        }
    };

    return (
        <div className="group relative rounded-xl border border-purple-500/20 bg-slate-900/40 p-4 shadow-lg transition-all duration-300 hover:border-purple-500/40 hover:shadow-purple-500/20">
            <div
                className="mb-4 flex h-32 items-center justify-center rounded-lg text-3xl font-black text-white/90"
                style={{ background: `linear-gradient(135deg, ${template.primaryColor}, ${template.secondaryColor})` }}
            >
                {template.name}
            </div>

            {isRenaming ? (
                <input
                    autoFocus
                    value={name}
                    onChange={e => setName(e.target.value)}
                    onBlur={submitRename}
                    onKeyDown={e => e.key === 'Enter' && submitRename()}
                    className="mb-1 w-full rounded-md border border-gray-600 bg-gray-800 px-2 py-1 text-white outline-none focus:border-primary-400"
                />
            ) : (
                <h3 className="mb-1 truncate text-base font-semibold text-white">{resume.name}</h3>
            )}

            <div className="mb-4 flex items-center justify-between text-xs text-slate-400">
                <span className="rounded-full bg-purple-500/10 px-2 py-1 text-purple-300">{template.name}</span>
                <span>{formatRelativeTime(resume.updatedAt)}</span>
            </div>

            <div className="flex items-center gap-2">
                <Link
                    href={`/editor/${resume.id}`}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-3 py-2 text-sm font-semibold text-white transition-transform hover:scale-105"
                >
                    <FaEdit className="h-3.5 w-3.5" /> Edit
                </Link>
                <button
                    onClick={() => setIsRenaming(true)}
                    title="Rename"
                    className="rounded-lg border border-purple-500/20 p-2 text-slate-300 transition-colors hover:bg-purple-500/10 hover:text-white"
                >
                    <FaPen className="h-3.5 w-3.5" />
                </button>
                <button
                    onClick={() => onDuplicate(resume.id)}
                    title="Duplicate"
                    className="rounded-lg border border-purple-500/20 p-2 text-slate-300 transition-colors hover:bg-purple-500/10 hover:text-white"
                >
                    <FaCopy className="h-3.5 w-3.5" />
                </button>
                <button
                    onClick={() => onDelete(resume.id)}
                    title="Delete"
                    className="rounded-lg border border-red-500/20 p-2 text-red-300 transition-colors hover:bg-red-500/10"
                >
                    <FaTrash className="h-3.5 w-3.5" />
                </button>
            </div>
        </div>
    );
};

export default memo(ResumeCard);
