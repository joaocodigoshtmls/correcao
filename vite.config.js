import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite' //Adicione o import

export default defineConfig({
  plugins: [react(), tailwindcss()], //Adicione tailwindcss()
})