import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setup.js",
    coverage: {
      provider: "v8",
      include: ["src/**"],
      exclude: ["src/main.jsx", "src/firebase.js", "src/setup.js", "src/**/*.test.jsx"],
      thresholds: { lines: 65 },
    },
  },
});
