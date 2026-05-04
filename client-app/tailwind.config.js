/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#000212",
        "slate-deep": "#08090a",
        "brand-purple": "#5e6ad2",
        "brand-emerald": "#10b981",
        "brand-gray": "#8a8f98",
        "pure-white": "#f7f8f8",
      },
      backgroundImage: {
        "linear-gradient": "radial-gradient(circle at 50% -20%, rgba(94, 106, 210, 0.1) 0%, transparent 80%), radial-gradient(circle at 100% 100%, rgba(16, 185, 129, 0.02) 0%, transparent 50%)",
      },
    },
  },
  plugins: [],
}
