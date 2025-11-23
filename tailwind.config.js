/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Lalezar"', '"Comic Neue"', 'cursive', 'sans-serif'], // Kid friendly font
      },
      colors: {
        primary: '#FFB900', // Gold/Yellow
        secondary: '#4F46E5', // Indigo
        accent: '#EC4899', // Pink
        background: '#F3F4F6',
      }
    },
  },
  plugins: [],
}