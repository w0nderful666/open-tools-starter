# Module Contract

以后真实工具模块应该怎么写。本文档是规范和示例结构，不包含真实业务工具。

---

## 1. 模块目录结构

每个工具模块放在 `src/tools/<tool-name>/` 下：

```txt
src/tools/<tool-name>/
  index.tsx          # 主组件（默认导出）
  types.ts           # 类型定义
  <tool-name>.ts     # 核心逻辑
  samples.ts         # 示例数据（可选）
  README.md          # 模块说明（可选）
```

---

## 2. 模块命名规范

- 目录名：kebab-case（如 `text-cleaner`、`json-formatter`）
- 组件名：PascalCase + Tool 后缀（如 `TextCleanerTool`）
- 注册 ID：kebab-case（如 `text-cleaner-mini`）
- 文件名：camelCase（如 `textCleaner.ts`）

---

## 3. 输入区规范

- 必须有明确的 `<label>` 关联输入控件。
- textarea / input 必须有 hint text（如 "Enter text..."）。
- 支持从示例数据加载（C 级推荐，B/A 级必须）。
- 支持文件拖拽（B 级推荐，A 级必须）。
- 输入区和输出区必须视觉分离。

---

## 4. 输出区规范

- 结果必须在独立区域展示。
- 无结果时显示空状态（EmptyState）。
- 结果可复制（CopyButton）。
- 结果可下载（B 级必须）。
- 输出区必须有明确标签。

---

## 5. 错误提示规范

- 错误必须可理解，不要只显示 "Error"。
- 错误必须可恢复（提供重试或重置按钮）。
- 使用 ErrorState 组件或等价方案。
- 不要暴露内部堆栈给用户。

---

## 6. localStorage 规范

- 使用 `usePersistentState` hook 或等价方案。
- 键名使用 `siteMeta.localStoragePrefix` 前缀。
- 格式：`<prefix>.<tool-name>:<key>`。
- 示例：`my-tool.text-cleaner:input`。
- 不存储敏感信息。
- 处理 localStorage 不可用的情况。

---

## 7. 导入导出规范

**导入（B 级必须）：**

- 支持 JSON 文件导入。
- 导入前验证格式。
- 导入失败给出明确提示。
- 不自动覆盖现有数据，先确认。

**导出（B 级必须）：**

- 支持导出为 JSON 文件。
- 文件名包含工具名和日期。
- 导出内容包含版本号。

---

## 8. 复制/下载按钮规范

**复制：**

- 使用 CopyButton 组件或等价方案。
- 复制成功显示 Toast 提示。
- 复制失败提供手动选择文本的回退方案。

**下载：**

- 使用 DownloadButton 组件或等价方案。
- 下载文件名有意义（不要叫 `download.txt`）。
- 下载成功显示 Toast 提示。

---

## 9. 隐私提示规范

- 工具页面应显示隐私徽章（Local First / No Upload / No Backend）。
- 处理文件时明确说明"在浏览器本地处理，不上传到服务器"。
- 不引入外部 API 调用（除非明确说明且可选）。

---

## 10. 自测覆盖规范

**C 级（可选）：**

- 浏览器打开工具页面正常
- 核心功能可执行
- 复制按钮可用

**B/A 级（必须）：**

- self-test.html 覆盖关键 DOM
- 覆盖导入导出链路
- 覆盖复制下载链路
- 覆盖错误状态
- 覆盖 localStorage 持久化

---

## 11. 移动端适配规范

- 输入区和输出区在小屏幕上垂直堆叠。
- 按钮不溢出屏幕。
- 文本不截断（除非有意 truncation）。
- 触摸目标至少 44px。
- 不依赖 hover 状态作为唯一交互方式。

---

## 12. 中英文文案规范

- 所有用户可见文案必须支持中英文切换。
- 不混用中英文（除非是品牌名或技术术语）。
- 使用 i18n/messages.ts 中的 messages 系统。
- hint text 也要翻译。
- Toast 提示也要翻译。
- 错误信息也要翻译。

---

## 示例模块结构（参考）

```tsx
// src/tools/my-tool/index.tsx
import { useState } from "react";
import { ToolShell } from "@/components/tools/ToolShell";
import { ToolHeader } from "@/components/tools/ToolHeader";
import { CopyButton } from "@/components/CopyButton";
import { EmptyState } from "@/components/EmptyState";

export function MyTool() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  const handleProcess = () => {
    // 核心逻辑
    setResult(input.toUpperCase());
  };

  return (
    <ToolShell>
      <ToolHeader
        name="My Tool"
        description="A simple example tool"
        level="C"
        localFirst={true}
        noBackend={true}
        language="en"
      />

      <div className="tool-input">
        <label htmlFor="my-input">Input</label>
        <textarea
          id="my-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={6}
        />
      </div>

      <div className="tool-actions">
        <button onClick={handleProcess}>Process</button>
      </div>

      <div className="tool-output">
        <label htmlFor="my-output">Output</label>
        {result ? (
          <>
            <textarea id="my-output" readOnly value={result} rows={6} />
            <CopyButton label="Copy" text={result} />
          </>
        ) : (
          <EmptyState title="Waiting" body="Enter text and click Process" />
        )}
      </div>
    </ToolShell>
  );
}
```
