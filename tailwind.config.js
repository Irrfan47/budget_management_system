/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#0f172a', // Dark blue/black from the sidebar
                secondary: '#64748b', // Gray text
                accent: '#3b82f6', // Blue accent
                background: '#f8fafc', // Light gray background
                card: '#ffffff',
            }
        },
    },
    plugins: [],
}
