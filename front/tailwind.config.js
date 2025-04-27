/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true, // Центрирование по горизонтали
      padding: {
        DEFAULT: '1rem', // Отступы по умолчанию (на мобильных)
        sm: '1.5rem',   // Начиная с sm-брейкпоинта
        lg: '2rem',     // Начиная с lg-брейкпоинта
      },
      screens: {
        DEFAULT: '100%', // На мобильных — 100% ширины
        sm: '640px',     // Начиная с sm — фиксированная ширина
        md: '768px',
        lg: '1024px',
        xl: '1280px',    // Максимальная ширина — 1280px (можно уменьшить)
      },
    },
    extend: {
      fontFamily: {
        minecraft: ['Minecraft', 'sans-serif'],
      },
    },
  },
  plugins: [],
}