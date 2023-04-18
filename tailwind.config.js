/* eslint-disable sort-keys-fix/sort-keys-fix */

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        gray: {
          900: '#F8F8F8',
          800: '#E8E8E8',
          700: '#ECECEC',
          600: '#E5E5E5',
          500: '#303941',
          400: '#727783',
          300: '#A6A6A6',
          100: '#2E2E2F',
        },
        red: {
          800: '#F84E55',
          700: '#F55065',
          600: '#D64D54',
        },
        blue: {
          700: '#3339D9',
          600: '#1D5CFF',
          500: '#2B32CB',
        },
        dark: {
          800: '#20133D',
          700: '#29123E',
          500: '#3C2D50',
        },
      },
      fontSize: {
        '2xs': '.625rem', // 10px
      },
      fontFamily: {
        lores12: ['lores-12', 'sans-serif'],
        lumadFree: ['lumad-free', 'sans-serif'],
        neueHaasGroteskTextPro: 'Neue Haas Grotesk Text Pro',
        neueHaasGroteskDisplayPro: 'Neue Haas Grotesk Display Pro',
        displayNarrowBoldRoslindale: 'Display Narrow Bold Roslindale',
      },
      backgroundImage: {
        'banner-desktop': 'url(/images/banner-bg.jpg)',
        'banner-mobile': 'url(/images/banner-bg_mobile.jpg)',
        'banner-desktop-v2': 'url(/images/banner-bg-v2_desktop.jpg)',
        'banner-mobile-v2': 'url(/images/banner-bg-v2_mobile.jpg)',
        'footer-desktop': 'url(/images/footer_desktop.jpg)',
        'footer-mobile': 'url(/images/footer_mobile.jpg)',
        'auth-desktop': 'url(/images/auth-bg.jpg)',
        'auth-mobile': 'url(/images/auth-bg_mobile.jpg)',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
