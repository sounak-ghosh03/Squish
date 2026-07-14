import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  build: {
    // Target modern browsers — smaller output, no legacy polyfills
    target: 'es2020',

    // Warn when a chunk exceeds 500 KB
    chunkSizeWarningLimit: 500,

    rollupOptions: {
      output: {
        // Split large dependencies into separate cached chunks
        manualChunks: {
          // React runtime — changes rarely, gets its own long-lived chunk
          'vendor-react': ['react', 'react-dom'],

          // Image compression — only loaded for JPEG/PNG files
          'vendor-image': ['browser-image-compression'],

          // PDF lib — already lazy-loaded via dynamic import(), but
          // declaring it here ensures it gets a stable chunk name
          'vendor-pdf': ['pdf-lib'],
        },
      },
    },
  },
})
