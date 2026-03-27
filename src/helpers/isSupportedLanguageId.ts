const supportedLanguageId = [
  "javascript",
  "javascriptreact",
  "typescript",
  "typescriptreact",
  "astro",
  "svelte",
  "vue"
];

export const isSupportedLanguageId = (id: string) => supportedLanguageId.includes(id) || false;