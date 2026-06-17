import { defineConfig } from "vitest/config"

export default defineConfig({
  base: "/puzzle.js/",
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
})
