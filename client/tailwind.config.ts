import type { Config } from 'tailwindcss'
const {nextui} = require("@nextui-org/react");

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        lustig: ['Lustig', 'sans-serif'],
        owners: ['Owners', 'sans-serif'],
        ownersWide: ['OwnersWide', 'sans-serif'],
        ownersNarrow: ['OwnersNarrow', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        main: {
          'primary': '#F9BF00',
          'destructive': "#db1e21",
          'destructive-secondary': "#8e1315",
          "outline": '#D9D9D9',
        },
        background: {
          'primary': '#000000',
          'secondary': '#0B0B0B',
          'tertiary': '#24242d'
        },
        text: {
          'primary': '#D9D9D9',
          'secondary': '#FFFFFF'
        },
        button: {
          primary: '#D9D9D9',
          hover: '#F9BF00',
          active: '#ffd400'
        },
      },
      lineHeight: {
        'extra-small': '0.8'
      }
    },
  },
}
export default config
