import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path";

import { fileURLToPath } from 'url' // <-- ADD THIS

// --- ADD THESE TWO LINES to define __dirname ---
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// ---

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    // This base config will now work
    base: mode === 'production' ? '/busquidy-project-files/' : '/',
    
    // Your existing resolve config (which now has __dirname)
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@components": path.resolve(__dirname, "./src/components"),
        "@pages": path.resolve(__dirname, "./src/pages"),
        "@routes": path.resolve(__dirname, "./src/routes"),
        "@common": path.resolve(__dirname, "./src/common"),
        "@utils": path.resolve(__dirname, "./src/utils"),
        "@api": path.resolve(__dirname, "./src/api"),
        "@hooks": path.resolve(__dirname, "./src/hooks"),
        "@contexts": path.resolve(__dirname, "./src/contexts")
      },
    }
  }
})
