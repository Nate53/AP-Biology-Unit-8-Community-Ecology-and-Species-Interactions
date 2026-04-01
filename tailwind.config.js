/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f6f7f2',
          100: '#e8ebe0',
          200: '#d3d9c3',
          300: '#b4be9e',
          400: '#95a67a',
          500: '#7a8e5e',
          600: '#5f7148',
          700: '#4a583a',
          800: '#3d4831',
          900: '#343d2b',
        },
        coyote: {
          50: '#fdf8f0',
          100: '#f9edda',
          200: '#f2d8b4',
          300: '#e9bd84',
          400: '#df9c53',
          500: '#d88432',
          600: '#c96c27',
          700: '#a75322',
          800: '#864322',
          900: '#6d381e',
        },
      },
    },
  },
  plugins: [],
}
