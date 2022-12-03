/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ["./views/**/*.{html,js,ejs}", "./*.{html,js,ejs}", "./public/**/*.{html,js,ejs}"],
  mode: 'jit',
  theme: {
    extend: {
      screens: {
        'sm': '576px',
        'max-md': {'raw': '(max-width: 769px)'}
      }
    },
  },
  plugins: [],
}
