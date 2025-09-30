module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}', // ← if using classnames inside utils
  ],
  safelist: [
    'text-white',
    'text-black',
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'rounded-lg',
    'text-lg',
    'font-semibold',
    // add any other classes you use dynamically
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
