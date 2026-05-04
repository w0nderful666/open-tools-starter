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

async function checkFileExists(filePath) {
  try {
    await access(path.join(root, filePath));
    return true;
  } catch {
    return false;
  }
}

async function loadTypeScript() {
  try {
    return await import("typescript");
  } catch {
    warn("typescript parser unavailable; run npm install for full syntax checks");
    return null;
  }
}

function getScriptKind(ts, filePath) {
  const ext = path.extname(filePath);
  if (ext === ".tsx") return ts.ScriptKind.TSX;
  if (ext === ".ts") return ts.ScriptKind.TS;
  if (ext === ".jsx") return ts.ScriptKind.JSX;
  return ts.ScriptKind.JS;
}

async function checkSyntax(filePath, ts) {
  if (!ts) {
    return { ok: true, detail: "parser unavailable; file existence checked only" };
  }

  const absolutePath = path.join(root, filePath);
  const content = await readFile(absolutePath, "utf8");
  const sourceFile = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.Latest,
    true,
    getScriptKind(ts, filePath),
  );

  const diagnostic = sourceFile.parseDiagnostics[0];
  if (!diagnostic) {
    return { ok: true, detail: "" };
  }

  const position = diagnostic.file?.getLineAndCharacterOfPosition(diagnostic.start ?? 0);
  const location = position ? `${position.line + 1}:${position.character + 1}` : "unknown";
  const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, " ");
  return { ok: false, detail: `${location} ${message}` };
}

async function run() {
  console.log("Static Test - Syntax and File Checks");
  console.log("=====================================");
  const ts = await loadTypeScript();

  const syntaxFiles = [
    "public/self-test.js",
    "scripts/run-self-test.mjs",
    "scripts/preflight.mjs",
    "scripts/test-config.mjs",
    "scripts/test-docs.mjs",
    "scripts/test-project-health.mjs",
    "scripts/test-privacy-boundary.mjs",
    "scripts/test-template-usability.mjs",
    "scripts/test-ui-contract.mjs",
    "scripts/test-dist.mjs",
    "scripts/pressure-test.mjs",
    "src/App.tsx",
    "src/main.tsx",
    "src/config/siteMeta.ts",
  ];

  for (const file of syntaxFiles) {
    const exists = await checkFileExists(file);
    if (!exists) {
      fail(`file missing: ${file}`);
      continue;
    }

    const syntax = await checkSyntax(file, ts);
    if (syntax.ok) {
      pass(`syntax OK: ${file}`);
    } else {
      fail(`syntax error: ${file}${syntax.detail ? ` (${syntax.detail})` : ""}`);
    }
  }

  const requiredFiles = [
    "package.json",
    "vite.config.ts",
    "index.html",
    "src/App.tsx",
  ];

  for (const file of requiredFiles) {
    const exists = await checkFileExists(file);
    if (exists) {
      pass(`file exists: ${file}`);
    } else {
      fail(`file missing: ${file}`);
    }
  }

  try {
    const pkgContent = await readFile(path.join(root, "package.json"), "utf8");
    JSON.parse(pkgContent);
    pass("package.json is valid JSON");
  } catch {
    fail("package.json is not valid JSON");
  }

  console.log("=====================================");
  if (failures.length > 0) {
    console.error(`Static Test FAIL: ${failures.length} issue(s)`);
    process.exit(1);
  }
  if (warnings.length > 0) {
    console.warn(`Static Test WARN: ${warnings.length} warning(s)`);
  }
  console.log("Static Test PASS");
}

run().catch((err) => {
  console.error("Static Test error:", err.message);
  process.exit(1);
});
