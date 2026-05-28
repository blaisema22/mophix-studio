/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                jetBlack: '#111111',
                black: {
                    DEFAULT: '#111111',
                    dark: '#222222',
                },
                orange: {
                    100: '#FFF0E8',
                    400: '#E8651A',
                    500: '#C4521A',
                },
                white: '#FFFFFF',
                offWhite: '#F7F7F7',
                accent: '#E8651A',
                primary: '#E8651A',
                secondary: '#111111',
                gray: {
                    50: '#F8F4EF',
                    100: '#F1E7DA',
                    200: '#D8C6A7',
                    300: '#E8C4A0',
                    400: '#CFA179',
                    500: '#A67753',
                    600: '#8F5F39',
                    700: '#6E4428',
                    800: '#52341F',
                    900: '#3A2518',
                },
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['Playfair Display', 'serif'],
            },
        },
    },
    plugins: [],
}