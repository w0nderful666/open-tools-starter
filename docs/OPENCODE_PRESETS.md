# Opencode Presets

这些提示词可直接复制给 opencode / Codex 使用。复制前请把方括号中的项目名、工具类型或特殊要求替换为真实内容。

所有提示词统一遵循以下项目风格：

- 纯前端
- GitHub Pages Ready
- Local First
- No Backend / No Login / No Upload
- 中英文切换
- 深色模式
- localStorage
- 导入导出（B/A 级）
- 分享链接（B/A 级）
- self-test.html / self-test.js（B/A 级）
- README 完整
- RELEASE_NOTES 完整（B/A 级）
- 页面底部显示版本号
- 不修改 SSH / WARP / 防火墙 / 系统网络配置

---

## 0. 使用 Starter Wizard + create-project 启动新项目（推荐）

最快的方式是使用首页的 Starter Wizard 生成提示词和 create-project 命令。

### 步骤

1. 打开首页 → Starter Wizard
2. 填写项目信息
3. 复制 "OpenCode 提示词" 或 "create-project 命令"
4. 在本地运行：

```bash
# 预览变更
npm run create:project -- --name [slug] --title "[title]" --level [C/B/A] --description "[desc]" --dry-run

# 应用变更
npm run create:project -- --name [slug] --title "[title]" --level [C/B/A] --description "[desc]" --apply
```

5. 用 Wizard 生成的 OpenCode 提示词启动开发

### Wizard 生成的输出物

| 输出物 | 说明 |
|--------|------|
| PROJECT_SPEC.md | 项目规格说明 |
| OpenCode Prompt | 开发提示词，可直接给 Codex/OpenCode |
| create-project 命令 | 脚手架命令 |
| README Draft | README 结构草案 |
| Release Checklist | 发布前检查清单 |
| Spec JSON | 机器可读的项目规格 |

---

## 1. 从 open-tools-starter 启动一个 C 级新项目

```text
请基于 open-tools-starter 创建一个 C 级纯前端小工具。

项目名称：[项目名]
项目说明：[一句话说明]
目标用户：[目标用户]
核心功能：[核心功能]

技术栈：Vite + React + TypeScript。

请先阅读：
- README.md
- docs/PROJECT_LEVELS.md
- docs/MODULE_MATRIX.md
- docs/NEW_PROJECT_PLAYBOOK.md
- docs/MODULE_CONTRACT.md
- docs/QUALITY_BAR.md
- src/config/siteMeta.ts
- src/config/projectProfiles.ts
- src/config/moduleRegistry.ts

C 级最低标准：
- 单核心功能，输入输出清晰，30 秒内可体验
- 现代 UI，卡片式布局，圆角，柔和阴影
- 移动端适配
- 深色模式（CSS variables，刷新后保持）
- 中英文切换（UI 主路径文案完整）
- 至少一组示例数据
- 一键复制可用
- localStorage 可选（至少保存主题和语言）
- 页面底部显示版本号
- README 说明用途、运行、部署、隐私
- GitHub Pages 部署支持

限制：
1. 不引入后端、数据库、登录系统。
2. 不上传用户文件到服务器。
3. 不引入重依赖。
4. 所有按钮必须真实可用，不允许空壳 UI。
5. 不修改 SSH、WARP、防火墙、系统网络配置。
6. 不加入 PWA、复杂导入导出、批处理或过度架构。

请修改 siteMeta、package.json、README 和页面标题，然后添加第一个真实 C 级工具。完成后运行 build 和 self-test。
```

---

## 2. 从 open-tools-starter 启动一个 B 级新项目

```text
请基于 open-tools-starter 创建一个 B 级纯前端实用工具。

项目名称：[项目名]
项目说明：[一句话说明]
目标用户：[目标用户]
核心功能：[核心功能]

技术栈：Vite + React + TypeScript。

请先阅读：
- README.md
- docs/PROJECT_LEVELS.md
- docs/MODULE_MATRIX.md
- docs/NEW_PROJECT_PLAYBOOK.md
- docs/MODULE_CONTRACT.md
- docs/QUALITY_BAR.md
- src/config/siteMeta.ts
- src/config/projectProfiles.ts
- src/config/moduleRegistry.ts

B 级必须包含 C 级全部能力，并额外包含：
- localStorage 业务数据持久化
- 导入 JSON（从本地恢复配置或数据）
- 导出 JSON（把结果导出为文件）
- 下载结果文件
- 分享链接（把状态编码到 URL）
- 错误提示（可理解、可恢复）
- 空状态（不面对空白页面）
- self-test.html 和 self-test.js
- RELEASE_NOTES.md
- 隐私说明（明确不上传用户文件）
- 发布前检查清单

限制：
1. 不引入后端、数据库、登录系统。
2. 不上传用户文件到服务器。
3. 不引入不必要的重依赖。
4. 所有按钮必须真实可用。
5. 不修改 SSH、WARP、防火墙、系统网络配置。

请按 B 级 Profile 裁剪模块，更新 siteMeta、README 和 RELEASE_NOTES，添加第一个真实工具，并运行 build、self-test、preflight。
```

---

## 3. 从 open-tools-starter 启动一个 A 级新项目

```text
请基于 open-tools-starter 创建一个 A 级旗舰纯前端工具项目。

项目名称：[项目名]
项目说明：[一句话说明]
目标用户：[目标用户]
核心模块：[核心模块列表]

技术栈：Vite + React + TypeScript。

请先阅读：
- README.md
- docs/PROJECT_LEVELS.md
- docs/MODULE_MATRIX.md
- docs/NEW_PROJECT_PLAYBOOK.md
- docs/MODULE_CONTRACT.md
- docs/QUALITY_BAR.md
- src/config/siteMeta.ts
- src/config/projectProfiles.ts
- src/config/moduleRegistry.ts

A 级必须包含 B 级全部能力，并额外包含：
- PWA（支持安装和缓存）
- 离线提示
- 批处理能力
- 工具模块化（可独立理解、独立测试、独立降级）
- 统一组件库
- 统一设置中心
- 项目健康检查
- preflight 脚本
- SEO / OpenGraph
- 完整错误边界（ErrorBoundary）
- 完整中英文文案
- 完整测试矩阵

限制：
1. 不引入后端、数据库、登录系统。
2. 不上传用户文件到服务器。
3. 不为炫技引入过重依赖。
4. 不一次性堆满所有业务功能。
5. 不修改 SSH、WARP、防火墙、系统网络配置。

请先做旗舰项目架构和第一个可运行工具模块，保持长期维护结构清晰。完成后运行 build、self-test、preflight。
```

---

## 4. 发布前收口检查提示词

```text
请对当前纯前端 GitHub Pages 项目做发布前收口检查。

请先阅读：
- docs/QUALITY_BAR.md
- docs/PROJECT_LEVELS.md
- docs/MODULE_CONTRACT.md
- README.md
- RELEASE_NOTES.md
- src/config/siteMeta.ts
- package.json

检查内容：

用户体验：
1. 用户打开就知道这是干什么的吗？
2. 首屏有清晰价值说明吗？
3. 有示例数据或示例入口吗？
4. 核心功能 30 秒内能体验吗？
5. 所有按钮真实可用吗？
6. 有明显空壳 UI 吗？

兼容性：
7. 移动端正常吗？
8. 深色模式可读吗？
9. 中英文切换完整吗？

文档：
10. 隐私说明清楚吗？
11. README 能让陌生人看懂吗？
12. RELEASE_NOTES 更新了吗？

技术：
13. npm run build 通过吗？
14. self-test 通过吗？
15. preflight 通过吗？
16. 版本号一致吗（package.json、siteMeta、sw.js、manifest、页面底部）？

安全：
17. 没有无意义依赖吗？
18. 没有后端上传代码吗？
19. 没有登录系统吗？
20. 没有残留模板占位符（待办标记、修复标记）吗？

请先输出问题清单，再修复可直接修复的问题，最后给出发布结论。
```

---

## 5. 从 C 级升级到 B 级

```text
请把当前项目从 C 级升级到 B 级。

升级前请先阅读：
- docs/PROJECT_LEVELS.md
- docs/MODULE_MATRIX.md
- docs/MODULE_CONTRACT.md
- docs/QUALITY_BAR.md
- README.md
- RELEASE_NOTES.md
- 当前源码

升级目标：
- 保留现有 C 级功能和 UI 风格。
- 补齐 localStorage 业务封装。
- 增加导入 JSON。
- 增加导出 JSON。
- 增加下载结果文件。
- 增加分享链接。
- 增加错误提示和空状态。
- 增加 self-test.html 和 self-test.js。
- 更新 RELEASE_NOTES.md。
- 更新 README.md 的隐私、自测和发布说明。
- 检查所有按钮真实可用。

限制：
1. 不引入后端、数据库、登录系统。
2. 不上传用户文件。
3. 不引入过重依赖。
4. 不修改 SSH、WARP、防火墙、系统网络配置。

完成后运行 npm run build、self-test 和 preflight，并修复所有错误。
```

---

## 6. 从 B 级升级到 A 级

```text
请把当前项目从 B 级升级到 A 级。

升级前请阅读所有 docs 文档、src/config 配置和当前源码。

升级目标：
- 保留现有 B 级功能。
- 加入 PWA。
- 加入离线提示。
- 支持批处理能力。
- 将工具模块化。
- 整理统一组件库。
- 增加统一设置中心。
- 增加项目健康检查。
- 完善 preflight 脚本。
- 完善 SEO / OpenGraph。
- 增加完整错误边界。
- 补齐完整中英文文案。

限制：
1. 不引入后端、数据库、登录系统。
2. 不上传用户文件。
3. 不把无关业务功能塞进升级任务。
4. 不为炫技引入重依赖。
5. 不修改 SSH、WARP、防火墙、系统网络配置。

完成后运行 npm run build、self-test 和 preflight，并修复所有错误。
```

---

## 7. README 打磨

```text
请打磨当前项目 README.md。

README 必须清楚说明：
- 这个项目是什么（模板还是具体工具）。
- 适合做什么。
- 不适合做什么。
- 当前项目等级。
- 核心功能。
- 本地运行方法。
- GitHub Pages 部署方法。
- 隐私原则。
- 项目结构。
- 自测方法。
- 发布前检查清单。

要求：
- 中文为主，必要时保留英文品牌标签。
- 不夸大功能。
- 不写还没实现的能力。
- 命令和路径必须准确。
- 读者可以照着 README 从零运行项目。
```

---

## 8. UI 质感优化

```text
请优化当前纯前端工具项目的 UI 质感。

目标：
- 保持现有功能不变。
- 卡片式布局、圆角、柔和阴影。
- 提升层级、间距、对比度和响应式体验。
- 移动端必须自然可用。
- 深色模式必须完整。
- 中英文切换后文本不能溢出。
- 所有按钮必须保持真实可用。

限制：
- 不引入重型 UI 框架。
- 不把工具页改成营销落地页。
- 不增加空壳模块。
- 不做无关业务功能。
- 不修改 SSH、WARP、防火墙、系统网络配置。

请先阅读现有 CSS 和组件结构，再做小步、可维护的优化。完成后运行 npm run build。
```

---

## 9. 检查项目是否符合对应等级

```text
请检查当前项目是否符合 [C/B/A] 级项目要求。

请阅读：
- docs/PROJECT_LEVELS.md
- docs/MODULE_MATRIX.md
- docs/QUALITY_BAR.md
- docs/MODULE_CONTRACT.md
- src/config/projectProfiles.ts
- src/config/moduleRegistry.ts
- README.md
- RELEASE_NOTES.md
- 当前源码

检查内容：
- 必须模块是否存在。
- 推荐模块是否合理处理。
- 不建议模块是否被过早加入。
- README 是否准确描述项目定位。
- RELEASE_NOTES 是否准确。
- 按钮是否真实可用。
- 是否存在空壳 UI。
- 是否依赖后端、数据库或登录。
- 是否上传用户文件。
- 版本号是否一致。
- build、self-test、preflight 是否通过。

请先输出问题清单，再修复可直接修复的问题，最后给出等级符合结论。
```

---

## 10. 根据 PROJECT_SPEC_TEMPLATE.md 生成项目计划

```text
请读取 docs/PROJECT_SPEC_TEMPLATE.md，并根据其中填写的内容生成项目实施计划。

输出内容：
- 项目等级判断是否合理。
- 必须启用的模块。
- 推荐启用的模块。
- 可以删除或暂不实现的模块。
- README 需要替换的内容。
- package.json 需要修改的字段。
- GitHub Pages base 建议。
- 第一版最小可发布范围。
- 风险和不做范围。
- 验收检查清单（对照 docs/QUALITY_BAR.md）。

限制：
- 不开始写业务代码。
- 不引入后端、数据库、登录系统。
- 不上传用户文件。

请先给计划，再等确认后再实现。
```

---

## 11. 开源维护文件检查

```text
请检查当前项目的开源维护文件是否完整。

检查内容：
- CONTRIBUTING.md 是否存在且内容完整
- SECURITY.md 是否存在且内容完整
- .github/ISSUE_TEMPLATE/ 下是否有 bug_report.yml、feature_request.yml、docs_improvement.yml
- .github/pull_request_template.md 是否存在
- docs/GITHUB_REPO_SETUP.md 是否存在
- docs/RELEASE_TEMPLATE.md 是否存在
- Starter Wizard 是否能生成 12 项输出物
- npm run release:check 是否通过

请先输出问题清单，再修复缺失项。
```
