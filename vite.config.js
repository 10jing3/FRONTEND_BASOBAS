import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Backend server running on port 5000
        changeOrigin: true, // Modifies the origin header to match the target
        secure: false, // For HTTP connections (not HTTPS)
      },
    },
  },
  plugins: [react()],
})
