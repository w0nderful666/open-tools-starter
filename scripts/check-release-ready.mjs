import { readFile, access } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const failures = [];
const warnings = [];

function pass(msg) {
  console.log(`PASS ${msg}`);
}

function warn(msg) {
  console.warn(`WARN ${msg}`);
  warnings.push(msg);
}

function fail(msg) {
  console.error(`FAIL ${msg}`);
  failures.push(msg);
}

async function fileExists(filePath) {
  try {
    await access(path.join(root, filePath));
    return true;
  } catch {
    return false;
  }
}

async function checkReadmeDemoUrl() {
  const readmePath = path.join(root, "README.md");
  const content = await readFile(readmePath, "utf8");
  if (/https:\/\//.test(content)) {
    pass("README contains online demo URL (https://)");
  } else {
    fail("README missing online demo URL (https://)");
  }
}

async function checkReleaseNotesVersion() {
  const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
  const version = packageJson.version;
  const releaseContent = await readFile(path.join(root, "RELEASE_NOTES.md"), "utf8");

  if (releaseContent.includes(version) || releaseContent.includes(`v${version}`)) {
    pass(`RELEASE_NOTES contains current version ${version}`);
  } else {
    fail(`RELEASE_NOTES missing current version ${version}`);
  }
}

async function checkRequiredFiles() {
  const requiredFiles = [
    "CONTRIBUTING.md",
    "SECURITY.md",
    ".github/ISSUE_TEMPLATE/bug_report.yml",
    ".github/ISSUE_TEMPLATE/feature_request.yml",
    ".github/ISSUE_TEMPLATE/docs_improvement.yml",
    ".github/pull_request_template.md",
    "docs/GITHUB_REPO_SETUP.md",
    "docs/RELEASE_TEMPLATE.md",
  ];

  for (const file of requiredFiles) {
    if (await fileExists(file)) {
      pass(`required file exists: ${file}`);
    } else {
      fail(`required file missing: ${file}`);
    }
  }
}

async function checkVersionConsistency() {
  const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
  const packageVersion = packageJson.version;

  // siteMeta.ts
  const siteMetaContent = await readFile(path.join(root, "src/config/siteMeta.ts"), "utf8");
  const versionMatch = siteMetaContent.match(/version:\s*"([^"]+)"/);
  if (versionMatch && versionMatch[1] === packageVersion) {
    pass(`version consistency: package.json (${packageVersion}) matches siteMeta.ts`);
  } else {
    fail(`version mismatch: package.json (${packageVersion}) vs siteMeta.ts (${versionMatch?.[1] || "not found"})`);
  }

  // sw.js
  const swContent = await readFile(path.join(root, "public/sw.js"), "utf8");
  const cacheMatch = swContent.match(/CACHE_NAME\s*=\s*"([^"]+)"/);
  if (cacheMatch && cacheMatch[1].includes(packageVersion)) {
    pass(`version consistency: sw.js CACHE_NAME includes ${packageVersion}`);
  } else {
    fail(`version mismatch: sw.js CACHE_NAME (${cacheMatch?.[1] || "not found"}) does not include ${packageVersion}`);
  }

  // manifest.webmanifest
  const manifest = JSON.parse(await readFile(path.join(root, "public/manifest.webmanifest"), "utf8"));
  if (manifest.version === packageVersion) {
    pass(`version consistency: manifest.webmanifest matches package.json (${packageVersion})`);
  } else {
    fail(`version mismatch: manifest.webmanifest (${manifest.version || "not found"}) vs package.json (${packageVersion})`);
  }
}

async function checkPackageMeta() {
  const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));

  if (packageJson.license === "MIT") {
    pass("package.json license is MIT");
  } else {
    fail(`package.json license is "${packageJson.license || "missing"}", expected "MIT"`);
  }

  if (packageJson.homepage) {
    pass("package.json has homepage field");
  } else {
    fail("package.json missing homepage field");
  }

  const repositoryUrl = typeof packageJson.repository === "string"
    ? packageJson.repository
    : packageJson.repository?.url;

  if (repositoryUrl) {
    pass("package.json has repository field");
  } else {
    fail("package.json missing repository field");
  }
}

console.log("Release Readiness Check");
console.log("--------------------------------");

await checkReadmeDemoUrl();
await checkReleaseNotesVersion();
await checkRequiredFiles();
await checkVersionConsistency();
await checkPackageMeta();

console.log("--------------------------------");

if (failures.length > 0) {
  console.error(`Release check FAIL: ${failures.length} issue(s).`);
}

if (warnings.length > 0) {
  console.warn(`Release check WARN: ${warnings.length} warning(s).`);
}

if (failures.length > 0) {
  process.exit(1);
}

if (warnings.length > 0) {
  console.log("Release check passed with warnings.");
} else {
  console.log("Release check passed.");
}
