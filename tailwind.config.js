/** @type {import('tailwindcss').Config} */

module.exports = {
    content: ['./src/**/*.{html,ts}'],
    theme: {
        extend: {
            spacing: {
                1: '1px',
                2: '2px',
                4: '4px',
                6: '6px',
                8: '8px',
                12: '12px',
                16: '16px',
                18: '18px',
                24: '24px',
                32: '32px',
                36: '36px',
                48: '48px',
                56: '56px',
            },
        },
    },
    plugins: [],
};
