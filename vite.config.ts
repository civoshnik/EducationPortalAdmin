import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      // всё, что начинается с /auth, /courses, /order и т.д. → ApiGateway
      '/auth': {
        target: 'http://localhost:5136',
        changeOrigin: true,
      },
      '/courses': {
        target: 'http://localhost:5136',
        changeOrigin: true,
      },
      '/lessons': {
        target: 'http://localhost:5136',
        changeOrigin: true,
      },
      '/questions': {
        target: 'http://localhost:5136',
        changeOrigin: true,
      },
      '/enrollment': {
        target: 'http://localhost:5136',
        changeOrigin: true,
      },
      '/notification': {
        target: 'http://localhost:5136',
        changeOrigin: true,
      },
      '/order': {
        target: 'http://localhost:5136',
        changeOrigin: true,
      },
      '/result': {
        target: 'http://localhost:5136',
        changeOrigin: true,
      },
      '/api/services': {
        target: 'http://localhost:5136',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/services/, '/services')
      }
    },
  },
})

