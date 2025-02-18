import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        search: resolve(__dirname, 'search.html'),
        local: resolve(__dirname, 'search-local.html'),
        searchall: resolve(__dirname, 'archive-wide-search.html')
      },
    },
  },
})