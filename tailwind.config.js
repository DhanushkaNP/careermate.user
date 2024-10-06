/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./Components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        default: ["Montserrat"],
        inika: ["Inika"],
      },
      colors: {
        "default-background": "#F7F9FB",
        "light-background": "#F7F9FB",
        "light-blue-background": "#EFF4FB",
        "dark-bg": "#E0E5F2",
        "dark-blue": "#2B3674",
        "dark-dark-blue": "#252B42",
        "light-blue": "#3056D3",
        "light-gray": "#A3AED0",
        "dark-gray": "#707EAE",
        "opacity-light-blue": "rgba(48, 86, 211, 0.35)",
        green: "#3f8600",
        red: "#cf1322",
        "ice-blue": "#26A4FF",
      },
      backgroundImage: {
        "study-image": "url('/study2.png')",
        "company-image": "url('/company2.png')",
        "supervisor-image": "url('/supervisor.jpg')",
      },
    },
  },
  plugins: [],
};
