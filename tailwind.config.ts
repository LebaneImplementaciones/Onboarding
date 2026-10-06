import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        lebane: {
          blue: '#2065FF',
          dark: '#343A46',
          light: '#f3f6fb',
        },
      },
    },
  },
  plugins: [],
}
export default config
