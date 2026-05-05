import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const failures = [];

async function read(file) {
  return readFile(path.join(root, file), "utf8");
}

async function exists(file) {
  await access(path.join(root, file));
}

function fail(message) {
  failures.push(message);
  console.error(`FAIL ${message}`);
}

function pass(message) {
  console.log(`PASS ${message}`);
}

async function assertExists(file) {
  try {
    await exists(file);
    pass(`exists: ${file}`);
  } catch {
    fail(`missing file: ${file}`);
  }
}

async function assertContains(file, marker) {
  try {
    const content = await read(file);
    if (content.includes(marker)) pass(`${file} contains ${marker}`);
    else fail(`${file} missing ${marker}`);
  } catch {
    fail(`cannot read ${file}`);
  }
}

async function assertPackageVersion() {
  const pkg = JSON.parse(await read("package.json"));
  if (pkg.version === "0.1.0") pass("package.json version is 0.1.0");
  else fail(`package.json version is ${pkg.version}`);
}

async function assertNoRealSecretsInSamples() {
  const content = await read("src/data/sampleClips.ts");
  const patterns = [
    /sk-(?!demo)[a-zA-Z0-9]{20,}/,
    /ghp_(?!demo)[a-zA-Z0-9]{20,}/,
    /bearer\s+(?!token_demo)[a-zA-Z0-9._-]{20,}/i,
  ];
  if (patterns.some((pattern) => pattern.test(content))) fail("sample data may contain a real API Key / Token");
  else pass("sample data uses placeholders only");
}

async function assertDistNoSecrets() {
  try {
    const assetDir = path.join(root, "dist", "assets");
    const files = await readdir(assetDir);
    const jsFiles = files.filter((file) => file.endsWith(".js"));
    const content = (await Promise.all(jsFiles.map((file) => readFile(path.join(assetDir, file), "utf8")))).join("\n");
    const suspicious = [
      /sk-(?!demo)[a-zA-Z0-9]{20,}/,
      /ghp_(?!demo)[a-zA-Z0-9]{20,}/,
      /bearer\s+(?!token_demo)[a-zA-Z0-9._-]{20,}/i,
    ];
    if (suspicious.some((pattern) => pattern.test(content))) fail("dist may contain an obvious real secret");
    else pass("dist does not contain obvious real secrets");
  } catch {
    fail("dist build artifacts are missing");
  }
}

await assertPackageVersion();
await assertExists("README.md");
await assertExists("RELEASE_NOTES.md");
await assertExists("src/App.tsx");
await assertExists("src/config/siteMeta.ts");
await assertExists("src/lib/clipboardUtils.ts");
await assertExists("src/lib/clipboardStorage.ts");
await assertExists("src/lib/cryptoVault.ts");
await assertExists("src/data/sampleClips.ts");

await assertContains("src/config/siteMeta.ts", "Local Clipboard Vault");
await assertContains("README.md", "Local First");
await assertContains("README.md", "No Backend");
await assertContains("README.md", "GitHub Pages Ready");
await assertContains("README.md", "隐私");
await assertContains("README.md", "Quick Capture");
await assertContains("README.md", "Floating Cards");
await assertContains("README.md", "Secure Vault");
await assertContains("README.md", "不上传用户内容");
await assertContains("README.md", "No remote AI");
await assertContains("README.md", "主密码不保存");
await assertContains("README.md", "忘记主密码无法恢复");
await assertContains("RELEASE_NOTES.md", "v0.1.0");

await assertContains("src/App.tsx", "navigator.clipboard.readText");
await assertContains("src/App.tsx", "Ctrl + Enter");
await assertContains("src/lib/clipboardUtils.ts", "generateClipTitle");
await assertContains("src/lib/clipboardUtils.ts", "detectClipType");
await assertContains("src/App.tsx", "Floating Cards");
await assertContains("src/App.tsx", "data-testid=\"clip-card\"");
await assertContains("src/App.tsx", "copyClip");
await assertContains("src/App.tsx", "openEdit");
await assertContains("src/App.tsx", "cloneClip");
await assertContains("src/App.tsx", "deleteClip");
await assertContains("src/App.tsx", "pinned");
await assertContains("src/App.tsx", "favorite");
await assertContains("src/lib/clipboardUtils.ts", "sensitive");
await assertContains("src/lib/clipboardUtils.ts", "encrypted");
await assertContains("src/lib/clipboardUtils.ts", "createdAt");
await assertContains("src/lib/clipboardUtils.ts", "updatedAt");
await assertContains("src/App.tsx", "importJson");
await assertContains("src/App.tsx", "exportJson");
await assertContains("src/lib/cryptoVault.ts", "crypto.subtle");
await assertContains("src/lib/cryptoVault.ts", "AES-GCM");
await assertContains("src/lib/cryptoVault.ts", "PBKDF2");
await assertContains("src/lib/cryptoVault.ts", "salt");
await assertContains("src/lib/cryptoVault.ts", "iv");
await assertContains("src/lib/cryptoVault.ts", "ciphertext");
await assertContains("src/App.tsx", "locked");
await assertContains("src/App.tsx", "unlocked");
await assertContains("src/lib/cryptoVault.ts", "AUTO_LOCK_MINUTES");
await assertContains("src/App.tsx", "setLanguage");

await assertNoRealSecretsInSamples();
await assertDistNoSecrets();

if (failures.length > 0) {
  console.error(`Self-test failed: ${failures.length} issue(s).`);
  process.exit(1);
}

console.log("Self-test passed.");
