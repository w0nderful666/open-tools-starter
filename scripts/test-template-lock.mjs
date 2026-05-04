#!/usr/bin/env node

/**
 * test-template-lock.mjs
 *
 * Locks the template homepage to prevent regression:
 * - No Text Cleaner / Example Module / Reference Implementation
 * - Starter Wizard, Project Levels, New Project Flow, Quality Bar, Starter Resources present
 * - Required docs exist
 * - README does not promote business tools as core
 * - Footer shows version
 * - No placeholder markers
 */

import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const failures = [];
const passes = [];

function pass(msg) {
  passes.push(msg);
  console.log(`  ✓ ${msg}`);
}

function fail(msg) {
  failures.push(msg);
  console.error(`  ✗ ${msg}`);
}

async function fileExists(filePath) {
  try {
    await stat(path.join(root, filePath));
    return true;
  } catch {
    return false;
  }
}

async function readText(filePath) {
  return readFile(path.join(root, filePath), "utf-8");
}

async function collectFiles(dir, acc = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name === ".git" || entry.name === "dist") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await collectFiles(full, acc);
    } else {
      acc.push(full);
    }
  }
  return acc;
}

console.log("\n[test:template-lock] Running template lock checks...\n");

// 1. Homepage must NOT contain banned terms
console.log("[Section 1] Checking for banned content...");

const appContent = await readText("src/App.tsx");

const bannedTerms = [
  "Text Cleaner",
  "TextCleaner",
  "text-cleaner",
  "Example Module",
  "example module",
  "Reference Implementation",
  "reference implementation",
  "参考实现",
  "示例工具",
];

for (const term of bannedTerms) {
  if (appContent.includes(term)) {
    fail(`App.tsx contains banned term: "${term}"`);
  } else {
    pass(`App.tsx does not contain "${term}"`);
  }
}

// 2. Homepage MUST contain required sections
console.log("\n[Section 2] Checking required sections...");

const requiredSections = [
  ["Starter Wizard", "data-testid=\"starter-wizard\""],
  ["Project Levels", "data-testid=\"levels-section\""],
  ["New Project Flow", "data-testid=\"flow-section\""],
  ["Quality Bar", "data-testid=\"quality-section\""],
  ["Starter Resources", "data-testid=\"resources-section\""],
];

for (const [name, marker] of requiredSections) {
  // StarterWizard marker lives in its own component file
  const targetFile = name === "Starter Wizard" ? "src/components/StarterWizard.tsx" : null;
  const targetContent = targetFile ? await readText(targetFile) : appContent;
  if (targetContent.includes(marker)) {
    pass(`Homepage has section: ${name}`);
  } else {
    fail(`Homepage missing section: ${name} (marker: ${marker})`);
  }
}

// 3. Required docs exist
console.log("\n[Section 3] Checking required docs...");

const requiredDocs = [
  "docs/NEW_PROJECT_PLAYBOOK.md",
  "docs/MODULE_CONTRACT.md",
  "docs/QUALITY_BAR.md",
  "docs/PROJECT_LEVELS.md",
  "docs/OPENCODE_PRESETS.md",
  "docs/VERSIONING_GUIDE.md",
];

for (const doc of requiredDocs) {
  if (await fileExists(doc)) {
    pass(`Doc exists: ${doc}`);
  } else {
    fail(`Doc missing: ${doc}`);
  }
}

// 4. README does not promote business tools as core
console.log("\n[Section 4] Checking README positioning...");

const readme = await readText("README.md");

const businessToolPatterns = [
  /text\s*cleaner/i,
  /image\s*compressor/i,
  /pdf\s*tool/i,
  /qr\s*code/i,
  /json\s*formatter/i,
];

for (const pattern of businessToolPatterns) {
  if (pattern.test(readme)) {
    fail(`README promotes business tool as core: ${pattern}`);
  }
}
pass("README does not promote business tools as core features");

// Check README mentions it's a template
if (readme.includes("template") || readme.includes("模板") || readme.includes("starter")) {
  pass("README positions project as template/starter");
} else {
  fail("README does not position project as template/starter");
}

// 5. Footer shows version
console.log("\n[Section 5] Checking footer version...");

if (appContent.includes("siteMeta.version")) {
  pass("Footer displays version via siteMeta.version");
} else {
  fail("Footer does not display version");
}

// 6. No task/fixme markers in source
console.log("\n[Section 6] Checking for task/fixme markers...");

const sourceFiles = await collectFiles(path.join(root, "src"));
const markerFiles = [];

for (const file of sourceFiles) {
  if (!file.endsWith(".ts") && !file.endsWith(".tsx")) continue;
  const content = await readText(path.relative(root, file));
  if (/\bTODO\b|\bFIXME\b/.test(content)) {
    markerFiles.push(path.relative(root, file));
  }
}

if (markerFiles.length === 0) {
  pass("No task/fixme markers in src/ TypeScript files");
} else {
  fail(`task/fixme markers found in: ${markerFiles.join(", ")}`);
}

// 7. Check that create-project script exists
console.log("\n[Section 7] Checking scaffold system...");

if (await fileExists("scripts/create-project.mjs")) {
  pass("create-project.mjs exists");
} else {
  fail("create-project.mjs missing");
}

if (await fileExists("scripts/test-scaffold.mjs")) {
  pass("test-scaffold.mjs exists");
} else {
  fail("test-scaffold.mjs missing");
}

// 8. Version consistency
console.log("\n[Section 8] Checking version consistency...");

const pkg = JSON.parse(await readText("package.json"));
const siteMeta = await readText("src/config/siteMeta.ts");
const sw = await readText("public/sw.js");
const manifest = JSON.parse(await readText("public/manifest.webmanifest"));

const pkgVersion = pkg.version;
const smMatch = siteMeta.match(/version:\s*"([^"]+)"/);
const swMatch = sw.match(/CACHE_NAME\s*=\s*"[^"]*-v([^"]+)"/);
const mVersion = manifest.version;

const versions = [
  ["package.json", pkgVersion],
  ["siteMeta.ts", smMatch?.[1]],
  ["sw.js CACHE_NAME", swMatch?.[1]],
  ["manifest.webmanifest", mVersion],
];

for (const [file, ver] of versions) {
  if (ver === pkgVersion) {
    pass(`${file} version matches: ${ver}`);
  } else {
    fail(`${file} version mismatch: expected ${pkgVersion}, got ${ver}`);
  }
}

// Summary
console.log(`\n[test:template-lock] ${passes.length} passed, ${failures.length} failed\n`);
if (failures.length > 0) {
  process.exit(1);
}
