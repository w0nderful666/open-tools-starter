# Quality Bar

一个项目做到什么程度才算够？

本文档是发布前的最终检查表。每一项都必须通过，项目才能发布。

---

## 用户体验检查

| # | 检查项 | 说明 |
|---|--------|------|
| 1 | 用户打开就知道这是干什么的 | 首屏有清晰的价值说明，不需要猜 |
| 2 | 首屏有清晰价值说明 | 标题、描述、标签明确表达项目用途 |
| 3 | 有示例数据或示例入口 | 用户不需要从零开始，可以立即体验 |
| 4 | 核心功能 30 秒内能体验 | 打开 → 看到入口 → 点击 → 看到结果 |
| 5 | 所有按钮真实可用 | 没有空壳 UI，没有假按钮，没有 dead link |
| 6 | 无明显空壳 UI | 不应该有"即将推出"或空白占位 |

## 兼容性检查

| # | 检查项 | 说明 |
|---|--------|------|
| 7 | 移动端不崩 | 手机浏览器打开，布局正常，按钮可点 |
| 8 | 深色模式可读 | 深色模式下文字对比度足够，不瞎眼 |
| 9 | 中英文切换完整 | 切换后所有文案都变了，没有半成品 |

## 文档检查

| # | 检查项 | 说明 |
|---|--------|------|
| 10 | 隐私说明清楚 | 明确说明本地处理、不上传、不追踪 |
| 11 | README 能让陌生人看懂 | 不需要问作者就能理解项目是什么、怎么用 |
| 12 | RELEASE_NOTES 更新 | 当前版本的变更已记录 |

## 技术检查

| # | 检查项 | 说明 |
|---|--------|------|
| 13 | GitHub Pages 可部署 | `npm run build` 成功，workflow 可运行 |
| 14 | self-test 通过 | `npm run self-test` 无 FAIL |
| 15 | preflight 通过 | `npm run preflight` 无 FAIL |
| 16 | 版本号一致 | package.json、siteMeta.ts、sw.js、manifest、页面底部一致 |

## 安全检查

| # | 检查项 | 说明 |
|---|--------|------|
| 17 | 没有无意义依赖 | 不引入用不到的重型包 |
| 18 | 没有后端上传 | 源码中没有文件上传到服务器的代码 |
| 19 | 没有登录系统 | 不需要用户注册或登录 |
| 20 | 没有残留模板占位符 | 没有待办标记、修复标记、"your project here" 等占位 |

## v0.5.0 RC 检查

| # | 检查项 | 说明 |
|---|--------|------|
| 21 | Starter Wizard 可用 | 首页 Wizard 表单可填写，6 种输出物实时生成 |
| 22 | Wizard 输出可复制下载 | 每个输出物都有 Copy 和 Download 按钮且真实可用 |
| 23 | Wizard localStorage 持久化 | 刷新页面后表单数据恢复 |
| 24 | create-project dry-run 不改文件 | dry-run 模式下所有文件保持不变 |
| 25 | create-project apply 一致 | apply 后 package/siteMeta/manifest/sw/README 版本一致 |
| 26 | template-lock 通过 | `npm run test:template-lock` 无 FAIL |
| 27 | scaffold 测试通过 | `npm run test:scaffold` 无 FAIL |
| 28 | 无 Text Cleaner / Example Module | 首页和源码中无回归内容 |

## v0.6.0 开源维护者检查

| # | 检查项 | 说明 |
|---|--------|------|
| 29 | CONTRIBUTING.md 存在且内容完整 | 包含 Bug 报告、功能建议、PR 流程、开发环境 |
| 30 | SECURITY.md 存在且内容完整 | 明确纯前端、本地优先、不上传文件、不收集隐私 |
| 31 | Issue Templates 存在 | bug_report.yml、feature_request.yml、docs_improvement.yml |
| 32 | PR Template 存在 | 包含变更类型、测试命令、隐私边界确认 |
| 33 | docs/GITHUB_REPO_SETUP.md 存在 | 从模板创建新项目后的仓库设置手册 |
| 34 | docs/RELEASE_TEMPLATE.md 存在 | 标准 GitHub Release 文案结构 |
| 35 | release:check 通过 | npm run release:check 无 FAIL |
| 36 | Starter Wizard 12 项输出完整 | 原 6 项 + 新增 6 项开源维护输出物均可复制下载 |

---

## 使用方法

### 发布前

逐项检查以上 20 项。任何一项不通过都应修复后再发布。

### 快速检查命令

```bash
# 构建
npm run build

# 自测
npm run self-test

# 发布前检查
npm run preflight

# 完整测试
npm run test:all

# CI 模拟
npm run test:ci
```

### 手动检查

- 打开浏览器访问首页
- 切换深色模式
- 切换中英文
- 在手机上打开
- 点击所有按钮
- 检查页面底部版本号

---

## 等级差异

| 检查项 | C 级 | B 级 | A 级 |
|--------|------|------|------|
| 用户体验 6 项 | ✅ | ✅ | ✅ |
| 兼容性 3 项 | ✅ | ✅ | ✅ |
| 文档 3 项 | ✅ | ✅ | ✅ |
| 技术 4 项 | ✅ | ✅ | ✅ |
| 安全 4 项 | ✅ | ✅ | ✅ |
| self-test | 可选 | 必须 | 必须 |
| preflight | 可选 | 推荐 | 必须 |
| RELEASE_NOTES | 可选 | 必须 | 必须 |

---

## 常见问题

**Q: 我的项目只有 3 个检查项没通过，可以先发布吗？**

A: 不建议。没通过的项很可能是用户会遇到的问题。修复后再发布。

**Q: C 级项目需要 self-test 吗？**

A: 可选，但强烈建议至少手动检查一遍。

**Q: 我不确定某个按钮是否"真实可用"？**

A: 点击它。如果它不做任何事情，或者做的事情和用户预期不符，就需要修复。
