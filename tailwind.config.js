/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        agri: {
          bg: "#152012",
          bgDark: "#111b0e",
          card: "#22331c",
          cardDark: "#1a2815",
          cardHover: "#2a4023",
          border: "#3d5634",
          borderLight: "#4e6f43",
          accent: "#eab308",
          accentHover: "#ca8a04",
          gold: "#f59e0b",
          leaf: "#4ade80",
          lime: "#84cc16",
          text: "#f0fdf4",
          muted: "#9cb497",
          subtle: "#6f886a",
          receipt: "#fcfaf4",
          receiptDark: "#f5f0e3",
          receiptInk: "#1f2937",
          receiptMuted: "#4b5563"
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace']
      },
      boxShadow: {
        'glow-gold': '0 0 20px -3px rgba(234, 179, 8, 0.35)',
        'glow-green': '0 0 20px -3px rgba(74, 222, 128, 0.35)',
        'receipt': '0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.4)'
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ripple': 'ripple 2s linear infinite',
      },
      keyframes: {
        ripple: {
          '0%': { transform: 'scale(0.95)', opacity: '1' },
          '100%': { transform: 'scale(1.4)', opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}
