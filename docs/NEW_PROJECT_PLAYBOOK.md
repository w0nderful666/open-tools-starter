# New Project Playbook

从拿到一个新项目想法到发布上线的完整流程。

---

## 快速启动：Starter Wizard + create-project

最简单的方式是使用首页的 **Starter Wizard**：

1. 打开首页，滚动到 "Starter Wizard" / "新项目启动向导"
2. 填写表单：项目名称、等级、描述、核心功能、技术决策
3. 实时生成 PROJECT_SPEC.md、OpenCode 提示词、create-project 命令等
4. 复制 create-project 命令，在本地运行：

```bash
# 预览（不修改文件）
npm run create:project -- --name my-tool --title "My Tool" --level B --description "..." --dry-run

# 应用（修改 package.json, siteMeta, index.html, manifest, sw.js, README, RELEASE_NOTES）
npm run create:project -- --name my-tool --title "My Tool" --level B --description "..." --apply
```

5. 运行 `npm install && npm run build && npm run self-test && npm run preflight`
6. 开始开发你的工具模块

---

## 完整流程（手动）

如果你想从零开始理解每一步，以下是完整流程：

---

## 第一步：判断项目等级

拿到想法后，先回答这三个问题：

1. **核心功能是什么？** 一句话说清楚。
2. **用户需要保存状态吗？** 不需要 → C 级。需要 → B 级或 A 级。
3. **会长期维护吗？** 不会 → C 级。会 → 考虑 B/A 级。

| 判断条件 | 推荐等级 |
|---------|---------|
| 单页工具，输入输出清晰，快速发布 | C |
| 有导入导出、分享链接、文件处理 | B |
| 多模块、长期维护、需要 PWA | A |

**拿不准时先选 C。** 只有当真实需求出现时，再从 C 升到 B。

---

## 第二步：明确目标用户

回答：

- 谁会用这个工具？
- 他们在哪里打开？（手机 / 电脑 / 都有）
- 他们最常做的操作是什么？
- 他们最怕遇到什么问题？

---

## 第三步：明确核心痛点

回答：

- 这个工具解决了什么具体问题？
- 用户现在怎么解决的？有什么痛？
- 这个工具的核心价值是什么？（一句话）

---

## 第四步：明确最小可用功能

C 级：列出 1-3 个核心功能。
B 级：列出核心功能 + 导入导出 + 下载。
A 级：列出核心模块 + 组件体系。

**原则：先做最小可用版本，再迭代。**

---

## 第五步：明确不能做什么

写下"不做范围"，例如：

- 不做后端
- 不做登录
- 不做批处理（C 级）
- 不做 PWA（C/B 级）
- 不做实时协作
- 不做移动端原生应用

---

## 第六步：修改 siteMeta

优先修改 `src/config/siteMeta.ts`，这是项目元信息的单一来源：

```ts
export const siteMeta = {
  name: "your-project-name",
  shortName: "YPN",
  version: "0.1.0",
  description: "一句话描述",
  repositoryUrl: "https://github.com/you/repo",
  demoUrl: "https://you.github.io/repo/",
  author: "Your Name",
  license: "MIT",
  keywords: ["keyword1", "keyword2"],
  localStoragePrefix: "your-prefix"
} as const;
```

---

## 第七步：修改 README

替换 README.md 中的内容：

- 标题和描述
- 在线演示地址
- 项目等级说明
- 核心功能
- 本地运行方法
- 部署方法
- 隐私原则

---

## 第八步：创建业务模块

1. 在 `src/tools/` 下创建新工具目录。
2. 参考 [docs/MODULE_CONTRACT.md](docs/MODULE_CONTRACT.md) 实现。
3. 在 `src/tools/toolRegistry.ts` 中注册。
4. 在 `App.tsx` 中添加入口。

---

## 第九步：增加项目专属自测

C 级（可选）：
- 浏览器打开首页正常
- 核心功能可用
- 深色模式可切换
- 中英文可切换

B/A 级（必须）：
- `self-test.html` 检查关键 DOM 和交互
- `public/self-test.js` 命令行自测
- 覆盖导入导出、复制下载、错误状态

---

## 第十步：运行质量检查

```bash
# 构建
npm run build

# 命令行自测
npm run self-test

# 发布前检查
npm run preflight

# 完整测试（B/A 级推荐）
npm run test:all
```

修复所有 FAIL 和重要 WARN。

---

## 第十一步：发布 GitHub Pages

1. 推送代码到 GitHub。
2. 仓库 Settings → Pages → Source → GitHub Actions。
3. push 到 `main` 或手动触发 workflow。
4. 等待 Actions 链路完成。

---

## 第十二步：发布后检查线上地址

- [ ] 页面可正常打开
- [ ] 首屏有清晰价值说明
- [ ] 核心功能可用
- [ ] 深色模式正常
- [ ] 中英文切换正常
- [ ] 移动端不崩
- [ ] 版本号显示正确

---

## 第十三步：更新 RELEASE_NOTES

```markdown
## v0.1.0

[日期]

Added:
- 核心功能描述
- 示例数据
- README 和部署说明

Checks:
- build 通过
- self-test 通过
- preflight 通过
```

---

## 第十四步：设置开源维护文件

从模板创建新项目时，以下文件已包含在内，需要按需定制：

- `CONTRIBUTING.md` — 定制为你的项目的贡献指南
- `SECURITY.md` — 审查并更新安全联系信息
- `.github/ISSUE_TEMPLATE/` — 定制 Issue 表单的标签和字段
- `.github/pull_request_template.md` — 定制 PR 检查清单
- `docs/GITHUB_REPO_SETUP.md` — 按照此指南设置新仓库
- `docs/RELEASE_TEMPLATE.md` — 创建 GitHub Release 时使用
- `scripts/check-release-ready.mjs` — 运行 `npm run release:check` 验证发布就绪状态

---

## 第十五步：截图或生成 preview 图

- 截图首页和核心功能页面。
- 生成 `docs/assets/preview.svg`（可选）。
- 生成 `public/og-image.svg`（可选）。
- 运行 `npm run release:check` 验证所有开源维护文件就绪。

---

## 检查清单

完成以上步骤后，运行 [docs/QUALITY_BAR.md](docs/QUALITY_BAR.md) 中的检查清单，确保项目达到对应等级标准。
