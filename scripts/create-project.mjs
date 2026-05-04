#!/usr/bin/env node

/**
 * create-project.mjs
 *
 * Scaffolds a new project identity from the open-tools-starter template.
 * Default mode: dry-run (preview only). Pass --apply to write changes.
 *
 * Usage:
 *   npm run create:project -- --name my-tool --title "My Tool" --level B --description "..." [--owner w0nderful666] [--version 0.1.0] [--dry-run|--apply]
 */

import { readFile, writeFile, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

// --- Argument parsing ---

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--apply") {
      args.apply = true;
    } else if (arg === "--dry-run") {
      args.dryRun = true;
    } else if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const val = argv[++i];
      if (val === undefined || val.startsWith("--")) {
        console.error(`Error: --${key} requires a value.`);
        process.exit(1);
      }
      args[key] = val;
    }
  }
  return args;
}

// --- Validation ---

function isKebabCase(s) {
  return /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(s);
}

function validate(args) {
  const errors = [];

  if (!args.name) errors.push("--name is required");
  else if (!isKebabCase(args.name)) errors.push("--name must be kebab-case (e.g., my-tool-name)");

  if (!args.title) errors.push("--title is required");

  if (!args.description) errors.push("--description is required");

  const level = (args.level || "C").toUpperCase();
  if (!["C", "B", "A"].includes(level)) errors.push("--level must be C, B, or A");

  return errors;
}

// --- File update helpers ---

async function fileExists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readJson(filePath) {
  const raw = await readFile(filePath, "utf-8");
  return JSON.parse(raw);
}

async function writeJson(filePath, data) {
  await writeFile(filePath, JSON.stringify(data, null, 2) + "\n", "utf-8");
}

// --- Main ---

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const errors = validate(args);

  if (errors.length > 0) {
    console.error("Validation errors:");
    for (const e of errors) console.error(`  ✗ ${e}`);
    process.exit(1);
  }

  const apply = args.apply === true;
  const dryRun = apply ? false : true; // default dry-run
  const name = args.name;
  const title = args.title;
  const level = (args.level || "C").toUpperCase();
  const description = args.description;
  const owner = args.owner || "w0nderful666";
  const version = args.version || "0.1.0";
  const repoUrl = `https://github.com/${owner}/${name}`;
  const demoUrl = `https://${owner}.github.io/${name}/`;

  const changed = [];
  const skipped = [];
  const warnings = [];

  console.log(`\n${"=".repeat(60)}`);
  console.log(`  create-project ${dryRun ? "(DRY-RUN)" : "(APPLY)"}`);
  console.log(`${"=".repeat(60)}`);
  console.log(`  Name:        ${name}`);
  console.log(`  Title:       ${title}`);
  console.log(`  Level:       ${level}`);
  console.log(`  Description: ${description}`);
  console.log(`  Owner:       ${owner}`);
  console.log(`  Version:     ${version}`);
  console.log(`${"=".repeat(60)}\n`);

  // 1. package.json
  const pkgPath = path.join(root, "package.json");
  if (await fileExists(pkgPath)) {
    const pkg = await readJson(pkgPath);
    const oldName = pkg.name;
    const oldDesc = pkg.description;
    const oldHomepage = pkg.homepage;
    const oldRepo = pkg.repository?.url;
    const oldVersion = pkg.version;

    pkg.name = name;
    pkg.version = version;
    pkg.description = description;
    pkg.homepage = demoUrl;
    pkg.repository = { type: "git", url: repoUrl };

    if (!dryRun) await writeJson(pkgPath, pkg);

    const diffs = [];
    if (oldName !== name) diffs.push(`name: ${oldName} → ${name}`);
    if (oldVersion !== version) diffs.push(`version: ${oldVersion} → ${version}`);
    if (oldDesc !== description) diffs.push(`description changed`);
    if (oldHomepage !== demoUrl) diffs.push(`homepage → ${demoUrl}`);
    if (oldRepo !== repoUrl) diffs.push(`repository → ${repoUrl}`);

    if (diffs.length > 0) {
      changed.push({ file: "package.json", diffs });
    } else {
      skipped.push("package.json (already up to date)");
    }
  } else {
    warnings.push("package.json not found");
  }

  // 2. siteMeta.ts
  const siteMetaPath = path.join(root, "src/config/siteMeta.ts");
  if (await fileExists(siteMetaPath)) {
    let content = await readFile(siteMetaPath, "utf-8");
    const old = content;

    content = content.replace(/name:\s*"[^"]*"/, `name: "${name}"`);
    content = content.replace(/version:\s*"[^"]*"/, `version: "${version}"`);
    content = content.replace(/description:\s*"[^"]*"/, `description: "${description}"`);
    content = content.replace(/repositoryUrl:\s*"[^"]*"/, `repositoryUrl: "${repoUrl}"`);
    content = content.replace(/demoUrl:\s*"[^"]*"/, `demoUrl: "${demoUrl}"`);
    content = content.replace(/localStoragePrefix:\s*"[^"]*"/, `localStoragePrefix: "${name}"`);

    if (content !== old) {
      if (!dryRun) await writeFile(siteMetaPath, content, "utf-8");
      changed.push({ file: "src/config/siteMeta.ts", diffs: ["name, version, description, repositoryUrl, demoUrl, localStoragePrefix updated"] });
    } else {
      skipped.push("src/config/siteMeta.ts (already up to date)");
    }
  } else {
    warnings.push("src/config/siteMeta.ts not found");
  }

  // 3. index.html
  const indexPath = path.join(root, "index.html");
  if (await fileExists(indexPath)) {
    let content = await readFile(indexPath, "utf-8");
    const old = content;

    content = content.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);
    content = content.replace(
      /content="[^"]*"(\s*\/?>?\s*<meta\s+name="description")/,
      `content="${description}"$1`,
    );
    content = content.replace(
      /content="[^"]*"(\s*\/?>?\s*<meta\s+property="og:description")/,
      `content="${description}"$1`,
    );
    content = content.replace(
      /content="[^"]*"(\s*\/?>?\s*<meta\s+name="twitter:description")/,
      `content="${description}"$1`,
    );
    content = content.replace(
      /content="[^"]*"(\s*\/?>?\s*<meta\s+property="og:url")/,
      `content="${demoUrl}"$1`,
    );
    content = content.replace(
      /href="[^"]*"(\s*\/?>?\s*<link\s+rel="canonical")/,
      `href="${demoUrl}"$1`,
    );

    if (content !== old) {
      if (!dryRun) await writeFile(indexPath, content, "utf-8");
      changed.push({ file: "index.html", diffs: ["title, description, og, twitter, canonical updated"] });
    } else {
      skipped.push("index.html (already up to date)");
    }
  } else {
    warnings.push("index.html not found");
  }

  // 4. manifest.webmanifest
  const manifestPath = path.join(root, "public/manifest.webmanifest");
  if (await fileExists(manifestPath)) {
    const manifest = await readJson(manifestPath);
    const oldName = manifest.name;
    const oldShort = manifest.short_name;
    const oldDesc = manifest.description;
    const oldVer = manifest.version;

    manifest.name = title;
    manifest.short_name = name;
    manifest.description = description;
    manifest.version = version;

    if (!dryRun) await writeJson(manifestPath, manifest);

    const diffs = [];
    if (oldName !== title) diffs.push(`name: ${oldName} → ${title}`);
    if (oldShort !== name) diffs.push(`short_name: ${oldShort} → ${name}`);
    if (oldDesc !== description) diffs.push(`description changed`);
    if (oldVer !== version) diffs.push(`version: ${oldVer} → ${version}`);

    if (diffs.length > 0) {
      changed.push({ file: "public/manifest.webmanifest", diffs });
    } else {
      skipped.push("public/manifest.webmanifest (already up to date)");
    }
  } else {
    warnings.push("public/manifest.webmanifest not found");
  }

  // 5. sw.js
  const swPath = path.join(root, "public/sw.js");
  if (await fileExists(swPath)) {
    let content = await readFile(swPath, "utf-8");
    const old = content;
    const cacheName = `${name}-v${version}`;
    content = content.replace(/const CACHE_NAME = "[^"]*";/, `const CACHE_NAME = "${cacheName}";`);

    if (content !== old) {
      if (!dryRun) await writeFile(swPath, content, "utf-8");
      changed.push({ file: "public/sw.js", diffs: [`CACHE_NAME → ${cacheName}`] });
    } else {
      skipped.push("public/sw.js (already up to date)");
    }
  } else {
    warnings.push("public/sw.js not found");
  }

  // 6. README.md (minimal update)
  const readmePath = path.join(root, "README.md");
  if (await fileExists(readmePath)) {
    let content = await readFile(readmePath, "utf-8");
    const old = content;

    content = content.replace(
      /\[!\[Version\]\(https:\/\/img\.shields\.io\/badge\/version-[^)]+\)\]/,
      `[![Version](https://img.shields.io/badge/version-${version}-blue)]`,
    );

    if (content !== old) {
      if (!dryRun) await writeFile(readmePath, content, "utf-8");
      changed.push({ file: "README.md", diffs: ["version badge updated"] });
    } else {
      skipped.push("README.md (already up to date)");
    }
  } else {
    warnings.push("README.md not found");
  }

  // 7. RELEASE_NOTES.md (prepend entry)
  const releasePath = path.join(root, "RELEASE_NOTES.md");
  if (await fileExists(releasePath)) {
    const content = await readFile(releasePath, "utf-8");
    const entry = `## v${version} - ${title}\n\nCreated with create-project.\n\n- Level ${level} project\n- ${description}\n\n`;
    if (!content.includes(`## v${version}`)) {
      if (!dryRun) await writeFile(releasePath, entry + content, "utf-8");
      changed.push({ file: "RELEASE_NOTES.md", diffs: [`prepended v${version} entry`] });
    } else {
      skipped.push("RELEASE_NOTES.md (entry already exists)");
    }
  } else {
    warnings.push("RELEASE_NOTES.md not found");
  }

  // --- Output ---

  console.log("Changed:");
  if (changed.length === 0) {
    console.log("  (none)");
  } else {
    for (const c of changed) {
      console.log(`  ✓ ${c.file}`);
      for (const d of c.diffs) console.log(`      ${d}`);
    }
  }

  console.log("\nSkipped:");
  if (skipped.length === 0) {
    console.log("  (none)");
  } else {
    for (const s of skipped) console.log(`  - ${s}`);
  }

  if (warnings.length > 0) {
    console.log("\nWarnings:");
    for (const w of warnings) console.log(`  ⚠ ${w}`);
  }

  console.log("\nNext steps:");
  if (dryRun) {
    console.log("  This was a dry-run. No files were modified.");
    console.log("  To apply changes, run again with --apply");
  } else {
    console.log("  1. npm install");
    console.log("  2. npm run build");
    console.log("  3. npm run self-test");
    console.log("  4. npm run preflight");
    console.log("  5. git add . && git commit -m 'Initialize project'");
  }
  console.log("");
}

main().catch((err) => {
  console.error("Fatal:", err.message);
  process.exit(1);
});
