import { readdir, readFile } from "node:fs/promises";
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

const ignoredDirs = new Set(["node_modules", "dist", ".git", ".github"]);
const textExtensions = new Set([".js", ".ts", ".tsx", ".jsx", ".json", ".md", ".html", ".css", ".mjs"]);
const ignoredFiles = new Set([
  "scripts/test-privacy-boundary.mjs",
  "scripts/preflight.mjs",
  "scripts/test-config.mjs",
  "scripts/test-docs.mjs",
  "scripts/test-static.mjs",
  "scripts/test-dist.mjs",
  "scripts/pressure-test.mjs",
]);

function toPosixPath(filePath) {
  return filePath.replaceAll(path.sep, "/").replaceAll("\\", "/");
}

function isIgnoredFile(relPath) {
  return ignoredFiles.has(toPosixPath(relPath));
}

const dangerousPatterns = [
  { pattern: /fetch\s*\(\s*['"]https?:\/\/(?!localhost|127\.0\.0\.1)[^'"]+api/i, type: "external API call", severity: "fail" },
  { pattern: /axios\.\w+\s*\(/i, type: "axios request", severity: "fail" },
  { pattern: /XMLHttpRequest/i, type: "XMLHttpRequest", severity: "fail" },
  { pattern: /new\s+WebSocket/i, type: "WebSocket", severity: "fail" },
  { pattern: /navigator\.sendBeacon/i, type: "sendBeacon", severity: "fail" },
  { pattern: /FormData/i, type: "FormData (file upload)", severity: "warn" },
  { pattern: /api\/upload/i, type: "upload endpoint", severity: "fail" },
  { pattern: /uploadEndpoint/i, type: "upload endpoint", severity: "fail" },
  { pattern: /uploadTo/i, type: "upload function", severity: "fail" },
  { pattern: /handleUpload/i, type: "upload handler", severity: "warn" },
  { pattern: /multipart\/form-data/i, type: "multipart upload", severity: "warn" },
];

const sensitivePatterns = [
  { pattern: /secret[_-]?key/i, type: "secret key", severity: "fail" },
  { pattern: /password\s*[=:]\s*['"][^'"]+['"]/i, type: "hardcoded password", severity: "fail" },
  { pattern: /Authorization\s*:\s*Bearer/i, type: "Authorization header", severity: "fail" },
  { pattern: /Bearer\s+[a-zA-Z0-9]{20,}/i, type: "Bearer token", severity: "fail" },
  { pattern: /ghp_[a-zA-Z0-9]{36}/i, type: "GitHub token (ghp_)", severity: "fail" },
  { pattern: /github_pat_[a-zA-Z0-9_]{22,}/i, type: "GitHub PAT", severity: "fail" },
  { pattern: /xox[baprs]-[a-zA-Z0-9]{10,}/i, type: "Slack/Discord token", severity: "fail" },
];

const localhostPatterns = [
  { pattern: /https?:\/\/localhost:[0-9]+\/(?!self-test|preview)/i, type: "localhost URL (non-test)", severity: "warn" },
  { pattern: /https?:\/\/127\.0\.0\.1:[0-9]+/i, type: "127.0.0.1 URL", severity: "warn" },
];

const docsIgnorePatterns = [
  /don't.*upload/i,
  /do not.*upload/i,
  /no.*upload/i,
  /not.*upload/i,
  /不要.*上传/i,
  /不上传/i,
  /不.*保存.*token/i,
  /不要.*保存.*token/i,
  /token.*说明/i,
  /privacy/i,
  /local.?first/i,
  /no.?backend/i,
];

function isDocsFile(relPath) {
  return relPath === "README.md"
    || relPath === "RELEASE_NOTES.md"
    || relPath.startsWith("docs/")
    || relPath.endsWith(".md");
}

async function collectFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (ignoredDirs.has(entry.name)) continue;

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectFiles(fullPath)));
    } else if (textExtensions.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }

  return files;
}

function isInDocsContext(content, lineIndex) {
  const lines = content.split("\n");
  const contextStart = Math.max(0, lineIndex - 5);
  const contextEnd = Math.min(lines.length, lineIndex + 3);
  const context = lines.slice(contextStart, contextEnd).join(" ");

  return docsIgnorePatterns.some((pattern) => pattern.test(context));
}

async function run() {
  console.log("Privacy Boundary Test - Local First / No Backend Checks");
  console.log("==========================================================");

  const files = await collectFiles(root);

  for (const file of files) {
    const relPath = toPosixPath(path.relative(root, file));
    if (isIgnoredFile(relPath)) continue;

    const content = await readFile(file, "utf8");
    const lines = content.split("\n");

    for (const pattern of dangerousPatterns) {
      lines.forEach((line, index) => {
        if (pattern.pattern.test(line)) {
          const isDocs = isDocsFile(relPath);
          const inDocsContext = isDocs && isInDocsContext(content, index);

          if (inDocsContext) {
            warn(`${relPath}:${index + 1}: "${pattern.type}" in documentation context (allowed)`);
          } else if (isDocs) {
            warn(`${relPath}:${index + 1}: found ${pattern.type} in documentation (review recommended)`);
          } else if (pattern.severity === "fail") {
            fail(`${relPath}:${index + 1}: found ${pattern.type}`);
          } else {
            warn(`${relPath}:${index + 1}: found ${pattern.type} (review recommended)`);
          }
        }
      });
    }

    for (const pattern of sensitivePatterns) {
      lines.forEach((line, index) => {
        if (pattern.pattern.test(line)) {
          const isDocs = isDocsFile(relPath);
          const inDocsContext = isDocs && isInDocsContext(content, index);
          const tokenShape = /ghp_[a-zA-Z0-9]{36}|github_pat_[a-zA-Z0-9_]{22,}|xox[baprs]-[a-zA-Z0-9]{10,}|Bearer\s+[a-zA-Z0-9]{20,}/i.test(line);

          if (isDocs && inDocsContext && !tokenShape) {
            warn(`${relPath}:${index + 1}: "${pattern.type}" in documentation context (allowed)`);
          } else {
            fail(`${relPath}:${index + 1}: 发现疑似敏感信息 (${pattern.type})`);
          }
        }
      });
    }

    for (const pattern of localhostPatterns) {
      lines.forEach((line, index) => {
        if (pattern.pattern.test(line) && !line.includes("test") && !line.includes("demo")) {
          warn(`${relPath}:${index + 1}: found ${pattern.type}`);
        }
      });
    }
  }

  const readmePath = path.join(root, "README.md");
  const readme = await readFile(readmePath, "utf8").catch(() => null);
  if (readme) {
    pass("README.md exists - privacy principles can be documented");
    const privacyKeywords = ["Local First", "No Backend", "Privacy Friendly", "Privacy", "隐私", "本地优先", "无后端"];
    const hasPrivacyMention = privacyKeywords.some((kw) => readme.toLowerCase().includes(kw.toLowerCase()));
    if (hasPrivacyMention) {
      pass("README.md contains privacy principles");
    } else {
      warn("README.md may lack privacy principles");
    }
  } else {
    fail("README.md missing - privacy principles cannot be verified");
  }

  if (passes.length > 0 || failures.length === 0) {
    pass("Privacy boundary check completed");
  }

  console.log("==========================================================");
  console.log(`\nSummary:`);
  console.log(`  PASS: ${passes.length}`);
  console.log(`  WARN: ${warnings.length}`);
  console.log(`  FAIL: ${failures.length}`);

  if (failures.length > 0) {
    console.error(`\nPrivacy Boundary Test FAIL: ${failures.length} issue(s)`);
    process.exit(1);
  }

  if (warnings.length > 0) {
    console.warn(`\nPrivacy Boundary Test passed with ${warnings.length} warning(s)`);
  } else {
    console.log(`\nPrivacy Boundary Test PASS`);
  }
}

run().catch((err) => {
  console.error("Privacy Boundary Test error:", err.message);
  process.exit(1);
});
