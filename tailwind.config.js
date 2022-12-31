/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./views/*.ejs",
    "./views/partials/*.ejs",
    "./dist/**/*.js"
  ],
  mode: 'jit',
  theme: {
    extend: {
      screens: {
        'sm': '576px',
        'md': '767px',
        'max-md': {'raw': '(max-width: 766.99px)'}
      },
      animation: {
        "scaleup": "scale 1s linear infinite",
      },
      keyframes: {
        scale: {
          "0%": { transform: "translate(-50%, -50%) scale(0)", opacity: "1" },
          "100%": { transform: "translate(-50%, -50%) scale(1)", opacity: ".01" },
        },
        scaleSpin: {
          "0%": { transform: "rotate(36deg) scale(1.2)" },
          "40%": { transform: "rotate(80deg) scale(1.3)" },
          "100%": { transform: "rotate(135deg)" },
        }
      }
    },
  },
  plugins: [],
}
