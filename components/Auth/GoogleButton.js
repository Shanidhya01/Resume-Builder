'use client';

const GoogleButton = ({ onClick, disabled, label = 'Continue with Google' }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="flex w-full items-center justify-center gap-3 rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-sm font-medium text-white outline-none transition hover:bg-gray-700 disabled:opacity-60"
    >
        <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
            <path
                fill="#FFC107"
                d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35 24 35c-6.1 0-11-4.9-11-11s4.9-11 11-11c2.8 0 5.3 1 7.3 2.7l5.7-5.7C33.6 6.5 29 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.3-.4-3.5z"
            />
            <path
                fill="#FF3D00"
                d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c2.8 0 5.3 1 7.3 2.7l5.7-5.7C33.6 6.5 29 4.5 24 4.5c-7.6 0-14.2 4.3-17.7 10.2z"
            />
            <path
                fill="#4CAF50"
                d="M24 43.5c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.4-4.5 2.2-7.2 2.2-5.3 0-9.6-3.5-11.2-8.3l-6.5 5C9.6 39.1 16.2 43.5 24 43.5z"
            />
            <path
                fill="#1976D2"
                d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.3 5.6l6.2 5.2c-.4.4 7.3-5.3 7.3-16.3 0-1.2-.1-2.3-.4-3.5z"
            />
        </svg>
        {label}
    </button>
);

export default GoogleButton;
