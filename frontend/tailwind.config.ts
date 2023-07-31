/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    mode: 'jit',
    theme: {
        extend: {
            colors: {
                'white-text': '#F4F6FA',
                input: '#2E3239',
                'light-input': '#DADADA',
                'light-placeholder': '#1E1E1E',
                'text-black': '#2E3239',
                background: '#23262C',
                'check-box': '#29ABE2',
                'dark-button': '#B4B4B4',
                'button-text': '#8C8E93',
            },
            fontFamily: { poppins: ['Poppins', 'sans-serif'] },
        },
    },
    plugins: [],
}
