export type Language = "zh" | "en";

type Level = {
  title: string;
  subtitle: string;
  description: string;
  required: string[];
};

export type Messages = {
  nav: {
    docs: string;
    levels: string;
    modules: string;
    wizard: string;
    settings: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    body: string;
    primaryAction: string;
    secondaryAction: string;
    copyPrompt: string;
    downloadManifest: string;
  };
  tags: string[];
  levels: {
    title: string;
    intro: string;
    items: Level[];
  };
  matrix: {
    title: string;
    body: string;
    open: string;
    modalTitle: string;
    modalBody: string;
    copyPath: string;
    bullets: string[];
  };
  capabilities: {
    title: string;
    intro: string;
    items: Array<{ title: string; body: string }>;
  };
  flow: {
    title: string;
    intro: string;
    steps: string[];
  };
  quality: {
    title: string;
    intro: string;
    body: string;
    link: string;
  };
  resources: {
    title: string;
    intro: string;
    items: Array<{ title: string; body: string; path: string }>;
  };
  settings: {
    title: string;
    intro: string;
    theme: string;
    language: string;
    themeDark: string;
    themeLight: string;
    zh: string;
    en: string;
    storageReady: string;
    storageBlocked: string;
  };
  states: {
    emptyTitle: string;
    emptyBody: string;
    errorTitle: string;
    errorBody: string;
  };
  toast: {
    copied: string;
    copyFailed: string;
    downloaded: string;
    themeChanged: string;
    languageChanged: string;
    modalOpened: string;
  };
  wizard: {
    title: string;
    intro: string;
    resetSample: string;
    clearForm: string;
    sectionIdentity: string;
    sectionProblem: string;
    sectionFeatures: string;
    sectionTechnical: string;
    projectName: string;
    repoSlug: string;
    level: string;
    description: string;
    targetUser: string;
    corePain: string;
    coreFeatures: string;
    notDoing: string;
    privacyModel: string;
    deployTarget: string;
    textLang: string;
    lsNeed: string;
    importExportNeed: string;
    shareNeed: string;
    pwaNeed: string;
    slugError: string;
    sectionOpenSource: string;
  };
  common: {
    close: string;
    copied: string;
    copy: string;
    download: string;
    open: string;
  };
  health: {
    title: string;
    intro: string;
    ready: string;
    partial: string;
    planned: string;
    items: Array<{ key: string; label: string }>;
  };
};

export const messages: Record<Language, Messages> = {
  zh: {
    nav: {
      docs: "文档",
      levels: "等级",
      modules: "模块",
      wizard: "向导",
      settings: "设置",
    },
    hero: {
      eyebrow: "快速启动 Local First 小工具项目的工程模板",
      title: "Build local-first web tools faster",
      body: "Open Tools Starter 不是具体工具项目。它是用于快速启动纯前端小工具的工程母版：标准项目结构、标准 UI 框架、标准配置入口、标准测试体系、标准发布流程。",
      primaryAction: "查看模块矩阵",
      secondaryAction: "复制 C 级启动提示词",
      copyPrompt: "复制启动提示词",
      downloadManifest: "下载模板清单",
    },
    tags: ["Local First", "No Backend", "Privacy Friendly", "GitHub Pages Ready"],
    levels: {
      title: "A / B / C 项目等级系统",
      intro: "用等级约束复杂度，让每个新工具都知道自己该做到哪里、暂时不该做什么。",
      items: [
        {
          title: "C 级项目",
          subtitle: "轻量小工具",
          description: "适合单页工具、文本处理、提示词生成器、二维码工具、小型计算器等。",
          required: ["现代 UI", "移动端适配", "深色模式", "中英文切换", "示例数据", "一键复制", "README", "GitHub Pages 部署"],
        },
        {
          title: "B 级项目",
          subtitle: "标准实用工具",
          description: "适合 PDF 小工具、图片工具、文件处理、批量重命名、字幕工具、JSON/CSV 工具等。",
          required: ["C 级全部能力", "localStorage", "导入/导出 JSON", "下载结果文件", "分享链接", "错误提示", "self-test", "发布说明", "隐私说明"],
        },
        {
          title: "A 级项目",
          subtitle: "旗舰项目",
          description: "适合长期维护的工具箱、File Bento、PDF Desk Lite、Image Desk Lite、Prompt Market、GitHub Galaxy 等。",
          required: ["B 级全部能力", "PWA", "离线提示", "批处理", "模块化工具", "统一组件库", "设置中心", "健康检查", "preflight", "SEO/OpenGraph"],
        },
      ],
    },
    matrix: {
      title: "模块矩阵入口",
      body: "模块矩阵定义每个能力在 C/B/A 等级中的状态：必须、推荐、可选或不建议。",
      open: "打开矩阵摘要",
      modalTitle: "模块矩阵摘要",
      modalBody: "完整矩阵位于 docs/MODULE_MATRIX.md。模板首页保留这个入口，方便新项目继续对照裁剪。",
      copyPath: "复制文档路径",
      bullets: ["C 级优先轻量发布", "B 级补齐文件与状态能力", "A 级加入长期维护体系"],
    },
    capabilities: {
      title: "What this starter gives you",
      intro: "模板提供的标准化能力，不需要从零搭建。",
      items: [
        {
          title: "项目结构",
          body: "标准目录结构、配置入口、模块注册表、等级系统。",
        },
        {
          title: "UI 框架",
          body: "Button、Card、Modal、Toast、EmptyState、ErrorState、CopyButton、DownloadButton。",
        },
        {
          title: "测试体系",
          body: "self-test、preflight、压力测试、隐私检查、UI 合约检查。",
        },
        {
          title: "发布流程",
          body: "GitHub Actions 自动运行质量检查链路，通过后部署到 GitHub Pages。",
        },
        {
          title: "隐私原则",
          body: "Local First、No Backend、No Upload、Privacy Friendly。",
        },
        {
          title: "新项目启动",
          body: "NEW_PROJECT_PLAYBOOK + MODULE_CONTRACT + QUALITY_BAR + OpenCode 提示词。",
        },
      ],
    },
    flow: {
      title: "New Project Flow",
      intro: "从想法到发布的标准流程。",
      steps: ["Idea", "Level", "Spec", "Module", "Test", "Release"],
    },
    quality: {
      title: "Quality Bar",
      intro: "项目做到什么程度才算够？",
      body: "QUALITY_BAR 定义了 20 项发布就绪检查清单，覆盖 UI、移动端、深色模式、中英文、隐私、测试、文档。每个新项目在发布前都应逐项对照。",
      link: "查看 QUALITY_BAR 文档",
    },
    resources: {
      title: "Starter Resources",
      intro: "模板配套的文档和规范，帮助你从零启动新项目。",
      items: [
        {
          title: "README",
          body: "项目说明、运行方式、部署方式、隐私原则。",
          path: "README.md",
        },
        {
          title: "NEW_PROJECT_PLAYBOOK",
          body: "从想法到发布的完整启动手册。",
          path: "docs/NEW_PROJECT_PLAYBOOK.md",
        },
        {
          title: "MODULE_CONTRACT",
          body: "模块接入规范，定义工具应该如何接入模板。",
          path: "docs/MODULE_CONTRACT.md",
        },
        {
          title: "PROJECT_LEVELS",
          body: "C / B / A 等级定义与最低标准。",
          path: "docs/PROJECT_LEVELS.md",
        },
        {
          title: "OPENCODE_PRESETS",
          body: "C / B / A 新项目启动提示词和发布检查提示词。",
          path: "docs/OPENCODE_PRESETS.md",
        },
        {
          title: "QUALITY_BAR",
          body: "20 项发布就绪质量检查清单。",
          path: "docs/QUALITY_BAR.md",
        },
      ],
    },
    settings: {
      title: "设置区域",
      intro: "主题和语言会写入 localStorage，刷新后保持选择。",
      theme: "主题",
      language: "语言",
      themeDark: "深色",
      themeLight: "浅色",
      zh: "中文",
      en: "English",
      storageReady: "localStorage 可用",
      storageBlocked: "localStorage 不可用",
    },
    states: {
      emptyTitle: "暂无业务模块",
      emptyBody: "open-tools-starter 是模板，不内置真实业务工具。请复制为新项目后添加你的工具。",
      errorTitle: "示例错误状态",
      errorBody: "这里展示可复用 ErrorState，后续业务模块可接入真实错误信息。",
    },
    toast: {
      copied: "已复制",
      copyFailed: "复制失败，请手动选择文本",
      downloaded: "已生成下载文件",
      themeChanged: "主题已更新",
      languageChanged: "语言已更新",
      modalOpened: "矩阵摘要已打开",
    },
    wizard: {
      title: "新项目启动向导",
      intro: "填写项目基本信息，实时生成 PROJECT_SPEC、OpenCode 提示词、create-project 命令等启动材料。",
      resetSample: "加载示例",
      clearForm: "清空表单",
      sectionIdentity: "项目身份",
      sectionProblem: "目标与痛点",
      sectionFeatures: "功能定义",
      sectionTechnical: "技术决策",
      projectName: "项目名称",
      repoSlug: "仓库 slug",
      level: "项目等级",
      description: "一句话描述",
      targetUser: "目标用户",
      corePain: "核心痛点",
      coreFeatures: "核心功能（每行一个）",
      notDoing: "明确不做什么（每行一个）",
      privacyModel: "隐私模型",
      deployTarget: "部署目标",
      textLang: "文案语言",
      lsNeed: "localStorage 需求",
      importExportNeed: "导入导出需求",
      shareNeed: "分享链接需求",
      pwaNeed: "PWA 需求",
      slugError: "slug 必须是 kebab-case（如 my-tool-name）",
      sectionOpenSource: "开源维护材料",
    },
    common: {
      close: "关闭",
      copied: "已复制",
      copy: "复制",
      download: "下载",
      open: "打开",
    },
    health: {
      title: "模板健康度",
      intro: "当前母版已具备的能力状态",
      ready: "就绪",
      partial: "部分",
      planned: "计划中",
      items: [
        { key: "githubPages", label: "GitHub Pages Ready" },
        { key: "localFirst", label: "Local First" },
        { key: "noBackend", label: "No Backend" },
        { key: "privacyFriendly", label: "Privacy Friendly" },
        { key: "cbaProfiles", label: "C/B/A Profiles" },
        { key: "moduleRegistry", label: "Module Registry" },
        { key: "selfTest", label: "self-test" },
        { key: "preflight", label: "preflight" },
        { key: "githubActions", label: "GitHub Actions" },
        { key: "pwa", label: "PWA Ready" },
        { key: "seo", label: "SEO Ready" },
        { key: "errorBoundary", label: "ErrorBoundary" },
      ],
    },
  },
  en: {
    nav: {
      docs: "Docs",
      levels: "Levels",
      modules: "Modules",
      wizard: "Wizard",
      settings: "Settings",
    },
    hero: {
      eyebrow: "Reusable engineering template for local-first frontend tools",
      title: "Build local-first web tools faster",
      body: "Open Tools Starter is not a specific tool project. It is the engineering template for launching pure frontend tools: standard project structure, UI framework, config system, test suite, and release workflow.",
      primaryAction: "View module matrix",
      secondaryAction: "Copy C-level prompt",
      copyPrompt: "Copy starter prompt",
      downloadManifest: "Download manifest",
    },
    tags: ["Local First", "No Backend", "Privacy Friendly", "GitHub Pages Ready"],
    levels: {
      title: "A / B / C Project Levels",
      intro: "Use project levels to control scope, quality gates, and upgrade paths.",
      items: [
        {
          title: "Level C",
          subtitle: "Lightweight utility",
          description: "Best for single-page tools, text helpers, prompt generators, QR helpers, and small calculators.",
          required: ["Modern UI", "Mobile layout", "Dark mode", "Chinese/English copy", "Sample data", "One-click copy", "README", "GitHub Pages deployment"],
        },
        {
          title: "Level B",
          subtitle: "Standard practical tool",
          description: "Best for PDF helpers, image tools, file utilities, batch renamers, subtitle tools, and JSON/CSV tools.",
          required: ["All Level C capabilities", "localStorage", "JSON import/export", "Result downloads", "Share links", "Error feedback", "self-test", "Release notes", "Privacy note"],
        },
        {
          title: "Level A",
          subtitle: "Flagship project",
          description: "Best for long-lived toolboxes, File Bento, PDF Desk Lite, Image Desk Lite, Prompt Market, and GitHub Galaxy.",
          required: ["All Level B capabilities", "PWA", "Offline hint", "Batch processing", "Modular tools", "Shared component library", "Settings center", "Health checks", "preflight", "SEO/OpenGraph"],
        },
      ],
    },
    matrix: {
      title: "Module Matrix",
      body: "The module matrix marks each capability as required, recommended, optional, or discouraged for C/B/A projects.",
      open: "Open matrix summary",
      modalTitle: "Module Matrix Summary",
      modalBody: "The full matrix lives in docs/MODULE_MATRIX.md. This homepage keeps a practical entry point for future projects.",
      copyPath: "Copy docs path",
      bullets: ["Level C ships light", "Level B adds files and states", "Level A adds long-term maintenance systems"],
    },
    capabilities: {
      title: "What this starter gives you",
      intro: "Standardized capabilities the template provides — no need to start from scratch.",
      items: [
        {
          title: "Project structure",
          body: "Standard directory layout, config entry point, module registry, and level system.",
        },
        {
          title: "UI framework",
          body: "Button, Card, Modal, Toast, EmptyState, ErrorState, CopyButton, DownloadButton.",
        },
        {
          title: "Test suite",
          body: "self-test, preflight, pressure tests, privacy checks, and UI contract checks.",
        },
        {
          title: "Release workflow",
          body: "GitHub Actions runs the full quality chain, then deploys to GitHub Pages.",
        },
        {
          title: "Privacy principles",
          body: "Local First, No Backend, No Upload, Privacy Friendly.",
        },
        {
          title: "New project playbook",
          body: "NEW_PROJECT_PLAYBOOK + MODULE_CONTRACT + QUALITY_BAR + OpenCode prompts.",
        },
      ],
    },
    flow: {
      title: "New Project Flow",
      intro: "Standard flow from idea to release.",
      steps: ["Idea", "Level", "Spec", "Module", "Test", "Release"],
    },
    quality: {
      title: "Quality Bar",
      intro: "What does 'good enough' look like?",
      body: "QUALITY_BAR defines a 20-item release-readiness checklist covering UI, mobile, dark mode, i18n, privacy, tests, and docs. Every new project should verify each item before release.",
      link: "View QUALITY_BAR docs",
    },
    resources: {
      title: "Starter Resources",
      intro: "配套文档和规范，帮助你从零启动新项目。",
      items: [
        {
          title: "README",
          body: "Project overview, running, deployment, and privacy principles.",
          path: "README.md",
        },
        {
          title: "NEW_PROJECT_PLAYBOOK",
          body: "Complete playbook from idea to release.",
          path: "docs/NEW_PROJECT_PLAYBOOK.md",
        },
        {
          title: "MODULE_CONTRACT",
          body: "Specification for writing tool modules that integrate with the template.",
          path: "docs/MODULE_CONTRACT.md",
        },
        {
          title: "PROJECT_LEVELS",
          body: "C / B / A level definitions and minimum standards.",
          path: "docs/PROJECT_LEVELS.md",
        },
        {
          title: "OPENCODE_PRESETS",
          body: "C / B / A new-project prompts and release check prompt.",
          path: "docs/OPENCODE_PRESETS.md",
        },
        {
          title: "QUALITY_BAR",
          body: "20-item release-readiness quality checklist.",
          path: "docs/QUALITY_BAR.md",
        },
      ],
    },
    settings: {
      title: "Settings",
      intro: "Theme and language are saved in localStorage and survive refreshes.",
      theme: "Theme",
      language: "Language",
      themeDark: "Dark",
      themeLight: "Light",
      zh: "中文",
      en: "English",
      storageReady: "localStorage available",
      storageBlocked: "localStorage unavailable",
    },
    states: {
      emptyTitle: "No business modules",
      emptyBody: "open-tools-starter is a template, not a tool collection. Copy it as a new project and add your own tools.",
      errorTitle: "Example error state",
      errorBody: "This reusable ErrorState can later receive real business errors.",
    },
    toast: {
      copied: "Copied",
      copyFailed: "Copy failed. Please select the text manually.",
      downloaded: "Download generated",
      themeChanged: "Theme updated",
      languageChanged: "Language updated",
      modalOpened: "Matrix summary opened",
    },
    wizard: {
      title: "Starter Wizard",
      intro: "Fill in your project details. Outputs are generated in real time: PROJECT_SPEC, OpenCode prompt, create-project command, and more.",
      resetSample: "Load sample",
      clearForm: "Clear form",
      sectionIdentity: "Project Identity",
      sectionProblem: "Target & Problem",
      sectionFeatures: "Feature Definition",
      sectionTechnical: "Technical Decisions",
      projectName: "Project Name",
      repoSlug: "Repo Slug",
      level: "Project Level",
      description: "One-line Description",
      targetUser: "Target User",
      corePain: "Core Pain Point",
      coreFeatures: "Core Features (one per line)",
      notDoing: "Explicit Non-Goals (one per line)",
      privacyModel: "Privacy Model",
      deployTarget: "Deploy Target",
      textLang: "Text Language",
      lsNeed: "localStorage Need",
      importExportNeed: "Import/Export Need",
      shareNeed: "Share Link Need",
      pwaNeed: "PWA Need",
      slugError: "Slug must be kebab-case (e.g., my-tool-name)",
      sectionOpenSource: "Open Source Materials",
    },
    common: {
      close: "Close",
      copied: "Copied",
      copy: "Copy",
      download: "Download",
      open: "Open",
    },
    health: {
      title: "Template Health",
      intro: "Current template capability status",
      ready: "Ready",
      partial: "Partial",
      planned: "Planned",
      items: [
        { key: "githubPages", label: "GitHub Pages Ready" },
        { key: "localFirst", label: "Local First" },
        { key: "noBackend", label: "No Backend" },
        { key: "privacyFriendly", label: "Privacy Friendly" },
        { key: "cbaProfiles", label: "C/B/A Profiles" },
        { key: "moduleRegistry", label: "Module Registry" },
        { key: "selfTest", label: "self-test" },
        { key: "preflight", label: "preflight" },
        { key: "githubActions", label: "GitHub Actions" },
        { key: "pwa", label: "PWA Ready" },
        { key: "seo", label: "SEO Ready" },
        { key: "errorBoundary", label: "ErrorBoundary" },
      ],
    },
  },
};
