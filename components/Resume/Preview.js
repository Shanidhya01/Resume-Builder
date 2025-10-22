'use client';

import { useEffect, useRef } from 'react';
import Resume from './pdf';
import { useSelector } from 'react-redux';
import { CgSpinner } from 'react-icons/cg';
import { usePDF } from '@react-pdf/renderer';
import { Document, Page, pdfjs } from 'react-pdf';
import { FaDownload, FaEye } from 'react-icons/fa6';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url
).toString();

const Loader = () => (
    <div className="flex min-h-[24rem] w-full items-center justify-center">
        <div className="relative">
            <CgSpinner className="animate-spin text-[#6F42C1] text-5xl md:text-6xl" />
            <div className="absolute inset-0 bg-[#6F42C1]/20 rounded-full blur-xl animate-pulse"></div>
        </div>
    </div>
);

const preview = (url) => {
    window.open(
        url,
        'Resume Preview',
        `toolbar=no, location=no, menubar=no, scrollbars=no, status=no, titlebar=no, resizable=no, width=600, height=800, left=${window.innerWidth / 2 - 300}, top=100`
    );
};

const Preview = () => {
    const parentRef = useRef(null);
    const resumeData = useSelector((state) => state.resume);
    const document = <Resume data={resumeData} />;
    const [instance, updateInstance] = usePDF({ document });

    useEffect(() => {
        if (resumeData.saved) updateInstance(document);
    }, [resumeData.saved]);

    return (
        <div className="relative w-full md:max-w-[24rem] 2xl:max-w-[28rem]">
            {/* Ambient glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-gradient-xy"></div>
            
            <div className="relative flex flex-col bg-gradient-to-br from-white to-purple-50/30 border-2 border-[#6F42C1]/30 rounded-2xl shadow-xl hover:shadow-2xl hover:border-[#6F42C1]/50 transition-all duration-500 overflow-hidden backdrop-blur-sm">
                {/* Header badge */}
                <div className="absolute top-4 left-4 z-10">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#6F42C1] to-[#8B5CF6] text-white text-xs font-semibold rounded-full shadow-lg">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        Live Preview
                    </div>
                </div>

                {/* PDF Viewer with enhanced styling */}
                <div 
                    ref={parentRef} 
                    className="w-full flex justify-center items-center p-4 md:p-6 min-h-[24rem] relative"
                >
                    {/* Decorative corner accents */}
                    <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-[#6F42C1]/20 rounded-tl-2xl"></div>
                    <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-[#6F42C1]/20 rounded-br-2xl"></div>
                    
                    {instance.loading ? (
                        <Loader />
                    ) : (
                        <div className="relative">
                            <Document loading={<Loader />} file={instance.url}>
                                <Page
                                    pageNumber={1}
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false}
                                    loading={<Loader />}
                                    width={parentRef.current?.clientWidth - 16}
                                    className="shadow-lg rounded-lg overflow-hidden ring-1 ring-[#6F42C1]/20"
                                />
                            </Document>
                        </div>
                    )}
                </div>

                {/* Action Buttons with enhanced styling */}
                {!instance.loading && (
                    <div className="relative">
                        {/* Gradient separator */}
                        <div className="h-px bg-gradient-to-r from-transparent via-[#6F42C1]/40 to-transparent"></div>
                        
                        <div className="flex justify-center gap-3 p-5 bg-gradient-to-br from-white/80 to-purple-50/50 backdrop-blur-sm">
                            <button
                                onClick={() => preview(instance.url)}
                                className="group relative flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#6F42C1] to-[#8B5CF6] text-white rounded-xl hover:from-[#5a32a3] hover:to-[#7C3AED] transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105 overflow-hidden"
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                                <FaEye className="relative z-10 text-lg group-hover:rotate-12 transition-transform duration-300" />
                                <span className="relative z-10">Preview</span>
                            </button>
                            
                            <a
                                href={instance.url}
                                download={`${resumeData.contact?.name || 'resume'}.pdf`}
                                className="group relative flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#6F42C1] to-[#8B5CF6] text-white rounded-xl hover:from-[#5a32a3] hover:to-[#7C3AED] transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105 overflow-hidden"
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                                <FaDownload className="relative z-10 text-lg group-hover:translate-y-1 transition-transform duration-300" />
                                <span className="relative z-10">Download</span>
                            </a>
                        </div>
                    </div>
                )}
            </div>

            {/* Custom animations */}
            <style jsx>{`
                @keyframes gradient-xy {
                    0%, 100% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                }
                .animate-gradient-xy {
                    background-size: 200% 200%;
                    animation: gradient-xy 3s ease infinite;
                }
            `}</style>
        </div>
    );
};

export default Preview;