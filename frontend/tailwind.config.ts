/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{js,jsx}'],
    mode: 'jit',
    theme: {
        extend: {
            colors: {
                text: '#F4F6FA',
                input: '#2E3239',
                background: '#23262C',
            },
        },
    },
    plugins: [],
}
