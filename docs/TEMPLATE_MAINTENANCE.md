# Template Maintenance Guide

This document explains how to maintain and upgrade the open-tools-starter template.

## siteMeta - Single Source of Truth

`src/config/siteMeta.ts` is the **single source of truth** for project metadata:

- `name` - project name
- `shortName` - short name for PWA
- `version` - current version
- `description` - project description
- `repositoryUrl` - GitHub repository URL
- `demoUrl` - GitHub Pages URL
- `author` - author name
- `license` - license type
- `keywords` - project keywords
- `localStoragePrefix` - prefix for localStorage keys

App.tsx, index.html, preflight, and self-test should read from siteMeta instead of hardcoding values.

## Node.js Version Warning

This project uses **Node.js 20** for GitHub Actions to ensure Vite/React build stability.

> **Note**: GitHub Actions has a known Node.js 20 deprecation warning for internal JavaScript actions. The warning appears in CI logs but does not affect build or test results.

To monitor or handle this warning:

1. Watch for GitHub's `actions/checkout` and `actions/setup-node` release notes.
2. If the warning becomes blocking, consider setting `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true` runner environment variable (requires testing).
3. Do NOT blindly upgrade project Node version to 24 unless local and CI are fully validated.

For local development, use Node.js 20 LTS for best compatibility with the CI environment.

## Version History

| Version | Date | Focus |
|---------|------|-------|
| v0.1.0 | 2026-04 | Foundation: Vite + React + TypeScript, A/B/C level system |
| v0.2.0 | 2026-05 | PWA, SEO, ErrorBoundary, Template Health, enhanced docs |
| v0.2.1 | 2026-05 | Self-Test & Pressure Check system |
| v0.2.2 | 2026-05 | Template Hardening: LICENSE, preview/OG images, siteMeta, enhanced preflight, test:ci |
| v0.2.3 | 2026-05 | Quality Fix: privacy/static false-positive fixes, cross-platform pressure rounds, stronger siteMeta checks |
| v0.2.4 | 2026-05 | Documentation & CI Polish: README scripts sync, siteMeta docs, Node.js 20 warning |

## How to Upgrade Version

1. Update `package.json` version field.
2. Update `src/config/siteMeta.ts` version to match.
3. Update `RELEASE_NOTES.md` with new section.
4. Update `public/sw.js` CACHE_NAME to include new version.
5. Update `public/manifest.webmanifest` version (optional).
6. Update `App.tsx` manifest version if hardcoded.
7. Run pre-release checks (see below).
8. Commit with version tag.
9. Push and verify GitHub Pages deployment.

## Pre-Release Check Procedure

Before each release, run the complete test chain:

```bash
# 1. Version consistency check
npm run preflight

# 2. Static test
npm run test:static

# 3. Config test
npm run test:config

# 4. Docs test
npm run test:docs

# 5. Health test
npm run test:health

# 6. Privacy boundary test
npm run test:privacy

# 7. Usability test
npm run test:usability

# 8. Build
npm run build

# 9. Self-test
npm run self-test

# 10. Dist test
npm run test:dist

# 11. UI contract test
npm run test:ui

# 12. Preflight
npm run preflight

# 13. Full test (no pressure)
npm run test:all

# 14. Pressure test (default 3 rounds)
npm run test:pressure

# 15. CI simulation (with pressure)
npm run test:ci

# 16. Cross-platform 2-round pressure check
npm run test:pressure -- --rounds=2

# 17. Manual verification
# - npm run dev
# - Open http://localhost:5173/self-test.html
# - Check all test groups pass
# - Check theme toggle, language switch work
# - Verify browser console for errors
```

Or simply run:
```bash
npm run test:ci
```

If any test fails, fix before releasing.

## Local and CI Test Order

Recommended local order:

1. `npm ci` or `npm install`
2. `npm run test:static`
3. `npm run test:config`
4. `npm run test:docs`
5. `npm run test:health`
6. `npm run test:privacy`
7. `npm run test:usability`
8. `npm run build`
9. `npm run self-test`
10. `npm run test:dist`
11. `npm run test:ui`
12. `npm run preflight`
13. `npm run test:all`
14. `npm run test:pressure`
15. `npm run test:ci`

GitHub Actions should run the same quality gates before deployment, using `npm run test:pressure -- --rounds=2` for the CI pressure check. WARN output is allowed to continue; FAIL output must stop deployment.

## Profile and Module Registry Sync

When updating module definitions:

1. Edit `src/config/moduleRegistry.ts` - add/remove/modify modules.
2. Edit `src/config/projectProfiles.ts` - update module assignments per level.
3. Run build and verify homepage reflects changes.
4. Update `docs/MODULE_MATRIX.md` if needed.

## README Updates

When making template changes:

1. Update online demo link if GitHub Pages URL changes.
2. Document new capabilities in appropriate sections.
3. Update "当前未做内容" section if scope changes.
4. Update local run / build instructions if needed.

## RELEASE_NOTES Updates

For each release:

1. Create new section `## vX.Y.Z`.
2. List `Added`, `Changed`, `Checks`, `Notes`, `Next`.
3. Keep "Still out of scope" accurate.
4. Update dates.

## GitHub Pages Verification

After each push:

1. Wait for GitHub Actions workflow to complete.
2. Check Pages URL loads correctly.
3. Verify theme toggle, language switch, level cards work.
4. Check browser console for errors.

## Avoiding Template Creep

The template must remain a "starter", not a business project.

Do:

- Keep PWA light, no complex offline logic.
- Keep SEO basic, no heavy meta tag management.
- Keep ErrorBoundary simple, only catch runtime errors.
- Keep Template Health declarative, no actual system checks.

Don't:

- Add business logic (PDF, image processing, file conversion).
- Add login, user accounts, database.
- Add backend API calls.
- Add heavy dependencies.

## Upgrading from v0.1.0 to v0.2.0

Key changes in v0.2.0:

- Added `public/manifest.webmanifest` for PWA installability.
- Added `public/icon.svg` for PWA icons.
- Added `public/sw.js` for lightweight static caching.
- Added `src/lib/registerServiceWorker.ts` for SW registration.
- Added `src/components/ErrorBoundary.tsx` for runtime error catch.
- Added `Template Health` section on homepage.
- Enhanced `index.html` with complete SEO / OpenGraph.
- Added `docs/TEMPLATE_MAINTENANCE.md`.
- Added `docs/COPY_TO_NEW_REPO_CHECKLIST.md`.
- Added `docs/VERSIONING_GUIDE.md`.
- Enhanced `preflight.mjs` to check PWA/SEO files.
- Enhanced `self-test` to verify PWA/SEO presence.

## Upgrading from v0.2.0/v0.2.1 to v0.2.2

Key changes in v0.2.2:

- Added `LICENSE` file (MIT).
- Added `src/config/siteMeta.ts` for unified project metadata.
- Added `docs/assets/preview.svg` for README preview.
- Added `public/og-image.svg` for OpenGraph/Twitter sharing.
- Added `package-lock.json` for consistent installs.
- Refactored `package.json` scripts: added `test:ci`.
- Enhanced `preflight.mjs` checks: LICENSE, version consistency, sw.js cache version, og-image, preview, package-lock.json, test:all, test:ci.
- Enhanced `test-docs.mjs`: adds preview and license checks.
- Updated README with badges and preview image.
- Updated `COPY_TO_NEW_REPO_CHECKLIST.md` with siteMeta and image asset guidance.
- Updated `TEMPLATE_MAINTENANCE.md` with pre-release check procedure.

## Upgrading from v0.2.3 to v0.2.4

Key changes in v0.2.4:

- Updated README scripts/ file list to show all actual test scripts.
- Updated "复制到新项目后的 PWA / SEO 配置" section to prioritize `src/config/siteMeta.ts`.
- Added Node.js 20 warning section in TEMPLATE_MAINTENANCE.md.
- Updated COPY_TO_NEW_REPO_CHECKLIST.md to list siteMeta as the primary config file.
