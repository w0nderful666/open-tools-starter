# GitHub Repository Setup Guide

This guide walks you through setting up a new GitHub repository from the Open Tools Starter template.

## 1. Create the Repository

After copying the template to a new directory and renaming it:

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit from Open Tools Starter"
```

Push to GitHub:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

## 2. Repository Settings

Go to **Settings → General**:

### Description

```
A local-first, privacy-friendly [your tool description]. No backend, no login, no upload.
```

### Website

```
https://YOUR_USERNAME.github.io/YOUR_REPO/
```

### Topics

Add these topics (comma-separated):

```
github-pages, frontend, local-first, no-backend, privacy-friendly, vite, react, typescript
```

Add project-specific topics as needed (e.g., `json-tools`, `text-processing`, `calculator`).

### About Section

Check **"Use your repository's description"** and ensure the website URL is correct.

## 3. License Display

GitHub automatically detects the `LICENSE` file (MIT) and displays it in the repository sidebar. No additional configuration needed.

## 4. Social Preview Image

1. Go to **Settings → General → Social preview**.
2. Upload a social preview image (1280×640 px recommended).
3. The template includes `public/og-image.svg` — you can convert it to PNG for the social preview.

## 5. GitHub Pages

1. Go to **Settings → Pages**.
2. Under **Source**, select **GitHub Actions**.
3. The workflow at `.github/workflows/pages.yml` handles the rest.

## 6. Actions Permissions

1. Go to **Settings → Actions → General**.
2. Under **Workflow permissions**, select **Read and Write permissions**.
3. Check **"Allow GitHub Actions to create and approve pull requests"** (optional).

This allows the deployment workflow to push to `gh-pages` if needed.

## 7. First GitHub Release

After the first successful deployment:

1. Go to **Releases → Create a new release**.
2. Tag: `v0.1.0` (or your initial version).
3. Title: `v0.1.0 - Initial Release`.
4. Use the template from `docs/RELEASE_TEMPLATE.md`.
5. Mark as **"Set as the latest release"**.

## 8. Pin to Profile

Go to your GitHub profile and pin the repository to make it visible to visitors.

## 9. README Top Section

Ensure your README starts with:

1. **Project title** and badges (version, license, platform badges).
2. **Online demo URL** — the GitHub Pages link.
3. **Screenshot** — a visual preview of the tool.
4. **One-line description** — what the tool does and why it exists.

Example:

```markdown
# My Tool Name

[![Version](https://img.shields.io/badge/version-0.1.0-blue)](package.json)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

🔗 **Online Demo**: https://YOUR_USERNAME.github.io/YOUR_REPO/

![Screenshot](docs/assets/preview.svg)

A local-first, privacy-friendly [tool description]. No backend, no login, no upload.
```

## 10. Branch Protection (Optional)

For team projects, consider enabling branch protection on `main`:

1. Go to **Settings → Branches → Add rule**.
2. Branch name pattern: `main`.
3. Enable **"Require pull request reviews before merging"**.
4. Enable **"Require status checks to pass before merging"**.
5. Select the CI workflow as a required check.
