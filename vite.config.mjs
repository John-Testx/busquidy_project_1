import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path";
import { visualizer } from 'rollup-plugin-visualizer'; // Import the plugin
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
      visualizer({
        open: true, // Automatically open the report in your browser after build
        filename: 'stats.html', // Output file name
        gzipSize: true, // Show GZIP size
        brotliSize: true, // Show Brotli size
      }),
    ],
    
    build: {
      rollupOptions: {
        output: {
          // manualChunks(id) {
          //   // This is the only logic you need.
          //   // It targets the giant vendor file.
          //   if (id.includes('node_modules')) {
              
              
          //     return 'vendor'; // Put ALL node_modules into a single 'vendor' chunk
              
              
          //     // // Group React libraries
          //     // if (id.includes('react-dom') || id.includes('react-router-dom') || id.includes('react')) {
          //     //   return 'vendor-react';
          //     // }

          //     // // Group Bootstrap
          //     // if (id.includes('bootstrap')) {
          //     //   return 'vendor-bootstrap';
          //     // }

          //     // // Put all other node_modules in a "core" chunk
          //     // return 'vendor-core';
          //   }
            
          //   // Let Vite handle all your app code (/src/) automatically.
          //   // Don't add rules for /src/components/ or /src/pages/.
          // }
        }
      }
    },

    // This base config will now work
    // base: mode === 'production' ? '/busquidy-project-files/' : '/',
    
    // base: '/',
    
    // Your existing resolve config (which now has __dirname)
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@components": path.resolve(__dirname, "./src/components"),
        "@pages": path.resolve(__dirname, "./src/pages"),
        "@routes": path.resolve(__dirname, "./src/routes"),
        "@common": path.resolve(__dirname, "./src/common"),
        "@api": path.resolve(__dirname, "./src/api"),
        "@hooks": path.resolve(__dirname, "./src/hooks"),
        "@utils": path.resolve(__dirname, "./src/utils"),
        "@contexts": path.resolve(__dirname, "./src/contexts")
      },
    }
  }
})
