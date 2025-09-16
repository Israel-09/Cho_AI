/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        "public-sans-light": ["Light", "sans-serif"],
        "public-sans-regular": ["Regular", "sans-serif"],
        "public-sans-medium": ["Medium", "sans-serif"],
        "public-sans-semibold": ["SemiBold", "sans-serif"],
        "public-sans-bold": ["Bold", "sans-serif"],
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [],
};
