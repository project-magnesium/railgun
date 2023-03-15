import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
    plugins: [react()],
    resolve: {
        alias: {
            'react-native': 'react-native-web',
        },
    },
    build: {
        minify: mode !== 'dev',
        emptyOutDir: false,
        outDir: 'public',
        rollupOptions: {
            input: 'src/content/content.tsx',
            output: {
                entryFileNames: 'build/content/[name].js',
                chunkFileNames: 'build/content/[name].js',
                assetFileNames: 'build/content/[name].[ext]',
            },
        },
        copyPublicDir: false,
    },
}));
