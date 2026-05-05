export const siteMeta = {
  name: "Local Clipboard Vault",
  shortName: "LCV",
  version: "0.1.0",
  description: "A Local First clipboard vault for saving, searching, and encrypting snippets in the browser.",
  repositoryUrl: "https://github.com/w0nderful666/open-tools-starter",
  demoUrl: "https://w0nderful666.github.io/open-tools-starter/",
  author: "w0nderful666",
  license: "MIT",
  keywords: [
    "GitHub Pages",
    "frontend",
    "local-first",
    "no-backend",
    "privacy-friendly",
    "Vite",
    "React",
    "TypeScript",
    "clipboard",
    "vault",
    "web-crypto"
  ],
  localStoragePrefix: "local-clipboard-vault"
} as const;

export type SiteMeta = typeof siteMeta;
