/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      minHeight: {
        'screen-minus-6rem': 'calc(100vh - 6rem)',
        'screen-minus-14rem': 'calc(100vh - 14rem)',
      }
    },
  },
  plugins: [],
}

