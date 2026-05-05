import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const failures = [];
const warnings = [];

function pass(message) {
  console.log(`PASS ${message}`);
}

function fail(message) {
  failures.push(message);
  console.error(`FAIL ${message}`);
}

function warn(message) {
  warnings.push(message);
  console.warn(`WARN ${message}`);
}

async function fileExists(file) {
  try {
    await stat(path.join(root, file));
    return true;
  } catch {
    return false;
  }
}

async function read(file) {
  return readFile(path.join(root, file), "utf8");
}

async function checkDist() {
  if (!(await fileExists("dist/index.html"))) {
    fail("dist build artifacts exist");
    return;
  }

  const index = await read("dist/index.html");
  const assetsDir = path.join(root, "dist", "assets");
  const assets = await readdir(assetsDir);
  const bundle = (await Promise.all(
    assets
      .filter((file) => file.endsWith(".js") || file.endsWith(".css"))
      .map((file) => readFile(path.join(assetsDir, file), "utf8")),
  )).join("\n");
  const dist = `${index}\n${bundle}`;

  const markers = [
    "Local Clipboard Vault",
    "Quick Capture",
    "Floating Cards",
    "clipboard",
    "AES-GCM",
  ];

  for (const marker of markers) {
    if (dist.includes(marker)) pass(`dist contains ${marker}`);
    else fail(`dist missing ${marker}`);
  }

  const secretPatterns = [
    /sk-(?!demo)[a-zA-Z0-9]{20,}/,
    /ghp_(?!demo)[a-zA-Z0-9]{20,}/,
    /bearer\s+(?!token_demo)[a-zA-Z0-9._-]{20,}/i,
    /password\s*[:=]\s*["'][^"']{8,}/i,
    /cookie\s*[:=]\s*["'][^"']{8,}/i,
  ];
  if (secretPatterns.some((pattern) => pattern.test(dist))) fail("dist contains possible real API Key / Token / Cookie / Password");
  else pass("dist contains no obvious real secrets");
}

async function checkDocs() {
  const readme = await read("README.md");
  const release = await read("RELEASE_NOTES.md");
  const pkg = JSON.parse(await read("package.json"));

  if (readme.includes("隐私") && readme.includes("不上传用户内容")) pass("README privacy note exists");
  else fail("README privacy note missing");

  if (readme.includes("Secure Vault") && readme.includes("Web Crypto")) pass("README Secure Vault section exists");
  else fail("README Secure Vault section missing");

  if (release.includes("v0.1.0")) pass("RELEASE_NOTES v0.1.0 exists");
  else fail("RELEASE_NOTES missing v0.1.0");

  if (pkg.version === "0.1.0") pass("package.json version is correct");
  else fail(`package.json version is ${pkg.version}`);
}

async function checkSourceBoundaries() {
  const app = await read("src/App.tsx");
  const cryptoVault = await read("src/lib/cryptoVault.ts");
  const storage = await read("src/lib/clipboardStorage.ts");

  if (app.includes("navigator.clipboard.readText")) pass("clipboard import logic exists");
  else fail("clipboard import logic missing");

  if (storage.includes("localStorage")) pass("local storage adapter exists");
  else fail("local storage adapter missing");

  if (cryptoVault.includes("crypto.subtle") && cryptoVault.includes("AES-GCM") && cryptoVault.includes("PBKDF2")) {
    pass("encryption markers exist");
  } else {
    fail("encryption markers missing");
  }

  const forbidden = [
    /fetch\s*\(/,
    /XMLHttpRequest/,
    /analytics/i,
    /remote log/i,
    /openai/i,
  ];
  const combined = `${app}\n${storage}\n${cryptoVault}`;
  if (forbidden.some((pattern) => pattern.test(combined))) warn("manual review: potential remote call or analytics marker found");
  else pass("no obvious remote upload, analytics, logs, or remote AI markers");
}

console.log("Local Clipboard Vault preflight");
console.log("--------------------------------");

await checkDist();
await checkDocs();
await checkSourceBoundaries();

console.log("--------------------------------");

if (failures.length > 0) {
  console.error(`Preflight FAIL: ${failures.length} issue(s).`);
  process.exit(1);
}

if (warnings.length > 0) {
  console.warn(`Preflight passed with ${warnings.length} warning(s).`);
} else {
  console.log("Preflight passed.");
}
