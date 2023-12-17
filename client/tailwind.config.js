/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        '50px': '50px',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
}

