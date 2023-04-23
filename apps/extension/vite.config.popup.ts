import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
    plugins: [react()],
    resolve: {
        extensions: ['.web.tsx', '.web.jsx', '.web.js', '.tsx', '.ts', '.js'],
        alias: {
            'react-native': 'react-native-web',
        },
    },
    build: {
        minify: mode !== 'dev',
        sourcemap: mode === 'dev',
        emptyOutDir: false,
        outDir: 'public',
        rollupOptions: {
            input: 'src/popup/popup.tsx',
            output: {
                entryFileNames: 'build/popup/[name].js',
                chunkFileNames: 'build/popup/[name].js',
                assetFileNames: 'build/popup/[name].[ext]',
            },
        },
        copyPublicDir: false,
    },
    envDir: '../',
}));
