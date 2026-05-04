export type ProjectLevel = "C" | "B" | "A";

export type ModuleStatus =
  | "required"
  | "recommended"
  | "optional"
  | "not-recommended";

export type ModuleCategory =
  | "foundation"
  | "interaction"
  | "data"
  | "state"
  | "personalization"
  | "release"
  | "platform";

export type LocalizedText = {
  zh: string;
  en: string;
};

export type ModuleDefinition = {
  id: ModuleId;
  name: LocalizedText;
  description: LocalizedText;
  category: ModuleCategory;
  cLevelStatus: ModuleStatus;
  bLevelStatus: ModuleStatus;
  aLevelStatus: ModuleStatus;
};

export type ModuleId =
  | "hero"
  | "toolCards"
  | "darkMode"
  | "i18n"
  | "localStorage"
  | "importJson"
  | "exportJson"
  | "shareLink"
  | "dragAndDrop"
  | "copyButton"
  | "downloadButton"
  | "toast"
  | "modal"
  | "emptyState"
  | "errorState"
  | "recentItems"
  | "favoriteTools"
  | "pwa"
  | "offlineNotice"
  | "selfTest"
  | "preflight"
  | "readme"
  | "releaseNotes"
  | "seo"
  | "privacyNotice"
  | "githubPages";

export const STATUS_LABELS: Record<ModuleStatus, LocalizedText> = {
  required: {
    zh: "必须",
    en: "Required",
  },
  recommended: {
    zh: "推荐",
    en: "Recommended",
  },
  optional: {
    zh: "可选",
    en: "Optional",
  },
  "not-recommended": {
    zh: "不建议",
    en: "Not recommended",
  },
};

export const CATEGORY_LABELS: Record<ModuleCategory, LocalizedText> = {
  foundation: {
    zh: "基础结构",
    en: "Foundation",
  },
  interaction: {
    zh: "交互能力",
    en: "Interaction",
  },
  data: {
    zh: "数据能力",
    en: "Data",
  },
  state: {
    zh: "状态反馈",
    en: "States",
  },
  personalization: {
    zh: "个性化",
    en: "Personalization",
  },
  release: {
    zh: "发布体系",
    en: "Release",
  },
  platform: {
    zh: "平台能力",
    en: "Platform",
  },
};

export const MODULE_REGISTRY: ModuleDefinition[] = [
  {
    id: "hero",
    name: { zh: "现代首页 Hero", en: "Modern Hero" },
    description: {
      zh: "第一屏说明项目用途、等级边界和隐私原则。",
      en: "Use the first screen to explain purpose, level boundaries, and privacy principles.",
    },
    category: "foundation",
    cLevelStatus: "required",
    bLevelStatus: "required",
    aLevelStatus: "required",
  },
  {
    id: "toolCards",
    name: { zh: "工具卡片", en: "Tool Cards" },
    description: {
      zh: "展示工具入口或模板能力，所有按钮必须真实可用。",
      en: "Show tool entries or template capabilities with real, working actions.",
    },
    category: "foundation",
    cLevelStatus: "required",
    bLevelStatus: "required",
    aLevelStatus: "required",
  },
  {
    id: "darkMode",
    name: { zh: "深色模式", en: "Dark Mode" },
    description: {
      zh: "通过主题变量切换浅色和深色界面，并持久保存。",
      en: "Switch between light and dark themes with persisted preferences.",
    },
    category: "personalization",
    cLevelStatus: "required",
    bLevelStatus: "required",
    aLevelStatus: "required",
  },
  {
    id: "i18n",
    name: { zh: "中英文切换", en: "Chinese / English" },
    description: {
      zh: "核心界面文案支持中文和英文。",
      en: "Support Chinese and English copy across the core interface.",
    },
    category: "personalization",
    cLevelStatus: "required",
    bLevelStatus: "required",
    aLevelStatus: "required",
  },
  {
    id: "localStorage",
    name: { zh: "localStorage", en: "localStorage" },
    description: {
      zh: "封装浏览器本地存储，用于设置、历史、草稿或配置。",
      en: "Wrap browser storage for settings, history, drafts, or configuration.",
    },
    category: "data",
    cLevelStatus: "recommended",
    bLevelStatus: "required",
    aLevelStatus: "required",
  },
  {
    id: "importJson",
    name: { zh: "导入 JSON", en: "Import JSON" },
    description: {
      zh: "从本地 JSON 恢复配置、任务或示例数据。",
      en: "Restore configuration, tasks, or sample data from local JSON.",
    },
    category: "data",
    cLevelStatus: "optional",
    bLevelStatus: "required",
    aLevelStatus: "required",
  },
  {
    id: "exportJson",
    name: { zh: "导出 JSON", en: "Export JSON" },
    description: {
      zh: "把配置、任务或处理结果导出为 JSON 文件。",
      en: "Export configuration, tasks, or results as JSON files.",
    },
    category: "data",
    cLevelStatus: "optional",
    bLevelStatus: "required",
    aLevelStatus: "required",
  },
  {
    id: "shareLink",
    name: { zh: "分享链接", en: "Share Link" },
    description: {
      zh: "把当前状态编码到 URL，方便分享或复现。",
      en: "Encode state in the URL for sharing and reproduction.",
    },
    category: "data",
    cLevelStatus: "optional",
    bLevelStatus: "required",
    aLevelStatus: "required",
  },
  {
    id: "dragAndDrop",
    name: { zh: "文件拖拽", en: "Drag and Drop" },
    description: {
      zh: "为文件型工具提供直接拖入文件的入口。",
      en: "Provide a direct drag-in entry point for file-oriented tools.",
    },
    category: "interaction",
    cLevelStatus: "optional",
    bLevelStatus: "recommended",
    aLevelStatus: "required",
  },
  {
    id: "copyButton",
    name: { zh: "一键复制", en: "Copy Button" },
    description: {
      zh: "复制文本、提示词、配置片段或处理结果。",
      en: "Copy text, prompts, snippets, or results.",
    },
    category: "interaction",
    cLevelStatus: "required",
    bLevelStatus: "required",
    aLevelStatus: "required",
  },
  {
    id: "downloadButton",
    name: { zh: "下载结果文件", en: "Download Result File" },
    description: {
      zh: "把结果保存为本地文件，不上传到服务器。",
      en: "Save results as local files without uploading them.",
    },
    category: "interaction",
    cLevelStatus: "optional",
    bLevelStatus: "required",
    aLevelStatus: "required",
  },
  {
    id: "toast",
    name: { zh: "Toast 提示", en: "Toast Feedback" },
    description: {
      zh: "为复制、下载、错误等操作提供即时反馈。",
      en: "Give immediate feedback for copy, download, and error actions.",
    },
    category: "state",
    cLevelStatus: "recommended",
    bLevelStatus: "required",
    aLevelStatus: "required",
  },
  {
    id: "modal",
    name: { zh: "Modal 弹窗", en: "Modal" },
    description: {
      zh: "用于设置、摘要、确认、预览或说明。",
      en: "Use for settings, summaries, confirmations, previews, or explanations.",
    },
    category: "interaction",
    cLevelStatus: "optional",
    bLevelStatus: "recommended",
    aLevelStatus: "required",
  },
  {
    id: "emptyState",
    name: { zh: "空状态", en: "Empty State" },
    description: {
      zh: "没有输入、没有结果或没有模块时给出清楚提示。",
      en: "Explain clearly when there is no input, result, or module yet.",
    },
    category: "state",
    cLevelStatus: "recommended",
    bLevelStatus: "required",
    aLevelStatus: "required",
  },
  {
    id: "errorState",
    name: { zh: "错误状态", en: "Error State" },
    description: {
      zh: "错误必须可理解，并尽量给出恢复路径。",
      en: "Errors should be understandable and recoverable where possible.",
    },
    category: "state",
    cLevelStatus: "recommended",
    bLevelStatus: "required",
    aLevelStatus: "required",
  },
  {
    id: "recentItems",
    name: { zh: "最近使用", en: "Recent Items" },
    description: {
      zh: "记录最近工具、任务或配置，适合多工具场景。",
      en: "Track recent tools, tasks, or configurations for multi-tool projects.",
    },
    category: "personalization",
    cLevelStatus: "optional",
    bLevelStatus: "recommended",
    aLevelStatus: "required",
  },
  {
    id: "favoriteTools",
    name: { zh: "收藏工具", en: "Favorite Tools" },
    description: {
      zh: "让用户固定常用工具，适合长期工具箱。",
      en: "Let users pin common tools in long-lived toolboxes.",
    },
    category: "personalization",
    cLevelStatus: "optional",
    bLevelStatus: "recommended",
    aLevelStatus: "required",
  },
  {
    id: "pwa",
    name: { zh: "PWA", en: "PWA" },
    description: {
      zh: "支持安装、缓存和更接近应用的体验。",
      en: "Support installability, caching, and a more app-like experience.",
    },
    category: "platform",
    cLevelStatus: "not-recommended",
    bLevelStatus: "optional",
    aLevelStatus: "required",
  },
  {
    id: "offlineNotice",
    name: { zh: "离线提示", en: "Offline Notice" },
    description: {
      zh: "提示当前离线状态和可继续使用的能力。",
      en: "Explain offline status and what can still be used.",
    },
    category: "platform",
    cLevelStatus: "optional",
    bLevelStatus: "recommended",
    aLevelStatus: "required",
  },
  {
    id: "selfTest",
    name: { zh: "self-test", en: "self-test" },
    description: {
      zh: "浏览器和命令行自测入口，检查关键能力。",
      en: "Browser and command-line checks for critical capabilities.",
    },
    category: "release",
    cLevelStatus: "optional",
    bLevelStatus: "required",
    aLevelStatus: "required",
  },
  {
    id: "preflight",
    name: { zh: "preflight 脚本", en: "preflight Script" },
    description: {
      zh: "发布前检查文档、配置、敏感信息和范围边界。",
      en: "Check docs, configuration, sensitive content, and scope boundaries before release.",
    },
    category: "release",
    cLevelStatus: "not-recommended",
    bLevelStatus: "recommended",
    aLevelStatus: "required",
  },
  {
    id: "readme",
    name: { zh: "README 模板", en: "README Template" },
    description: {
      zh: "说明项目用途、运行、部署、隐私和自测。",
      en: "Explain purpose, running, deployment, privacy, and self-test.",
    },
    category: "release",
    cLevelStatus: "required",
    bLevelStatus: "required",
    aLevelStatus: "required",
  },
  {
    id: "releaseNotes",
    name: { zh: "RELEASE_NOTES", en: "RELEASE_NOTES" },
    description: {
      zh: "记录版本变化、边界和未做内容。",
      en: "Record version changes, boundaries, and omitted scope.",
    },
    category: "release",
    cLevelStatus: "optional",
    bLevelStatus: "required",
    aLevelStatus: "required",
  },
  {
    id: "seo",
    name: { zh: "SEO / OpenGraph", en: "SEO / OpenGraph" },
    description: {
      zh: "保证公开页面标题、描述和分享预览可用。",
      en: "Ensure public titles, descriptions, and share previews work.",
    },
    category: "platform",
    cLevelStatus: "recommended",
    bLevelStatus: "recommended",
    aLevelStatus: "required",
  },
  {
    id: "privacyNotice",
    name: { zh: "隐私说明", en: "Privacy Notice" },
    description: {
      zh: "明确本地处理、不上传文件、不追踪。",
      en: "State local processing, no file uploads, and no tracking.",
    },
    category: "release",
    cLevelStatus: "recommended",
    bLevelStatus: "required",
    aLevelStatus: "required",
  },
  {
    id: "githubPages",
    name: { zh: "GitHub Pages 部署", en: "GitHub Pages Deployment" },
    description: {
      zh: "默认支持 GitHub Pages 子路径部署。",
      en: "Support GitHub Pages deployment under repository subpaths.",
    },
    category: "platform",
    cLevelStatus: "required",
    bLevelStatus: "required",
    aLevelStatus: "required",
  },
];

export function getStatusForLevel(
  module: ModuleDefinition,
  level: ProjectLevel,
): ModuleStatus {
  if (level === "A") {
    return module.aLevelStatus;
  }

  if (level === "B") {
    return module.bLevelStatus;
  }

  return module.cLevelStatus;
}

export function getModulesByStatus(
  level: ProjectLevel,
  status: ModuleStatus,
): ModuleDefinition[] {
  return MODULE_REGISTRY.filter((module) => getStatusForLevel(module, level) === status);
}

export function getModuleById(id: ModuleId): ModuleDefinition {
  const module = MODULE_REGISTRY.find((item) => item.id === id);

  if (!module) {
    throw new Error(`Unknown module id: ${id}`);
  }

  return module;
}
