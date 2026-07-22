export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#2563eb',
          dark: '#1d4ed8',
          light: '#dbeafe'
        },
        accent: {
          DEFAULT: '#8b5cf6',
          dark: '#6d28d9',
          light: '#ede9fe'
        },
        surface: '#080a17',
        ink: '#050713',
        card: '#0d1020'
      },
      boxShadow: {
        soft: '0 18px 45px rgba(15, 23, 42, 0.12)'
      }
    }
  },
  plugins: []
}
