/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tfe: {
          primary: 'var(--tfe-primary)',
          'primary-light': 'var(--tfe-primary-light)',
          'primary-dark': 'var(--tfe-primary-dark)',
          secondary: 'var(--tfe-secondary)',
          'secondary-light': 'var(--tfe-secondary-light)',
          'secondary-dark': 'var(--tfe-secondary-dark)',
          accent: 'var(--tfe-accent)',
          'accent-light': 'var(--tfe-accent-light)',
          'accent-dark': 'var(--tfe-accent-dark)',
          gray: {
            50: 'var(--tfe-gray-50)',
            100: 'var(--tfe-gray-100)',
            200: 'var(--tfe-gray-200)',
            300: 'var(--tfe-gray-300)',
            400: 'var(--tfe-gray-400)',
            500: 'var(--tfe-gray-500)',
            600: 'var(--tfe-gray-600)',
            700: 'var(--tfe-gray-700)',
            800: 'var(--tfe-gray-800)',
            900: 'var(--tfe-gray-900)',
          }
        }
      },
      fontFamily: {
        sans: 'var(--tfe-font-family)',
      },
      animation: {
        'bounce-in': 'bounceIn 0.6s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'confetti': 'confetti 0.5s ease-out',
      }
    },
  },
  plugins: [],
}
