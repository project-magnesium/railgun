import { existsSync, unlinkSync } from 'fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    if (mode !== 'dev') {
        const popupMap = 'public/build/popup/popup.js.map';
        const contentMap = 'public/build/content/content.js.map';
        const backgroundMap = 'public/build/background.js.map';

        if (existsSync(popupMap)) unlinkSync(popupMap);
        if (existsSync(contentMap)) unlinkSync(contentMap);
        if (existsSync(backgroundMap)) unlinkSync(backgroundMap);
    }

    return {
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
                input: 'src/content/content.tsx',
                output: {
                    entryFileNames: 'build/content/[name].js',
                    chunkFileNames: 'build/content/[name].js',
                    assetFileNames: 'build/content/[name].[ext]',
                },
            },
            copyPublicDir: false,
        },
        envDir: '../',
    };
});
