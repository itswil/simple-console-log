import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["./src/**/*.test.ts"],
  deps: {
    neverBundle: ["vscode", /^node:/],
  },
  format: ["cjs"],
});
