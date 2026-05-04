import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

const failures = [];
const warnings = [];
const passes = [];

function pass(msg) {
  console.log(`PASS ${msg}`);
  passes.push(msg);
}

function warn(msg) {
  console.warn(`WARN ${msg}`);
  warnings.push(msg);
}

function fail(msg) {
  console.error(`FAIL ${msg}`);
  failures.push(msg);
}

async function getDirSize(dirPath) {
  let size = 0;
  try {
    const entries = await readdir(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        size += await getDirSize(fullPath);
      } else {
        const stats = await stat(fullPath);
        size += stats.size;
      }
    }
  } catch {
    // ignore errors
  }
  return size;
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function run() {
  console.log("UI Contract Test - Build Output Verification");
  console.log("===============================================");

  const distPath = path.join(root, "dist");

  try {
    await stat(distPath);
  } catch {
    fail("dist directory not found - run 'npm run build' first");
    console.log("\n===============================================");
    console.log(`\nSummary: PASS: ${passes.length}, WARN: ${warnings.length}, FAIL: ${failures.length}`);
    process.exit(1);
  }

  const indexHtmlPath = path.join(distPath, "index.html");
  try {
    await stat(indexHtmlPath);
    pass("dist/index.html exists");
  } catch {
    fail("dist/index.html not found");
  }

  const assetsPath = path.join(distPath, "assets");
  try {
    await stat(assetsPath);
    const files = await readdir(assetsPath);
    const jsFiles = files.filter(f => f.endsWith(".js"));
    const cssFiles = files.filter(f => f.endsWith(".css"));

    if (jsFiles.length > 0) {
      pass(`dist/assets contains ${jsFiles.length} JS file(s)`);
    } else {
      fail("dist/assets missing JS files");
    }

    if (cssFiles.length > 0) {
      pass(`dist/assets contains ${cssFiles.length} CSS file(s)`);
    } else {
      warn("dist/assets missing CSS files");
    }
  } catch {
    fail("dist/assets directory not found");
  }

  const selfTestHtmlPath = path.join(distPath, "self-test.html");
  try {
    await stat(selfTestHtmlPath);
    pass("dist/self-test.html exists");
  } catch {
    warn("dist/self-test.html not found (optional)");
  }

  try {
    const indexHtml = await readFile(indexHtmlPath, "utf8");

    if (indexHtml.includes("<title>")) {
      pass("index.html has title tag");
    } else {
      fail("index.html missing title tag");
    }

    if (indexHtml.includes('name="description"')) {
      pass("index.html has meta description");
    } else {
      fail("index.html missing meta description");
    }

    if (indexHtml.includes('name="theme-color"')) {
      pass("index.html has theme-color");
    } else {
      fail("index.html missing theme-color");
    }

    if (indexHtml.includes('property="og:title"')) {
      pass("index.html has og:title");
    } else {
      fail("index.html missing og:title");
    }

    if (indexHtml.includes('property="og:description"')) {
      pass("index.html has og:description");
    } else {
      warn("index.html missing og:description");
    }

    if (indexHtml.includes('property="og:image"')) {
      const ogImageMatch = indexHtml.match(/property="og:image"\s+content="([^"]+)"/);
      if (ogImageMatch) {
        const ogImagePath = ogImageMatch[1];
        if (ogImagePath.startsWith("http")) {
          pass(`og:image points to external URL: ${ogImagePath}`);
        } else {
          const resolvedPath = path.join(distPath, ogImagePath.replace(/^\.\//, ""));
          try {
            await stat(resolvedPath);
            pass(`og:image file exists in dist: ${ogImagePath}`);
          } catch {
            warn(`og:image file not found in dist: ${ogImagePath}`);
          }
        }
      }
    } else {
      warn("index.html missing og:image");
    }

    if (indexHtml.includes("localhost") || indexHtml.includes("127.0.0.1")) {
      fail("dist/index.html contains localhost references");
    } else {
      pass("dist/index.html has no localhost references");
    }

    const manifestLink = indexHtml.match(/<link[^>]*rel="manifest"[^>]*>/);
    if (manifestLink) {
      pass("index.html links to manifest");
      const manifestMatch = indexHtml.match(/href="([^"]+manifest[^"]+)"/);
      if (manifestMatch) {
        const manifestPath = path.join(distPath, manifestMatch[1].replace(/^\.\//, ""));
        try {
          const manifestContent = await readFile(manifestPath, "utf8");
          const manifest = JSON.parse(manifestContent);
          if (manifest.name) pass("manifest has name");
          else warn("manifest missing name");
          if (manifest.short_name) pass("manifest has short_name");
          else warn("manifest missing short_name");
          if (manifest.description) pass("manifest has description");
          else warn("manifest missing description");
        } catch {
          warn("cannot read/parse manifest in dist");
        }
      }
    } else {
      warn("index.html does not link to manifest");
    }
  } catch (err) {
    fail(`cannot read dist/index.html: ${err.message}`);
  }

  const distSize = await getDirSize(distPath);
  pass(`dist total size: ${formatSize(distSize)}`);

  if (distSize > 5 * 1024 * 1024) {
    warn(`dist size (${formatSize(distSize)}) exceeds 5MB - may be too large`);
  } else {
    pass("dist size is reasonable");
  }

  console.log("===============================================");
  console.log(`\nSummary:`);
  console.log(`  PASS: ${passes.length}`);
  console.log(`  WARN: ${warnings.length}`);
  console.log(`  FAIL: ${failures.length}`);

  if (failures.length > 0) {
    console.error(`\nUI Contract Test FAIL: ${failures.length} issue(s)`);
    process.exit(1);
  }

  if (warnings.length > 0) {
    console.warn(`\nUI Contract Test passed with ${warnings.length} warning(s)`);
  } else {
    console.log(`\nUI Contract Test PASS`);
  }
}

run().catch((err) => {
  console.error("UI Contract Test error:", err.message);
  process.exit(1);
});