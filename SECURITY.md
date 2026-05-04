# Security Policy

## Project Architecture

Open Tools Starter is a **pure frontend, local-first** project. This means:

- **No user data is uploaded to any server.** All processing happens in the browser.
- **No login system.** There is no authentication, no user accounts, no sessions.
- **No backend.** There is no server, no database, no API endpoints.
- **All data stays in the browser.** User data is stored in `localStorage` and never leaves the device.
- **Static hosting only.** The project is deployed as static files to GitHub Pages.

## Reporting a Vulnerability

If you discover a security concern, please **do not** open a public issue.

Instead, contact the maintainer privately:

- **Email**: [Open a private security advisory on GitHub](https://github.com/w0nderful666/open-tools-starter/security/advisories/new)

We will respond as quickly as possible and work with you to address the issue.

## What to Report

- Cross-site scripting (XSS) vulnerabilities
- Content Security Policy bypasses
- Service Worker cache poisoning
- Any issue that could compromise user data in the browser

## What NOT to Report

- The absence of backend features (this is by design)
- The use of `localStorage` for data persistence (this is intentional)
- The lack of user authentication (this is a core principle)

## Responsible Disclosure

- **DO NOT** paste tokens, verification codes, API keys, or private files in public issues.
- **DO NOT** publicly disclose vulnerabilities before they are resolved.
- **DO** provide enough detail to reproduce the issue.
- **DO** allow reasonable time for a fix before public disclosure.

## Scope

This security policy covers the Open Tools Starter template itself. Projects created from this template are maintained separately and may have their own security policies.
