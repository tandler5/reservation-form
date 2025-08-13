const plugin = require('tailwindcss/plugin')

module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        bs: '960px'
      },
      keyframes: {
        animation: {
          availabilityPopup: {
            '0%': { transform: 'translate3d(-50%, -60%, 0px)', opacity: 0 },
            '100%': { transform: 'translate3d(-50%, -115%, 0px)', opacity: 1 }
          }
        },
        mobileSummary: {
          '0%': {
            transform: 'translate3d(-50%, -30%, 0)',
            opacity: 0
          },
          '100%': {
            transform: 'translate3d(-50%, -50%, 0)',
            opacity: 1
          }
        }
      },
      animation: {
        summary: '0.4s cubic-bezier(0.45, 1, 0.4, 1.1) 0ms mobileSummary',
        availabilityPopup: 'availabilityPopup 0.1s ease'
      },
      fontFamily: {
        priceTotal: [
          '-apple-system',
          'system-ui',
          'BlinkMacSystemFont',
          'segoe ui',
          'Roboto',
          'helvetica neue',
          'Arial',
          'sans-serif'
        ]
      },
      backgroundImage: {
        'radial-gradient': 'radial-gradient(#d4d4d4 1px,transparent 0)'
      },
      backgroundSize: { 7: '7px 7px' },
      colors: {
        success: {
          DEFAULT: '#13b353'
        },
        input: {
          DEFAULT: '#334155'
        },
        primary: {
          DEFAULT: '#fab40a'
        },
        light: {
          DEFAULT: '#feca00'
        },
        content: {
          DEFAULT: '#8e97b3'
        }
      },
      transitionTimingFunction: {
        form: 'cubic-bezier(.05,.45,.1,1)'
      },
      boxShadow: {
        summary: '0px 10px 28px -5px rgba(0, 0, 0, 0.4), 0px 2px 3px 0px rgba(0, 0, 0, 0.4)',
        form: '0 10px 30px 0 rgba(115,125,146,.11),0 1px 2px 0 rgba(160,170,185,.6)',
        button: '0 0 0 1px #fab40a'
      }
    }
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.fill-mode-both': {
          'animation-fill-mode': 'both'
        },
        '.translate-3d-center': {
          transform: 'translate3d(-50%, -100%, 0)'
        }
      })
    })
  ]
}
