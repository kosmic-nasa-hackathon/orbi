import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import type { Connect, Plugin } from "vite";
import { defineConfig } from "vitest/config";

function pitchDeck(): Plugin {
  const rewrite: Connect.NextHandleFunction = (req, _res, next) => {
    if (req.url === "/pitch" || req.url === "/pitch/") req.url = "/pitch/index.html";
    next();
  };
  return {
    name: "orbi-pitch-deck",
    configurePreviewServer(server) {
      server.middlewares.use(rewrite);
    },
    configureServer(server) {
      server.middlewares.use(rewrite);
    },
  };
}

const { version } = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url), "utf8"),
) as { version: string };

/** Short SHA for the footer; empty in the Docker build, which has no .git. */
function shortCommit(): string {
  try {
    return execSync("git rev-parse --short HEAD", { stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim();
  } catch {
    return "";
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), pitchDeck()],
  define: {
    __APP_VERSION__: JSON.stringify(version),
    __APP_COMMIT__: JSON.stringify(shortCommit()),
  },
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname, "./src") },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
