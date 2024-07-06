import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environmentMatchGlobs: [
      // all tests in convex/ will run in edge-runtime
      ["src/convex/**", "edge-runtime"],
      // all other tests use jsdom
      ["src/**", "jsdom"],
    ],
    server: { deps: { inline: ["convex-test"] } },
  },
});
