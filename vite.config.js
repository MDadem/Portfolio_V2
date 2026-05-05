import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.pdf'],
  build: {
    // Disable sourcemaps for production (smaller bundle, no leaking source)
    sourcemap: false,
    // Minify with esbuild (default, fastest)
    minify: 'esbuild',
    // Target modern browsers for smaller output
    target: 'es2020',
    // Split vendor chunks for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-icons': ['lucide-react'],
        },
      },
    },
    // Inline small assets as base64
    assetsInlineLimit: 0,
    // CSS code splitting
    cssCodeSplit: true,
  },
  server: {
    fs: {
      strict: false,
    },
  },
})
