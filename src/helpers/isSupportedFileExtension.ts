const supportedFileExtensions = [
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".mjs",
  ".cjs",
  ".mts",
  ".cts",
  ".astro",
  ".svelte",
  ".vue",
];

export const isSupportedFileExtension = (extension: string) => supportedFileExtensions.includes(extension) || false;
