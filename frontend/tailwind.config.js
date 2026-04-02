const colors = require('tailwindcss/colors')

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#2563eb', dark: '#1d4ed8', light: '#eff6ff' },
        brand:   colors.blue,
        accent:  { DEFAULT: '#7c3aed' },
        success: { DEFAULT: '#16a34a' },
        danger:  { DEFAULT: '#dc2626' },
        warning: { DEFAULT: '#d97706' },
      },
    },
  },
  plugins: [],
}
