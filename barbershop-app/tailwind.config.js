/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50:  '#fffdf0',
          100: '#fef9d7',
          200: '#fceea8',
          300: '#f9de6e',
          400: '#f0c040',
          500: '#e8b030',
          600: '#c9981a',
          700: '#a67c12',
          800: '#875f0c',
          900: '#6e4c09',
        },
        dark: {
          50:  '#1c1c1e',
          100: '#161618',
          200: '#111113',
          300: '#0d0d0f',
          400: '#09090b',
          500: '#050507',
        },
        cream: {
          DEFAULT: '#f5e6c8',
          dim: '#d4c49a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        gold:       '0 0 24px rgba(201,152,26,0.30)',
        'gold-sm':  '0 0 12px rgba(201,152,26,0.20)',
        'gold-lg':  '0 0 48px rgba(201,152,26,0.40)',
        'gold-xl':  '0 0 80px rgba(201,152,26,0.50)',
        'glow-white': '0 0 20px rgba(255,255,255,0.06)',
        'inner':    'inset 0 1px 0 rgba(255,255,255,0.06)',
        'card':     '0 4px 24px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)',
        'card-gold':'0 4px 24px rgba(0,0,0,0.7), inset 0 1px 0 rgba(201,152,26,0.12)',
      },
      backgroundImage: {
        'gold-gradient':    'linear-gradient(135deg, #c9981a 0%, #f0c040 50%, #c9981a 100%)',
        'gold-subtle':      'linear-gradient(135deg, rgba(201,152,26,0.15) 0%, rgba(201,152,26,0.05) 100%)',
        'dark-gradient':    'linear-gradient(180deg, #0d0d0f 0%, #09090b 100%)',
        'card-gradient':    'linear-gradient(135deg, rgba(28,28,30,0.9) 0%, rgba(16,16,18,0.95) 100%)',
        'glass':            'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
      },
      animation: {
        'shimmer':       'shimmer 2.5s linear infinite',
        'pulse-gold':    'pulseGold 2s ease-in-out infinite',
        'float':         'float 3s ease-in-out infinite',
        'count-up':      'countUp 0.6s ease-out forwards',
        'slide-in-up':   'slideInUp 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards',
        'fade-blur':     'fadeBlur 0.3s ease-out forwards',
        'ring-spin':     'ringSpin 8s linear infinite',
        'glow-pulse':    'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition:  '200% center' },
        },
        pulseGold: {
          '0%,100%': { opacity: '1',   transform: 'scale(1)' },
          '50%':     { opacity: '0.7', transform: 'scale(0.97)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-4px)' },
        },
        slideInUp: {
          from: { opacity: '0', transform: 'translateY(16px) scale(0.97)' },
          to:   { opacity: '1', transform: 'translateY(0)   scale(1)' },
        },
        fadeBlur: {
          from: { opacity: '0', filter: 'blur(6px)' },
          to:   { opacity: '1', filter: 'blur(0px)' },
        },
        ringSpin: {
          from: { transform: 'rotate(0deg)' },
          to:   { transform: 'rotate(360deg)' },
        },
        glowPulse: {
          '0%,100%': { boxShadow: '0 0 20px rgba(201,152,26,0.2)' },
          '50%':     { boxShadow: '0 0 40px rgba(201,152,26,0.5)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        '2.5xl': '1.125rem',
        '3xl':   '1.5rem',
        '4xl':   '2rem',
      },
    },
  },
  plugins: [],
}
