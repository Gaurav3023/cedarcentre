import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cedar: {
          primary: '#017196',       // Dark Blue
          darkBlue: '#017196',      // Dark Blue
          coral: '#ea6f5b',         // Coral
          lightBlue: '#afe0e7',     // Light Blue
          aqua: '#1daba2',          // Aqua
          brown: '#b25c4a',         // Brown
          lightPink: '#fff5f5',     // Light Pink
          cream: '#ffeccf',         // Cream
          brown2: '#8f5c52',        // Brown2
          background: '#fff5f5',    // Light Pink
          dark: '#015c7a',
          50: '#fff5f5',
          100: '#ffeccf',
          200: '#afe0e7',
          300: '#1daba2',
          400: '#ea6f5b',
          500: '#017196',
          600: '#8f5c52',
          700: '#b25c4a',
          800: '#015c7a',
          900: '#015c7a',
        },
      },
      fontFamily: {
        serif: ["'Nunito Sans'", "sans-serif"],
        sans: ["'Nunito Sans'", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "brand-gradient": "linear-gradient(135deg, #017196 0%, #afe0e7 100%)",
      },
      boxShadow: {
        'premium': '0 10px 40px -10px rgba(1, 113, 150, 0.1)',
        'premium-hover': '0 20px 60px -15px rgba(1, 113, 150, 0.2)',
      }
    },
  },
  plugins: [],
};
export default config;
