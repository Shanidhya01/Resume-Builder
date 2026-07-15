'use client';

import { AlertCircle } from 'lucide-react';
import Button from './Button';

/** ErrorMessage — inline error banner with optional retry. */
const ErrorMessage = ({ message = 'Something went wrong.', onRetry }) => (
    <div className="mb-6 flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/5 px-6 py-10 text-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-red-500/10 text-red-500">
            <AlertCircle className="h-5 w-5" />
        </span>
        <p className="text-sm font-medium text-fg">{message}</p>
        {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry}>
                Try again
            </Button>
        )}
    </div>
);

export default ErrorMessage;
