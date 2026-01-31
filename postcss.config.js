import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const tailwindVersion = require('tailwindcss/package.json').version;
const major = Number.parseInt(tailwindVersion.split('.')[0], 10);
const tailwindPlugin = major >= 4 ? require('@tailwindcss/postcss') : require('tailwindcss');

export default {
  plugins: [tailwindPlugin, require('autoprefixer')],
};
