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
            colors: {
                primary: { ...colors.teal },
                gray: { ...colors.zinc },
            },
            animation: {
                'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
                'gradient-shift': 'gradientShift 4s ease infinite',
                'bounce': 'bounce 3s ease-in-out infinite',
            },
            keyframes: {
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