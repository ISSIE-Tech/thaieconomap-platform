/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'main-orange': '#FA961E',
        'main-green': '#11BD6D',
        'main-red': '#F90000',
        'soft-orange': '#F99B0F',
        'soft-green': '#EAFFF0',
        'soft-red': '#FFCCCC',
        'filling-orange': '#FFF8E6',
        'filling-green': '#C3F1DC',
        'granite-50': '#79807F',
        'granite-100': '#1C1818',
        'paper-100': '#FAFAFA',
        'main-red': '#F90000',
        ink: '#393840',
        mist: '#D1D1DA',
        line: '#EFF0F4',
        border: '#CEDBEE',
        cloud: '#EFF0F4',
      },
    },
  },
  plugins: [],
};
