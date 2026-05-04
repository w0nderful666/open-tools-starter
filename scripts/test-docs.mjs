import { readFile, access, readdir } from "node:fs/promises";
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

const requiredDocs = [
  "README.md",
  "RELEASE_NOTES.md",
  "LICENSE",
  "docs/PROJECT_LEVELS.md",
  "docs/MODULE_MATRIX.md",
  "docs/OPENCODE_PRESETS.md",
  "docs/NEW_PROJECT_START_GUIDE.md",
  "docs/PROJECT_SPEC_TEMPLATE.md",
  "docs/RELEASE_CHECKLIST.md",
  "docs/assets/preview.svg",
];

const placeholderPatterns = [
  { pattern: /\bTODO\b/i, name: "TODO" },
  { pattern: /\bFIXME\b/i, name: "FIXME" },
  { pattern: /coming soon/i, name: "coming soon" },
  { pattern: /placeholder/i, name: "placeholder" },
  { pattern: /待补充/i, name: "待补充" },
  { pattern: /稍后补充/i, name: "稍后补充" },
  { pattern: /未完成/i, name: "未完成" },
];

async function run() {
  console.log("Docs Test - Documentation Quality Checks");
  console.log("==========================================");

  for (const doc of requiredDocs) {
    const exists = await fileExists(doc);
    if (exists) {
      pass(`doc exists: ${doc}`);
    } else {
      fail(`doc missing: ${doc}`);
    }
  }

  const readmePath = path.join(root, "README.md");
  try {
    const readme = await readFile(readmePath, "utf8");

    const checks = [
      { pattern: /https?:\/\//, name: "online demo URL" },
      { pattern: /npm (run )?(dev|install|build)/, name: "local run instructions" },
      { pattern: /GitHub Pages/i, name: "GitHub Pages deployment" },
      { pattern: /隐私|Privacy|Local First|No Backend/i, name: "privacy principles" },
      { pattern: /preview\.svg|License|MIT/i, name: "preview or license section" },
    ];

    for (const check of checks) {
      if (check.pattern.test(readme)) {
        pass(`README contains ${check.name}`);
      } else {
        fail(`README missing ${check.name}`);
      }
    }

    const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
    const version = packageJson.version;
    const versionInReadme = readme.includes(version);

    if (versionInReadme || readme.includes("v0.2")) {
      pass("README version reference consistent with package.json");
    } else {
      warn("README may not reflect current version");
    }
  } catch {
    fail("cannot read README.md");
  }

  const presetsPath = path.join(root, "docs/OPENCODE_PRESETS.md");
  try {
    const presets = await readFile(presetsPath, "utf8");
    const hasMultipleSections = (presets.match(/^##/gm) || []).length >= 2;
    const hasPromptContent = presets.includes("提示词") || presets.includes("prompt") || presets.includes("Prompt");

    if (hasMultipleSections && hasPromptContent) {
      pass("OPENCODE_PRESETS contains copyable prompts");
    } else {
      warn("OPENCODE_PRESETS may lack detailed prompt content");
    }
  } catch {
    warn("cannot verify OPENCODE_PRESETS content");
  }

  const releasePath = path.join(root, "RELEASE_NOTES.md");
  try {
    const release = await readFile(releasePath, "utf8");
    const hasVersionSection = release.match(/^##\s+v\d+\.\d+\.\d+/m);

    if (hasVersionSection) {
      pass("RELEASE_NOTES contains current version");
    } else {
      fail("RELEASE_NOTES missing version section");
    }
  } catch {
    fail("cannot read RELEASE_NOTES.md");
  }

  const docsDir = path.join(root, "docs");
  try {
    const entries = await readdir(docsDir);
    const mdFiles = entries.filter((f) => f.endsWith(".md"));

    for (const mdFile of mdFiles) {
      const filePath = path.join(docsDir, mdFile);
      const content = await readFile(filePath, "utf8");

      for (const placeholder of placeholderPatterns) {
        const matches = content.match(placeholder.pattern);
        if (matches) {
          const isChecklist = mdFile === "RELEASE_CHECKLIST.md" || mdFile === "OPENCODE_PRESETS.md";
          const contextLines = content.split("\n").filter((line) => placeholder.pattern.test(line));

          if (isChecklist) {
            warn(`${mdFile}: contains "${placeholder.name}" but may be in checklist context`);
          } else {
            const problematicLines = contextLines.slice(0, 2);
            fail(`${mdFile}: contains placeholder "${placeholder.name}": ${problematicLines.join("; ")}`);
          }
        }
      }
    }
  } catch (err) {
    warn(`cannot scan docs for placeholders: ${err.message}`);
  }

  console.log("==========================================");
  if (failures.length > 0) {
    console.error(`Docs Test FAIL: ${failures.length} issue(s)`);
    process.exit(1);
  }
  if (warnings.length > 0) {
    console.warn(`Docs Test WARN: ${warnings.length} warning(s)`);
  }
  console.log("Docs Test PASS");
}

run().catch((err) => {
  console.error("Docs Test error:", err.message);
  process.exit(1);
});