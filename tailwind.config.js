export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0f4c81',
          dark: '#0b3a5c',
          light: '#e3eefb'
        },
        accent: {
          DEFAULT: '#f5b800',
          dark: '#c48b00',
          light: '#fff2cc'
        },
        surface: '#f8fafc'
      },
      boxShadow: {
        soft: '0 18px 45px rgba(15, 23, 42, 0.08)'
      }
    }
  },
  plugins: []
}
