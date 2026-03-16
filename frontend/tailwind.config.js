/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["'DM Sans'", "sans-serif"],
      },
      animation: {
        "float-in": "floatIn 0.5s ease forwards",
        "paper-fly": "paperFly 0.9s ease forwards",
        "fade-up": "fadeUp 0.4s ease forwards",
        "spin-slow": "spin 3s linear infinite",
        shimmer: "shimmer 1.5s infinite",
      },
      keyframes: {
        floatIn: {
          "0%": { opacity: 0, transform: "translateY(20px) scale(0.95)" },
          "100%": { opacity: 1, transform: "translateY(0) scale(1)" },
        },
        paperFly: {
          "0%": { opacity: 1, transform: "translate(0,0) rotate(0deg) scale(1)" },
          "50%": { opacity: 0.7, transform: "translate(60px,-80px) rotate(25deg) scale(1.1)" },
          "100%": { opacity: 0, transform: "translate(120px,-160px) rotate(45deg) scale(0.5)" },
        },
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(12px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
