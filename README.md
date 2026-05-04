# Open Tools Starter

[![Version](https://img.shields.io/badge/version-0.6.1-blue)](package.json)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Local First](https://img.shields.io/badge/Local_First-true-teal)]()
[![No Backend](https://img.shields.io/badge/No_Backend-true-teal)]()
[![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-Ready-orange)]()
[![React](https://img.shields.io/badge/React-18.x-61DAFB)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6)]()
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF)]()

**A production-ready template for building and publishing small local-first frontend tools on GitHub Pages.**

Not a generic boilerplate — a complete development, testing, deployment, and maintenance template for open source tool projects.

🔗 **Live Demo**: https://w0nderful666.github.io/open-tools-starter/

---

### What is this?

Open Tools Starter is an **engineering template** for launching pure frontend tools. It includes standard project structure, UI components, test suite, release workflow, documentation system, and open source maintainer files — everything you need to go from idea to published GitHub Pages tool.

### Who is it for?

- Solo developers building small frontend utilities
- Open source maintainers who want a repeatable project scaffold
- Anyone who needs a Local First / No Backend / Privacy Friendly tool template

### What you get

| Layer | Included |
|-------|----------|
| **Project structure** | Standard directory layout, `siteMeta.ts` single source of truth, module registry, C/B/A level system |
| **UI framework** | Button, Card, Modal, Toast, EmptyState, ErrorState, CopyButton, DownloadButton |
| **Test suite** | self-test, preflight, release:check, pressure test, privacy check, UI contract check |
| **Release workflow** | GitHub Actions → quality chain → GitHub Pages deployment |
| **Documentation** | README, RELEASE_NOTES, NEW_PROJECT_PLAYBOOK, MODULE_CONTRACT, QUALITY_BAR, OPENCODE_PRESETS |
| **Open source files** | CONTRIBUTING, SECURITY, Issue Templates (YAML forms), PR Template, Release Template |
| **Starter Wizard** | 12 generated artifacts: PROJECT_SPEC, OpenCode prompt, create-project command, README draft, checklist, spec JSON, repo setup, release draft, roadmap issues, screenshot guide, security summary, contributing summary |

### Stable baseline

v0.6.1 is the current stable release line. It is intended for daily use as a reusable template. No breaking changes from v0.6.0. See [RELEASE_NOTES.md](RELEASE_NOTES.md) for details.

---

## Screenshots

> Recommended screenshots to add when forking this template:
>
> 1. **Home dashboard** — Hero section with tags and quality meter
> 2. **Starter Wizard** — Form and live output panel
> 3. **Generated artifacts** — 12 output cards with copy/download
> 4. **Self-test page** — `/self-test.html` browser test results
>
> Save to `docs/assets/` and reference here:
> ```md
> ![Home](docs/assets/screenshot-home.png)
> ![Wizard](docs/assets/screenshot-wizard.png)
> ```

---

## 项目定位

**Open Tools Starter 不是一个具体工具项目。它是一个用于快速启动 Local First 小工具项目的工程模板。**

你可以把它复制为新项目的基础，然后替换业务逻辑、页面文案和工具模块，而不是从零搭建 Vite + React + TypeScript 项目。

它提供：

- 标准项目结构
- 标准 UI 框架（卡片、按钮、弹窗、Toast、空状态、错误状态）
- 标准配置入口（siteMeta.ts）
- 标准文档体系（等级、模块矩阵、质量检查、启动手册）
- 标准测试体系（self-test、preflight、压力测试、release:check）
- 标准发布流程（GitHub Actions → GitHub Pages）
- 标准隐私说明（Local First、No Backend、No Upload）
- 标准项目等级规范（C / B / A）
- 标准 OpenCode/Codex 开发提示词
- 标准新项目启动流程
- 标准开源维护文件（CONTRIBUTING、SECURITY、Issue Templates、PR Template）

## 适合做什么项目

- 纯前端文本处理工具
- 提示词生成器
- JSON / CSV 小工具
- 文件处理小工具（浏览器本地处理）
- 前端计算器
- 长期维护的前端工具箱

## 不适合做什么项目

本模板不包括以下内容：

- 需要后端、数据库或用户登录的项目
- 需要上传用户文件到服务器的项目
- 需要实时协作或多用户同步的项目
- 需要原生移动应用的项目
- 需要复杂服务器端渲染的项目

## 项目等级 C / B / A

| 等级 | 名称 | 适合项目 | 核心要求 |
| --- | --- | --- | --- |
| C | 轻量小工具 | 单页工具、文本处理、小型计算器 | 现代 UI、移动端适配、深色模式、中英文切换、示例数据、一键复制、README、GitHub Pages 部署 |
| B | 标准实用工具 | PDF、图片、文件处理、JSON/CSV | C 级全部 + localStorage、导入导出、下载结果、分享链接、错误提示、self-test、RELEASE_NOTES、隐私说明 |
| A | 旗舰项目 | 长期维护工具箱、多模块产品 | B 级全部 + PWA、离线提示、批处理、模块化、统一组件库、设置中心、健康检查、preflight、SEO/OpenGraph |

详细定义见 [docs/PROJECT_LEVELS.md](docs/PROJECT_LEVELS.md)。

## 推荐目录结构

```txt
src/
  components/          # 可复用 UI 组件（Button, Card, Modal, Toast...）
    tools/             # 工具壳组件（ToolShell, ToolHeader, ToolStats）
  config/
    siteMeta.ts        # 项目元信息单一来源
    moduleRegistry.ts  # 模块注册表
    projectProfiles.ts # C/B/A 等级配置
  hooks/               # 自定义 hooks
  i18n/                # 中英文文案
  lib/                 # 工具函数（storage, classNames...）
  tools/               # 业务工具模块（每个工具一个目录）
    toolRegistry.ts    # 工具注册表
    <tool-name>/       # 具体工具目录
      index.tsx
      types.ts
  styles/              # 全局样式
  App.tsx              # 根组件
  main.tsx             # 入口
docs/                  # 文档目录
scripts/               # 测试和检查脚本
public/                # 静态资源（manifest, sw.js, icon）
```

## 如何复制为新项目

1. 复制整个项目目录。
2. 修改目录名和 `package.json`（name、version、description、homepage、repository）。
3. 优先修改 `src/config/siteMeta.ts`（这是项目元信息的单一来源）。
4. 选择 C / B / A 等级。
5. 对照 [docs/MODULE_MATRIX.md](docs/MODULE_MATRIX.md) 裁剪模块。
6. 更新 `README.md` 和 `RELEASE_NOTES.md`。
7. 在 `src/tools/` 下创建你的业务模块。
8. 运行 build、self-test 和 preflight。

完整流程见 [docs/NEW_PROJECT_PLAYBOOK.md](docs/NEW_PROJECT_PLAYBOOK.md)。

## 如何修改 siteMeta

`src/config/siteMeta.ts` 是项目元信息的**单一来源**。App.tsx、preflight 和 self-test 都从这里读取配置。

```ts
export const siteMeta = {
  name: "your-project-name",        // 项目全名
  shortName: "YPN",                 // 简称
  version: "0.1.0",                 // 版本号（与 package.json 一致）
  description: "...",               // 项目描述
  repositoryUrl: "https://...",     // GitHub 仓库地址
  demoUrl: "https://...",           // GitHub Pages 在线地址
  author: "Your Name",              // 作者
  license: "MIT",                   // 许可证
  keywords: [...],                  // 关键词
  localStoragePrefix: "your-prefix" // localStorage 键前缀
} as const;
```

修改 siteMeta 后，同步更新：

| 文件 | 需要修改的字段 |
|------|---------------|
| `package.json` | name, version, description, homepage, repository |
| `index.html` | title, description, keywords, og:*, twitter:*, canonical |
| `public/manifest.webmanifest` | name, short_name, description, version |
| `public/sw.js` | CACHE_NAME |
| `README.md` | 标题、描述、在线地址、版本徽章 |

## 如何新增真实业务模块

1. 在 `src/tools/` 下创建新目录（如 `src/tools/my-tool/`）。
2. 参考 [docs/MODULE_CONTRACT.md](docs/MODULE_CONTRACT.md) 的规范。
3. 实现输入区、输出区、选项区、错误提示、localStorage 持久化。
4. 在 `src/tools/toolRegistry.ts` 中注册。
5. 在 `App.tsx` 中添加入口。
6. 运行 build 和 self-test 验证。

详细规范见 [docs/MODULE_CONTRACT.md](docs/MODULE_CONTRACT.md)。

## Starter Wizard

首页内置 **Starter Wizard / 新项目启动向导**，帮助你快速生成项目启动材料。

填写表单后实时生成：
- **PROJECT_SPEC.md** — 项目规格说明
- **OpenCode Prompt** — 开发提示词，可直接给 Codex/OpenCode
- **create-project 命令** — 脚手架命令
- **README 结构草案** — README 骨架
- **发布前检查清单** — 针对性的检查项
- **Spec JSON** — 机器可读的项目规格

所有输出物支持复制和下载，表单数据 localStorage 持久化。

## create-project 脚本

使用 `create-project` 脚本快速将模板改造为新项目：

```bash
# 预览变更（不修改文件）
npm run create:project -- --name my-tool --title "My Tool" --level B --description "Resize images for upload limits" --dry-run

# 应用变更
npm run create:project -- --name my-tool --title "My Tool" --level B --description "Resize images for upload limits" --apply
```

参数说明：
- `--name` (必填)：kebab-case 仓库名
- `--title` (必填)：项目显示名称
- `--level` C/B/A，默认 C
- `--description` (必填)：一句话描述
- `--owner` 默认 w0nderful666
- `--version` 默认 0.1.0
- `--dry-run` 默认，不修改文件
- `--apply` 写入文件

apply 会更新：package.json、siteMeta.ts、index.html、manifest.webmanifest、sw.js、README.md、RELEASE_NOTES.md。

## 如何运行自测

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build

# 命令行自测
npm run self-test

# 浏览器自测
npm run dev
# 打开 http://localhost:5173/self-test.html

# 发布前检查
npm run preflight

# 发布就绪检查（开源维护文件和版本一致性）
npm run release:check

# 完整测试
npm run test:all

# CI 模拟（含压力测试）
npm run test:ci
```

### 测试脚本一览

| 脚本 | 功能 |
|------|------|
| `npm run test:static` | 静态检查，验证 JS 语法和必要文件 |
| `npm run test:config` | 配置检查，验证 C/B/A 体系和模块注册 |
| `npm run test:docs` | 文档检查，验证必要文档和质量 |
| `npm run test:health` | 项目健康检查 |
| `npm run test:privacy` | 隐私边界检查 |
| `npm run test:usability` | 模板可用性检查 |
| `npm run test:ui` | UI 合约检查 |
| `npm run test:dist` | 构建产物检查 |
| `npm run test:scaffold` | create-project 脚手架检查 |
| `npm run test:template-lock` | 模板锁定检查（防回归） |
| `npm run release:check` | 发布就绪检查，验证开源维护文件和版本一致性 |
| `npm run test:pressure` | 压力测试（可自定义轮数） |
| `npm run test:all` | 完整测试 |
| `npm run test:ci` | CI 模拟（含 2 轮压力测试） |
| `npm run create:project` | 创建新项目脚手架（默认 dry-run） |

## 如何发布到 GitHub Pages

1. 推送代码到 GitHub。
2. 在仓库 Settings → Pages 中启用 GitHub Pages。
3. Source 选择 **GitHub Actions**。
4. push 到 `main` 分支，或在 Actions 页面手动运行 workflow。
5. workflow 会自动运行完整质量检查链路，通过后部署。

workflow 位于 `.github/workflows/pages.yml`，执行步骤：

1. 安装依赖
2. 运行 test:static → test:config → test:docs → test:health → test:privacy → test:usability
3. 构建
4. 运行 self-test → test:dist → test:ui → preflight → test:pressure
5. 部署到 GitHub Pages

任何一步失败都会阻止部署。

## Starter 资源文件

本模板包含以下标准资源文件，可直接复用或按需定制：

- `README.md` — 项目说明
- `RELEASE_NOTES.md` — 版本发布记录
- `CONTRIBUTING.md` — 贡献指南（Bug 报告、功能建议、PR 流程）
- `SECURITY.md` — 安全政策（纯前端、本地优先、不上传文件）
- `docs/GITHUB_REPO_SETUP.md` — 新项目仓库设置手册
- `docs/RELEASE_TEMPLATE.md` — GitHub Release 文案模板
- `docs/QUALITY_BAR.md` — 质量检查清单
- `docs/NEW_PROJECT_PLAYBOOK.md` — 新项目启动手册
- `docs/PROJECT_LEVELS.md` — 项目等级定义
- `docs/MODULE_MATRIX.md` — 模块矩阵

## 隐私原则

Open Tools Starter 默认遵守：

- **Local First** — 数据在浏览器本地处理
- **No Backend** — 不引入后端、数据库或登录系统
- **Privacy Friendly** — 不上传用户文件，不追踪用户行为
- **Offline Friendly** — 支持 PWA 缓存
- **GitHub Pages Ready** — 纯静态部署，无需服务器

本模板不包含后端、数据库、登录系统或外部追踪脚本。

## 开源维护者标准层

v0.6.0 新增开源维护者标准层，补齐专业开源作者模板所需的维护和发布规范：

- **CONTRIBUTING.md** — 贡献指南，包含 Bug 报告、功能建议、PR 流程
- **SECURITY.md** — 安全政策，明确纯前端、本地优先、不上传文件
- **Issue Templates** — 结构化 GitHub Issue 表单（Bug Report / Feature Request / Docs Improvement）
- **PR Template** — PR 检查清单，包含变更类型、测试命令、隐私边界确认
- **GitHub Repo Setup Guide** — 从模板创建新项目后的仓库设置手册
- **Release Template** — 标准 GitHub Release 文案结构
- **Release Readiness Check** — `npm run release:check` 自动检查发布就绪状态
- **Starter Wizard 扩展** — 新增 6 个开源维护输出物（仓库设置、Release 草案、Roadmap Issues、截图指南、SECURITY 摘要、CONTRIBUTING 摘要）

## 发布前检查清单

- [ ] 所有按钮真实可用，无空壳 UI
- [ ] 移动端布局正常
- [ ] 深色模式可读
- [ ] 中英文切换完整
- [ ] README 说明清晰
- [ ] RELEASE_NOTES 更新
- [ ] 版本号一致（package.json、siteMeta、sw.js、manifest）
- [ ] 页面底部显示版本号
- [ ] 无 TODO/FIXME 残留
- [ ] 无误导性描述
- [ ] `npm run build` 通过
- [ ] `npm run self-test` 通过
- [ ] `npm run preflight` 通过

详细检查表见 [docs/QUALITY_BAR.md](docs/QUALITY_BAR.md)。

## 在线演示

🔗 **在线访问**: https://w0nderful666.github.io/open-tools-starter/

## License

本项目采用 [MIT License](LICENSE)，可免费用于个人和商业项目。
