module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        airport: {
          bg: '#06121F',
          surface: '#0E1B2D',
          elevated: '#13243B',
          primary: '#2F80FF',
          'primary-hover': '#1E6DFF',
          accent: '#14C8FF',
          success: '#22C55E',
          warning: '#F59E0B',
          danger: '#EF4444',
          'text-primary': '#F8FAFC',
          'text-secondary': '#94A3B8',
          border: 'rgba(255, 255, 255, 0.08)',
        },
      },
      opacity: {
        '4': '0.04',
        '8': '0.08',
        '12': '0.12',
        '15': '0.15',
        '18': '0.18',
      },
      borderRadius: {
        'btn': '18px',
        'card': '24px',
        'input': '18px',
        'modal': '28px',
        'pill': '999px',
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'boarding-ring': 'boardingRing 1.8s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 10px 0 rgba(47, 128, 255, 0.3)' },
          '50%': { boxShadow: '0 0 24px 4px rgba(47, 128, 255, 0.55)' },
        },
        boardingRing: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
};

