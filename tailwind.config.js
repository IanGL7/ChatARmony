/** @type {import('tailwindcss').Config} */
/* Tailwind Configuration */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      spacing: {
        '16': '4rem',  // Tamaño del menú contraído
        '64': '16rem', // Tamaño del menú expandido
      },
    },
  },
};


