/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './screens/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0a0e0d',
        panel: '#111816',
        panel2: '#0d1312',
        line: '#1f2d2a',
        'line-bright': '#2f4540',
        txt: '#e8f0ed',
        txt2: '#dfe8e5',
        dim: '#6b827c',
        dim2: '#8a9a96',
        acid: '#c4ff3d',
        'pace-cyan': '#34e7d4',
        'pace-orange': '#ff7a3d',
        'pace-red': '#ff4d5e',
        'pace-blue': '#34556e',
        'pace-green': '#1db954',
      },
    },
  },
  plugins: [],
};
