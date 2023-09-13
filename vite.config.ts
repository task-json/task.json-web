import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import UnoCSS from "unocss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8080
  },
	plugins: [
    preact(),
    UnoCSS()
  ],
});
