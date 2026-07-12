const ErrorMessage = ({ message = 'Something went wrong.', onRetry }) => (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 py-10 px-6 text-center">
        <p className="text-sm font-medium text-red-300">{message}</p>
        {onRetry && (
            <button
                onClick={onRetry}
                className="rounded-lg border border-red-400/40 px-4 py-2 text-sm font-semibold text-red-200 transition-colors hover:bg-red-500/20"
            >
                Retry
            </button>
        )}
    </div>
);

export default ErrorMessage;
