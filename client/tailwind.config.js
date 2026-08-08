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
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        edu: {
          blue: '#1d4ed8',
          sky: '#0284c7',
          amber: '#f59e0b',
          rose: '#e11d48',
          indigo: '#4338ca',
          teal: '#0f766e',
        },
        nipun: {
          mastered: '#10b981', // 80-100%
          developing: '#f59e0b', // 31-79%
          emerging: '#ef4444', // 0-30%
          locked: '#94a3b8',
        }
      },
      fontFamily: {
        gujarati: ['"Noto Sans Gujarati"', 'system-ui', 'sans-serif'],
        sans: ['Inter', '"Noto Sans Gujarati"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'bounce-soft': 'bounce 2s infinite',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
