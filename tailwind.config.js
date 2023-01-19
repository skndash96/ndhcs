/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./views/*.ejs",
    "./views/partials/*.ejs",
    "./dist/**/*.js"
  ],
  mode: 'jit',
  safelist: [
    "grid-cols-1","grid-cols-2","grid-cols-3","grid-cols-4","grid-cols-5","grid-cols-6","grid-cols-7","grid-cols-8","grid-cols-9","grid-cols-10",
    "sm:grid-cols-1","sm:grid-cols-2","sm:grid-cols-3","sm:grid-cols-4","sm:grid-cols-5","sm:grid-cols-6","sm:grid-cols-7","sm:grid-cols-8","sm:grid-cols-9","sm:grid-cols-10",
    "md:grid-cols-1","md:grid-cols-2","md:grid-cols-3","md:grid-cols-4","md:grid-cols-5","md:grid-cols-6","md:grid-cols-7","md:grid-cols-8","md:grid-cols-9","md:grid-cols-10",
    "lg:grid-cols-1","lg:grid-cols-2","lg:grid-cols-3","lg:grid-cols-4","lg:grid-cols-5","lg:grid-cols-6","lg:grid-cols-7","lg:grid-cols-8","lg:grid-cols-9","lg:grid-cols-10",
    "col-span-1","col-span-2","col-span-3",
    "row-span-1","row-span-2","row-span-3"
  ],
  theme: {
    extend: {
      screens: {
        'sm': '576px',
        'md': '767px', /*changed in ./dist/scripts/loadnews.js*/
        'max-sm': {'raw': '(max-width: 575.99px)'},
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
