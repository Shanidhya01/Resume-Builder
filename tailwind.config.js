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
                'gradient-x': 'gradientX 15s ease infinite',
                'bounce': 'bounce 3s ease-in-out infinite',
                'blob': 'blob 7s infinite',
                'float': 'float 6s ease-in-out infinite',
                'shake': 'shake 0.5s ease-in-out infinite',
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