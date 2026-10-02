import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import { attachSuggest } from "./server/suggest.js";

function suggestPlugin() {
  return {
    name: "suggest",
    configureServer(server) {
      const env = { ...loadEnv(server.config.mode, server.config.root, ""), ...process.env };
      attachSuggest(server.middlewares, env);
    },
    configurePreviewServer(server) {
      const env = { ...loadEnv(server.config.mode, server.config.root, ""), ...process.env };
      attachSuggest(server.middlewares, env);
    },
  };
}

export default defineConfig({
  plugins: [tailwindcss(), suggestPlugin()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
      },
    },
  },
});
