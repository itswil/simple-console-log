import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["./src/extension.ts", "./src/**/*.test.ts"],
  external: ["vscode", /^node:/],
  format: ["cjs"],
  clean: true,
  outExtension() {
    return { js: ".js" };
  },
});
