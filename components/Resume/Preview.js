'use client';

import { useEffect, useRef, useState } from 'react';
import Resume from './pdf';
import { useSelector } from 'react-redux';
import { CgSpinner } from 'react-icons/cg';

// import 'react-pdf/dist/Page/AnnotationLayer.css';
// import 'react-pdf/dist/Page/TextLayer.css';

import { usePDF } from '@react-pdf/renderer';
import { Document, Page, pdfjs } from 'react-pdf';
import { FaDownload, FaEye } from 'react-icons/fa6';
import { HiSparkles, HiDocumentText } from 'react-icons/hi';
import { IoMdCheckmarkCircle } from 'react-icons/io';

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.js', import.meta.url).toString();

const Loader = () => (
    <div className="flex min-h-96 w-full items-center justify-center bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200/50 shadow-lg backdrop-blur-sm">
        <div className="text-center space-y-4">
            <div className="relative">
                <CgSpinner className="mx-auto animate-spin text-4xl text-blue-500 md:text-5xl" />
                <div className="absolute inset-0 mx-auto w-12 h-12 md:w-16 md:h-16 border-4 border-blue-200 rounded-full animate-pulse"></div>
            </div>
            <div className="space-y-2">
                <p className="text-slate-700 font-semibold">Generating preview...</p>
                <p className="text-sm text-slate-500">Creating your professional resume</p>
            </div>
        </div>
    </div>
);

const preview = url => {
    window.open(
        url,
        'Resume Preview',
        `toolbar=no, location=no, menubar=no, scrollbars=no, status=no, titlebar=no, resizable=no, width=600, height=800, left=${window.innerWidth / 2 - 300}, top=100`,
    );
};

const Preview = () => {
    const parentRef = useRef(null);
    const resumeData = useSelector(state => state.resume);
    const document = <Resume data={resumeData} />;
    const [instance, updateInstance] = usePDF({ document });
    const [showControls, setShowControls] = useState(false);

    useEffect(() => {
        if (resumeData.saved) updateInstance(document);
    }, [resumeData.saved]);

    return (
        <div className="relative w-full md:max-w-[24rem] 2xl:max-w-[28rem] space-y-4">
            {/* Preview Header */}
            <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-white/60 shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg blur-lg opacity-30"></div>
                        <div className="relative p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg">
                            <HiDocumentText className="w-5 h-5 text-white" />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                            Live Preview
                            <HiSparkles className="w-4 h-4 text-yellow-500" />
                        </h3>
                        <p className="text-sm text-slate-600">ATS-friendly format</p>
                    </div>
                </div>
                
                {!instance.loading && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        <IoMdCheckmarkCircle className="w-3 h-3" />
                        <span>Ready</span>
                    </div>
                )}
            </div>

            {/* Preview Container */}
            <div 
                ref={parentRef} 
                className="relative group"
                onMouseEnter={() => setShowControls(true)}
                onMouseLeave={() => setShowControls(false)}
            >
                {/* Glow effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                
                {/* Main preview area */}
                <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl border border-white/60 shadow-xl overflow-hidden">
                    {instance.loading ? (
                        <Loader />
                    ) : (
                        <div className="relative">
                            <Document 
                                loading={<Loader />} 
                                file={instance.url}
                                className="w-full"
                            >
                                <Page
                                    pageNumber={1}
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false}
                                    loading={<Loader />}
                                    width={parentRef.current?.clientWidth}
                                    className="shadow-lg"
                                />
                            </Document>
                            
                            {/* Overlay badges */}
                            <div className="absolute top-4 right-4 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg">
                                ATS Ready
                            </div>
                            
                            <div className={`absolute top-4 left-4 flex items-center gap-2 px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-full shadow-lg transition-all duration-300 ${
                                showControls ? 'opacity-100 translate-y-0' : 'opacity-70 -translate-y-1'
                            }`}>
                                <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                                Live
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Enhanced Action Buttons */}
            {!instance.loading && (
                <div className="space-y-3">
                    <div className="flex justify-center gap-3">
                        <button 
                            onClick={() => preview(instance.url)} 
                            className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden relative"
                        >
                            <span className="absolute inset-0 w-0 bg-gradient-to-r from-blue-700 to-indigo-700 transition-all duration-500 ease-out group-hover:w-full"></span>
                            <FaEye className="relative w-4 h-4 transition-transform group-hover:scale-110" />
                            <span className="relative">Preview</span>
                        </button>
                        
                        <a
                            href={instance.url}
                            download={`${resumeData.contact?.name || 'resume'}.pdf`}
                            className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden relative"
                        >
                            <span className="absolute inset-0 w-0 bg-gradient-to-r from-emerald-700 to-teal-700 transition-all duration-500 ease-out group-hover:w-full"></span>
                            <FaDownload className="relative w-4 h-4 transition-transform group-hover:scale-110 group-hover:-translate-y-0.5" />
                            <span className="relative">Download</span>
                        </a>
                    </div>
                    
                    {/* Info Footer */}
                    <div className="p-3 bg-slate-50/80 backdrop-blur-sm rounded-xl border border-slate-200/50">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600 font-medium">Professional template</span>
                            <div className="flex items-center gap-3">
                                <span className="text-green-600 font-medium">✓ ATS Compatible</span>
                                <span className="text-blue-600 font-medium">✓ Print Ready</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// const Preview = () => {
//     const resumeData = useSelector(state => state.resume);
//     const [data, setData] = useState(resumeData);

//     useEffect(() => {
//         if (resumeData.saved) setData(resumeData);
//     }, [resumeData.saved]);

//     return (
//         <div className="hidden h-[40rem] w-[28rem] md:block">
//             <PDFViewer className="h-full w-full" showToolbar={true}>
//                 <Resume data={data} />
//             </PDFViewer>
//         </div>
//     );
// };

export default Preview;
