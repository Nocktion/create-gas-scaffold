import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react(), viteSingleFile()],
  base: './',
  root: 'src/client',
  build: {
    target: 'es2022',
    sourcemap: false,
    cssCodeSplit: false,
    assetsInlineLimit: 100_000_000,
    modulePreload: false,
    outDir: resolve(process.cwd(), 'dist/client'),
    emptyOutDir: true,
    minify: true,
  },
});
