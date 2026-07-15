/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors');

module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
                mono: ['var(--font-geist-mono)', 'ui-monospace', 'monospace'],
            },
            colors: {
                // `primary` remapped to blue (Phase 9 brand) so not-yet-migrated
                // legacy pages inherit the new accent automatically.
                primary: { ...colors.blue },
                gray: { ...colors.zinc },
                // Semantic, theme-aware tokens. Backed by CSS vars in
                // globals.scss so they adapt to light/dark and the accent picker.
                canvas: 'rgb(var(--canvas) / <alpha-value>)',
                surface: {
                    DEFAULT: 'rgb(var(--surface) / <alpha-value>)',
                    2: 'rgb(var(--surface-2) / <alpha-value>)',
                    3: 'rgb(var(--surface-3) / <alpha-value>)',
                },
                fg: {
                    DEFAULT: 'rgb(var(--fg) / <alpha-value>)',
                    muted: 'rgb(var(--fg-muted) / <alpha-value>)',
                    subtle: 'rgb(var(--fg-subtle) / <alpha-value>)',
                },
                line: {
                    DEFAULT: 'rgb(var(--line) / <alpha-value>)',
                    strong: 'rgb(var(--line-strong) / <alpha-value>)',
                },
                accent: {
                    DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
                    hover: 'rgb(var(--accent-hover) / <alpha-value>)',
                    fg: 'rgb(var(--accent-fg) / <alpha-value>)',
                    soft: 'rgb(var(--accent-soft) / <alpha-value>)',
                },
            },
            boxShadow: {
                'ds-sm': 'var(--shadow-sm)',
                'ds-md': 'var(--shadow-md)',
                'ds-lg': 'var(--shadow-lg)',
                'ds-xl': 'var(--shadow-xl)',
            },
            animation: {
                'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
                'gradient-shift': 'gradientShift 4s ease infinite',
                'gradient-x': 'gradientX 15s ease infinite',
                'bounce': 'bounce 3s ease-in-out infinite',
                'blob': 'blob 7s infinite',
                'float': 'float 6s ease-in-out infinite',
                'shake': 'shake 0.5s ease-in-out infinite',
                'shimmer': 'shimmer 1.6s ease-in-out infinite',
                'fade-in': 'fadeIn 0.2s ease-out forwards',
                'scale-in': 'scaleIn 0.15s ease-out forwards',
            },
            keyframes: {
                shimmer: {
                    '0%': { 'background-position': '-200% 0' },
                    '100%': { 'background-position': '200% 0' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.96)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                fadeInUp: {
                    '0%': {
                        opacity: '0',
                        transform: 'translateY(30px)',
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateY(0)',
                    },
                },
                gradientShift: {
                    '0%, 100%': {
                        'background-position': '0% 50%',
                    },
                    '50%': {
                        'background-position': '100% 50%',
                    },
                },
                gradientX: {
                    '0%, 100%': {
                        'background-size': '200% 200%',
                        'background-position': 'left center',
                    },
                    '50%': {
                        'background-size': '200% 200%',
                        'background-position': 'right center',
                    },
                },
                blob: {
                    '0%': {
                        transform: 'translate(0px, 0px) scale(1)',
                    },
                    '33%': {
                        transform: 'translate(30px, -50px) scale(1.1)',
                    },
                    '66%': {
                        transform: 'translate(-20px, 20px) scale(0.9)',
                    },
                    '100%': {
                        transform: 'translate(0px, 0px) scale(1)',
                    },
                },
                float: {
                    '0%, 100%': {
                        transform: 'translateY(0px)',
                        opacity: '0.3',
                    },
                    '50%': {
                        transform: 'translateY(-20px)',
                        opacity: '0.6',
                    },
                },
                shake: {
                    '0%, 100%': {
                        transform: 'translateY(0)',
                    },
                    '25%': {
                        transform: 'translateY(-2px)',
                    },
                    '50%': {
                        transform: 'translateY(0)',
                    },
                    '75%': {
                        transform: 'translateY(-1px)',
                    },
                },
            },
            perspective: {
                '1000': '1000px',
            },
            rotate: {
                'y-2': 'rotateY(2deg)',
                'x-1': 'rotateX(1deg)',
            },
            boxShadow: {
                '3xl': '0 35px 60px -12px rgba(0, 0, 0, 0.25)',
            },
        },
    },
    plugins: [],
};