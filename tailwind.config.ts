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
          primary: '#017196',
          coral: '#EA6F5B',
          aqua: '#A6DCE3',
          background: '#F7F9FB',
          dark: '#015c7a',
          50: '#f0f9f6',
          100: '#d7f2e9',
          200: '#afe4d3',
          300: '#7eceb6',
          400: '#54b097',
          500: '#3a937c',
          600: '#2c7665',
          700: '#255f52',
          800: '#1f4d43',
          900: '#1a4038',
        },
      },
      fontFamily: {
        heading: ["Playfair Display", "serif"],
        sans: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "brand-gradient": "linear-gradient(135deg, #017196 0%, #A6DCE3 100%)",
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
