/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Neutral surface palette — layered dark
        surface: {
          0:  '#080b0f',   // deepest bg
          1:  '#0d1117',   // page bg
          2:  '#111820',   // card bg
          3:  '#161e28',   // elevated card
          4:  '#1c2533',   // hover surface
        },
        // Borders
        border: {
          subtle: 'rgba(255,255,255,0.06)',
          DEFAULT: 'rgba(255,255,255,0.09)',
          strong: 'rgba(255,255,255,0.14)',
        },
        // Accent — restrained green
        accent: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        // Text
        ink: {
          primary:   'rgba(255,255,255,0.92)',
          secondary: 'rgba(255,255,255,0.55)',
          tertiary:  'rgba(255,255,255,0.35)',
          disabled:  'rgba(255,255,255,0.20)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1rem' }],
        xs:   ['0.75rem', { lineHeight: '1.125rem' }],
        sm:   ['0.8125rem', { lineHeight: '1.25rem' }],
        base: ['0.9375rem', { lineHeight: '1.5rem' }],
        lg:   ['1.0625rem', { lineHeight: '1.625rem' }],
        xl:   ['1.1875rem', { lineHeight: '1.75rem' }],
        '2xl':['1.375rem',  { lineHeight: '1.875rem' }],
        '3xl':['1.75rem',   { lineHeight: '2.25rem' }],
        '4xl':['2.25rem',   { lineHeight: '2.75rem' }],
        '5xl':['3rem',      { lineHeight: '3.5rem' }],
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
      },
      borderRadius: {
        sm:   '6px',
        DEFAULT: '8px',
        md:   '10px',
        lg:   '12px',
        xl:   '16px',
        '2xl':'20px',
        '3xl':'24px',
      },
      boxShadow: {
        // Layered, directional shadows — not glowing
        xs:   '0 1px 2px rgba(0,0,0,0.3)',
        sm:   '0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)',
        md:   '0 4px 8px rgba(0,0,0,0.35), 0 2px 4px rgba(0,0,0,0.25)',
        lg:   '0 8px 20px rgba(0,0,0,0.4), 0 4px 8px rgba(0,0,0,0.3)',
        xl:   '0 16px 40px rgba(0,0,0,0.45), 0 8px 16px rgba(0,0,0,0.3)',
        card: '0 1px 3px rgba(0,0,0,0.5)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.5)',
        inset: 'inset 0 1px 0 rgba(255,255,255,0.05)',
      },
      backgroundImage: {
        'page-gradient': 'linear-gradient(180deg, #0d1117 0%, #080b0f 100%)',
        'hero-gradient': 'linear-gradient(160deg, #0d1117 0%, #0f1a12 60%, #0d1117 100%)',
        'card-gradient': 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.65) 100%)',
        'accent-gradient': 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out-quart': 'cubic-bezier(0.76, 0, 0.24, 1)',
      },
      transitionDuration: {
        150: '150ms',
        250: '250ms',
      },
    },
  },
  plugins: [],
};
