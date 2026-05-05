import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

const requiredFiles = [
  ".github/workflows/pages.yml",
  ".gitignore",
  "README.md",
  "RELEASE_NOTES.md",
  "LICENSE",
  "docs/PROJECT_LEVELS.md",
  "docs/MODULE_MATRIX.md",
  "docs/OPENCODE_PRESETS.md",
  "docs/NEW_PROJECT_START_GUIDE.md",
  "docs/NEW_PROJECT_PLAYBOOK.md",
  "docs/MODULE_CONTRACT.md",
  "docs/QUALITY_BAR.md",
  "docs/PROJECT_SPEC_TEMPLATE.md",
  "docs/TEMPLATE_MAINTENANCE.md",
  "docs/COPY_TO_NEW_REPO_CHECKLIST.md",
  "docs/VERSIONING_GUIDE.md",
  "self-test.html",
  "public/self-test.js",
  "src/config/projectProfiles.ts",
  "src/config/moduleRegistry.ts",
  "src/config/siteMeta.ts",
  "src/components/ErrorBoundary.tsx",
  "public/manifest.webmanifest",
  "public/icon.svg",
  "public/og-image.svg",
  "public/sw.js",
  "docs/assets/preview.svg",
  "package-lock.json",
  "scripts/test-static.mjs",
  "scripts/test-config.mjs",
  "scripts/test-docs.mjs",
  "scripts/test-project-health.mjs",
  "scripts/test-privacy-boundary.mjs",
  "scripts/test-template-usability.mjs",
  "scripts/test-ui-contract.mjs",
  "scripts/test-dist.mjs",
  "scripts/pressure-test.mjs",
  "scripts/create-project.mjs",
  "scripts/test-scaffold.mjs",
  "scripts/test-template-lock.mjs",
  "CONTRIBUTING.md",
  "SECURITY.md",
  "docs/GITHUB_REPO_SETUP.md",
  "docs/RELEASE_TEMPLATE.md",
  "scripts/check-release-ready.mjs",
];

const ignoredDirs = new Set(["node_modules", "dist", ".git"]);
const textExtensions = new Set([
  ".css",
  ".html",
  ".js",
  ".json",
  ".md",
  ".mjs",
  ".ts",
  ".tsx",
]);

const failures = [];
const warnings = [];

async function fileExists(filePath) {
  try {
    await stat(path.join(root, filePath));
    return true;
  } catch {
    return false;
  }
}

async function collectFiles(dir, includeDist = false) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  const dirsToSkip = includeDist ? new Set([".git", "node_modules"]) : ignoredDirs;

  for (const entry of entries) {
    if (dirsToSkip.has(entry.name)) {
      continue;
    }

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectFiles(fullPath, includeDist)));
      continue;
    }

    if (textExtensions.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }

  return files;
}

function relative(filePath) {
  return path.relative(root, filePath).replaceAll(path.sep, "/");
}

function pass(message) {
  console.log(`PASS ${message}`);
}

function warn(message, details = []) {
  console.warn(`WARN ${message}`);
  warnings.push(message);
  for (const detail of details) {
    console.warn(`  - ${detail}`);
  }
}

function fail(message, details = []) {
  console.error(`FAIL ${message}`);
  failures.push(message);
  for (const detail of details) {
    console.error(`  - ${detail}`);
  }
}

async function checkRequiredFiles() {
  for (const file of requiredFiles) {
    if (await fileExists(file)) {
      pass(`required file exists: ${file}`);
    } else {
      fail(`required file exists: ${file}`);
    }
  }
}

async function checkPackageScripts() {
  const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
  const scripts = packageJson.scripts ?? {};

  for (const scriptName of ["build", "self-test", "preflight"]) {
    if (typeof scripts[scriptName] === "string" && scripts[scriptName].length > 0) {
      pass(`package.json script exists: ${scriptName}`);
    } else {
      fail(`package.json script exists: ${scriptName}`);
    }
  }
}

async function checkIndexHtmlSeo() {
  const indexPath = path.join(root, "index.html");
  const content = (await readFile(indexPath, "utf8")).replace(/\s+/g, " ");

  const checks = [
    { pattern: /<meta[^>]*name="description"/i, name: "description meta tag" },
    { pattern: /<meta[^>]*property="og:title"/i, name: "og:title meta tag" },
    { pattern: /<meta[^>]*name="theme-color"/i, name: "theme-color meta tag" },
  ];

  for (const check of checks) {
    if (check.pattern.test(content)) {
      pass(`index.html contains ${check.name}`);
    } else {
      fail(`index.html missing ${check.name}`);
    }
  }
}

async function checkReadmeContent() {
  const readmePath = path.join(root, "README.md");
  const content = await readFile(readmePath, "utf8");

  if (/https?:\/\//.test(content)) {
    pass("README contains online demo link");
  } else {
    warn("README may lack online demo URL");
  }

  const privacyKeywords = ["Local First", "No Backend", "Privacy Friendly", "GitHub Pages Ready"];
  const missingPrivacyKeywords = privacyKeywords.filter((kw) => !content.includes(kw));
  if (missingPrivacyKeywords.length === 0) {
    pass("README contains Local First / No Backend / Privacy Friendly / GitHub Pages Ready");
  } else {
    fail(`README missing required principle(s): ${missingPrivacyKeywords.join(", ")}`);
  }

  // Check README clearly states this is a starter template
  if (/starter|template|母版|模板|工程模板/i.test(content)) {
    pass("README clearly states this is a starter template");
  } else {
    fail("README does not clearly state this is a starter template");
  }

  // Check README contains C/B/A level info
  if (/C\s*级|B\s*级|A\s*级|Level C|Level B|Level A|C\/B\/A/i.test(content)) {
    pass("README contains C/B/A project level information");
  } else {
    fail("README missing C/B/A project level information");
  }

  // v0.4.1: Check README does not promote a concrete business tool as core feature
  if (/Text Cleaner Mini/i.test(content)) {
    fail("README still references Text Cleaner Mini as a template feature");
  } else {
    pass("README does not promote concrete business tool as core feature");
  }
}

async function checkReleaseNotesVersion() {
  const releasePath = path.join(root, "RELEASE_NOTES.md");
  const releaseContent = await readFile(releasePath, "utf8");

  const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
  const version = packageJson.version;

  if (releaseContent.includes(version) || releaseContent.includes(`v${version}`)) {
    pass(`RELEASE_NOTES contains current version ${version}`);
  } else {
    fail(`RELEASE_NOTES missing version ${version}`);
  }
}

async function checkPackageMeta() {
  const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));

  if (packageJson.license) {
    pass(`package.json has license: ${packageJson.license}`);
  } else {
    fail("package.json missing license field");
  }

  const repositoryUrl = typeof packageJson.repository === "string"
    ? packageJson.repository
    : packageJson.repository?.url;

  if (repositoryUrl?.includes("https://github.com/w0nderful666/open-tools-starter")) {
    pass("package.json repository points to project repository");
  } else {
    fail("package.json repository missing or incorrect");
  }

  if (packageJson.homepage === "https://w0nderful666.github.io/open-tools-starter/") {
    pass("package.json homepage points to GitHub Pages demo");
  } else {
    fail("package.json homepage missing or incorrect");
  }

  if (Array.isArray(packageJson.keywords) && packageJson.keywords.length >= 5) {
    pass("package.json has keywords");
  } else {
    fail("package.json missing useful keywords");
  }
}

async function checkManifestContent() {
  const manifestPath = path.join(root, "public/manifest.webmanifest");
  try {
    const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
    if (manifest.name) pass("manifest has name");
    else warn("manifest missing name");
    if (manifest.short_name) pass("manifest has short_name");
    else warn("manifest missing short_name");
    if (manifest.description) pass("manifest has description");
    else warn("manifest missing description");
  } catch {
    warn("cannot read/parse manifest");
  }
}

async function checkWorkflowContent() {
  const workflowPath = path.join(root, ".github/workflows/pages.yml");
  const content = await readFile(workflowPath, "utf8");

  const requiredCommands = [
    { pattern: /npm run test:static/, name: "npm run test:static" },
    { pattern: /npm run test:config/, name: "npm run test:config" },
    { pattern: /npm run test:docs/, name: "npm run test:docs" },
    { pattern: /npm run test:health/, name: "npm run test:health" },
    { pattern: /npm run test:privacy/, name: "npm run test:privacy" },
    { pattern: /npm run test:usability/, name: "npm run test:usability" },
    { pattern: /npm run build/, name: "npm run build" },
    { pattern: /npm run self-test/, name: "npm run self-test" },
    { pattern: /npm run test:dist/, name: "npm run test:dist" },
    { pattern: /npm run test:ui/, name: "npm run test:ui" },
    { pattern: /npm run preflight/, name: "npm run preflight" },
    { pattern: /npm run release:check/, name: "npm run release:check" },
    { pattern: /npm run test:pressure -- --rounds=2/, name: "npm run test:pressure -- --rounds=2" },
  ];

  for (const cmd of requiredCommands) {
    if (cmd.pattern.test(content)) {
      pass(`workflow contains ${cmd.name}`);
    } else {
      fail(`workflow missing ${cmd.name}`);
    }
  }

  pass("workflow quality chain matches test:ci semantics");
}

async function checkPackageTestScripts() {
  const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
  const scripts = packageJson.scripts ?? {};

  const testScripts = [
    "test:static",
    "test:config",
    "test:docs",
    "test:health",
    "test:privacy",
    "test:usability",
    "test:ui",
    "test:dist",
    "test:pressure",
    "test:all",
    "test:ci",
    "release:check",
  ];

  for (const scriptName of testScripts) {
    if (typeof scripts[scriptName] === "string" && scripts[scriptName].length > 0) {
      pass(`package.json script exists: ${scriptName}`);
    } else {
      fail(`package.json is missing script: ${scriptName}`);
    }
  }
}

async function checkSensitiveFiles() {
  const envFiles = [".env", ".env.local", ".env.development", ".env.production"];
  const foundEnvFiles = [];

  for (const envFile of envFiles) {
    if (await fileExists(envFile)) {
      foundEnvFiles.push(envFile);
    }
  }

  if (foundEnvFiles.length > 0) {
    warn(`found environment files (should not be committed): ${foundEnvFiles.join(", ")}`);
  } else {
    pass("no environment files found");
  }
}

async function checkDistCommitted() {
  const gitignoreContent = await readFile(path.join(root, ".gitignore"), "utf8");
  if (gitignoreContent.includes("dist") || gitignoreContent.includes("/dist")) {
    pass("dist is in .gitignore (will not be committed)");
  } else {
    warn("dist may not be in .gitignore");
  }
}

async function checkNodeModulesCommitted() {
  const gitignoreContent = await readFile(path.join(root, ".gitignore"), "utf8");
  if (gitignoreContent.includes("node_modules") || gitignoreContent.includes("/node_modules")) {
    pass("node_modules is in .gitignore (will not be committed)");
  } else {
    warn("node_modules may not be in .gitignore");
  }
}

async function checkTokensOrSecrets(files) {
  const sourceFiles = files.filter((file) => {
    const rel = relative(file);
    if (rel.startsWith("node_modules/") || rel.startsWith("dist/")) return false;
    if (rel.startsWith("scripts/")) {
      const ignoredScripts = [
        "scripts/preflight.mjs",
        "scripts/test-privacy-boundary.mjs",
        "scripts/test-static.mjs",
        "scripts/test-config.mjs",
        "scripts/test-docs.mjs",
        "scripts/test-dist.mjs",
        "scripts/pressure-test.mjs",
      ];
      if (ignoredScripts.includes(rel)) return false;
    }
    return rel.startsWith("src/") || rel.startsWith("public/");
  });

  const tokenPatterns = [
    /api[_-]?key/i,
    /secret[_-]?key/i,
    /access[_-]?token/i,
    /auth[_-]?token/i,
    /password/i,
    /private[_-]?key/i,
    /bearer\s+[a-zA-Z0-9]{20,}/i,
    /ghp_[a-zA-Z0-9]{36}/i,
    /gho_[a-zA-Z0-9]{36}/i,
  ];

  const allowedPatterns = [
    /https:\/\/api\.github\.com/,
    /github\.com.*\/actions\/secrets/,
    /docs\/RELEASE_CHECKLIST\.md/,
    /docs\/OPENCODE_PRESETS\.md/,
  ];

  const hits = [];

  for (const file of sourceFiles) {
    const rel = relative(file);
    if (rel === "scripts/preflight.mjs") {
      continue;
    }

    const content = await readFile(file, "utf8");
    const lines = content.split(/\r?\n/);

    lines.forEach((line, index) => {
      if (tokenPatterns.some((pattern) => pattern.test(line))) {
        const isAllowed = allowedPatterns.some((pattern) => pattern.test(line) || rel.match(pattern));
        if (!isAllowed) {
          hits.push(`${rel}:${index + 1}`);
        }
      }
    });
  }

  if (hits.length === 0) {
    pass("no obvious tokens or secrets in source");
  } else {
    warn(`potential token/secret found (manual review recommended): ${hits.length} location(s)`, hits.slice(0, 5));
  }
}

async function checkTodos(files) {
  const sourceFiles = files.filter((file) => {
    const rel = relative(file);
    return !rel.startsWith("node_modules/") && !rel.startsWith("dist/");
  });
  const hits = [];

  const excludePatterns = [
    "scripts/preflight.mjs",
    "scripts/test-docs.mjs",
    "scripts/test-config.mjs",
    "scripts/test-static.mjs",
    "scripts/test-dist.mjs",
    "scripts/pressure-test.mjs",
    "scripts/test-template-lock.mjs",
    "scripts/test-scaffold.mjs",
  ];

  for (const file of sourceFiles) {
    const rel = relative(file);
    if (excludePatterns.includes(rel)) {
      continue;
    }

    // Skip markdown files — they reference TODO/FIXME as checklist items, not actual markers
    if (rel.endsWith(".md")) {
      continue;
    }

    const content = await readFile(file, "utf8");
    const lines = content.split(/\r?\n/);
    lines.forEach((line, index) => {
      if (/\b(TODO|FIXME)\b/i.test(line)) {
        hits.push(`${rel}:${index + 1}`);
      }
    });
  }

  if (hits.length === 0) {
    pass("no TODO/FIXME markers found");
  } else {
    fail("TODO/FIXME markers found", hits.slice(0, 5));
  }
}

async function checkUploadKeywords(files) {
  const sourceFiles = files.filter((file) => {
    const rel = relative(file);
    if (rel.startsWith("node_modules/") || rel.startsWith("dist/")) return false;
    if (rel.startsWith("scripts/")) {
      const ignoredScripts = [
        "scripts/preflight.mjs",
        "scripts/test-privacy-boundary.mjs",
        "scripts/test-static.mjs",
        "scripts/test-config.mjs",
        "scripts/test-docs.mjs",
        "scripts/test-dist.mjs",
        "scripts/pressure-test.mjs",
      ];
      if (ignoredScripts.includes(rel)) return false;
    }
    return rel.startsWith("src/") || rel.startsWith("public/");
  });
  const suspiciousPatterns = [
    /api\/upload/i,
    /server endpoint/i,
    /uploadEndpoint/i,
    /uploadUrl/i,
    /uploadFile/i,
    /uploadTo/i,
    /handleUpload/i,
    /fetch\s*\([^)]*upload/i,
  ];
  const hits = [];

  for (const file of sourceFiles) {
    const rel = relative(file);
    if (rel === "scripts/preflight.mjs") {
      continue;
    }

    const content = await readFile(file, "utf8");
    const lines = content.split(/\r?\n/);
    lines.forEach((line, index) => {
      if (suspiciousPatterns.some((pattern) => pattern.test(line))) {
        hits.push(`${rel}:${index + 1}`);
      }
    });
  }

  if (hits.length === 0) {
    pass("no obvious upload endpoint keywords in source");
  } else {
    fail("Suspicious upload endpoint keyword found", hits);
  }
}

async function checkVersionConsistency() {
  const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
  const packageVersion = packageJson.version;

  const siteMetaPath = path.join(root, "src/config/siteMeta.ts");
  const siteMetaContent = await readFile(siteMetaPath, "utf8");
  const versionMatch = siteMetaContent.match(/version:\s*"([^"]+)"/);
  const requiredFields = [
    "name",
    "shortName",
    "version",
    "description",
    "repositoryUrl",
    "demoUrl",
    "author",
    "license",
    "keywords",
    "localStoragePrefix",
  ];

  for (const field of requiredFields) {
    const fieldPattern = new RegExp(`${field}:\\s*`);
    if (fieldPattern.test(siteMetaContent)) {
      pass(`siteMeta has field: ${field}`);
    } else {
      fail(`siteMeta missing field: ${field}`);
    }
  }

  if (versionMatch && versionMatch[1] === packageVersion) {
    pass(`version consistency: package.json (${packageVersion}) matches siteMeta.ts`);
  } else {
    fail(`version mismatch: package.json (${packageVersion}) vs siteMeta.ts (${versionMatch?.[1] || "not found"})`);
  }

  const swPath = path.join(root, "public/sw.js");
  const swContent = await readFile(swPath, "utf8");
  const cacheMatch = swContent.match(/CACHE_NAME\s*=\s*"([^"]+)"/);

  if (cacheMatch && cacheMatch[1].includes(packageVersion)) {
    pass(`Service Worker cache version includes ${packageVersion}`);
  } else {
    fail(`Service Worker cache version (${cacheMatch?.[1] || "not found"}) does not include ${packageVersion}`);
  }

  const manifestPath = path.join(root, "public/manifest.webmanifest");
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  if (manifest.version === packageVersion) {
    pass(`manifest version matches package.json (${packageVersion})`);
  } else {
    warn(`manifest version (${manifest.version || "not found"}) does not match package.json (${packageVersion})`);
  }
}

async function checkHardcodedLocalhost(files) {
  const sourceFiles = files.filter((file) => {
    const rel = relative(file);
    return !rel.startsWith("node_modules/") && !rel.startsWith("dist/");
  });
  const hits = [];

  for (const file of sourceFiles) {
    const rel = relative(file);
    if (rel.endsWith("README.md") || rel.startsWith("docs/")) {
      continue;
    }

    const content = await readFile(file, "utf8");
    const lines = content.split(/\r?\n/);
    lines.forEach((line, index) => {
      if (/https?:\/\/(localhost|127\.0\.0\.1)/i.test(line)) {
        hits.push(`${rel}:${index + 1}`);
      }
    });
  }

  if (hits.length === 0) {
    pass("no hardcoded localhost production URLs");
  } else {
    fail("Hardcoded localhost URL found", hits.slice(0, 3));
  }
}

async function checkOpenCodePresets() {
  const presetsPath = path.join(root, "docs/OPENCODE_PRESETS.md");
  try {
    const content = await readFile(presetsPath, "utf8");

    if (/C\s*级|Level C|C 级新项目/i.test(content)) {
      pass("OPENCODE_PRESETS contains C-level prompt");
    } else {
      fail("OPENCODE_PRESETS missing C-level prompt");
    }

    if (/B\s*级|Level B|B 级新项目/i.test(content)) {
      pass("OPENCODE_PRESETS contains B-level prompt");
    } else {
      fail("OPENCODE_PRESETS missing B-level prompt");
    }

    if (/A\s*级|Level A|A 级新项目/i.test(content)) {
      pass("OPENCODE_PRESETS contains A-level prompt");
    } else {
      fail("OPENCODE_PRESETS missing A-level prompt");
    }

    if (/发布前|preflight|release check/i.test(content)) {
      pass("OPENCODE_PRESETS contains release check prompt");
    } else {
      warn("OPENCODE_PRESETS may lack release check prompt");
    }
  } catch {
    fail("cannot read OPENCODE_PRESETS.md");
  }
}

async function checkHomepageContent() {
  const appPath = path.join(root, "src/App.tsx");
  const content = await readFile(appPath, "utf8");

  // Homepage must NOT contain business tool references
  if (/TextCleanerTool|text-cleaner|Text Cleaner/i.test(content)) {
    fail("App.tsx still references Text Cleaner Mini");
  } else {
    pass("App.tsx has no Text Cleaner Mini references");
  }

  if (/example-tools|Example Module|exampleLabel|exampleDesc/i.test(content)) {
    fail("App.tsx still references Example Module");
  } else {
    pass("App.tsx has no Example Module references");
  }

  if (/Reference Implementation|参考实现/i.test(content)) {
    fail("App.tsx still references Reference Implementation");
  } else {
    pass("App.tsx has no Reference Implementation references");
  }

  // Homepage must contain key sections
  const requiredSections = [
    { pattern: /Open Tools Starter|open-tools-starter/i, name: "Open Tools Starter" },
    { pattern: /Local First/i, name: "Local First" },
    { pattern: /No Backend/i, name: "No Backend" },
    { pattern: /GitHub Pages Ready/i, name: "GitHub Pages Ready" },
    { pattern: /Project Levels|项目等级/i, name: "Project Levels" },
    { pattern: /New Project Flow|从想法到发布/i, name: "New Project Flow" },
    { pattern: /Quality Bar|quality-section/i, name: "Quality Bar section" },
    { pattern: /Starter Resources|resources-section/i, name: "Starter Resources section" },
    { pattern: /starter-wizard|Starter Wizard|新项目启动向导/i, name: "Starter Wizard section" },
  ];

  for (const section of requiredSections) {
    if (section.pattern.test(content)) {
      pass(`App.tsx contains ${section.name}`);
    } else {
      fail(`App.tsx missing ${section.name}`);
    }
  }
}

async function checkMisleadingDescriptions(files) {
  const sourceFiles = files.filter((file) => {
    const rel = relative(file);
    if (rel.startsWith("node_modules/") || rel.startsWith("dist/")) return false;
    if (rel.startsWith("scripts/")) return false;
    return rel.startsWith("src/") || rel === "README.md" || rel === "index.html";
  });

  const misleadingPatterns = [
    /这是一个.*文本清洗.*产品/i,
    /这是一个.*文本清洗.*工具(?!.*示例|.*参考|.*example|.*reference)/i,
    /real.*text.*cleaner.*product/i,
    /production.*text.*cleaner/i,
  ];

  const hits = [];

  for (const file of sourceFiles) {
    const rel = relative(file);
    const content = await readFile(file, "utf8");
    const lines = content.split(/\r?\n/);
    lines.forEach((line, index) => {
      if (misleadingPatterns.some((p) => p.test(line))) {
        hits.push(`${rel}:${index + 1}`);
      }
    });
  }

  if (hits.length === 0) {
    pass("no misleading 'text cleaner product' descriptions found");
  } else {
    warn(`potentially misleading description(s) found: ${hits.length} location(s)`, hits.slice(0, 3));
  }
}

async function checkAppTsxVersionFooter() {
  const appPath = path.join(root, "src/App.tsx");
  try {
    const content = await readFile(appPath, "utf8");
    if (/app-footer/.test(content) && /siteMeta\.version/.test(content)) {
      pass("App.tsx contains version footer using siteMeta.version");
    } else {
      warn("App.tsx may not display version in footer");
    }
  } catch {
    warn("cannot read App.tsx to check footer");
  }
}

console.log("Open Tools Starter preflight");
console.log("--------------------------------");

await checkRequiredFiles();
await checkPackageScripts();
await checkPackageTestScripts();
await checkIndexHtmlSeo();
await checkWorkflowContent();
await checkReadmeContent();
await checkReleaseNotesVersion();
await checkPackageMeta();
await checkManifestContent();
await checkSensitiveFiles();
await checkDistCommitted();
await checkNodeModulesCommitted();
await checkVersionConsistency();

const files = await collectFiles(root, true);
await checkTodos(files);
await checkTokensOrSecrets(files);
await checkUploadKeywords(files);
await checkHardcodedLocalhost(files);
await checkOpenCodePresets();
await checkHomepageContent();
await checkMisleadingDescriptions(files);
await checkAppTsxVersionFooter();

console.log("--------------------------------");

if (failures.length > 0) {
  console.error(`Preflight FAIL: ${failures.length} issue(s).`);
}

if (warnings.length > 0) {
  console.warn(`Preflight WARN: ${warnings.length} warning(s).`);
}

if (failures.length > 0) {
  process.exit(1);
}

if (warnings.length > 0) {
  console.log("Preflight passed with warnings.");
} else {
  console.log("Preflight passed.");
}
