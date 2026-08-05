import type { Config } from "tailwindcss";

// Color/spacing/radius tokens pulled from the Figma file's local variables
// (Tanuh AI - Mobile App, node 3064:1756 "Capture images").
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#14868c",
          "primary-dark": "#00767d",
          "primary-light": "#daf3f4",
          neutral: "#f7f7f7",
        },
        surface: {
          primary: "#f9fafb",
          white: "#ffffff",
        },
        text: {
          primary: "#111827",
          secondary: "#6b7280",
          positive: "#f0fdf4",
          hint: "#9ca3af",
        },
        border: {
          DEFAULT: "#e5e7eb",
        },
        states: {
          "warning-default": "#fde047",
          "warning-dark": "#a16207",
          "error-light": "#f2f2f2",
        },
      },
      fontFamily: {
        sans: ["Roboto", "Helvetica", "Arial", "sans-serif"],
      },
      fontSize: {
        "label-sm": ["11px", { lineHeight: "16px" }],
        "body-sm": ["12px", { lineHeight: "16px" }],
        "body-md": ["14px", { lineHeight: "20px" }],
        "body-lg": ["16px", { lineHeight: "24px" }],
        "title-sm": ["14px", { lineHeight: "20px", fontWeight: "500" }],
        "title-md": ["16px", { lineHeight: "24px", fontWeight: "500" }],
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
      },
      borderRadius: {
        sm: "4px",
        lg: "8px",
        full: "9999px",
      },
    },
  },
  plugins: [],
};

export default config;
