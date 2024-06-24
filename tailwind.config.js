/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#A2CDC4',
        secondary: '#79A89E',
        accent: '#36C2A2',
        background: '#4B4B4B',
        text: '#F1EFEF',
        textsecondary: '#232F2C',
        button_primary_color: '#36C2A2',
        button_primary_hover: '#368472',
      },
    },
  },
  plugins: [],
} 