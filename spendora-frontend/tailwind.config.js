/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"] ,
  theme: {
    extend: {
      colors: {
        background: "#f8fafc",
        foreground: "#0f172a",
        border: "#e2e8f0",
        primary: "#fb923c",
        "primary-foreground": "#1f130a"
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 23, 42, 0.06), 0 6px 24px rgba(15, 23, 42, 0.08)"
      },
      fontFamily: {
        sans: ["Space Grotesk", "IBM Plex Sans", "ui-sans-serif", "system-ui"]
      }
    }
  },
  plugins: []
};
