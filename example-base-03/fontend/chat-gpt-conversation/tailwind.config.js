/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Include all your source files
  ],
  // darkMode: 'class', // Enable class-based dark mode
  darkMode: ["class", '[data-theme="dark"]'], // Enable class-based and custom attribute-based dark mode
  theme: {
    extend: {
      // typography: {
      //   DEFAULT: {
      //     css: {
      //       color: '#333333', // Default text color
      //       a: {
      //         color: '#1a73e8', // Link color
      //         textDecoration: 'underline',
      //         '&:hover': {
      //           color: '#0048aa',
      //         },
      //       },
      //       h1: {
      //         fontSize: '2.25rem',
      //         fontWeight: '700',
      //         color: '#1F2937', // Darker color for headings
      //       },
      //       h2: {
      //         fontSize: '1.875rem',
      //         fontWeight: '600',
      //         color: '#4B5563',
      //       },
      //       p: {
      //         marginTop: '0.75rem',
      //         marginBottom: '0.75rem',
      //         lineHeight: '1.75',
      //       },
      //       blockquote: {
      //         fontStyle: 'italic',
      //         borderLeftWidth: '4px',
      //         borderColor: '#d1d5db', // Light gray border for blockquotes
      //         paddingLeft: '1rem',
      //         color: '#6B7280',
      //       },
      //       code: {
      //         backgroundColor: '#f5f5f5',
      //         padding: '0.25rem 0.5rem',
      //         borderRadius: '0.375rem',
      //         color: '#D6336C',
      //       },
      //     },
      //   },
      //   lg: {
      //     css: {
      //       fontSize: '1.125rem',
      //       lineHeight: '1.85',
      //     },
      //   },
      // },
      // colors: {
      //   cornsilk: '#40E0D0',
      //   lavenderblush: '#DA70D6',
      // },
      colors: {
        scrollbar: {
          thumb: '#6b7280', // Gray-500
          track: '#e5e7eb', // Gray-200
        },
      },
      backgroundColor: {
        base: "var(--bg-color)", // Use CSS variables for colors
      },
      textColor: {
        base: "var(--text-color)",
      },
      animation: {
        fadeIn: "fadeIn 0.3s ease-in-out",
        slideDown: "slideDown 0.4s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-50px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
