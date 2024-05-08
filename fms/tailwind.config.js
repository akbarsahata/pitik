/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        primary: {
          100: "#F47B20",
          80: "#F8A556",
          60: "#FBBF78",
          40: "#FDDAA5",
          20: "#FEEFD2",
        },
        disabled: "#FAFAFA",
      },
    },
  },
  plugins: [],
};
