/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#282a36',
        foreground: '#f8f8f2',
        card: '#44475a',
        'card-foreground': '#f8f8f2',
        popover: '#282a36',
        'popover-foreground': '#f8f8f2',
        primary: '#bd93f9',
        'primary-foreground': '#282a36',
        secondary: '#6272a4',
        'secondary-foreground': '#f8f8f2',
        muted: '#44475a',
        'muted-foreground': '#6272a4',
        accent: '#ffb86c',
        'accent-foreground': '#282a36',
        destructive: '#ff5555',
        'destructive-foreground': '#f8f8f2',
        border: '#44475a',
        input: '#44475a',
        ring: '#bd93f9',
        chart: {
          '1': '#bd93f9',
          '2': '#50fa7b',
          '3': '#8be9fd',
          '4': '#ff79c6',
          '5': '#ffb86c',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
