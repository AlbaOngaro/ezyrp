import { defineWorkspace } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineWorkspace([
  {
    test: {
      name: "convex",
      include: ["src/convex/**/*.test.{ts,js}"],
      environment: "edge-runtime",
      server: { deps: { inline: ["convex-test"] } },
    },
  },
  {
    plugins: [react(), tsconfigPaths()],
    test: {
      include: ["src/**/*.test.{tsx,jsx}"],
      name: "frontend",
      environment: "jsdom",
    },
  },
]);
