/** @type {import('tailwindcss').Config} */
export default {
  // src 폴더 내의 모든 vue, js, ts 파일을 감지하도록 설정
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        main: {
          300: 'var(--main-300)',
          200: 'var(--main-200)',
          100: 'var(--main-100)',
        },
        'sub-main': {
          300: 'var(--sub-main-300)',
          200: 'var(--sub-main-200)',
          100: 'var(--sub-main-100)',
        },
        error: {
          300: 'var(--error-300)',
          200: 'var(--error-200)',
          100: 'var(--error-100)',
        },
        warning: {
          300: 'var(--warning-300)',
          200: 'var(--warning-200)',
          100: 'var(--warning-100)',
        },
        info: {
          300: 'var(--info-300)',
          200: 'var(--info-200)',
          100: 'var(--info-100)',
        },
        gray: {
          900: 'var(--gray-900)',
          800: 'var(--gray-800)',
          700: 'var(--gray-700)',
          600: 'var(--gray-600)',
          500: 'var(--gray-500)',
          400: 'var(--gray-400)',
          300: 'var(--gray-300)',
          200: 'var(--gray-200)',
          100: 'var(--gray-100)',
          50: 'var(--gray-50)',
        },
      },
      fontFamily: {
        sans: ['Pretendard', 'SUIT', 'sans-serif'],
        jalnan: ['JalnanGothic', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
