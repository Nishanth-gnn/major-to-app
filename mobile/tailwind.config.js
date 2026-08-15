/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}", "./features/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: '#06121F',
        surface: '#0E1B2D',
        elevated: '#13243B',
        primary: '#2F80FF',
        accent: '#14C8FF',
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        text: '#F8FAFC',
        muted: '#94A3B8',
      },
      borderRadius: {
        'card': '24px',
        'btn': '18px',
        'sheet': '28px',
        'pill': '999px',
      }
    },
  },
  plugins: [],
}
