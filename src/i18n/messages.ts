export type Language = "zh" | "en";

export const messages = {
  zh: {
    appName: "Local Clipboard Vault",
    localName: "本地剪贴内容保险箱",
  },
  en: {
    appName: "Local Clipboard Vault",
    localName: "Local Clipboard Vault",
  },
} satisfies Record<Language, { appName: string; localName: string }>;
