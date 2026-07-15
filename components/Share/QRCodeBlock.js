'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { FaDownload, FaCopy, FaPrint } from 'react-icons/fa';
import { useToast } from '@/context/ToastContext';

// Generated on demand, in-memory only (a data: URL) — never uploaded or
// persisted anywhere, per the "Firestore only, no Storage" constraint.
const QRCodeBlock = ({ url, fileName = 'resume-qr' }) => {
    const { showToast } = useToast();
    const [dataUrl, setDataUrl] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        let cancelled = false;

        QRCode.toDataURL(url, { width: 320, margin: 2, color: { dark: '#1e1b4b', light: '#ffffff' } })
            .then(result => {
                if (!cancelled) setDataUrl(result);
            })
            .catch(() => {
                if (!cancelled) setError(true);
            });

        return () => {
            cancelled = true;
        };
    }, [url]);

    const handleDownload = () => {
        if (!dataUrl) return;
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `${fileName}.png`;
        link.click();
    };

    const handleCopy = async () => {
        if (!dataUrl) return;
        try {
            const blob = await (await fetch(dataUrl)).blob();
            await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
            showToast('QR code copied to clipboard.', { tone: 'success' });
        } catch {
            showToast('Could not copy the QR image on this browser.', { tone: 'error' });
        }
    };

    const handlePrint = () => {
        if (!dataUrl) return;
        const win = window.open('', 'Print QR Code', 'width=420,height=520');
        if (!win) return;
        win.document.write(`<html><head><title>Resume QR Code</title></head><body style="margin:0;display:flex;align-items:center;justify-content:center;height:100vh;"><img src="${dataUrl}" alt="Resume QR code" style="width:320px;height:320px;" onload="window.print();window.close();" /></body></html>`);
        win.document.close();
    };

    if (error) {
        return <p className="text-sm text-red-600 dark:text-red-400">Couldn&apos;t generate the QR code.</p>;
    }

    return (
        <div className="flex flex-col items-center gap-3">
            {!dataUrl ? (
                <div className="h-[180px] w-[180px] animate-pulse rounded-lg bg-surface-2" role="status" aria-label="Generating QR code" />
            ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={dataUrl} alt="QR code linking to the public resume" className="h-[180px] w-[180px] rounded-lg bg-white p-2" />
            )}
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={handleDownload}
                    disabled={!dataUrl}
                    aria-label="Download QR code as PNG"
                    className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent/10 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                    <FaDownload className="h-3 w-3" aria-hidden="true" /> Download
                </button>
                <button
                    type="button"
                    onClick={handleCopy}
                    disabled={!dataUrl}
                    aria-label="Copy QR code image"
                    className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent/10 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                    <FaCopy className="h-3 w-3" aria-hidden="true" /> Copy
                </button>
                <button
                    type="button"
                    onClick={handlePrint}
                    disabled={!dataUrl}
                    aria-label="Print QR code"
                    className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent/10 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                    <FaPrint className="h-3 w-3" aria-hidden="true" /> Print
                </button>
            </div>
        </div>
    );
};

export default QRCodeBlock;
