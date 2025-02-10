/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7C3AED',
          dark: '#6D28D9',
        },
        secondary: {
          DEFAULT: '#4B5563',
          dark: '#374151',
        },
        background: {
          DEFAULT: '#FFFFFF',
          dark: '#111827',
        },
        chat: {
          user: '#7C3AED',
          bot: '#4B5563',
          userBg: '#EDE9FE',
          botBg: '#1F2937',
        },
        custom: {
          bg: '#0c1620', // Adding the custom background color
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
