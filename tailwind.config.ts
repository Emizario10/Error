import { type Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx,js,jsx}',
    './components/**/*.{ts,tsx,js,jsx}',
    './pages/**/*.{ts,tsx,js,jsx}',
    './node_modules/@shadcn/ui/**/*.{js,ts,jsx,tsx}',
    './node_modules/@radix-ui/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'void-black': '#000000',
        'neon-acid': '#CCFF00',
        'chrome': '#E8E8E8',
        'cyber-red': '#FF003C',
      },
      fontFamily: {
        sans: ['Oswald', ...defaultTheme.fontFamily.sans],
        display: ['Oswald', ...defaultTheme.fontFamily.sans],
        mono: ['Space Mono', ...defaultTheme.fontFamily.mono],
      },
    },
  },
  plugins: [],
};

export default config;