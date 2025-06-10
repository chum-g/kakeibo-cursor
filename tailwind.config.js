/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#fb8500', // オレンジ
          light: '#ffb703',
          dark: '#ff6600',
        },
      },
    },
  },
  plugins: [],
} 