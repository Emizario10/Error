import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'void-black': '#0A0A0C', // Asfalto oscuro
        'neon-acid': '#CCFF00',  // Verde tóxico para botones de compra
        'cyber-red': '#FF003C',  // Rojo infrarrojo para alertas/glitches
        'chrome': '#E8E8E8',     // Plata para textos secundarios
      },
      fontFamily: {
        sans: ['var(--font-oswald)'],
        mono: ['var(--font-space-mono)'],
      },
    },
  },
  plugins: [],
}
export default config