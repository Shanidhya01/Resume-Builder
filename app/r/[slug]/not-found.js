import Link from 'next/link';
import { FaFileCircleXmark } from 'react-icons/fa6';

export default function PublicResumeNotFound() {
    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-6 text-center text-white">
            <FaFileCircleXmark className="h-14 w-14 text-purple-400" aria-hidden="true" />
            <h1 className="text-3xl font-bold">This resume isn&apos;t available</h1>
            <p className="max-w-md text-slate-300">
                The link may be incorrect, or the owner has made this resume private or disabled sharing.
            </p>
            <Link
                href="/"
                className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2.5 font-semibold text-white transition hover:scale-105"
            >
                Go to HireReady
            </Link>
        </div>
    );
}
