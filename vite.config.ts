import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'

export default defineConfig({
  root: 'src',
  base: '/color-tester-that-doesnt-sucks/',
  plugins: [
    react(),
    tailwind(),
  ],
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
})