# New Project Start Guide

这份指南用于把 `open-tools-starter` 复制成一个新的纯前端 GitHub Pages 工具项目。

核心问题：如何从 open-tools-starter 复制一个新项目，并按 C / B / A 等级裁剪到合适复杂度。

## 1. 复制母版

推荐做法：

1. 复制整个 `open-tools-starter` 目录。
2. 把目录改名为新项目名，例如 `prompt-card-maker`。
3. 删除旧的构建产物 `dist/` 和依赖目录 `node_modules/`。
4. 保留 `docs/`、`src/config/`、`self-test.html` 和 `public/self-test.js`。

不要复制时顺手删除等级文档和模块矩阵。它们是模板复用的导航。

## 2. 选择 C / B / A 等级

先阅读：

- `docs/PROJECT_LEVELS.md`
- `docs/MODULE_MATRIX.md`
- `src/config/projectProfiles.ts`
- `src/config/moduleRegistry.ts`

选择建议：

- 只做单页小工具，选 C 级。
- 需要文件、导入导出、下载结果或分享链接，选 B 级。
- 长期维护、多模块、PWA、离线、批处理，选 A 级。

宁可先选低一级，把当前等级做完整，再升级。

## 3. 修改 package.json

至少修改：

- `name`
- `version`
- `description`

示例：

```json
{
  "name": "prompt-card-maker",
  "version": "0.1.0",
  "description": "A local-first prompt card maker for GitHub Pages."
}
```

不要删除：

- `build`
- `self-test`
- `preflight`

## 4. 修改项目名称

需要同步修改：

- `index.html` 的 `<title>` 和 description。
- `README.md` 的项目名和说明。
- `src/App.tsx` 中展示的品牌名称。
- 下载文件名或 manifest 中的项目名。

如果项目仍然使用模板等级系统，保留 `src/config/projectProfiles.ts` 和 `src/config/moduleRegistry.ts`。

## 5. 修改 GitHub Pages base

母版默认使用：

```ts
base: "./"
```

这适合大多数 GitHub Pages 仓库路径。

如果你明确知道部署路径，也可以改成：

```ts
base: "/your-repo-name/"
```

改完后必须运行：

```bash
npm run build
```

并检查构建产物是否能正确加载。

## 6. 替换 README

新项目 README 至少包含：

- 项目是什么。
- 当前等级：C / B / A。
- 适合谁。
- 核心功能。
- 不做什么。
- 本地运行。
- GitHub Pages 部署。
- 隐私原则。
- 自测方法。
- 发布前检查。

不要写还没实现的功能。

## 7. 删除不需要的模块

先看 `src/config/projectProfiles.ts` 中目标等级的：

- `requiredModules`
- `recommendedModules`
- `optionalModules`
- `notRecommendedModules`

删除策略：

- `requiredModules` 默认保留。
- `recommendedModules` 根据项目规模判断。
- `optionalModules` 没业务需要就不加。
- `notRecommendedModules` 默认删除或不实现。

删除前先确认页面上没有按钮指向被删除的能力。

## 8. 保留 localStorage / i18n / theme

建议默认保留：

- `src/lib/storage.ts`
- `src/hooks/usePersistentState.ts`
- `src/i18n/messages.ts`
- `src/styles/global.css` 中的主题变量

C 级项目也可以只用它们保存主题和语言。B / A 级项目应继续扩展它们，而不是另起一套设置系统。

## 9. 添加第一个真实工具

添加工具时遵守：

- 工具必须在浏览器本地运行。
- 不上传用户文件。
- 按钮必须真实可用。
- 有输入、示例、输出和错误状态。
- 文案同步补齐中文和英文。
- 需要下载结果时使用真实 Blob 下载。

推荐目录：

```txt
src/tools/
  firstTool/
    FirstTool.tsx
    firstTool.logic.ts
```

简单 C 级项目也可以先不拆太细，但不要把复杂逻辑全部塞进 `App.tsx`。

## 10. 发布前检查

发布前运行：

```bash
npm run build
npm run self-test
npm run preflight
```

并阅读：

- `docs/RELEASE_CHECKLIST.md`
- `RELEASE_NOTES.md`

如果是 B / A 级项目，发布前必须确认 self-test 通过。

如果是 A 级项目，发布前必须确认 preflight 通过。
