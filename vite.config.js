import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: 'rdf-elements.js',
      formats: ['es']
    },
    target: 'es2020'
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020'
    }
  }
})
