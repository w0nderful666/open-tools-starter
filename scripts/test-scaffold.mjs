#!/usr/bin/env node

/**
 * test-scaffold.mjs
 *
 * Tests for the create-project scaffold system:
 * - Script exists and is valid
 * - dry-run does not modify files
 * - Argument validation works
 * - invalid level / invalid slug fail
 * - apply generates consistent project info
 * - No backend/database/login/upload introduced
 */

import { access, readFile, writeFile, mkdtemp, rm, readdir } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { execSync } from "node:child_process";

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
    await access(path.join(root, filePath));
    return true;
  } catch {
    return false;
  }
}

async function copyDir(src, dest) {
  const entries = await readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.name === "node_modules" || entry.name === ".git" || entry.name === "dist") continue;
    if (entry.isDirectory()) {
      await (await import("node:fs/promises")).mkdir(destPath, { recursive: true });
      await copyDir(srcPath, destPath);
    } else {
      await writeFile(destPath, await readFile(srcPath));
    }
  }
}

// Test 1: create-project.mjs exists
console.log("\n[test:scaffold] Checking create-project script...");

if (await fileExists("scripts/create-project.mjs")) {
  pass("scripts/create-project.mjs exists");
} else {
  fail("scripts/create-project.mjs does not exist");
}

// Test 2: npm script registered
const pkg = JSON.parse(await readFile(path.join(root, "package.json"), "utf-8"));
if (pkg.scripts?.["create:project"]) {
  pass("npm script 'create:project' registered");
} else {
  fail("npm script 'create:project' not registered");
}

// Test 3: dry-run does not modify files
console.log("\n[test:scaffold] Checking dry-run safety...");

const tmpDir = await mkdtemp(path.join(os.tmpdir(), "ots-scaffold-"));
try {
  await copyDir(root, tmpDir);

  // Capture state before
  const beforePkg = await readFile(path.join(tmpDir, "package.json"), "utf-8");
  const beforeSiteMeta = await readFile(path.join(tmpDir, "src/config/siteMeta.ts"), "utf-8");

  // Run dry-run in temp copy
  try {
    execSync(
      `node scripts/create-project.mjs --name test-dry --title "Test" --level C --description "Test project" --dry-run`,
      { cwd: tmpDir, stdio: "pipe" },
    );
  } catch {
    // Ignore exit code issues in temp env
  }

  const afterPkg = await readFile(path.join(tmpDir, "package.json"), "utf-8");
  const afterSiteMeta = await readFile(path.join(tmpDir, "src/config/siteMeta.ts"), "utf-8");

  if (beforePkg === afterPkg) {
    pass("dry-run does not modify package.json");
  } else {
    fail("dry-run modified package.json");
  }

  if (beforeSiteMeta === afterSiteMeta) {
    pass("dry-run does not modify siteMeta.ts");
  } else {
    fail("dry-run modified siteMeta.ts");
  }
} finally {
  await rm(tmpDir, { recursive: true, force: true });
}

// Test 4: validation rejects bad inputs
console.log("\n[test:scaffold] Checking argument validation...");

try {
  execSync(
    `node scripts/create-project.mjs --name "NOT KEBAB" --title "Test" --level C --description "Test"`,
    { cwd: root, stdio: "pipe" },
  );
  fail("should reject non-kebab-case name");
} catch {
  pass("rejects non-kebab-case name");
}

try {
  execSync(
    `node scripts/create-project.mjs --name my-tool --title "Test" --level X --description "Test"`,
    { cwd: root, stdio: "pipe" },
  );
  fail("should reject invalid level X");
} catch {
  pass("rejects invalid level X");
}

try {
  execSync(
    `node scripts/create-project.mjs --title "Test" --level C --description "Test"`,
    { cwd: root, stdio: "pipe" },
  );
  fail("should reject missing --name");
} catch {
  pass("rejects missing --name");
}

// Test 5: apply generates consistent project info
console.log("\n[test:scaffold] Checking apply consistency...");

const tmpDir2 = await mkdtemp(path.join(os.tmpdir(), "ots-scaffold-apply-"));
try {
  await copyDir(root, tmpDir2);

  try {
    execSync(
      `node scripts/create-project.mjs --name scaffold-test --title "Scaffold Test" --level B --description "A test project" --apply`,
      { cwd: tmpDir2, stdio: "pipe" },
    );
  } catch {
    // May fail due to missing deps, but files should still be written
  }

  // Check package.json
  const pkg2 = JSON.parse(await readFile(path.join(tmpDir2, "package.json"), "utf-8"));
  if (pkg2.name === "scaffold-test") {
    pass("apply sets package.json name correctly");
  } else {
    fail(`apply package.json name: expected "scaffold-test", got "${pkg2.name}"`);
  }

  if (pkg2.version === "0.1.0") {
    pass("apply sets package.json version correctly");
  } else {
    fail(`apply package.json version: expected "0.1.0", got "${pkg2.version}"`);
  }

  // Check siteMeta.ts
  const sm = await readFile(path.join(tmpDir2, "src/config/siteMeta.ts"), "utf-8");
  if (sm.includes('"scaffold-test"')) {
    pass("apply updates siteMeta.ts name");
  } else {
    fail("apply does not update siteMeta.ts name");
  }

  // Check manifest
  const manifest = JSON.parse(await readFile(path.join(tmpDir2, "public/manifest.webmanifest"), "utf-8"));
  if (manifest.name === "Scaffold Test") {
    pass("apply updates manifest name");
  } else {
    fail("apply does not update manifest name");
  }

  // Check sw.js
  const sw = await readFile(path.join(tmpDir2, "public/sw.js"), "utf-8");
  if (sw.includes("scaffold-test-v0.1.0")) {
    pass("apply updates sw.js CACHE_NAME");
  } else {
    fail("apply does not update sw.js CACHE_NAME");
  }
} finally {
  await rm(tmpDir2, { recursive: true, force: true });
}

// Test 6: no backend/database/login/upload
console.log("\n[test:scaffold] Checking privacy boundaries...");

const scriptContent = await readFile(path.join(root, "scripts/create-project.mjs"), "utf-8");
const forbiddenPatterns = [
  [/\bexpress\b/, "express"],
  [/\bkoa\b/, "koa"],
  [/\bfastify\b/, "fastify"],
  [/\bmongo\b/, "mongo"],
  [/\bmysql\b/, "mysql"],
  [/\bpostgres\b/, "postgres"],
  [/\bcrypt\b/, "bcrypt"],
  [/\bjwt\b/, "jwt"],
  [/require\(["']fs-extra["']\)/, "fs-extra"],
];

for (const [pattern, name] of forbiddenPatterns) {
  if (pattern.test(scriptContent)) {
    fail(`create-project.mjs imports forbidden dependency: ${name}`);
  }
}
pass("create-project.mjs has no forbidden dependencies");

// Summary
console.log(`\n[test:scaffold] ${passes.length} passed, ${failures.length} failed\n`);
if (failures.length > 0) {
  process.exit(1);
}
