import { useEffect, useMemo, useState } from "react";
import {
  Boxes,
  CheckCircle2,
  ClipboardCopy,
  FileJson,
  Github,
  Languages,
  Layers3,
  Moon,
  PanelTop,
  ShieldCheck,
  Sparkles,
  Sun,
  Zap,
  BookOpen,
  GitBranch,
  ArrowRight,
  ExternalLink,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { CopyButton } from "@/components/CopyButton";
import { DownloadButton } from "@/components/DownloadButton";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { Modal } from "@/components/Modal";
import { StarterWizard } from "@/components/StarterWizard";
import { Toast, type ToastMessage } from "@/components/Toast";
import {
  CATEGORY_LABELS,
  MODULE_REGISTRY,
  STATUS_LABELS,
  getModuleById,
  getStatusForLevel,
  type ModuleDefinition,
  type ModuleId,
  type ModuleStatus,
  type ProjectLevel,
} from "@/config/moduleRegistry";
import { PROJECT_PROFILES, type ProjectProfile } from "@/config/projectProfiles";
import { siteMeta } from "@/config/siteMeta";
import { usePersistentState } from "@/hooks/usePersistentState";
import { messages, type Language } from "@/i18n/messages";
import { storage } from "@/lib/storage";

type Theme = "light" | "dark";

const cLevelPromptZh = `请基于 open-tools-starter 创建一个 C 级纯前端小工具。
要求：Vite + React + TypeScript、GitHub Pages Ready、移动端适配、深色模式、中英文切换、示例数据、一键复制、README、无后端、无登录、不上传用户文件。
请保持轻量，不要引入重依赖，不要实现超出 C 级范围的复杂能力。`;

const cLevelPromptEn = `Create a Level C pure frontend tool based on open-tools-starter.
Requirements: Vite + React + TypeScript, GitHub Pages Ready, mobile layout, dark mode, Chinese/English copy, sample data, one-click copy, README, no backend, no login, and no file uploads.
Keep it lightweight and avoid heavy dependencies or features beyond Level C scope.`;

const levelTone: Record<ProjectLevel, "teal" | "amber" | "blue"> = {
  C: "teal",
  B: "amber",
  A: "blue",
};

const statusOrder: ModuleStatus[] = [
  "required",
  "recommended",
  "optional",
  "not-recommended",
];

const statusCopy: Record<
  Language,
  Record<ModuleStatus, { title: string; help: string }>
> = {
  zh: {
    required: { title: "必须启用", help: "复制新项目时默认保留。" },
    recommended: { title: "推荐启用", help: "通常有价值，可按范围裁剪。" },
    optional: { title: "按需启用", help: "只有业务需要时再加入。" },
    "not-recommended": { title: "默认删除", help: "当前等级容易过度设计。" },
  },
  en: {
    required: { title: "Enable by default", help: "Keep when copying a new project." },
    recommended: { title: "Recommended", help: "Usually useful, but scope-dependent." },
    optional: { title: "Use when needed", help: "Add only when the product needs it." },
    "not-recommended": { title: "Remove by default", help: "Likely over-scoped for this level." },
  },
};

function getInitialTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function localize<T extends { zh: string; en: string }>(
  value: T,
  language: Language,
): string {
  return value[language];
}

function getProfileModules(profile: ProjectProfile, status: ModuleStatus): ModuleDefinition[] {
  const idsByStatus: Record<ModuleStatus, ModuleId[]> = {
    required: profile.requiredModules,
    recommended: profile.recommendedModules,
    optional: profile.optionalModules,
    "not-recommended": profile.notRecommendedModules,
  };

  return idsByStatus[status].map((id) => getModuleById(id));
}

function getModulePreviewLabel(language: Language, count: number): string {
  return language === "zh" ? `${count} 个模块` : `${count} modules`;
}

const capabilityIcons = [
  <Layers3 size={24} />,
  <PanelTop size={24} />,
  <ShieldCheck size={24} />,
  <Github size={24} />,
  <ShieldCheck size={24} />,
  <BookOpen size={24} />,
];

const capabilityTones: Array<"teal" | "blue" | "amber" | "rose"> = [
  "teal",
  "blue",
  "amber",
  "rose",
  "teal",
  "blue",
];

export function App() {
  const [theme, setTheme] = usePersistentState<Theme>(
    `${siteMeta.localStoragePrefix}.theme`,
    getInitialTheme(),
  );
  const [language, setLanguage] = usePersistentState<Language>(
    `${siteMeta.localStoragePrefix}.language`,
    "zh",
  );
  const [selectedLevel, setSelectedLevel] = useState<ProjectLevel>("C");
  const [isMatrixOpen, setIsMatrixOpen] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const t = messages[language];
  const storageReady = storage.isAvailable();
  const selectedProfile = PROJECT_PROFILES.find(
    (profile) => profile.level === selectedLevel,
  ) as ProjectProfile;

  const manifest = useMemo(
    () =>
      JSON.stringify(
        {
          name: siteMeta.name,
          shortName: siteMeta.shortName,
          version: siteMeta.version,
          description: siteMeta.description,
          repositoryUrl: siteMeta.repositoryUrl,
          demoUrl: siteMeta.demoUrl,
          phase: "reusable-template",
          principles: ["Local First", "No Backend", "Privacy Friendly", "GitHub Pages Ready"],
          levelSystem: PROJECT_PROFILES.map((profile) => profile.level),
          modules: MODULE_REGISTRY.map((module) => module.id),
          selectedLevel,
          selectedRequiredModules: selectedProfile.requiredModules,
          docs: [
            "docs/PROJECT_LEVELS.md",
            "docs/MODULE_MATRIX.md",
            "docs/OPENCODE_PRESETS.md",
            "docs/NEW_PROJECT_PLAYBOOK.md",
            "docs/MODULE_CONTRACT.md",
            "docs/QUALITY_BAR.md",
            "docs/PROJECT_SPEC_TEMPLATE.md",
            "docs/RELEASE_CHECKLIST.md",
          ],
        },
        null,
        2,
      ),
    [selectedLevel, selectedProfile.requiredModules],
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.lang = language;
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  }, [theme, language]);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timer = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const showToast = (text: string, tone: ToastMessage["tone"] = "success") => {
    setToast({ id: Date.now(), text, tone });
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
    showToast(t.toast.themeChanged);
  };

  const toggleLanguage = () => {
    setLanguage(language === "zh" ? "en" : "zh");
    showToast(t.toast.languageChanged);
  };

  const openMatrix = () => {
    setIsMatrixOpen(true);
    showToast(t.toast.modalOpened);
  };

  const selectLevel = (level: ProjectLevel) => {
    setSelectedLevel(level);
    showToast(
      language === "zh" ? `已选择 ${level} 级 Profile` : `Selected Level ${level} profile`,
    );
  };

  const promptText = language === "zh" ? cLevelPromptZh : cLevelPromptEn;

  return (
    <div className="app-shell" data-testid="app-shell">
      <header className="topbar" data-testid="top-nav">
        <a className="brand" href="#hero" aria-label={siteMeta.name}>
          <span className="brand__mark" aria-hidden="true">
            <Boxes size={22} />
          </span>
          <span>
            <strong>Open Tools</strong>
            <small>Starter</small>
          </span>
        </a>
        <nav className="nav-links" aria-label="Primary">
          <a href="#capabilities">{t.nav.docs}</a>
          <a href="#levels">{t.nav.levels}</a>
          <a href="#modules">{t.nav.modules}</a>
          <a href="#wizard">{t.nav.wizard}</a>
          <a href="#settings">{t.nav.settings}</a>
        </nav>
        <div className="topbar__actions">
          <Button
            aria-label={t.settings.theme}
            data-testid="theme-toggle"
            icon={theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            onClick={toggleTheme}
            size="sm"
            variant="ghost"
          >
            {theme === "dark" ? t.settings.themeLight : t.settings.themeDark}
          </Button>
          <Button
            aria-label={t.settings.language}
            data-testid="language-toggle"
            icon={<Languages size={17} />}
            onClick={toggleLanguage}
            size="sm"
            variant="ghost"
          >
            {language === "zh" ? "EN" : "中文"}
          </Button>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="hero section" data-testid="hero" id="hero">
          <div className="hero__content">
            <p className="eyebrow">{t.hero.eyebrow}</p>
            <h1>{t.hero.title}</h1>
            <p className="hero__body">{t.hero.body}</p>
            <div className="tag-row" aria-label="Project principles">
              {t.tags.map((tag) => (
                <span className="tag" key={tag}>
                  <CheckCircle2 size={15} aria-hidden="true" />
                  {tag}
                </span>
              ))}
            </div>
            <div className="hero__actions">
              <Button icon={<Layers3 size={18} />} onClick={openMatrix} variant="primary">
                {t.hero.primaryAction}
              </Button>
              <CopyButton
                copiedLabel={t.common.copied}
                label={t.hero.secondaryAction}
                onCopied={() => showToast(t.toast.copied)}
                onError={() => showToast(t.toast.copyFailed, "danger")}
                text={promptText}
              />
            </div>
          </div>
          <div className="hero__panel" aria-label="Starter quality gates">
            <div className="quality-meter">
              {PROJECT_PROFILES.map((profile) => (
                <button
                  className={selectedLevel === profile.level ? "quality-meter__item is-active" : "quality-meter__item"}
                  data-testid={`hero-level-${profile.level}`}
                  key={profile.level}
                  onClick={() => selectLevel(profile.level)}
                  type="button"
                >
                  {profile.level}
                </button>
              ))}
            </div>
            <ul>
              <li>
                <ShieldCheck size={18} aria-hidden="true" />
                Local data by default
              </li>
              <li>
                <Github size={18} aria-hidden="true" />
                Pages deployment baseline
              </li>
              <li>
                <Sparkles size={18} aria-hidden="true" />
                Profile and registry driven
              </li>
            </ul>
          </div>
        </section>

        {/* What this starter gives you */}
        <section className="section" data-testid="capabilities-section" id="capabilities">
          <div className="section__header">
            <p className="eyebrow">Foundation</p>
            <h2>{t.capabilities.title}</h2>
            <p>{t.capabilities.intro}</p>
          </div>
          <div className="grid grid--three">
            {t.capabilities.items.map((item, index) => (
              <Card
                description={item.body}
                icon={capabilityIcons[index]}
                key={item.title}
                title={item.title}
                tone={capabilityTones[index]}
              />
            ))}
          </div>
        </section>

        {/* Project Levels */}
        <section className="section" data-testid="levels-section" id="levels">
          <div className="section__header">
            <p className="eyebrow">Project Profiles</p>
            <h2>{t.levels.title}</h2>
            <p>{t.levels.intro}</p>
          </div>
          <div className="grid grid--three">
            {PROJECT_PROFILES.map((profile) => (
              <Card
                className={selectedLevel === profile.level ? "level-card is-selected" : "level-card"}
                description={localize(profile.description, language)}
                key={profile.level}
                title={localize(profile.name, language)}
                tone={levelTone[profile.level]}
              >
                <p className="card__subtitle">
                  {getModulePreviewLabel(language, profile.requiredModules.length)}
                </p>
                <ul className="mini-list">
                  {profile.suitableFor.slice(0, 4).map((item) => (
                    <li key={localize(item, language)}>{localize(item, language)}</li>
                  ))}
                </ul>
                <Button
                  data-testid={`level-card-${profile.level}`}
                  onClick={() => selectLevel(profile.level)}
                  variant={selectedLevel === profile.level ? "primary" : "secondary"}
                >
                  {language === "zh" ? `选择 ${profile.level} 级` : `Select Level ${profile.level}`}
                </Button>
              </Card>
            ))}
          </div>
        </section>

        {/* Module Matrix */}
        <section
          className="section split"
          data-config-source="projectProfiles,moduleRegistry"
          data-testid="module-matrix"
          id="modules"
        >
          <div>
            <p className="eyebrow">Module Registry</p>
            <h2>{t.matrix.title}</h2>
            <p>{t.matrix.body}</p>
            <div className="legend" data-testid="status-legend">
              {statusOrder.map((status) => (
                <span className={`legend__item status status--${status}`} key={status}>
                  {STATUS_LABELS[status][language]}
                </span>
              ))}
            </div>
          </div>
          <Card icon={<PanelTop size={24} />} tone="rose">
            <div className="matrix-preview" data-testid="module-matrix-preview">
              <div className="matrix-preview__header">
                <span>{language === "zh" ? "模块" : "Module"}</span>
                <span>C</span>
                <span>B</span>
                <span>A</span>
              </div>
              {MODULE_REGISTRY.slice(0, 9).map((module) => (
                <div className="matrix-preview__row" data-testid={`module-row-${module.id}`} key={module.id}>
                  <span>{module.name[language]}</span>
                  <span className={`status-dot status-dot--${module.cLevelStatus}`} title={STATUS_LABELS[module.cLevelStatus][language]} />
                  <span className={`status-dot status-dot--${module.bLevelStatus}`} title={STATUS_LABELS[module.bLevelStatus][language]} />
                  <span className={`status-dot status-dot--${module.aLevelStatus}`} title={STATUS_LABELS[module.aLevelStatus][language]} />
                </div>
              ))}
            </div>
            <div className="card__actions">
              <Button icon={<Layers3 size={18} />} onClick={openMatrix} variant="primary">
                {t.matrix.open}
              </Button>
              <CopyButton
                copiedLabel={t.common.copied}
                label={t.matrix.copyPath}
                onCopied={() => showToast(t.toast.copied)}
                onError={() => showToast(t.toast.copyFailed, "danger")}
                text="docs/MODULE_MATRIX.md"
              />
            </div>
          </Card>
        </section>

        {/* Selected Profile Detail */}
        <section className="section profile-summary" data-testid="selected-profile">
          <div className="section__header">
            <p className="eyebrow">Selected Profile</p>
            <h2>{localize(selectedProfile.name, language)}</h2>
            <p>{localize(selectedProfile.description, language)}</p>
          </div>
          <div className="profile-grid">
            {statusOrder.map((status) => {
              const modules = getProfileModules(selectedProfile, status);
              return (
                <article className="module-group" data-testid={`profile-${status}`} key={status}>
                  <div className="module-group__header">
                    <span className={`status status--${status}`}>
                      {STATUS_LABELS[status][language]}
                    </span>
                    <strong>{statusCopy[language][status].title}</strong>
                  </div>
                  <p>{statusCopy[language][status].help}</p>
                  <ul>
                    {modules.slice(0, 8).map((module) => (
                      <li key={module.id}>
                        <span>{module.name[language]}</span>
                        <small>{CATEGORY_LABELS[module.category][language]}</small>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </section>

        {/* New Project Flow */}
        <section className="section" data-testid="flow-section">
          <div className="section__header">
            <p className="eyebrow">Workflow</p>
            <h2>{t.flow.title}</h2>
            <p>{t.flow.intro}</p>
          </div>
          <div className="flow-steps">
            {t.flow.steps.map((step, index) => (
              <span className="flow-step" key={step}>
                <span className="flow-step__number">{index + 1}</span>
                <span className="flow-step__label">{step}</span>
                {index < t.flow.steps.length - 1 && (
                  <ArrowRight size={16} className="flow-step__arrow" aria-hidden="true" />
                )}
              </span>
            ))}
          </div>
        </section>

        {/* Starter Wizard */}
        <StarterWizard language={language} showToast={showToast} />

        {/* Quality Bar */}
        <section className="section" data-testid="quality-section">
          <div className="section__header">
            <p className="eyebrow">Quality</p>
            <h2>{t.quality.title}</h2>
            <p>{t.quality.intro}</p>
          </div>
          <div className="grid grid--three">
            <Card
              description={t.quality.body}
              icon={<ShieldCheck size={24} />}
              title={t.quality.title}
              tone="teal"
            >
              <div className="card__actions">
                <Button
                  icon={<ExternalLink size={16} />}
                  onClick={() => window.open("docs/QUALITY_BAR.md", "_blank")}
                  variant="secondary"
                >
                  {t.quality.link}
                </Button>
              </div>
            </Card>
            <Card
              description={language === "zh"
                ? "self-test 在浏览器和命令行中检查关键能力，确保模板基础功能正常。"
                : "self-test checks critical capabilities in browser and CLI, ensuring template fundamentals work."}
              icon={<CheckCircle2 size={24} />}
              title="self-test"
              tone="blue"
            />
            <Card
              description={language === "zh"
                ? "preflight 在发布前检查文档、配置、敏感信息和范围边界，防止低级错误上线。"
                : "preflight checks docs, config, sensitive content, and scope boundaries before release to prevent low-level errors."}
              icon={<ShieldCheck size={24} />}
              title="preflight"
              tone="amber"
            />
          </div>
        </section>

        {/* Starter Resources */}
        <section className="section" data-testid="resources-section" id="docs">
          <div className="section__header">
            <p className="eyebrow">Documentation</p>
            <h2>{t.resources.title}</h2>
            <p>{t.resources.intro}</p>
          </div>
          <div className="grid grid--three">
            {t.resources.items.map((item, index) => (
              <Card
                description={item.body}
                icon={<BookOpen size={24} />}
                key={item.title}
                title={item.title}
                tone={capabilityTones[index % capabilityTones.length]}
              >
                <div className="card__actions">
                  <CopyButton
                    copiedLabel={t.common.copied}
                    label={t.matrix.copyPath}
                    onCopied={() => showToast(t.toast.copied)}
                    onError={() => showToast(t.toast.copyFailed, "danger")}
                    text={item.path}
                  />
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Settings */}
        <section className="section settings" data-testid="settings-section" id="settings">
          <div>
            <p className="eyebrow">Settings</p>
            <h2>{t.settings.title}</h2>
            <p>{t.settings.intro}</p>
            <span className={storageReady ? "status-pill status-pill--ok" : "status-pill status-pill--warn"}>
              {storageReady ? t.settings.storageReady : t.settings.storageBlocked}
            </span>
          </div>
          <div className="settings__controls">
            <div className="control-row">
              <span>{t.settings.theme}</span>
              <Button
                data-testid="settings-theme-toggle"
                icon={theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
                onClick={toggleTheme}
                variant="secondary"
              >
                {theme === "dark" ? t.settings.themeLight : t.settings.themeDark}
              </Button>
            </div>
            <div className="control-row">
              <span>{t.settings.language}</span>
              <Button
                data-testid="settings-language-toggle"
                icon={<Languages size={17} />}
                onClick={toggleLanguage}
                variant="secondary"
              >
                {language === "zh" ? t.settings.en : t.settings.zh}
              </Button>
            </div>
          </div>
        </section>

        {/* Template Health */}
        <section className="section" data-testid="template-health">
          <div className="section__header">
            <p className="eyebrow">Foundation</p>
            <h2>{t.health.title}</h2>
            <p>{t.health.intro}</p>
          </div>
          <div className="health-grid">
            {t.health.items.map((item) => (
              <div className="health-item" data-health-key={item.key} key={item.key}>
                <span className="health-item__status">
                  <CheckCircle2 size={16} aria-hidden="true" />
                </span>
                <span className="health-item__label">{item.label}</span>
                <span className="health-item__state">{t.health.ready}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Reusable States Demo */}
        <section className="section state-grid" aria-label="Reusable states">
          <EmptyState body={t.states.emptyBody} title={t.states.emptyTitle} />
          <ErrorState body={t.states.errorBody} title={t.states.errorTitle} />
        </section>
      </main>

      {/* Footer */}
      <footer className="app-footer" data-testid="app-footer">
        <span className="app-footer__version">v{siteMeta.version}</span>
        <span className="app-footer__tag">Local First</span>
        <span className="app-footer__tag">No Backend</span>
        <span className="app-footer__tag">GitHub Pages Ready</span>
      </footer>

      {/* Matrix Modal */}
      <Modal
        closeLabel={t.common.close}
        isOpen={isMatrixOpen}
        onClose={() => setIsMatrixOpen(false)}
        title={t.matrix.modalTitle}
      >
        <p>{t.matrix.modalBody}</p>
        <div className="matrix-modal-list">
          {MODULE_REGISTRY.map((module) => {
            const status = getStatusForLevel(module, selectedLevel);
            return (
              <div className="matrix-modal-list__item" key={module.id}>
                <span>{module.name[language]}</span>
                <span className={`status status--${status}`}>
                  {STATUS_LABELS[status][language]}
                </span>
              </div>
            );
          })}
        </div>
        <div className="modal__actions">
          <CopyButton
            copiedLabel={t.common.copied}
            label={t.matrix.copyPath}
            onCopied={() => showToast(t.toast.copied)}
            onError={() => showToast(t.toast.copyFailed, "danger")}
            text="docs/MODULE_MATRIX.md"
          />
          <DownloadButton
            content={manifest}
            fileName={`${siteMeta.name}-manifest.json`}
            label={t.hero.downloadManifest}
            onDownloaded={() => showToast(t.toast.downloaded)}
          />
        </div>
      </Modal>

      <Toast message={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
