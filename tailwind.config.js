/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#ecf4ff",
          100: "#d8e9ff",
          200: "#b7d4ff",
          300: "#8fb8ff",
          400: "#5f93f7",
          500: "#3b76e5",
          600: "#2d5ec0",
          700: "#234a96",
          800: "#1b3873",
          900: "#142a57"
        },
        ink: "#0e1116",
        paper: "#ffffff"
      },
      boxShadow: {
        soft: "0 10px 30px rgba(20,42,87,.12)"
      },
      keyframes: {
        heartbeat: {
          "0%, 100%": { transform: "scale(1)" },
          "25%": { transform: "scale(1.05)" },
          "40%": { transform: "scale(.98)" },
          "60%": { transform: "scale(1.06)" }
        },
        "bounce-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-25px)" }
        }
      },
      animation: {
        heartbeat: "heartbeat 1.6s ease-in-out infinite",
        "bounce-slow": "bounce-slow 1.5s ease-in-out infinite"
      }
    }
  },
  plugins: []
};
