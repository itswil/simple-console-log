import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["./src/**/*.test.ts"],
  deps: {
    neverBundle: ["vscode", /^node:/],
  },
  format: ["cjs"],
  outDir: "dist-test", // note: test runner must execute ./dist/extension.cjs as stated in package.json
});
