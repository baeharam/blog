module.exports = {
  content: [
    './public/**/*.html',
    './src/**/*.{astro,md,js,jsx,svelte,ts,tsx,vue}',
    '../../libs/**/*.{astro,md,js,jsx,svelte,ts,tsx,vue}',
  ],
  theme: {
    fontFamily: {
      sans: ["Nanum Gothic"],
    },
    extend: {
      colors: {
        "strong-blue": "#3259A4"
      },
      boxShadow: {
        "link-underline": "0 1px 0 0 #3259A4"
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
}