/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // 柔和蓝灰系默认主题
        primary: {
          50: '#f0f4f8',
          100: '#dbe5ef',
          200: '#b8c9dd',
          300: '#8fa7c5',
          400: '#6482a8',
          500: '#4a6b8f',
          600: '#3d5675',
          700: '#32445c',
          800: '#2a394d',
          900: '#243041',
        },
        ink: {
          50: '#f7f8fa',
          100: '#eef0f4',
          200: '#d9dde5',
          300: '#b8bfcd',
          400: '#8b95a9',
          500: '#636e85',
          600: '#4c5569',
          700: '#3c4355',
          800: '#2e3342',
          900: '#1f2330',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 12px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.08)',
      },
      transitionProperty: {
        'card': 'transform, box-shadow',
      },
    },
  },
  plugins: [],
}
