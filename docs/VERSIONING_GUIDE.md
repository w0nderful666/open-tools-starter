# Versioning Guide

This guide explains the versioning strategy for open-tools-starter.

## Version Format

Format: `vMAJOR.MINOR.PATCH`

- **MAJOR**: Incompatible template changes (rare, should not happen)
- **MINOR**: New capabilities while maintaining backward compatibility
- **PATCH**: Bug fixes, documentation updates, small improvements

## Release Cadence

| Version | Type | When |
|---------|------|------|
| v0.1.0 | Minor | Initial foundation (April 2026) |
| v0.2.0 | Minor | PWA, SEO, ErrorBoundary, Health (May 2026) |
| v0.2.3 | Patch | Quality Fix / Test Chain Hardening (May 2026) |
| v0.3.0 | Minor | First C-level example project (May 2026) |
| v0.4.0 | Minor | Foundation Template Standardization (May 2026) |
| v0.4.1 | Patch | Template-only homepage cleanup (May 2026) |
| v0.5.0 | Minor | Project Starter System: Wizard, create-project, template lock (May 2026) |

## v1.0.0 Conditions

The template reaches v1.0.0 when:

1. Starter Wizard generates all 6 artifacts reliably
2. create-project script works across Windows and Linux
3. Template lock tests prevent all known regressions
4. Full test chain passes on CI without flaky failures
5. At least one real project has been created from the template using the Wizard + create-project flow

## Version Focus Areas

### v0.1.0: Foundation

Goal: Establish reusable template skeleton.

- Vite + React + TypeScript skeleton
- A/B/C project level system
- Profile and Module Registry
- Basic UI components
- Theme and i18n
- GitHub Pages configuration
- GitHub Actions workflow
- Basic self-test and preflight

### v0.2.0: Template Enhancement

Goal: Add template-level quality features.

- PWA: manifest, service worker, icon
- SEO: Complete OpenGraph and meta tags
- ErrorBoundary: Runtime error catching
- Template Health: Homepage capability display
- Enhanced preflight: Check PWA/SEO files
- Enhanced self-test: Verify PWA/SEO presence
- New documentation: Maintenance, Copy Checklist, Version Guide

### v0.2.3: Quality Fix / Test Chain Hardening

Goal: Make the template quality gates reliable across local Windows development and Linux GitHub Actions.

- Fix privacy test self-matches from rule definitions and Windows path separators
- Replace shell-based static syntax checks with `spawn`-based Node checks
- Make pressure test rounds configurable with CLI args instead of Linux-only env syntax
- Strengthen `siteMeta.ts`, package metadata, release notes, Service Worker, and manifest version checks
- Keep GitHub Actions aligned with `test:ci` while preserving explicit quality gate steps

### v0.3.0: First Example Project

Goal: Provide a working C-level example.

- Add first C-level example tool (e.g., simple text helper)
- Demonstrate real button actions
- Show README template for business project
- Keep template separate from example

### v0.4.0: Foundation Template Standardization

Goal: Reposition as engineering template standard, not a tool collection.

- Reposition project: template, not tool collection
- Label Text Cleaner Mini as Example Module / Reference Implementation
- Rewrite README to clearly explain template positioning
- Add NEW_PROJECT_PLAYBOOK.md (idea → release playbook)
- Add MODULE_CONTRACT.md (spec for writing real tool modules)
- Add QUALITY_BAR.md (20-item quality checklist)
- Update OPENCODE_PRESETS.md with C/B/A prompts and release check prompt
- Update PROJECT_LEVELS.md with clear C/B/A minimum standards
- Reframe homepage to show "what the starter gives you"
- Update i18n to reflect template positioning

### v0.4.1: Template-only Homepage Cleanup

Goal: Remove Example Module / Text Cleaner Mini from homepage and user-facing path.

- Remove Example Module section from homepage
- Remove Text Cleaner Mini source code from template
- Add Quality Bar and Starter Resources sections to homepage
- Strengthen test scripts to prevent business-tool messaging from leaking into starter homepage
- Update README to clarify template-only positioning
- Ensure all version references are consistent at v0.4.1

### v0.5.0: Project Starter System

Goal: Complete the project creation workflow with Wizard, scaffold script, and template lock tests.

- Add Starter Wizard to homepage: interactive form generating PROJECT_SPEC, OpenCode prompt, create-project command, README draft, release checklist, and spec JSON
- Add `scripts/create-project.mjs` with dry-run/apply modes
- Add `scripts/test-scaffold.mjs` testing the scaffold system
- Add `scripts/test-template-lock.mjs` preventing template regression
- Integrate new tests into test:all and test:ci chains
- Update preflight and self-test to verify wizard presence
- Update documentation: README, RELEASE_NOTES, VERSIONING_GUIDE, NEW_PROJECT_PLAYBOOK, QUALITY_BAR, OPENCODE_PRESETS

## Writing RELEASE_NOTES

Each release should include:

```markdown
## vX.Y.Z

[Date]

Added:
- [New feature 1]
- [New feature 2]

Changed:
- [Behavior change 1]

Checks:
- [Test updates]
- [Build improvements]

Notes:
- [Known limitations]
- [Migration notes]

Next:
- [Planned for next version]
```

## What Belongs in Template vs Business Project

The template should never include:

- Actual business logic (PDF processing, image manipulation)
- File upload endpoints
- Backend services
- User authentication
- Database connections

These belong in projects created FROM the template, not in the template itself.

## Semantic Versioning Exceptions

This is a template, not a library. We use relaxed semver:

- MINOR versions may add new capabilities without guaranteed backward compatibility
- PATCH may include breaking bug fixes if necessary
- We prioritize template simplicity over strict API stability

## Updating Version

1. Update `package.json` version
2. Update `src/config/siteMeta.ts` version
3. Update `RELEASE_NOTES.md`
4. Update `public/sw.js` CACHE_NAME if changed
5. Update `public/manifest.webmanifest` version
6. Update README badge and preview/OG image version text if needed
7. Create Git tag
8. Push and verify deployment
