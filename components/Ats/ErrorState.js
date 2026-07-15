'use client';

const ErrorState = ({ message = 'Something went wrong.', onRetry }) => (
    <div role="alert" className="flex flex-col items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/5 p-8 text-center">
        <p className="text-sm text-red-600 dark:text-red-300">{message}</p>
        {onRetry && (
            <button
                onClick={onRetry}
                className="rounded-lg border border-red-500/30 px-4 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-500/10 dark:text-red-300"
            >
                Try again
            </button>
        )}
    </div>
);

export default ErrorState;
