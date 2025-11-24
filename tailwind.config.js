/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./App.tsx",
    "./index.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./constants.ts",
    "./types.ts",
  ],
  safelist: [
    // Background colors
    'bg-red-600',
    'bg-green-600',
    'bg-blue-600',
    'bg-yellow-500',
    'bg-yellow-600',
    'bg-orange-600',
    'bg-purple-600',
    'bg-slate-500',
    'bg-slate-600',
    'bg-cyan-600',
    'bg-indigo-600',
    'bg-emerald-600',
    // Text colors
    'text-white',
    'text-black',
    // Hover variants
    'hover:bg-red-700',
    'hover:bg-green-700',
    'hover:bg-blue-700',
    'hover:bg-yellow-600',
    'hover:bg-yellow-700',
    'hover:bg-orange-700',
    'hover:bg-purple-700',
    'hover:bg-slate-600',
    'hover:bg-slate-700',
    'hover:bg-cyan-700',
    'hover:bg-indigo-700',
    'hover:bg-emerald-700',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
