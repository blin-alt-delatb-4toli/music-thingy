const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
        './resources/js/**/*.tsx',
        './resources/css/*.css',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
        },
        minWidth: {
            '0': '0',
            '1/4': '25%',
            '1/3': '33%',
            '1/2': '50%',
            '3/4': '75%',
            'full': '100%',
        }
    },

    plugins: [require('@tailwindcss/forms')],

    darkMode: "class",
};
