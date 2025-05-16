/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  safelist: [
    "bg-[#2B4C8C]",
    "bg-[#3A5FA0]",
    "bg-[#99AAD6]/70",
    "text-[#2B4C8C]",
    "from-[#2B4C8C]/90",
    "via-[#2B4C8C]/70",
    "to-transparent",
    "bg-gradient-to-br",
    "bg-gradient-to-tr",
    "bg-gradient-to-tl",
    "bg-gradient-to-t",
    "bg-white/10",
    "bg-white/5",
    "bg-white/90",
    "text-white",
    "text-white/90"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} 