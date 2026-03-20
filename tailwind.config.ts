import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        jakarta: ['var(--font-jakarta)', 'sans-serif'],
      },
      colors: {
        purple: {
          DEFAULT: '#7C3AED',
          light: '#A855F7',
          dark: '#5B21B6',
        },
        pink: '#EC4899',
        brand: {
          bg: '#FAFAFF',
          bg2: '#F3F0FF',
          border: '#E8E4F5',
          text: '#0F0A1E',
          muted: '#4B4869',
          subtle: '#9896B0',
        },
      },
    },
  },
  plugins: [],
}

export default config
