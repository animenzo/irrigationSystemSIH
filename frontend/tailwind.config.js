import { fontFamily } from "tailwindcss/defaultTheme";
import { shadcnPreset } from "tailwindcss-preset-shadcn";

export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  presets: [shadcnPreset()],
  theme: {
    extend: {
      colors: {
        // If you selected "slate"
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // add more if needed
      },
    },
  },
  plugins: [],
};
