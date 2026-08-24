import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["app/plan/_lib/**/*.test.ts"],
    environment: "node",
  },
});
