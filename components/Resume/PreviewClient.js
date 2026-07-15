'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const Loader = () => (
    <div className="flex min-h-[24rem] w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-accent" />
    </div>
);

const Preview = dynamic(() => import('./Preview'), { ssr: false, loading: Loader });

export default Preview;
