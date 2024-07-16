import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    base: '', // https://stackoverflow.com/a/69746868/23648002
    root: './src',
    build: {
        outDir: '../dist',
    },
});
