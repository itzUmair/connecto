/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "hsl(var(--primary) / <alpha-value>)",
        secondary: "hsl(var(--secondary) / <alpha-value>)",
        content: "hsl(var(--content) / <alpha-value>)",
        accent: "hsl(var(--accent) / <alpha-value>)",
        gradient: {
          1: "#8562E9",
          2: "#5DC1EC",
        },
      },
      fontFamily: {
        primary: ["Poppins", "sans-serif"],
      },
      screens: {
        "2xl": "2560px",
      },
      animation: {
        pulse: " pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite ",
      },
    },
  },
  plugins: [],
};
