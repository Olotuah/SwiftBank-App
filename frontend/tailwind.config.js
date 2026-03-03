/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Manrope", "Inter", "system-ui", "sans-serif"], // default body
        heading: ["Inter", "Manrope", "system-ui", "sans-serif"], // titles
      },
    },
  },
  plugins: [],
};
