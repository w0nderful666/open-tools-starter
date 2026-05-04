export const siteMeta = {
  name: "open-tools-starter",
  shortName: "OTS",
  version: "0.6.1",
  description: "A local-first, privacy-friendly starter template for pure frontend GitHub Pages tools.",
  repositoryUrl: "https://github.com/w0nderful666/open-tools-starter",
  demoUrl: "https://w0nderful666.github.io/open-tools-starter/",
  author: "Open Tools Starter contributors",
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
    "starter",
    "template"
  ],
  localStoragePrefix: "open-tools-starter"
} as const;

export type SiteMeta = typeof siteMeta;
