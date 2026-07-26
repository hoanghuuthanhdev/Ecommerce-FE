/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#FCFCFA',
        surface: '#FFFFFF',
        ink: '#16181D',
        muted: '#5B5F57',
        line: '#E4E2DC',
        brand: {
          DEFAULT: '#1C3F3A',
          light: '#2E5E56',
          dark: '#122824',
        },
        accent: {
          DEFAULT: '#B5883D',
          light: '#D1A968',
        },
        danger: '#A8402F',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        sm: '2px',
      },
    },
  },
  plugins: [],
}
