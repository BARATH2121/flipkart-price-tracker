/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        'neon-blue': '#00d4ff',
        'dark-bg': '#0a0e27',
        'dark-card': '#1a1f3a',
        'dark-border': '#2d3561',
      },
      backgroundImage: {
        'gradient-neon': 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)',
      },
      fontSize: {
        'futuristic': ['1.5rem', { letterSpacing: '0.05em' }],
      },
      borderRadius: {
        'xl': '12px',
        'card': '12px',
      },
      boxShadow: {
        'neon': '0 0 20px rgba(0, 212, 255, 0.3)',
        'neon-lg': '0 0 40px rgba(0, 212, 255, 0.4)',
      },
      animation: {
        'pulse-neon': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
