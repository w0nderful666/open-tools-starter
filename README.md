# Local Clipboard Vault

[![Version](https://img.shields.io/badge/version-0.1.0-blue)](package.json)
[![Local First](https://img.shields.io/badge/Local_First-true-teal)]()
[![No Backend](https://img.shields.io/badge/No_Backend-true-teal)]()
[![GitHub Pages Ready](https://img.shields.io/badge/GitHub_Pages-Ready-orange)]()

Local Clipboard Vault / 本地剪贴内容保险箱 is a Local First, No Backend, GitHub Pages Ready clipboard workspace. It saves prompts, commands, notes, JSON snippets, Markdown, templates, and token placeholders as small floating cards in the browser.

Live demo: https://w0nderful666.github.io/open-tools-starter/

## Positioning

This is a pure frontend Web tool. It has no backend, no login, no cloud sync, no remote logs, no third-party analytics, and no remote AI title generation. All auto title generation, local type detection, sensitive-content checks, search, JSON import/export, and Secure Vault encryption run in the browser.

## Core Features

- Quick Capture: paste from `navigator.clipboard.readText()` or manual input.
- Ctrl + Enter saves the manual paste box.
- Auto title generation from local rules.
- Local type detection for Prompt, API Key, Token, Command, Note, Template, JSON, Markdown, and Other.
- Floating Cards layout with Copy / Edit / Clone / Delete / Pin / Favorite / Reveal / Hide.
- Search title, content, tags, notes, and type metadata.
- Filters for type, tag, pinned, and favorite.
- Local storage adapter using `localStorage`, ready to migrate to IndexedDB later.
- Secure Vault with Web Crypto API, PBKDF2, AES-GCM, random salt, random iv, and ciphertext payloads.
- JSON import / export with encrypted sensitive payloads kept encrypted.
- Dark mode, mobile responsive layout, and Chinese / English switching.
- Sample data with obvious placeholders only.

## Quick Capture

Click "Paste from clipboard" to read the clipboard, generate a title, detect the type, create timestamps, and save the clip locally. If the browser denies clipboard permission, paste manually into the text area and press Ctrl + Enter.

Clipboard content is never uploaded anywhere.

## Floating Cards

Each clip appears as a small OS-like floating card with title, type badge, updated time, summary, tags, pinned/favorite/sensitive/encrypted states, and real card actions. Clicking a card opens the edit details modal.

## Auto Title And Local Type Detection

Titles are generated locally. The rules prefer the first useful line, cap long titles, and use special titles such as `API Key · HH:mm`, `Token · HH:mm`, `Command · HH:mm`, `JSON Snippet · HH:mm`, and `Markdown Note · HH:mm` for recognized content.

Type detection is also local. It checks command prefixes, JSON parse success, Markdown markers, API key/token markers, prompt-like text, and template placeholders.

No remote AI is used to generate titles.

## Secure Vault

Sensitive clips can be encrypted with the browser native Web Crypto API:

- `crypto.subtle`
- PBKDF2
- AES-GCM
- random `salt`
- random `iv`
- `ciphertext`
- at least 100000 iterations

The master password is never saved. It only lives in memory while the vault is unlocked. Refreshing the page locks the vault again. Forgetting the master password means encrypted content cannot be recovered.

The vault auto-locks after 10 minutes of inactivity. "Lock vault" clears the in-memory password and revealed content immediately.

## Local Storage

Data is stored in `localStorage` under the `local-clipboard-vault` prefix. This is simple and GitHub Pages friendly, but it has browser quota limits. Export JSON backups regularly.

Clearing browser data deletes saved clips. Changing devices does not sync data automatically.

## JSON Import / Export

Export includes all clips. Normal clips export plaintext. Encrypted sensitive clips export only encrypted payload metadata and ciphertext. The master password and unlocked state are never exported.

Import merges records by `id` and accepts the current structure plus older plaintext clip-like records.

## 隐私说明 / Privacy Notes

- 不上传用户内容。
- 数据只保存在当前浏览器。
- 清除浏览器数据会导致内容丢失。
- 换设备不会自动同步。
- 用户应定期导出 JSON 备份。
- 公共电脑不要保存敏感内容。
- 保存 API Key / Token 前应确认设备可信。
- 主密码不保存。
- 忘记主密码无法恢复加密内容。
- 本工具不能防御设备已中毒、恶意浏览器扩展、系统权限被他人控制等情况。

## Local Use

```bash
npm install
npm run build
npm run self-test
npm run preflight
```

## GitHub Pages Deployment

This project is ready for GitHub Pages through the included workflow:

1. Push code to GitHub.
2. In repository Settings -> Pages, choose GitHub Actions.
3. Push to `main` or run the workflow manually.
4. The workflow builds and deploys the static site.

## C-Level Scope

This v0.1.0 launch focuses on a polished single-page local-first utility: fast capture, floating cards, local persistence, import/export, privacy notes, and basic Secure Vault encryption. It does not add backend services, login, cloud sync, database services, remote logging, analytics, or remote AI.

## Known Limitations

- `localStorage` quota varies by browser.
- The master password cannot be recovered.
- Existing legacy sensitive plaintext clips must be re-saved while unlocked to become encrypted.
- Clipboard access requires browser permission and a secure context.
- This tool cannot protect content from compromised devices or malicious browser extensions.

## Roadmap

- Optional IndexedDB adapter.
- Stronger encrypted import migration helpers.
- Keyboard navigation polish for large card walls.
- Optional browser self-test page for core UI actions.
