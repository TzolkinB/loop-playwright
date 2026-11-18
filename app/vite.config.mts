import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Run with the app folder as the Vite root: `vite build app`.
export default defineConfig({
  plugins: [react()],
  build: { outDir: 'dist', emptyOutDir: true },
})
