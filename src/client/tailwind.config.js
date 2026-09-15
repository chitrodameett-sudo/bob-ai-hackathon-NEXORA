/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        defense: {
          dark: '#0f172a',
          panel: '#1e293b',
          card: '#0f172a',
          cyan: '#38bdf8',
          cyanLight: '#7dd3fc',
          blue: '#3b82f6',
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e',
          purple: '#8b5cf6',
        }
      },
      fontFamily: {
        sans:     ['Inter', 'system-ui', 'sans-serif'],
        mono:     ['JetBrains Mono', 'Fira Code', 'monospace'],
        orbitron: ['Inter', 'system-ui', 'sans-serif'],
        jb:       ['Inter', 'system-ui', 'sans-serif'],
        tech:     ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-cyan':    '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'glow-rose':    '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'glow-amber':   '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'glow-purple':  '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'glow-emerald': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      },
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-left': {
          '0%':   { opacity: '0', transform: 'translateX(-100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'float-y': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' }
        }
      },
      animation: {
        'fade-up':     'fade-up 0.5s ease-out both',
        'slide-left':  'slide-left 0.35s ease-out both',
        'float':       'float-y 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
