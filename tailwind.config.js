/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#D1D5DB',
        secondary: '#9CA3AF',
        accent: '#6B7280',
        background: '#F3F4F6',
        text: '#111827',
        textsecondary: '#4B5563',
        button_primary_color: '#6B7280',
        button_primary_hover: '#4B5563',
        sidebar_color: '#4B5563',
        avatar_color: '#9CA3AF',
        hover_color: '#D1D5DB',
      },
    },
  },
  plugins: [],
} 