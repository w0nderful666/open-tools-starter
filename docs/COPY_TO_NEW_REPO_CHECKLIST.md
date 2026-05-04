# Copy to New Repository Checklist

When copying open-tools-starter to create a new project, follow this checklist.

## Must Change Files

### 1. package.json

| Field | Change |
|-------|--------|
| `name` | Rename to new project name (kebab-case) |
| `version` | Reset to `0.1.0` or `1.0.0` |
| `description` | Update to describe new project |
| `author` | Update to your name/email |
| `license` | Update if needed (default: MIT) |
| `repository.url` | Update to new repo URL if known |
| `homepage` | Update to the new GitHub Pages URL |
| `keywords` | Update to project-specific keywords |

### 1.1. src/config/siteMeta.ts (优先)

| Field | Change |
|-------|--------|
| `name` | New project name |
| `shortName` | Short name |
| `version` | Reset to `0.1.0` or `1.0.0` |
| `description` | Project description |
| `repositoryUrl` | New repo URL |
| `demoUrl` | GitHub Pages URL |
| `author` | Your name |
| `license` | MIT or other |
| `keywords` | Project keywords |
| `localStoragePrefix` | New prefix for localStorage keys |

> **优先修改 `src/config/siteMeta.ts`**，这是项目元信息的单一来源。App.tsx、preflight 和 self-test 都从这里读取配置。

### 1.2. Version Consistency

- Ensure `package.json` version matches `src/config/siteMeta.ts` version.
- Ensure `public/sw.js` CACHE_NAME contains the version (e.g., `my-project-v0.1.0`).
- Update `RELEASE_NOTES.md` initial version entry.

### 2. README.md

- [ ] Update title (first line) to new project name.
- [ ] Update description in first paragraph.
- [ ] Update "在线演示" section with new URL.
- [ ] Update project structure section if needed.
- [ ] Update "当前未做内容" to match new project scope.
- [ ] Update any references to `open-tools-starter` in code examples.
- [ ] Update version badge to match `package.json` version.
- [ ] Update License section if using non-MIT license.
- [ ] Update or replace preview image at `docs/assets/preview.svg`.

### 2.1. Image Assets

| File | Change |
|------|--------|
| `docs/assets/preview.svg` | Replace with project-specific preview |
| `public/og-image.svg` | Replace with project-specific OG image |
| `public/icon.svg` | Replace with project icon (optional) |

### 3. index.html

| Element | Change |
|---------|--------|
| `<title>` | New project title |
| `meta[name="description"]` | New project description |
| `meta[name="keywords"]` | New relevant keywords |
| `meta[name="theme-color"]` | Optional new theme color |
| `meta[property="og:title"]` | New OpenGraph title |
| `meta[property="og:description"]` | New OpenGraph description |
| `meta[property="og:url"]` | New GitHub Pages URL |
| `meta[property="og:image"]` | New image URL |
| `meta[name="twitter:title"]` | New Twitter title |
| `meta[name="twitter:description"]` | New Twitter description |
| `meta[name="twitter:image"]` | New Twitter image |
| `<link rel="canonical">` | New canonical URL |

### 4. public/manifest.webmanifest

| Field | Change |
|-------|--------|
| `name` | Full project name |
| `short_name` | Short name for app launcher |
| `description` | Project description |
| `theme_color` | Match index.html theme-color |
| `background_color` | Match light theme background |

### 5. public/sw.js

- [ ] Update `CACHE_NAME` to new version (e.g., `my-new-project-v0.1.0`)
- [ ] Update console messages to reference new project name

### 6. src/lib/registerServiceWorker.ts

- [ ] Update console message to reference new project name

### 7. src/App.tsx

- [ ] Prefer updating `src/config/siteMeta.ts` before editing App directly
- [ ] Verify localStorage keys use `siteMeta.localStoragePrefix`
- [ ] Verify manifest JSON in `useMemo` reads project info from `siteMeta`
- [ ] Update any remaining visible references to open-tools-starter that are specific to the old project

## Files You Can Remove

Depending on chosen C/B/A level:

- `docs/RELEASE_CHECKLIST.md` - optional for C-level
- `docs/NEW_PROJECT_START_GUIDE.md` - optional for C-level
- `docs/PROJECT_SPEC_TEMPLATE.md` - optional for C-level

## Files You Should Keep

- `README.md` - always keep, update content
- `RELEASE_NOTES.md` - always keep, update for new project
- `.github/workflows/pages.yml` - keep for deployment
- `src/config/projectProfiles.ts` - keep but may customize
- `src/config/moduleRegistry.ts` - keep but may customize
- `docs/PROJECT_LEVELS.md` - keep, useful reference
- `docs/MODULE_MATRIX.md` - keep, useful reference

## After Copying

1. Run `npm install`
2. Run `npm run build` - ensure build passes
3. Update GitHub repo settings:
   - Enable GitHub Pages
   - Source: GitHub Actions
4. Push and verify deployment
5. Run browser self-test at `/self-test.html`
6. Run `npm run preflight` to verify health

## PWA/SEO Config Quick Ref

| File | Key Fields to Update |
|------|---------------------|
| `index.html` | title, description, og:* |
| `manifest.webmanifest` | name, short_name, description |
| `sw.js` | CACHE_NAME, console messages |
