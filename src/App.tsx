import { useEffect, useMemo, useRef, useState } from "react";
import {
  Clipboard,
  Copy,
  Download,
  Eye,
  EyeOff,
  FileJson,
  Heart,
  Languages,
  Lock,
  Moon,
  Pencil,
  Pin,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Sun,
  Trash2,
  Upload,
} from "lucide-react";
import { Button } from "@/components/Button";
import { Modal } from "@/components/Modal";
import { Toast, type ToastMessage } from "@/components/Toast";
import { siteMeta } from "@/config/siteMeta";
import { sampleClips } from "@/data/sampleClips";
import { clipboardStorage } from "@/lib/clipboardStorage";
import {
  CLIP_TYPES,
  type ClipItem,
  type ClipType,
  createClipFromContent,
  detectClipType,
  generateClipTitle,
  summarizeClip,
} from "@/lib/clipboardUtils";
import { AUTO_LOCK_MINUTES, decryptContent, encryptContent } from "@/lib/cryptoVault";

type Theme = "light" | "dark";
type Language = "zh" | "en";
type FilterMode = {
  query: string;
  type: "All" | ClipType;
  tag: string;
  onlyPinned: boolean;
  onlyFavorite: boolean;
};

const text = {
  zh: {
    localName: "本地剪贴内容保险箱",
    tagline: "Local First / No Backend / GitHub Pages Ready 的本地内容浮窗工作台。",
    quickCapture: "Quick Capture",
    pasteFromClipboard: "从剪贴板导入",
    manualPaste: "手动粘贴",
    saveContent: "保存内容",
    ctrlEnter: "Press Ctrl + Enter to save",
    sensitive: "敏感内容",
    autoTitle: "自动标题",
    autoType: "自动类型识别",
    floatingCards: "Floating Cards",
    recentClips: "Recent clips",
    search: "搜索",
    tags: "标签",
    type: "类型",
    copy: "复制",
    edit: "编辑",
    clone: "克隆",
    delete: "删除",
    pin: "置顶",
    favorite: "收藏",
    reveal: "Reveal / Hide",
    details: "Open details",
    unlockVault: "Unlock vault",
    lockVault: "Lock vault",
    masterPassword: "Master password",
    locked: "Vault locked",
    unlocked: "Vault unlocked",
    encryptionEnabled: "Encryption enabled",
    unlockToReveal: "Unlock to reveal",
    importJson: "Import JSON",
    exportJson: "Export JSON",
    loadSample: "Load sample data",
    clearAll: "Clear all data",
    privacyFirst: "Privacy first",
    localOnly: "Local only",
    noBackend: "No backend",
    savedFromClipboard: "Saved from clipboard",
    saved: "Saved",
    clipboardDenied: "Clipboard permission denied. Use Ctrl + V manually.",
    unlockFirst: "Unlock vault before saving or revealing sensitive content.",
    imported: "JSON imported",
    exported: "JSON exported",
    deleted: "Deleted",
    noResults: "No clips match the current filters.",
    privacyNote:
      "Your content never leaves this page. Data is stored in this browser only; clearing browser data removes it. Export JSON backups regularly.",
  },
  en: {
    localName: "Local Clipboard Vault",
    tagline: "A Local First / No Backend / GitHub Pages Ready floating workspace for snippets.",
    quickCapture: "Quick Capture",
    pasteFromClipboard: "Paste from clipboard",
    manualPaste: "Manual paste",
    saveContent: "Save content",
    ctrlEnter: "Press Ctrl + Enter to save",
    sensitive: "Sensitive content",
    autoTitle: "Auto title",
    autoType: "Local type detection",
    floatingCards: "Floating Cards",
    recentClips: "Recent clips",
    search: "Search",
    tags: "Tags",
    type: "Type",
    copy: "Copy",
    edit: "Edit",
    clone: "Clone",
    delete: "Delete",
    pin: "Pin",
    favorite: "Favorite",
    reveal: "Reveal / Hide",
    details: "Open details",
    unlockVault: "Unlock vault",
    lockVault: "Lock vault",
    masterPassword: "Master password",
    locked: "Vault locked",
    unlocked: "Vault unlocked",
    encryptionEnabled: "Encryption enabled",
    unlockToReveal: "Unlock to reveal",
    importJson: "Import JSON",
    exportJson: "Export JSON",
    loadSample: "Load sample data",
    clearAll: "Clear all data",
    privacyFirst: "Privacy first",
    localOnly: "Local only",
    noBackend: "No backend",
    savedFromClipboard: "Saved from clipboard",
    saved: "Saved",
    clipboardDenied: "Clipboard permission denied. Paste manually with Ctrl + V.",
    unlockFirst: "Unlock vault before saving or revealing sensitive content.",
    imported: "JSON imported",
    exported: "JSON exported",
    deleted: "Deleted",
    noResults: "No clips match the current filters.",
    privacyNote:
      "Your content never leaves this page. Data is stored in this browser only; clearing browser data removes it. Export JSON backups regularly.",
  },
} satisfies Record<Language, Record<string, string>>;

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const saved = window.localStorage.getItem(`${siteMeta.localStoragePrefix}.theme`);
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getInitialLanguage(): Language {
  if (typeof window === "undefined") return "zh";
  return window.localStorage.getItem(`${siteMeta.localStoragePrefix}.language`) === "en" ? "en" : "zh";
}

function formatTime(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function sortClips(clips: ClipItem[]): ClipItem[] {
  return [...clips].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    if (a.favorite !== b.favorite) return a.favorite ? -1 : 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}

function matchesFilter(clip: ClipItem, filter: FilterMode, revealedContent?: string): boolean {
  if (filter.type !== "All" && clip.type !== filter.type) return false;
  if (filter.onlyPinned && !clip.pinned) return false;
  if (filter.onlyFavorite && !clip.favorite) return false;
  if (filter.tag && !clip.tags.includes(filter.tag)) return false;

  const query = filter.query.trim().toLowerCase();
  if (!query) return true;

  const searchable = [
    clip.title,
    clip.type,
    clip.note,
    clip.tags.join(" "),
    clip.encrypted && !revealedContent ? "" : revealedContent ?? clip.content ?? "",
  ].join(" ").toLowerCase();

  return searchable.includes(query);
}

function downloadText(fileName: string, content: string): void {
  const blob = new Blob([content], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [language, setLanguage] = useState<Language>(getInitialLanguage);
  const [clips, setClips] = useState<ClipItem[]>([]);
  const [storageLoaded, setStorageLoaded] = useState(false);
  const [manualText, setManualText] = useState("");
  const [manualSensitive, setManualSensitive] = useState(false);
  const [filter, setFilter] = useState<FilterMode>({
    query: "",
    type: "All",
    tag: "",
    onlyPinned: false,
    onlyFavorite: false,
  });
  const [vaultPassword, setVaultPassword] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [revealed, setRevealed] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState<ClipItem | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editTags, setEditTags] = useState("");
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const importInputRef = useRef<HTMLInputElement | null>(null);
  const t = text[language];
  const vaultUnlocked = vaultPassword.length > 0;

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    window.localStorage.setItem(`${siteMeta.localStoragePrefix}.theme`, theme);
    window.localStorage.setItem(`${siteMeta.localStoragePrefix}.language`, language);
  }, [theme, language]);

  useEffect(() => {
    const saved = clipboardStorage.readAll();
    const next = saved.length > 0 ? saved : sampleClips;
    setClips(sortClips(next));
    setStorageLoaded(true);
    if (saved.length === 0) {
      clipboardStorage.saveAll(sampleClips);
    }
  }, []);

  useEffect(() => {
    if (storageLoaded) {
      clipboardStorage.saveAll(sortClips(clips));
    }
  }, [clips, storageLoaded]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!vaultUnlocked) return undefined;
    let timer = window.setTimeout(lockVault, AUTO_LOCK_MINUTES * 60 * 1000);
    const reset = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(lockVault, AUTO_LOCK_MINUTES * 60 * 1000);
    };
    window.addEventListener("keydown", reset);
    window.addEventListener("pointerdown", reset);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", reset);
      window.removeEventListener("pointerdown", reset);
    };
  }, [vaultUnlocked]);

  const tags = useMemo(
    () => Array.from(new Set(clips.flatMap((clip) => clip.tags))).sort(),
    [clips],
  );

  const filteredClips = useMemo(
    () => sortClips(clips).filter((clip) => matchesFilter(clip, filter, revealed[clip.id])),
    [clips, filter, revealed],
  );

  const showToast = (text: string, tone: ToastMessage["tone"] = "success") => {
    setToast({ id: Date.now(), text, tone });
  };

  const persistClip = async (clip: ClipItem, content: string): Promise<ClipItem | null> => {
    if (!clip.sensitive) {
      return {
        ...clip,
        content,
        encrypted: false,
        encryptedPayload: undefined,
      };
    }

    if (!vaultUnlocked) {
      showToast(t.unlockFirst, "danger");
      return null;
    }

    const encryptedPayload = await encryptContent(content, vaultPassword);
    return {
      ...clip,
      content: undefined,
      encrypted: true,
      encryptedPayload,
    };
  };

  const saveNewContent = async (content: string, sensitive = manualSensitive) => {
    const trimmed = content.trim();
    if (!trimmed) return;
    const created = createClipFromContent(trimmed, { sensitive });
    const stored = await persistClip(created, trimmed);
    if (!stored) return;
    setClips((current) => sortClips([stored, ...current]));
    setManualText("");
    setManualSensitive(false);
    showToast(t.saved);
  };

  const importFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      await saveNewContent(text);
      showToast(t.savedFromClipboard);
    } catch {
      showToast(t.clipboardDenied, "danger");
    }
  };

  const copyClip = async (clip: ClipItem) => {
    const content = clip.encrypted ? revealed[clip.id] : clip.content;
    if (clip.encrypted && !content) {
      showToast(t.unlockFirst, "danger");
      return;
    }
    await navigator.clipboard.writeText(content ?? "");
    showToast(t.copy);
  };

  const revealClip = async (clip: ClipItem) => {
    if (!clip.encrypted || !clip.encryptedPayload) return;
    if (revealed[clip.id]) {
      setRevealed((current) => {
        const next = { ...current };
        delete next[clip.id];
        return next;
      });
      return;
    }
    if (!vaultUnlocked) {
      showToast(t.unlockFirst, "danger");
      return;
    }
    try {
      const content = await decryptContent(clip.encryptedPayload, vaultPassword);
      setRevealed((current) => ({ ...current, [clip.id]: content }));
    } catch {
      showToast("Wrong password or damaged payload.", "danger");
    }
  };

  const updateClip = (id: string, patch: Partial<ClipItem>) => {
    setClips((current) =>
      sortClips(
        current.map((clip) =>
          clip.id === id ? { ...clip, ...patch, updatedAt: new Date().toISOString() } : clip,
        ),
      ),
    );
  };

  const openEdit = async (clip: ClipItem) => {
    if (clip.encrypted && !revealed[clip.id]) {
      await revealClip(clip);
      if (!vaultUnlocked) return;
    }
    setEditing(clip);
    setEditContent(revealed[clip.id] ?? clip.content ?? "");
    setEditTags(clip.tags.join(", "));
  };

  const saveEdit = async () => {
    if (!editing) return;
    const updated: ClipItem = {
      ...editing,
      title: editing.title.trim() || generateClipTitle(editContent),
      type: editing.type || detectClipType(editContent),
      tags: editTags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      updatedAt: new Date().toISOString(),
    };
    const stored = await persistClip(updated, editContent);
    if (!stored) return;
    setClips((current) => sortClips(current.map((clip) => (clip.id === stored.id ? stored : clip))));
    setRevealed((current) => ({ ...current, [stored.id]: editContent }));
    setEditing(null);
    showToast(t.saved);
  };

  const cloneClip = async (clip: ClipItem) => {
    const sourceContent = revealed[clip.id] ?? clip.content;
    if (clip.encrypted && !sourceContent) {
      showToast(t.unlockFirst, "danger");
      return;
    }
    const now = new Date().toISOString();
    const clone: ClipItem = {
      ...clip,
      id: crypto.randomUUID(),
      title: `${clip.title} Copy`,
      content: sourceContent,
      encryptedPayload: undefined,
      createdAt: now,
      updatedAt: now,
    };
    const stored = await persistClip(clone, sourceContent ?? "");
    if (!stored) return;
    setClips((current) => sortClips([stored, ...current]));
    showToast(t.clone);
  };

  const deleteClip = (clip: ClipItem) => {
    if (!window.confirm(`Delete "${clip.title}"?`)) return;
    setClips((current) => current.filter((item) => item.id !== clip.id));
    setRevealed((current) => {
      const next = { ...current };
      delete next[clip.id];
      return next;
    });
    showToast(t.deleted);
  };

  function lockVault() {
    setVaultPassword("");
    setPasswordInput("");
    setRevealed({});
  }

  const exportJson = () => {
    const date = new Date().toISOString().slice(0, 10);
    downloadText(
      `local-clipboard-vault-v${siteMeta.version}-${date}.json`,
      clipboardStorage.exportJson(clips),
    );
    showToast(t.exported);
  };

  const importJson = async (file: File | undefined) => {
    if (!file) return;
    try {
      const text = await file.text();
      const merged = clipboardStorage.importJson(text, clips);
      setClips(sortClips(merged));
      showToast(t.imported);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Import failed.", "danger");
    }
  };

  const clearAll = () => {
    if (!window.confirm("Clear all Local Clipboard Vault data in this browser?")) return;
    clipboardStorage.clear();
    setClips([]);
    setRevealed({});
    showToast(t.clearAll);
  };

  return (
    <div className="app-shell" data-testid="app-shell">
      <header className="topbar">
        <a className="brand" href="#vault" aria-label={siteMeta.name}>
          <span className="brand__mark" aria-hidden="true"><Clipboard size={21} /></span>
          <span>
            <strong>{siteMeta.name}</strong>
            <small>{language === "zh" ? t.localName : "Local only clipboard vault"}</small>
          </span>
        </a>
        <nav className="nav-links" aria-label="Primary">
          <a href="#capture">{t.quickCapture}</a>
          <a href="#cards">{t.floatingCards}</a>
          <a href="#advanced">Advanced Tools</a>
        </nav>
        <div className="topbar__actions">
          <Button
            aria-label="Toggle theme"
            data-testid="theme-toggle"
            icon={theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            size="sm"
            variant="ghost"
          >
            {theme === "dark" ? "Light" : "Dark"}
          </Button>
          <Button
            aria-label="Toggle language"
            data-testid="language-toggle"
            icon={<Languages size={17} />}
            onClick={() => setLanguage(language === "zh" ? "en" : "zh")}
            size="sm"
            variant="ghost"
          >
            {language === "zh" ? "EN" : "中文"}
          </Button>
        </div>
      </header>

      <main>
        <section className="hero section" id="vault">
          <div className="hero__content">
            <p className="eyebrow">v{siteMeta.version} · Local First · No Backend · GitHub Pages Ready</p>
            <h1>{siteMeta.name}</h1>
            <p className="hero__body">{t.tagline}</p>
            <div className="tag-row">
              <span className="tag"><ShieldCheck size={15} />{t.privacyFirst}</span>
              <span className="tag"><Lock size={15} />{t.encryptionEnabled}</span>
              <span className="tag"><FileJson size={15} />JSON import / export</span>
            </div>
          </div>
          <aside className="vault-panel">
            <div className="vault-panel__status">
              <span className={vaultUnlocked ? "vault-dot vault-dot--open" : "vault-dot"} />
              <strong>{vaultUnlocked ? t.unlocked : t.locked}</strong>
              <small>{AUTO_LOCK_MINUTES} min auto lock</small>
            </div>
            <label className="field">
              <span>{t.masterPassword}</span>
              <input
                autoComplete="off"
                onChange={(event) => setPasswordInput(event.target.value)}
                placeholder="Never saved"
                type="password"
                value={passwordInput}
              />
            </label>
            <div className="button-row">
              <Button
                icon={<ShieldCheck size={17} />}
                onClick={() => {
                  if (!passwordInput) return showToast(t.unlockFirst, "danger");
                  setVaultPassword(passwordInput);
                  setPasswordInput("");
                  showToast(t.unlocked);
                }}
                variant="primary"
              >
                {t.unlockVault}
              </Button>
              <Button icon={<Lock size={17} />} onClick={lockVault}>
                {t.lockVault}
              </Button>
            </div>
          </aside>
        </section>

        <section className="workspace">
          <div className="capture-dock" data-testid="quick-capture" id="capture">
            <div>
              <p className="eyebrow">{t.quickCapture}</p>
              <h2>{t.manualPaste}</h2>
              <p>{t.autoTitle} · {t.autoType} · {t.ctrlEnter}</p>
            </div>
            <textarea
              aria-label={t.manualPaste}
              onChange={(event) => setManualText(event.target.value)}
              onKeyDown={(event) => {
                if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
                  void saveNewContent(manualText);
                }
              }}
              placeholder="Paste prompt, command, token placeholder, JSON, Markdown..."
              value={manualText}
            />
            <div className="capture-dock__actions">
              <label className="check">
                <input
                  checked={manualSensitive}
                  onChange={(event) => setManualSensitive(event.target.checked)}
                  type="checkbox"
                />
                {t.sensitive}
              </label>
              <Button icon={<Clipboard size={17} />} onClick={importFromClipboard} variant="primary">
                {t.pasteFromClipboard}
              </Button>
              <Button icon={<Plus size={17} />} onClick={() => void saveNewContent(manualText)}>
                {t.saveContent}
              </Button>
            </div>
          </div>

          <aside className="filter-panel">
            <label className="search-box">
              <Search size={17} />
              <input
                aria-label={t.search}
                onChange={(event) => setFilter((current) => ({ ...current, query: event.target.value }))}
                placeholder={t.search}
                value={filter.query}
              />
            </label>
            <div className="chip-row">
              <button className={filter.type === "All" ? "chip is-active" : "chip"} onClick={() => setFilter((current) => ({ ...current, type: "All" }))} type="button">All</button>
              {CLIP_TYPES.map((type) => (
                <button
                  className={filter.type === type ? "chip is-active" : "chip"}
                  key={type}
                  onClick={() => setFilter((current) => ({ ...current, type }))}
                  type="button"
                >
                  {type}
                </button>
              ))}
            </div>
            <select
              aria-label={t.tags}
              onChange={(event) => setFilter((current) => ({ ...current, tag: event.target.value }))}
              value={filter.tag}
            >
              <option value="">All tags</option>
              {tags.map((tag) => <option key={tag} value={tag}>{tag}</option>)}
            </select>
            <div className="button-row">
              <Button
                icon={<Heart size={16} />}
                onClick={() => setFilter((current) => ({ ...current, onlyFavorite: !current.onlyFavorite }))}
                variant={filter.onlyFavorite ? "primary" : "secondary"}
              >
                {t.favorite}
              </Button>
              <Button
                icon={<Pin size={16} />}
                onClick={() => setFilter((current) => ({ ...current, onlyPinned: !current.onlyPinned }))}
                variant={filter.onlyPinned ? "primary" : "secondary"}
              >
                {t.pin}
              </Button>
            </div>
            <Button onClick={() => setFilter({ query: "", type: "All", tag: "", onlyPinned: false, onlyFavorite: false })}>
              Clear filters · {filteredClips.length}
            </Button>
          </aside>
        </section>

        <section className="section" id="cards">
          <div className="section__header">
            <p className="eyebrow">{t.floatingCards}</p>
            <h2>{t.recentClips}</h2>
            <p>{filteredClips.length} / {clips.length} clips</p>
          </div>
          <div className="floating-grid" data-testid="floating-cards">
            {filteredClips.map((clip) => (
              <article className="clip-card" data-testid="clip-card" key={clip.id} onClick={() => void openEdit(clip)}>
                <div className="clip-card__bar">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="clip-card__head">
                  <div>
                    <h3>{clip.title}</h3>
                    <small>{formatTime(clip.updatedAt)}</small>
                  </div>
                  <span className="type-badge">{clip.type}</span>
                </div>
                <p className="clip-card__summary">{summarizeClip(clip, revealed[clip.id])}</p>
                <div className="tag-row tag-row--compact">
                  {clip.tags.map((tag) => <span className="tag tag--small" key={tag}>{tag}</span>)}
                  {clip.pinned ? <span className="tag tag--small">Pinned</span> : null}
                  {clip.favorite ? <span className="tag tag--small">Favorite</span> : null}
                  {clip.sensitive ? <span className="tag tag--small">Sensitive</span> : null}
                  {clip.encrypted ? <span className="tag tag--small">Encrypted</span> : null}
                </div>
                <div className="clip-card__actions" onClick={(event) => event.stopPropagation()}>
                  <Button icon={<Copy size={15} />} onClick={() => void copyClip(clip)} size="sm">{t.copy}</Button>
                  <Button icon={<Pencil size={15} />} onClick={() => void openEdit(clip)} size="sm">{t.edit}</Button>
                  <Button icon={<Sparkles size={15} />} onClick={() => void cloneClip(clip)} size="sm">{t.clone}</Button>
                  <Button icon={<Pin size={15} />} onClick={() => updateClip(clip.id, { pinned: !clip.pinned })} size="sm" variant={clip.pinned ? "primary" : "secondary"}>{t.pin}</Button>
                  <Button icon={<Heart size={15} />} onClick={() => updateClip(clip.id, { favorite: !clip.favorite })} size="sm" variant={clip.favorite ? "primary" : "secondary"}>{t.favorite}</Button>
                  {clip.encrypted ? (
                    <Button icon={revealed[clip.id] ? <EyeOff size={15} /> : <Eye size={15} />} onClick={() => void revealClip(clip)} size="sm">{t.reveal}</Button>
                  ) : null}
                  <Button icon={<Trash2 size={15} />} onClick={() => deleteClip(clip)} size="sm" variant="danger">{t.delete}</Button>
                </div>
              </article>
            ))}
          </div>
          {filteredClips.length === 0 ? <p className="empty-note">{t.noResults}</p> : null}
        </section>

        <section className="advanced section" id="advanced">
          <div>
            <p className="eyebrow">Advanced Tools</p>
            <h2>{t.privacyFirst}</h2>
            <p>{t.privacyNote}</p>
          </div>
          <div className="advanced__actions">
            <input
              accept="application/json"
              hidden
              onChange={(event) => void importJson(event.target.files?.[0])}
              ref={importInputRef}
              type="file"
            />
            <Button icon={<Upload size={17} />} onClick={() => importInputRef.current?.click()}>{t.importJson}</Button>
            <Button icon={<Download size={17} />} onClick={exportJson}>{t.exportJson}</Button>
            <Button icon={<FileJson size={17} />} onClick={() => setClips(sortClips(sampleClips))}>{t.loadSample}</Button>
            <Button icon={<Trash2 size={17} />} onClick={clearAll} variant="danger">{t.clearAll}</Button>
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <span className="app-footer__version">v{siteMeta.version}</span>
        <span className="app-footer__tag">{t.localOnly}</span>
        <span className="app-footer__tag">{t.noBackend}</span>
        <span className="app-footer__tag">GitHub Pages Ready</span>
      </footer>

      <Modal closeLabel="Close" isOpen={Boolean(editing)} onClose={() => setEditing(null)} title={editing?.title ?? t.details}>
        {editing ? (
          <div className="edit-form">
            <label className="field">
              <span>Title</span>
              <input value={editing.title} onChange={(event) => setEditing({ ...editing, title: event.target.value })} />
            </label>
            <label className="field">
              <span>{t.type}</span>
              <select value={editing.type} onChange={(event) => setEditing({ ...editing, type: event.target.value as ClipType })}>
                {CLIP_TYPES.map((type) => <option key={type}>{type}</option>)}
              </select>
            </label>
            <label className="field">
              <span>Content</span>
              <textarea value={editContent} onChange={(event) => setEditContent(event.target.value)} />
            </label>
            <label className="field">
              <span>{t.tags}</span>
              <input value={editTags} onChange={(event) => setEditTags(event.target.value)} />
            </label>
            <label className="field">
              <span>Note</span>
              <input value={editing.note} onChange={(event) => setEditing({ ...editing, note: event.target.value })} />
            </label>
            <div className="edit-flags">
              <label className="check"><input checked={editing.sensitive} onChange={(event) => setEditing({ ...editing, sensitive: event.target.checked })} type="checkbox" />{t.sensitive}</label>
              <label className="check"><input checked={editing.pinned} onChange={(event) => setEditing({ ...editing, pinned: event.target.checked })} type="checkbox" />{t.pin}</label>
              <label className="check"><input checked={editing.favorite} onChange={(event) => setEditing({ ...editing, favorite: event.target.checked })} type="checkbox" />{t.favorite}</label>
            </div>
            {editing.sensitive && !editing.encrypted ? <p className="legacy-note">Legacy sensitive item: re-save while vault is unlocked to enable encryption.</p> : null}
            <div className="modal__actions">
              <Button icon={<ShieldCheck size={17} />} onClick={() => void saveEdit()} variant="primary">{t.saveContent}</Button>
              <Button onClick={() => setEditing(null)}>Close</Button>
            </div>
          </div>
        ) : null}
      </Modal>

      <Toast message={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
