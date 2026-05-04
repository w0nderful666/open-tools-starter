# Release Notes

## v0.6.1 - Stable Polish Release / 稳定打磨版

May 2026.

This release polishes v0.6.0 for stable daily use as a reusable open source project template. No new features — only consistency, documentation, and reliability fixes.

Changed:

- **Version**: unified to 0.6.1 across package.json, siteMeta.ts, sw.js CACHE_NAME, manifest.webmanifest, README badge.
- **README.md**: improved hero section with quick-scan structure (What / Who / What You Get / Stable Baseline), screenshot placeholder section, and clearer template positioning.

Checks:

- `npm run build` passes.
- `npm run self-test` passes.
- `npm run preflight` passes.
- `npm run release:check` passes (16/16).
- `npm run test:all` passes.
- `npm run test:ci` passes (2 rounds).
- Version consistency verified across all locations.

## v0.6.0 - Open Source Maintainer Layer / 开源维护者标准层

May 2026.

This release adds the standard open source collaboration layer to open-tools-starter: contribution guidelines, security policy, GitHub issue templates, PR template, release readiness checks, and repo setup documentation. Projects created from this template now ship with everything needed to accept community contributions.

Added:

- **CONTRIBUTING.md**: contribution guidelines covering bug reports, feature requests, PRs, development setup, code style, testing requirements, privacy boundary, and license.
- **SECURITY.md**: security policy documenting the local-first, no-backend architecture and responsible disclosure guidance.
- **`.github/ISSUE_TEMPLATE/bug_report.yml`**: structured GitHub issue form for bug reports (description, steps to reproduce, expected/actual behavior, browser, device, OS, screenshot, mobile issue).
- **`.github/ISSUE_TEMPLATE/feature_request.yml`**: structured GitHub issue form for feature requests (problem, use case, proposed solution, local-first fit, additional context).
- **`.github/ISSUE_TEMPLATE/docs_improvement.yml`**: structured GitHub issue form for documentation improvements (location, problem, suggestion, context).
- **`.github/pull_request_template.md`**: PR template with change type checklist, description, testing instructions, privacy boundary confirmation, and quality checklist.
- **`docs/GITHUB_REPO_SETUP.md`**: manual for setting up a new GitHub repository from this template (description, topics, about section, GitHub Pages, Actions permissions, first release, social preview).
- **`docs/RELEASE_TEMPLATE.md`**: standard GitHub Release template with title, summary, highlights, added/changed/fixed lists, verification commands, known limitations, and links.
- **`scripts/check-release-ready.mjs`**: release readiness check script verifying demo URL in README, version in RELEASE_NOTES, required collaboration files, version consistency across all config files, and package.json metadata (license, homepage, repository).
- **`release:check` npm script**: runs the release readiness check.
- Release check integrated into `test:all` chain (runs after preflight) and GitHub Actions workflow.
- **Preflight**: added CONTRIBUTING.md, SECURITY.md, docs/GITHUB_REPO_SETUP.md, docs/RELEASE_TEMPLATE.md, and scripts/check-release-ready.mjs to required files.
- **Self-test**: added CONTRIBUTING.md and SECURITY.md to required files.

Changed:

- **Version**: unified to 0.6.0 across package.json, siteMeta.ts, sw.js CACHE_NAME, manifest.webmanifest, README badge.
- **test:all** chain now includes `release:check` as the final step after preflight.
- **GitHub Actions workflow** (`pages.yml`): added "Run release check" step after preflight.

## v0.5.0 - Release Candidate: Project Starter System

May 2026.

This release adds the Starter Wizard, create-project scaffold script, and template lock tests, completing the project starter system for open-tools-starter.

Added:

- **Starter Wizard** on homepage: interactive form to generate PROJECT_SPEC.md, OpenCode/Codex prompt, create-project command, README draft, release checklist, and spec JSON in real time.
- Wizard fields: project name, repo slug, project level (C/B/A), description, target user, core pain, core features, non-goals, privacy model, deploy target, text language, localStorage/import-export/share/PWA needs.
- Wizard outputs: Copy and Download buttons for each generated artifact. localStorage persistence across refreshes.
- `scripts/create-project.mjs`: scaffold script that updates package.json, siteMeta.ts, index.html, manifest, sw.js, README, and RELEASE_NOTES. Supports `--dry-run` (default) and `--apply`.
- `scripts/test-scaffold.mjs`: tests for create-project script (existence, dry-run safety, argument validation, apply consistency, privacy boundary).
- `scripts/test-template-lock.mjs`: template lock tests preventing regression (no Text Cleaner / Example Module / Reference Implementation; required sections present; version consistency).
- Added `test:scaffold` and `test:template-lock` npm scripts.
- Added `create:project` npm script.
- Integrated new tests into `test:all` and `test:ci` chains.
- Preflight now checks for Starter Wizard section presence.
- Self-test now verifies StarterWizard component and wizard/flow section markers.
- i18n messages for wizard section in Chinese and English.
- Wizard CSS with responsive layout, mobile support, and dark mode compatibility.

Changed:

- **Version**: unified to 0.5.0 across package.json, siteMeta.ts, sw.js CACHE_NAME, manifest.webmanifest, README badge.
- **Homepage**: added Starter Wizard section between New Project Flow and Quality Bar.
- **Navigation**: added "Wizard" / "向导" nav link.
- **test:all** chain now includes test:template-lock (before build) and test:scaffold (after self-test).
- **preflight.mjs**: added new script files to required files list; added Starter Wizard to required homepage sections.
- **run-self-test.mjs**: added StarterWizard.tsx to required files; added wizard and flow section markers.

## v0.4.1 - Template-only homepage cleanup

May 2026.

This release removes the Example Module / Text Cleaner Mini section from the homepage, making open-tools-starter look like what it is: a project template standard, not a tool page.

Added:

- Quality Bar section on homepage with self-test and preflight cards.
- Starter Resources section on homepage linking to README, NEW_PROJECT_PLAYBOOK, MODULE_CONTRACT, PROJECT_LEVELS, OPENCODE_PRESETS, and QUALITY_BAR.
- `docs/QUALITY_BAR.md` entry in Starter Resources for quick access.
- i18n messages for `quality` and `resources` sections.
- Homepage checks in `preflight.mjs`: no Text Cleaner Mini, no Example Module, no Reference Implementation on homepage.
- Homepage content checks: Open Tools Starter, Local First, No Backend, GitHub Pages Ready, Project Levels, New Project Flow, Quality Bar must appear.
- README check: no concrete business tool promoted as core feature.

Changed:

- **Homepage**: removed Example Module section and Text Cleaner Mini from the primary user-facing path.
- **Homepage**: replaced Example Module area with Quality Bar and Starter Resources sections.
- **i18n**: removed `tools` section (Text Cleaner Mini references). Added `quality` and `resources` sections.
- **README**: further clarified this is a project template / engineering foundation, not a tool collection. Removed "replace example module with real tools" wording.
- All version references updated to v0.4.1.

Removed:

- `src/tools/text-cleaner/` directory (TextCleanerTool, textCleaner.ts, samples.ts, types.ts).
- Text Cleaner Mini registration from `src/tools/toolRegistry.ts`.
- Text Cleaner Mini import and Example Module section from `src/App.tsx`.
- `.example-module-banner`, `.example-module-badge`, `.tool-card-preview`, `.grid--two` CSS classes.
- Self-test markers for `TextCleanerTool`, `tool-card-preview`, and `text-cleaner-mini` in toolRegistry.
- Self-test check for `[data-testid='example-tools']` in critical DOM regions.

Checks:

- `npm run build` passes.
- `npm run self-test` passes.
- `npm run preflight` passes.
- `npm run test:all` passes.
- `npm run test:ci` passes.
- Version consistency verified across package.json, siteMeta.ts, sw.js, manifest.webmanifest, and page footer.

Notes:

- open-tools-starter does not include any built-in business tools. Tools belong in projects created FROM this template.
- Text Cleaner Mini source code has been fully removed. Reference implementations should live in separate example repos.

## v0.4.0

Foundation Template Standardization release (May 2026).

This release repositions open-tools-starter from a "tool collection" to a "foundation template standard." It is not a specific tool project — it is the engineering template for launching new Local-first GitHub Pages tools.

Added:

- `docs/NEW_PROJECT_PLAYBOOK.md` — complete playbook from idea to release.
- `docs/MODULE_CONTRACT.md` — specification for writing real tool modules.
- `docs/QUALITY_BAR.md` — 20-item quality checklist for release readiness.
- Updated `docs/OPENCODE_PRESETS.md` with 4 C/B/A new-project prompts plus release check prompt.
- Updated `docs/PROJECT_LEVELS.md` with clear minimum standards for C/B/A.

Changed:

- **Project repositioning**: open-tools-starter is now explicitly a foundation template, not a tool collection.
- **Text Cleaner Mini** is now labeled as Example Module / Reference Implementation, not a core product feature.
- **README.md**: rewritten to clearly explain template positioning, what it's for, what it's not for, and how to use it.
- **Homepage**: reframed to show "What this starter gives you" instead of "Here's a text cleaner tool."
- **i18n messages**: updated hero, tools, and capabilities sections to reflect template positioning.
- All version references updated to v0.4.0.

Removed:

- No new business tools added (by design).
- Text Cleaner Mini is no longer positioned as a product feature.

Checks:

- `npm run build` passes.
- `npm run self-test` passes.
- `npm run preflight` passes.
- `npm run test:all` passes.
- `npm run test:ci` passes.
- Version consistency verified across package.json, siteMeta.ts, sw.js, manifest.webmanifest, and page footer.

Next:

- v0.5.0 can add more ToolShell components (ToolPanel, ToolActionBar, ToolHistory, ToolStorage).
- Future versions will not add business tools — those belong in projects created FROM this template.

## v0.3.0

First C-Level Example Tool release (May 2026).

Added:

- Added `src/tools/` directory with tool registry structure.
- Added Text Cleaner Mini - first C-level example tool.
- Added tool components: ToolShell, ToolHeader, ToolStats.
- Updated home page to include Example Tool section with Text Cleaner Mini.
- Updated i18n messages for example tools section.
- Updated self-test to check for tool components and TextCleanerTool.
- Updated storage.ts to use generic string keys instead of strict union type.
- Updated usePersistentState hook to work with generic keys.
- Updated preflight to check for Text Cleaner Mini presence.

Features in Text Cleaner Mini:

- Real text cleaning with 9 options (trim, dedupe, zero-width chars, tabs, etc.)
- Input/output areas with localStorage persistence
- Sample data loading (3 samples)
- Statistics display (char/line counts, duplicates, reduction %)
- Copy result, download TXT, clear, reset options
- Recent history (last 5 operations)
- Privacy badges: Local First, No Upload, No Backend, Runs in browser
- Full Chinese/English i18n
- Dark mode support

Changed:

- Updated all version references to v0.3.0.
- Updated README to document the example tool and src/tools directory.
- Updated docs to include tool creation guidelines.

Checks:

- test:all covers all quality gates.
- test:ci includes 2-round pressure test.
- preflight checks tool registry and Text Cleaner presence.
- self-test validates tool components in build output.

## v0.2.4

Documentation & CI Polish release (May 2026).

Added:

- README `scripts/` directory now lists all actual test scripts (preflight.mjs, run-self-test.mjs, test-*.mjs, pressure-test.mjs).
- Node.js 20 warning section in `docs/TEMPLATE_MAINTENANCE.md` explaining CI JS runtime deprecation warning.
- `docs/COPY_TO_NEW_REPO_CHECKLIST.md` now prioritizes `src/config/siteMeta.ts` as single source of truth.
- `docs/TEMPLATE_MAINTENANCE.md` includes siteMeta section and upgrade notes for v0.2.4.

Changed:

- Updated "复制到新项目后的 PWA / SEO 配置" section in README to prioritize `src/config/siteMeta.ts`.
- Updated all version references to v0.2.4 in package.json, siteMeta.ts, sw.js, manifest.webmanifest.
- Version consistency now checks package.json, siteMeta.sw.js, manifest, README badge.
- README v0.2.4 badge now reflects version.

## v0.2.3

Quality Fix / Test Chain Hardening release (May 2026).

Added:

- Cross-platform pressure test rounds via `npm run test:pressure -- --rounds=2`.
- Stronger `siteMeta.ts` field checks in health and preflight scripts.
- package metadata for repository, homepage, and keywords.

Changed:

- Updated package, siteMeta, manifest, Service Worker cache, README badge, preview assets, and OpenGraph image text to v0.2.3.
- `App.tsx` now reads project name, version, demo URL, repository URL, and localStorage prefix from `siteMeta.ts`.
- GitHub Actions now uses the same cross-platform pressure test argument style as `test:ci`.
- Documentation planning wording now uses explicit Roadmap / Planned / Future language instead of ambiguous marker text.

Fixed:

- `test:privacy` no longer self-matches its own detection rules on Windows path separators.
- `test:static` now uses `child_process.spawn` without `shell: true`, avoiding `cmd.exe EPERM` false failures.
- `test:ci` no longer depends on Linux-only inline environment variable syntax.
- Project health no longer misses `src/config/siteMeta.ts` because of absolute path handling.

## v0.2.2

Template Hardening release (May 2026).

Added:

- Unified project meta configuration at `src/config/siteMeta.ts`.
- LICENSE file (MIT) added to repository root.
- Project preview SVG at `docs/assets/preview.svg`.
- OpenGraph image at `public/og-image.svg`.
- Enhanced preflight checks: LICENSE, version consistency, sw.js cache version, og-image, preview, package-lock.json, test:all, test:ci.
- Refactored package.json scripts: `test:all` now covers static, config, docs, build, self-test, dist, preflight. `test:ci` covers full GitHub Actions pipeline including pressure test.

New Test Scripts (v0.2.2):

- `scripts/test-project-health.mjs` - comprehensive project health check with score
- `scripts/test-privacy-boundary.mjs` - scans for external API calls, sensitive data, upload endpoints
- `scripts/test-template-usability.mjs` - validates template can be copied to new projects
- `scripts/test-ui-contract.mjs` - verifies build output and SEO meta

## v0.2.1

Self-Test & Pressure Check release (May 2026).

Added:

- Unified test entry points in package.json.
- Static test, config test, docs test, dist test, pressure test scripts.
- Enhanced preflight to verify new test scripts exist.
- GitHub Actions now runs full test chain.

## v0.2.0

Template enhancement release (May 2026).

Added:

- PWA support: manifest, service worker, icon.
- Complete SEO / OpenGraph configuration.
- ErrorBoundary component.
- Template Health section on homepage.
- Enhanced preflight and self-test.
- New documentation: TEMPLATE_MAINTENANCE, COPY_TO_NEW_REPO_CHECKLIST, VERSIONING_GUIDE.

## v0.1.0

Initial foundation release for Open Tools Starter.

Added:

- Vite + React + TypeScript project skeleton.
- GitHub Pages ready build configuration.
- A / B / C project level system.
- Module matrix documentation.
- opencode preset prompts.
- Release checklist documentation.
- Reusable UI primitives: Button, Card, Modal, Toast, EmptyState, ErrorState, CopyButton, DownloadButton.
- Theme switching with localStorage persistence.
- Chinese / English switching with localStorage persistence.
- Local-first starter homepage.
- Browser self-test entry.
- Command-line self-test smoke script.
