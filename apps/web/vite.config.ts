import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
    plugins: [react()],
    optimizeDeps: {
        esbuildOptions: {
            resolveExtensions: ['.web.js', '.js', '.ts', '.web.ts', '.tsx', '.jsx'],
        },
    },
    resolve: {
        extensions: ['.web.tsx', '.web.jsx', '.web.js', '.tsx', '.ts', '.js'],
        alias: {
            'react-native': 'react-native-web',
        },
    },
    base: mode === 'dev' ? '/' : '/app/',
    build: {
        minify: mode !== 'dev',
    },
    envDir: '../',
}));
