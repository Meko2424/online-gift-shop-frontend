/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-brand": "#ab0000",
        "search-field": "#959499",
        "user-field": "#626369",
      },
      fontFamily: {
        brand: ["Source Code Pro"],
      },
    },
  },
  plugins: [],
};
