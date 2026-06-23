/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FFFFFF',
        'primary-light': '#F8FAFC',
        gold: '#8B5CF6',
        'gold-light': '#A78BFA',
        metallic: '#64748B',
        'neon-blue': '#06B6D4',
        'neon-green': '#10B981',
        'neon-purple': '#8B5CF6',
        warning: '#EF4444',
        'warning-orange': '#F97316',
        'cyber-dark': '#FFFFFF',
        'cyber-darker': '#F1F5F9',
        'cyber-light': '#F8FAFC',
        'cyber-accent': '#8B5CF6',
        'cyber-glow': '#06B6D4',
        'cyber-purple': '#7C3AED',
        'cyber-pink': '#EC4899',
        'cyber-green': '#10B981',
        'cyber-orange': '#F97316',
        'cyber-yellow': '#8B5CF6',
        'cyber-neon-yellow': '#7C3AED',
        'cyber-muted': '#64748B',
        'cyber-white': '#0F172A',
        'slate-text': '#1E293B',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'automind-gradient': 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)',
        'hero-grid': 'linear-gradient(to right, #E2E8F0 1px, transparent 1px), linear-gradient(to bottom, #E2E8F0 1px, transparent 1px)',
      },
      backgroundSize: {
        'hero-grid': '40px 40px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.02)' },
        },
        gridFade: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        spinSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out forwards',
        fadeInUp: 'fadeInUp 0.6s ease-out forwards',
        fadeInDown: 'fadeInDown 0.5s ease-out forwards',
        slideInLeft: 'slideInLeft 0.6s ease-out forwards',
        slideInRight: 'slideInRight 0.6s ease-out forwards',
        float: 'float 4s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
        pulseSoft: 'pulseSoft 3s ease-in-out infinite',
        gridFade: 'gridFade 4s ease-in-out infinite',
        spinSlow: 'spinSlow 20s linear infinite',
        bounceSoft: 'bounceSoft 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
