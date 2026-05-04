import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

const requiredFiles = [
  "README.md",
  "RELEASE_NOTES.md",
  "docs/PROJECT_LEVELS.md",
  "docs/MODULE_MATRIX.md",
  "docs/OPENCODE_PRESETS.md",
  "docs/RELEASE_CHECKLIST.md",
  "docs/NEW_PROJECT_START_GUIDE.md",
  "docs/PROJECT_SPEC_TEMPLATE.md",
  "docs/TEMPLATE_MAINTENANCE.md",
  "docs/COPY_TO_NEW_REPO_CHECKLIST.md",
  "docs/VERSIONING_GUIDE.md",
  "src/App.tsx",
  "src/config/projectProfiles.ts",
  "src/config/moduleRegistry.ts",
  "src/components/Button.tsx",
  "src/components/Card.tsx",
  "src/components/Modal.tsx",
  "src/components/Toast.tsx",
  "src/components/EmptyState.tsx",
  "src/components/ErrorState.tsx",
  "src/components/CopyButton.tsx",
  "src/components/DownloadButton.tsx",
  "src/components/ErrorBoundary.tsx",
  "src/components/StarterWizard.tsx",
  "CONTRIBUTING.md",
  "SECURITY.md",
  "src/lib/storage.ts",
  "src/lib/registerServiceWorker.ts",
  "self-test.html",
  "public/self-test.js",
  "public/manifest.webmanifest",
  "public/icon.svg",
  "public/sw.js",
  "dist/index.html",
  "dist/self-test.html",
  "dist/self-test.js",
];

const requiredSourceMarkers = [
  ["src/App.tsx", "data-testid=\"theme-toggle\""],
  ["src/App.tsx", "data-testid=\"language-toggle\""],
  ["src/App.tsx", "data-testid=\"module-matrix\""],
  ["src/App.tsx", "data-testid=\"selected-profile\""],
  ["src/App.tsx", "data-config-source=\"projectProfiles,moduleRegistry\""],
  ["src/App.tsx", "Local First"],
  ["src/App.tsx", "data-testid=\"template-health\""],
  ["src/App.tsx", "health-grid"],
  ["src/App.tsx", "data-testid=\"capabilities-section\""],
  ["src/App.tsx", "data-testid=\"quality-section\""],
  ["src/App.tsx", "data-testid=\"resources-section\""],
  ["src/components/StarterWizard.tsx", "data-testid=\"starter-wizard\""],
  ["src/App.tsx", "data-testid=\"flow-section\""],
  ["src/components/ErrorBoundary.tsx", "ErrorBoundary"],
  ["src/components/ErrorBoundary.tsx", "data-error-boundary"],
  ["src/lib/registerServiceWorker.ts", "registerServiceWorker"],
  ["src/config/projectProfiles.ts", "C_LEVEL_PROFILE"],
  ["src/config/projectProfiles.ts", "B_LEVEL_PROFILE"],
  ["src/config/projectProfiles.ts", "A_LEVEL_PROFILE"],
  ["src/config/moduleRegistry.ts", "MODULE_REGISTRY"],
  ["src/config/moduleRegistry.ts", "not-recommended"],
  ["src/lib/storage.ts", "isAvailable"],
  ["src/tools/toolRegistry.ts", "registeredTools"],
  ["public/self-test.js", "Theme toggle works"],
  ["public/self-test.js", "Language toggle works"],
  ["public/self-test.js", "A/B/C level cards exist"],
  ["public/self-test.js", "Configuration data is readable"],
  ["public/self-test.js", "Copy button works"],
  ["public/self-test.js", "Download button works"],
  ["public/self-test.js", "Template Health region exists"],
  ["public/self-test.js", "ErrorBoundary root exists"],
  ["public/manifest.webmanifest", "name"],
  ["public/manifest.webmanifest", "theme_color"],
  ["public/sw.js", "CACHE_NAME"],
  ["docs/MODULE_MATRIX.md", "| GitHub Pages 部署 | 必须 | 必须 | 必须 |"],
  ["docs/PROJECT_LEVELS.md", "C 级项目：轻量小工具"],
  ["docs/NEW_PROJECT_START_GUIDE.md", "如何从 open-tools-starter 复制一个新项目"],
  ["docs/PROJECT_SPEC_TEMPLATE.md", "项目等级"],
  ["docs/TEMPLATE_MAINTENANCE.md", "Version History"],
  ["docs/COPY_TO_NEW_REPO_CHECKLIST.md", "Must Change Files"],
  ["docs/VERSIONING_GUIDE.md", "Version Format"],
  ["index.html", "og:title"],
  ["index.html", "theme-color"],
];

async function exists(filePath) {
  await access(path.join(root, filePath));
}

async function assertContains(filePath, marker) {
  const content = await readFile(path.join(root, filePath), "utf8");
  if (!content.includes(marker)) {
    throw new Error(`${filePath} is missing marker: ${marker}`);
  }
}

async function assertDistAssets() {
  const assetDir = path.join(root, "dist", "assets");
  const assets = await readdir(assetDir);
  const hasJs = assets.some((file) => file.endsWith(".js"));
  const hasCss = assets.some((file) => file.endsWith(".css"));
  if (!hasJs || !hasCss) {
    throw new Error("dist/assets must contain built JS and CSS files.");
  }
}

const checks = [
  ...requiredFiles.map((file) => ({
    name: `exists: ${file}`,
    run: () => exists(file),
  })),
  ...requiredSourceMarkers.map(([file, marker]) => ({
    name: `marker: ${file}`,
    run: () => assertContains(file, marker),
  })),
  {
    name: "dist assets include JS and CSS",
    run: assertDistAssets,
  },
];

let failed = 0;

for (const check of checks) {
  try {
    await check.run();
    console.log(`PASS ${check.name}`);
  } catch (error) {
    failed += 1;
    console.error(`FAIL ${check.name}`);
    console.error(error instanceof Error ? error.message : String(error));
  }
}

if (failed > 0) {
  console.error(`Self-test failed: ${failed} check(s) failed.`);
  process.exit(1);
}

console.log("Self-test passed.");
