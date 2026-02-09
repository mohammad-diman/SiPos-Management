import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                seafoam: {
                    50: '#f0fdfd',
                    100: '#dcfafa',
                    200: '#bff3f5',
                    300: '#93eaee',
                    400: '#7ddde6',
                    500: '#4ec4d1',
                    600: '#39a3b2',
                    700: '#318391',
                    800: '#226d7a',
                    900: '#1a5661',
                    950: '#0d323a',
                },
            },
        },
    },

    plugins: [forms],
};
