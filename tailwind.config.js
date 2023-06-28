/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-fade-left': 'linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%);',
        'gradient-fade-right': 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%);'
      },
      colors: {
        'text-purple': 'rgba(226, 43, 255, 1)',
      },
      backgroundColor: {
      }
    },
  },
  plugins: [],
}
