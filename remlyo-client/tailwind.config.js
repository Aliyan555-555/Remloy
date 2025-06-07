// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    './node_modules/@mantine/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-green': '#2F6A50',
        'brand-green-light': '#3D8B6A',
        'brand-green-dark': '#264a3d',
        'brand-light': '#F5F7F4',
      },
      fontFamily: {
        sans: [
          '-apple-system', 
          'BlinkMacSystemFont', 
          '"Segoe UI"', 
          'Roboto', 
          'Oxygen', 
          'Ubuntu', 
          'Cantarell', 
          '"Open Sans"', 
          '"Helvetica Neue"', 
          'sans-serif'
        ],
      },
      boxShadow: {
        'card': '0 2px 8px 0 rgba(0, 0, 0, 0.1)',
        'hover': '0 4px 12px 0 rgba(0, 0, 0, 0.15)',
      },
      backgroundImage: {
        'hero-banner': "url('/images/hero-banner.png')",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    function({ addComponents }) {
      addComponents({
        '.btn': {
          padding: '.5rem 1rem',
          borderRadius: '.25rem',
          fontWeight: '500',
          display: 'inline-block',
          transition: 'all 150ms ease',
          cursor: 'pointer',
        },
        '.btn-green': {
          backgroundColor: '#2F6A50',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#264a3d',
          },
        },
        '.btn-white': {
          backgroundColor: '#fff',
          color: '#2F6A50',
          borderWidth: '1px',
          borderColor: '#e5e7eb',
          '&:hover': {
            borderColor: '#2F6A50',
          },
        },
        '.btn-outline': {
          backgroundColor: 'transparent',
          borderWidth: '1px',
          borderColor: '#2F6A50',
          color: '#2F6A50',
          '&:hover': {
            backgroundColor: '#2F6A50',
            color: '#fff',
          },
        },
        '.card': {
          backgroundColor: '#fff',
          borderRadius: '.5rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          overflow: 'hidden',
          transition: 'all 150ms ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
        },
        '.category-badge': {
          position: 'absolute',
          top: '0.5rem',
          left: '0.5rem',
          backgroundColor: '#2F6A50',
          color: '#fff',
          fontSize: '0.75rem',
          padding: '0.25rem 0.75rem',
          borderRadius: '9999px',
        },
        'recommendation-bg': '#f2f5f3',
      })
    }
  ],
}