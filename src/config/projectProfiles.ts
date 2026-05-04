import {
  getModulesByStatus,
  type LocalizedText,
  type ModuleId,
  type ProjectLevel,
} from "./moduleRegistry";

export type ProjectProfile = {
  level: ProjectLevel;
  name: LocalizedText;
  description: LocalizedText;
  suitableFor: LocalizedText[];
  requiredModules: ModuleId[];
  recommendedModules: ModuleId[];
  optionalModules: ModuleId[];
  notRecommendedModules: ModuleId[];
  requiredDocs: string[];
  requiredChecks: LocalizedText[];
  deploymentNotes: LocalizedText[];
};

function moduleIds(level: ProjectLevel, status: "required" | "recommended" | "optional" | "not-recommended") {
  return getModulesByStatus(level, status).map((module) => module.id);
}

export const C_LEVEL_PROFILE: ProjectProfile = {
  level: "C",
  name: {
    zh: "C 级项目：轻量小工具",
    en: "Level C: Lightweight Utility",
  },
  description: {
    zh: "适合单页、输入输出清晰、可以快速发布的小工具。目标是轻量、完整、无过度架构。",
    en: "Best for single-page utilities with clear input and output. The goal is lightweight, complete, and intentionally simple.",
  },
  suitableFor: [
    { zh: "文本处理", en: "Text helpers" },
    { zh: "提示词生成器", en: "Prompt generators" },
    { zh: "二维码工具", en: "QR helpers" },
    { zh: "小型计算器", en: "Small calculators" },
  ],
  requiredModules: moduleIds("C", "required"),
  recommendedModules: moduleIds("C", "recommended"),
  optionalModules: moduleIds("C", "optional"),
  notRecommendedModules: moduleIds("C", "not-recommended"),
  requiredDocs: ["README.md", "docs/PROJECT_LEVELS.md", "docs/MODULE_MATRIX.md"],
  requiredChecks: [
    { zh: "所有按钮真实可用", en: "All buttons perform real actions" },
    { zh: "移动端布局可用", en: "Mobile layout works" },
    { zh: "深色模式和中英文切换可用", en: "Dark mode and language switching work" },
    { zh: "README 包含运行和部署说明", en: "README includes run and deployment instructions" },
  ],
  deploymentNotes: [
    { zh: "默认使用 Vite 相对 base，适合 GitHub Pages 子路径。", en: "Uses a relative Vite base by default for GitHub Pages subpaths." },
    { zh: "发布前至少运行 build，并手动检查首页核心交互。", en: "Run build before release and manually check core homepage interactions." },
  ],
};

export const B_LEVEL_PROFILE: ProjectProfile = {
  level: "B",
  name: {
    zh: "B 级项目：标准实用工具",
    en: "Level B: Standard Practical Tool",
  },
  description: {
    zh: "适合有文件、配置、导入导出或分享状态的实用工具。目标是完整工作流和发布可靠性。",
    en: "Best for practical tools with files, configuration, import/export, or shareable state. The goal is a complete workflow and reliable release path.",
  },
  suitableFor: [
    { zh: "PDF 小工具", en: "PDF helpers" },
    { zh: "图片工具", en: "Image tools" },
    { zh: "文件处理", en: "File utilities" },
    { zh: "JSON / CSV 工具", en: "JSON / CSV tools" },
  ],
  requiredModules: moduleIds("B", "required"),
  recommendedModules: moduleIds("B", "recommended"),
  optionalModules: moduleIds("B", "optional"),
  notRecommendedModules: moduleIds("B", "not-recommended"),
  requiredDocs: [
    "README.md",
    "RELEASE_NOTES.md",
    "docs/PROJECT_LEVELS.md",
    "docs/MODULE_MATRIX.md",
    "docs/RELEASE_CHECKLIST.md",
  ],
  requiredChecks: [
    { zh: "build 通过", en: "Build passes" },
    { zh: "self-test 通过", en: "self-test passes" },
    { zh: "导入、导出、下载和分享链路可用", en: "Import, export, download, and share flows work" },
    { zh: "隐私说明明确不上传用户文件", en: "Privacy notice clearly states no user file uploads" },
  ],
  deploymentNotes: [
    { zh: "GitHub Pages 部署前检查 self-test.html。", en: "Check self-test.html before GitHub Pages deployment." },
    { zh: "发布说明需要记录新增、修复和未做范围。", en: "Release notes should record additions, fixes, and omitted scope." },
  ],
};

export const A_LEVEL_PROFILE: ProjectProfile = {
  level: "A",
  name: {
    zh: "A 级项目：旗舰项目",
    en: "Level A: Flagship Project",
  },
  description: {
    zh: "适合长期维护、多模块、多入口的工具箱。目标是模块化、离线能力和完整发布治理。",
    en: "Best for long-lived, multi-module toolboxes. The goal is modularity, offline capability, and complete release governance.",
  },
  suitableFor: [
    { zh: "长期维护工具箱", en: "Long-lived toolboxes" },
    { zh: "多模块前端产品", en: "Multi-module frontend products" },
    { zh: "批处理工具", en: "Batch processing tools" },
    { zh: "旗舰级 GitHub Pages 应用", en: "Flagship GitHub Pages apps" },
  ],
  requiredModules: moduleIds("A", "required"),
  recommendedModules: moduleIds("A", "recommended"),
  optionalModules: moduleIds("A", "optional"),
  notRecommendedModules: moduleIds("A", "not-recommended"),
  requiredDocs: [
    "README.md",
    "RELEASE_NOTES.md",
    "docs/PROJECT_LEVELS.md",
    "docs/MODULE_MATRIX.md",
    "docs/RELEASE_CHECKLIST.md",
    "docs/NEW_PROJECT_START_GUIDE.md",
    "docs/PROJECT_SPEC_TEMPLATE.md",
  ],
  requiredChecks: [
    { zh: "build、self-test、preflight 全部通过", en: "Build, self-test, and preflight all pass" },
    { zh: "PWA 和离线提示可用", en: "PWA and offline notice work" },
    { zh: "核心工具模块化且可独立维护", en: "Core tools are modular and independently maintainable" },
    { zh: "SEO / OpenGraph 和完整双语文案齐全", en: "SEO / OpenGraph and complete bilingual copy are present" },
  ],
  deploymentNotes: [
    { zh: "每次发布前必须跑 preflight，并记录 RELEASE_NOTES。", en: "Run preflight and update RELEASE_NOTES before every release." },
    { zh: "适合接入 GitHub Actions 自动部署。", en: "Well suited for GitHub Actions deployment." },
  ],
};

export const PROJECT_PROFILES = [
  C_LEVEL_PROFILE,
  B_LEVEL_PROFILE,
  A_LEVEL_PROFILE,
] as const;

export function getProfileByLevel(level: ProjectLevel): ProjectProfile {
  const profile = PROJECT_PROFILES.find((item) => item.level === level);

  if (!profile) {
    throw new Error(`Unknown project level: ${level}`);
  }

  return profile;
}
