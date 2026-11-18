import { defineConfig } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3000,
    open: false,
    fs: {
      allow: ['.']
    }
  },
  plugins: [
    {
      name: 'copy-afterlight-assets',
      closeBundle() {
        const srcDir = path.resolve(__dirname, 'assets');
        const destDir = path.resolve(__dirname, 'dist', 'assets');
        if (fs.existsSync(srcDir)) {
          fs.cpSync(srcDir, destDir, { recursive: true });
          console.log('✓ Successfully copied assets/ to dist/assets/');
        }
      }
    }
  ],
  build: {
    target: 'esnext',
    outDir: 'dist',
    chunkSizeWarningLimit: 3000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) {
            return 'three-vendor';
          }
          if (id.includes('node_modules/animejs')) {
            return 'anime-vendor';
          }
        }
      }
    }
  }
});
