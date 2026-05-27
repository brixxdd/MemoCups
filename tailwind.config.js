/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Nunito', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        pop: '0 18px 0 rgba(35, 70, 110, 0.12)',
        soft: '0 20px 60px rgba(39, 74, 120, 0.16)',
      },
    },
  },
  plugins: [],
};
