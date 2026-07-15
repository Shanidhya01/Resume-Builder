'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { pdf } from '@react-pdf/renderer';
import { Download, Printer, Share2 } from 'lucide-react';
import { loadTemplateComponent } from '@/components/Resume/templates/registry';
import { useToast } from '@/context/ToastContext';
import Button from '@/components/UI/Button';

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
            <Button
                onClick={handleDownload}
                disabled={downloading}
                loading={downloading}
                leftIcon={!downloading ? <Download className="h-4 w-4" aria-hidden="true" /> : null}
            >
                {downloading ? 'Preparing PDF…' : 'Download PDF'}
            </Button>
            <Button variant="outline" onClick={() => window.print()} leftIcon={<Printer className="h-4 w-4" aria-hidden="true" />}>
                Print
            </Button>
            <Button variant="outline" onClick={() => setShareOpen(true)} leftIcon={<Share2 className="h-4 w-4" aria-hidden="true" />}>
                Share
            </Button>

            {shareOpen && (
                <ShareDialog resumeName={resume.name} publicUrl={publicUrl} onClose={() => setShareOpen(false)} />
            )}
        </div>
    );
};

export default PublicResumeActions;
