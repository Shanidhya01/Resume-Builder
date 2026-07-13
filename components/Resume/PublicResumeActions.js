'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { pdf } from '@react-pdf/renderer';
import { FaDownload, FaPrint, FaShareAlt } from 'react-icons/fa';
import { CgSpinner } from 'react-icons/cg';
import { loadTemplateComponent } from '@/components/Resume/templates/registry';
import { useToast } from '@/context/ToastContext';

const ShareDialog = dynamic(() => import('@/components/Share/ShareDialog'), { ssr: false });

const recordDownload = slug => {
    fetch('/api/public/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
    }).catch(() => {});
};

// Read-only action bar for the public resume page: generates the PDF
// on-demand client-side (reusing the exact same template components as the
// authenticated editor's Preview — see templates/registry.js), never
// storing the file anywhere. No editing controls of any kind.
const PublicResumeActions = ({ resume, slug, publicUrl }) => {
    const { showToast } = useToast();
    const [downloading, setDownloading] = useState(false);
    const [shareOpen, setShareOpen] = useState(false);

    const handleDownload = async () => {
        setDownloading(true);
        try {
            const TemplateComponent = await loadTemplateComponent(resume.selectedTemplate);
            const blob = await pdf(<TemplateComponent data={resume} />).toBlob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${resume.contact?.name || resume.name || 'resume'}.pdf`;
            link.click();
            URL.revokeObjectURL(url);
            recordDownload(slug);
        } catch (err) {
            showToast("Couldn't generate the PDF. Please try again.", { tone: 'error' });
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 print:hidden">
            <button
                type="button"
                onClick={handleDownload}
                disabled={downloading}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-purple-500/30 transition-transform hover:scale-105 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
            >
                {downloading ? <CgSpinner className="h-4 w-4 animate-spin" aria-hidden="true" /> : <FaDownload className="h-3.5 w-3.5" aria-hidden="true" />}
                {downloading ? 'Preparing PDF...' : 'Download PDF'}
            </button>
            <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-2 rounded-xl border border-purple-500/30 px-5 py-2.5 text-sm font-semibold text-purple-200 hover:bg-purple-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
            >
                <FaPrint className="h-3.5 w-3.5" aria-hidden="true" /> Print
            </button>
            <button
                type="button"
                onClick={() => setShareOpen(true)}
                className="flex items-center gap-2 rounded-xl border border-purple-500/30 px-5 py-2.5 text-sm font-semibold text-purple-200 hover:bg-purple-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
            >
                <FaShareAlt className="h-3.5 w-3.5" aria-hidden="true" /> Share
            </button>

            {shareOpen && (
                <ShareDialog resumeName={resume.name} publicUrl={publicUrl} onClose={() => setShareOpen(false)} />
            )}
        </div>
    );
};

export default PublicResumeActions;
