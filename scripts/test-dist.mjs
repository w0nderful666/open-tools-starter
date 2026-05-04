import { readdir, readFile, access } from "node:fs/promises";
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

async function run() {
  console.log("Dist Test - Build Output Checks");
  console.log("================================");

  const distExists = await fileExists("dist");

  if (!distExists) {
    warn("dist directory does not exist");
    warn("Run 'npm run build' first to generate dist");
    console.log("================================");
    console.log("Dist Test SKIPPED - build required");
    return;
  }

  pass("dist directory exists");

  const indexExists = await fileExists("dist/index.html");
  if (indexExists) {
    pass("dist/index.html exists");
  } else {
    fail("dist/index.html missing");
  }

  try {
    const distDir = path.join(root, "dist");
    const entries = await readdir(distDir, { recursive: true });
    const hasAssets = entries.some((e) => typeof e === "string" && (e.endsWith(".js") || e.endsWith(".css")));
    const hasAssetsFolder = await fileExists("dist/assets");

    if (hasAssets || hasAssetsFolder) {
      pass("dist contains JS/CSS assets");
    } else {
      fail("dist missing JS/CSS assets");
    }
  } catch {
    fail("cannot scan dist directory");
  }

  const sensitivePatterns = [
    { pattern: /[A-Za-z0-9]{32,}/, name: "potential token" },
    { pattern: /ghp_[a-zA-Z0-9]{36}/, name: "GitHub token" },
    { pattern: /gho_[a-zA-Z0-9]{36}/, name: "GitHub token" },
    { pattern: /sk-[a-zA-Z0-9]{48}/, name: "OpenAI key" },
  ];

  const pathPatterns = [
    { pattern: /[A-Z]:\\/i, name: "Windows absolute path" },
    { pattern: /\/home\//i, name: "Linux absolute path" },
    { pattern: /\/Users\//i, name: "macOS absolute path" },
    { pattern: /localhost(?::\d+)?/i, name: "localhost URL" },
  ];

  try {
    const distFiles = [];

    async function collectDistFiles(dir) {
      const entries = await readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          await collectDistFiles(fullPath);
        } else if (entry.name.endsWith(".js") || entry.name.endsWith(".html") || entry.name.endsWith(".css") || entry.name.endsWith(".json") || entry.name.endsWith(".svg") || entry.name.endsWith(".webmanifest")) {
          distFiles.push(fullPath);
        }
      }
    }

    await collectDistFiles(path.join(root, "dist"));

    for (const filePath of distFiles.slice(0, 20)) {
      try {
        const content = await readFile(filePath, "utf8");
        const relPath = path.relative(root, filePath);

        for (const pattern of pathPatterns) {
          if (pattern.pattern.test(content)) {
            fail(`${relPath}: contains ${pattern.name}`);
          }
        }

        for (const pattern of sensitivePatterns) {
          if (pattern.pattern.test(content)) {
            warn(`${relPath}: may contain ${pattern.name}`);
          }
        }
      } catch {
      }
    }
  } catch {
    warn("cannot scan dist for sensitive content");
  }

  const pwaFiles = [
    "dist/manifest.webmanifest",
    "dist/sw.js",
    "dist/icon.svg",
  ];

  for (const pwaFile of pwaFiles) {
    const exists = await fileExists(pwaFile);
    if (exists) {
      pass(`PWA file exists: ${pwaFile.replace("dist/", "")}`);
    } else {
      warn(`PWA file missing: ${pwaFile.replace("dist/", "")}`);
    }
  }

  try {
    const indexHtml = await readFile(path.join(root, "dist/index.html"), "utf8");
    const hasScript = /<script[^>]*src=/i.test(indexHtml);
    const hasStyle = /<link[^>]*href=.*\.css/i.test(indexHtml);

    if (hasScript) {
      pass("dist/index.html references JS");
    } else {
      warn("dist/index.html may not reference JS");
    }

    if (hasStyle) {
      pass("dist/index.html references CSS");
    } else {
      warn("dist/index.html may not reference CSS");
    }
  } catch {
    fail("cannot read dist/index.html");
  }

  console.log("================================");
  if (failures.length > 0) {
    console.error(`Dist Test FAIL: ${failures.length} issue(s)`);
    process.exit(1);
  }
  if (warnings.length > 0) {
    console.warn(`Dist Test WARN: ${warnings.length} warning(s)`);
  }
  console.log("Dist Test PASS");
}

run().catch((err) => {
  console.error("Dist Test error:", err.message);
  process.exit(1);
});