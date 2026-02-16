const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/**/*.html",
    "./src/**/*.{astro,md,js,jsx,svelte,ts,tsx,vue}",
    "../../libs/**/*.{astro,md,js,jsx,svelte,ts,tsx,vue}",
  ],
  theme: {
    fontFamily: {
      sans: ["Youth"],
      logo: ["Autograf"],
    },
    screens: {
      sm: { max: "320px" },
    },
    extend: {
      colors: {
        "strong-blue": "#3259A4",
      },
      boxShadow: {
        "link-underline": "0 1px 0 0 #3259A4",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    plugin(function ({ addBase }) {
      addBase({
        "@font-face": {
          fontFamily: "Youth",
          src: "url(//cdn.jsdelivr.net/korean-webfonts/1/orgs/othrs/kywa/Youth/Youth.woff2) format('woff2'), url(//cdn.jsdelivr.net/korean-webfonts/1/orgs/othrs/kywa/Youth/Youth.woff) format('woff')",
        },

        "@font-face": {
          fontFamily: "Autograf",
          src: "url(/fonts/Autograf.woff) format('woff')",
        },

        h2: {
          borderLeft: "8px solid #EAC541",
          paddingLeft: "10px",
        },
      });
    }),
  ],
};
