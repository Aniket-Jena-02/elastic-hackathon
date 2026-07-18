/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#10142B", // base background - night transit map navy
          panel: "#171B36", // card/panel surface
          rule: "#2A2F52", // hairline dividers
        },
        paper: "#F3EFE3", // warm off-white for primary text
        slate: {
          soft: "#9CA3C4", // muted secondary text
        },
        signal: "#F5B700", // signature amber accent (station-signage yellow)
        line: {
          red: "#E23744",
          yellow: "#F5B700",
          blue: "#2563EB",
          green: "#16A34A",
          violet: "#8B5CF6",
          pink: "#EC4899",
          magenta: "#D6249F",
          orange: "#F97316",
          aqua: "#06B6D4",
          gray: "#6B7280",
          rapid: "#0EA5A5",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};
