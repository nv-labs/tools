import type { Config } from 'tailwindcss';
import daisyui from 'daisyui';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        light: {
          100: '#f2f2f2',
          200: '#e6e6e6',
          300: '#d9d9d9',
          400: '#cccccc',
          500: '#bfbfbf',
        },
      },

      animation: {
        fadeOut: 'fadeOut 0.2s ease-in-out',
        fadeIn: 'fadeIn 0.2s ease-in-out',
      },

      keyframes: {
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
    container: {
      center: true,
      padding: "15px",
    },
  },
  plugins: [daisyui],
  daisyui: {
      themes : ["lofi"],
      color: {
          primary: "#ffffff",
      }
  }
};
export default config;
