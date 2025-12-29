import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // KIES Kleurenpalet
        primary: {
          DEFAULT: '#a15df5',
          hover: '#7947ba',
          light: '#ebdfff',
        },
        // KIES-letter specifieke kleuren
        kies: {
          k: '#a15df5', // Kiezen - primair paars
          i: '#9959ea', // Instrueren - variant 1
          e: '#814bc6', // Evalueren - medium paars
          s: '#7947ba', // Spelregels - donker paars
        },
        background: '#ffffff',
        foreground: '#000000',
        muted: {
          DEFAULT: '#f4f4f5',
          foreground: '#71717a',
        },
        card: {
          DEFAULT: '#ffffff',
          foreground: '#000000',
        },
        border: '#e4e4e7',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: '12px',
        md: '8px',
        sm: '4px',
      },
    },
  },
  plugins: [],
}

export default config
