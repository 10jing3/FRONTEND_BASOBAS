import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': { // Use '/api' instead of 'api'
        target: 'http://localhost:3000',
        changeOrigin: true, // Ensure the origin of the host header is changed to the target URL
        secure: false,
      },
    },
  },
  plugins: [react()],
})
