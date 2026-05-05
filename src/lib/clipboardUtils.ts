export const CLIP_TYPES = [
  "Prompt",
  "API Key",
  "Token",
  "Command",
  "Note",
  "Template",
  "JSON",
  "Markdown",
  "Other",
] as const;

export type ClipType = (typeof CLIP_TYPES)[number];

export type EncryptedPayload = {
  encrypted: true;
  algorithm: "AES-GCM";
  kdf: "PBKDF2";
  iterations: number;
  salt: string;
  iv: string;
  ciphertext: string;
};

export type ClipItem = {
  id: string;
  title: string;
  content?: string;
  encryptedPayload?: EncryptedPayload;
  type: ClipType;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  pinned: boolean;
  favorite: boolean;
  sensitive: boolean;
  encrypted: boolean;
  note: string;
};

const commandPattern = /^(npm|pnpm|yarn|git|curl|ssh|docker|node|python|bash|chmod|systemctl|npx|deno|bun)\b/i;
const apiKeyPattern = /\b(sk-[a-z0-9_-]{8,}|api[_-]?key|x-api-key|AIza[a-z0-9_-]{8,})\b/i;
const tokenPattern = /\b(access[_-]?token|auth[_-]?token|bearer\s+[a-z0-9._-]{8,}|ghp_[a-z0-9_]{8,}|token[_-]?[a-z0-9_-]{8,})\b/i;
const promptPattern = /(please help|you are|你现在要|请帮我|目标|要求|prompt|system prompt|act as)/i;
const templatePattern = /(\{\{.+\}\}|\$\{.+\}|<[^>\s]+>)/;

export function isJsonSnippet(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) {
    return false;
  }

  try {
    JSON.parse(trimmed);
    return true;
  } catch {
    return false;
  }
}

export function detectClipType(content: string): ClipType {
  const text = content.trim();
  if (!text) return "Note";
  if (apiKeyPattern.test(text)) return "API Key";
  if (tokenPattern.test(text)) return "Token";
  if (commandPattern.test(text)) return "Command";
  if (isJsonSnippet(text)) return "JSON";
  if (/^#{1,6}\s|\n#{1,6}\s|```|- \[ \]|\[[^\]]+\]\([^)]+\)/.test(text)) return "Markdown";
  if (templatePattern.test(text)) return "Template";
  if (promptPattern.test(text) || text.length > 260) return "Prompt";
  return "Note";
}

export function detectSensitive(content: string): boolean {
  return apiKeyPattern.test(content) || tokenPattern.test(content) || /password|cookie|secret/i.test(content);
}

export function generateClipTitle(content: string, now = new Date()): string {
  const time = new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(now);
  const type = detectClipType(content);
  const cleaned = content
    .split(/\r?\n/)
    .map((line) => line.trim().replace(/\s+/g, " "))
    .find(Boolean);

  const generatedByType: Partial<Record<ClipType, string>> = {
    "API Key": `API Key · ${time}`,
    Token: `Token · ${time}`,
    Command: `Command · ${time}`,
    JSON: `JSON Snippet · ${time}`,
    Markdown: `Markdown Note · ${time}`,
  };

  if (generatedByType[type]) {
    return generatedByType[type] as string;
  }

  if (!cleaned) {
    return `Clip · ${time}`;
  }

  if (type === "Prompt" && cleaned.length > 72) {
    return `Prompt · ${time}`;
  }

  return cleaned.length > 32 ? `${cleaned.slice(0, 29)}...` : cleaned;
}

export function createClipFromContent(content: string, overrides: Partial<ClipItem> = {}): ClipItem {
  const now = new Date().toISOString();
  const type = overrides.type ?? detectClipType(content);

  return {
    id: overrides.id ?? crypto.randomUUID(),
    title: overrides.title ?? generateClipTitle(content, new Date(now)),
    content,
    type,
    tags: overrides.tags ?? [type.toLowerCase().replace(/\s+/g, "-")],
    createdAt: overrides.createdAt ?? now,
    updatedAt: overrides.updatedAt ?? now,
    pinned: overrides.pinned ?? false,
    favorite: overrides.favorite ?? false,
    sensitive: overrides.sensitive ?? detectSensitive(content),
    encrypted: overrides.encrypted ?? false,
    note: overrides.note ?? "",
    encryptedPayload: overrides.encryptedPayload,
  };
}

export function summarizeClip(clip: ClipItem, revealedContent?: string): string {
  if (clip.encrypted && !revealedContent) {
    return "•••••••• encrypted content. Unlock vault to reveal.";
  }

  const content = revealedContent ?? clip.content ?? "";
  const normalized = content.replace(/\s+/g, " ").trim();
  if (!normalized) {
    return clip.sensitive ? "Sensitive content is empty or hidden." : "Empty clip.";
  }

  return normalized.length > 150 ? `${normalized.slice(0, 147)}...` : normalized;
}

export function normalizeImportedClip(value: unknown): ClipItem | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const source = value as Partial<ClipItem>;
  const fallbackContent = typeof source.content === "string" ? source.content : "";
  const now = new Date().toISOString();

  return {
    id: typeof source.id === "string" ? source.id : crypto.randomUUID(),
    title: typeof source.title === "string" ? source.title : generateClipTitle(fallbackContent),
    content: typeof source.content === "string" ? source.content : undefined,
    encryptedPayload: source.encryptedPayload,
    type: CLIP_TYPES.includes(source.type as ClipType) ? (source.type as ClipType) : detectClipType(fallbackContent),
    tags: Array.isArray(source.tags) ? source.tags.filter((tag): tag is string => typeof tag === "string") : [],
    createdAt: typeof source.createdAt === "string" ? source.createdAt : now,
    updatedAt: typeof source.updatedAt === "string" ? source.updatedAt : now,
    pinned: Boolean(source.pinned),
    favorite: Boolean(source.favorite),
    sensitive: Boolean(source.sensitive),
    encrypted: Boolean(source.encrypted || source.encryptedPayload),
    note: typeof source.note === "string" ? source.note : "",
  };
}
