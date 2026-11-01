import { defineConfig } from "vite";

/**
 * O GitHub Pages publica o projeto em um subdiretório:
 * https://ivan-teotonio.github.io/app-clima/
 *
 * Por isso o build e o preview usam a base "/app-clima/". Em desenvolvimento
 * a base continua "/" para manter o endereço habitual (http://localhost:5173/).
 */
export default defineConfig(({ command, isPreview }) => ({
  base: command === "build" || isPreview ? "/app-clima/" : "/",
}));
