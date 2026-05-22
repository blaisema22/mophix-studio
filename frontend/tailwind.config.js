/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#FF7F11',
                secondary: '#FF9F1C',
                accent: '#E8C4A0',
                dark: '#000000',
                light: '#F5F1ED',
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