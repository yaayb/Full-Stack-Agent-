/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#0B0B0B',
        alabaster: '#F9F9F8',
        stone: {
          light: '#E5E5E5',
          muted: '#737373',
          dark: '#1C1C1C',
        },
        gold: {
          DEFAULT: '#C5A46D',
          light: '#D8BE90',
          dark: '#A3834E',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      letterSpacing: {
        editorial: '0.22em',
        luxury: '0.14em',
      },
    },
  },
  plugins: [],
};
