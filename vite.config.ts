import { defineConfig } from "vite";

/**
 * A Vercel (e o servidor de desenvolvimento) publica o app na raiz, então a
 * base padrão é "/". Para hospedar em um subdiretório, defina VITE_BASE_PATH:
 *
 *   VITE_BASE_PATH=/app-clima/ npm run build
 */
export default defineConfig({
  base: process.env.VITE_BASE_PATH ?? "/",
});
