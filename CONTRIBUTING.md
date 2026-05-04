# Contributing to Open Tools Starter

Thanks for your interest in contributing! This document explains how to participate.

## Welcome

Open Tools Starter is a local-first, privacy-friendly engineering template for building pure frontend GitHub Pages tools. Contributions of all kinds are welcome — bug reports, feature suggestions, documentation improvements, and code.

## How to Report Bugs

1. Check [existing issues](https://github.com/w0nderful666/open-tools-starter/issues) to avoid duplicates.
2. Open a new issue using the **Bug Report** template.
3. Fill in all required fields: description, steps to reproduce, expected behavior, actual behavior, browser, device, and OS.
4. If the bug is mobile-specific, note it in the issue.

## How to Suggest Features

1. Open a new issue using the **Feature Request** template.
2. Describe the problem or pain point, your use case, and proposed solution.
3. Indicate whether the feature fits the **Local First / No Backend** principle.

## How to Submit PRs

1. Fork the repository.
2. Create a feature branch from `main`.
3. Make your changes.
4. Run the full test suite and ensure everything passes:
   ```bash
   npm run test:all
   ```
5. Open a Pull Request using the PR template.
6. Fill in the change type, description, testing details, and privacy boundary confirmation.

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/open-tools-starter.git
cd open-tools-starter

# Install dependencies
npm install

# Start development server
npm run dev

# Run full test suite
npm run test:all

# Build for production
npm run build
```

## Code Style

- **Language**: TypeScript with strict mode.
- **Framework**: React 18 with functional components and hooks.
- **Formatting**: Follow existing code conventions in the project.
- **Components**: Place reusable UI components in `src/components/`.
- **Tools**: Place business tool modules in `src/tools/`.
- **Config**: Project metadata goes in `src/config/siteMeta.ts` (single source of truth).

## Testing Requirements

Before submitting a PR, verify:

```bash
npm run test:all     # Full test suite (must pass)
npm run build        # Production build (must succeed)
npm run self-test    # Command-line self-test (must pass)
```

All tests must pass. The CI pipeline runs the same checks.

## Privacy Boundary

This project strictly follows:

- **No Backend** — no server, no database, no API endpoints.
- **No Login** — no authentication, no user accounts.
- **No Upload** — no user data leaves the browser.
- **Local First** — all processing happens client-side. Data persists in `localStorage`.

Do not introduce backend services, external API calls that transmit user data, login systems, or server-side processing.

## License

This project is licensed under the [MIT License](LICENSE). By contributing, you agree that your contributions will be licensed under the same license.
