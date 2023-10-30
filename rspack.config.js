import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from '@rspack/cli';
import TsCheckPlugin from 'fork-ts-checker-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
    entry: {
        main: './src/index.ts',
    },
    output: {
        filename: 'main.js',
        path: resolve(__dirname, 'dist', 'script'),
    },
    plugins: [new TsCheckPlugin()],
    stats: {
        preset: 'verbose',
    },
});
