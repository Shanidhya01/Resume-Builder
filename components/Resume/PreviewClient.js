'use client';

import dynamic from 'next/dynamic';
import { CgSpinner } from 'react-icons/cg';

const Loader = () => (
    <div className="flex min-h-[24rem] w-full items-center justify-center">
        <CgSpinner className="animate-spin text-[#6F42C1] text-5xl md:text-6xl" />
    </div>
);

const Preview = dynamic(() => import('./Preview'), { ssr: false, loading: Loader });

export default Preview;
