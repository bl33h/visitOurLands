import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: '3000'
  },
  test: {
    setupFiles: './src/setupTests.js',
    globals: true,
    environment: 'jsdom',
  },
  optimizeDeps: {
    include: ['bcryptjs'],
  },
})
