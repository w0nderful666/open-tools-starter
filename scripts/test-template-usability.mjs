import { readFile, access } from "node:fs/promises";
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

async function fileExists(filePath) {
  try {
    await access(path.join(root, filePath));
    return true;
  } catch {
    return false;
  }
}

async function run() {
  console.log("Template Usability Test - Project Reusability Checks");
  console.log("========================================================");

  const checklistPath = "docs/COPY_TO_NEW_REPO_CHECKLIST.md";
  if (await fileExists(checklistPath)) {
    pass(`copy checklist exists: ${checklistPath}`);
  } else {
    fail(`copy checklist missing: ${checklistPath}`);
  }

  const specTemplatePath = "docs/PROJECT_SPEC_TEMPLATE.md";
  if (await fileExists(specTemplatePath)) {
    pass(`project spec template exists: ${specTemplatePath}`);
  } else {
    fail(`project spec template missing: ${specTemplatePath}`);
  }

  const readme = await readFile(path.join(root, "README.md"), "utf8");

  const checks = [
    { pattern: /复制|copy.*模板|template|复制整个项目/i, name: "copy template instructions", required: true },
    { pattern: /GitHub Pages/i, name: "GitHub Pages deployment", required: true },
    { pattern: /npm (run )?(dev|install|build)/i, name: "local run instructions", required: true },
    { pattern: /build|self-test|preflight/i, name: "build/self-test/preflight instructions", required: true },
    { pattern: /C.*B.*A|等级|Level.*C.*B.*A/i, name: "C/B/A level system", required: true },
    { pattern: /Module.*Registry|模块矩阵/i, name: "Module Registry", required: true },
    { pattern: /localStorage|Local First/i, name: "localStorage/Local First", required: true },
    { pattern: /隐私|Privacy Friendly|Privacy/i, name: "privacy principles", required: true },
    { pattern: /不做什么|out of scope|不包括|not.*include/i, name: "scope boundaries", required: true },
  ];

  for (const check of checks) {
    if (check.pattern.test(readme)) {
      pass(`README contains ${check.name}`);
    } else if (check.required) {
      fail(`README missing required: ${check.name}`);
    }
  }

  const releaseNotesPath = "RELEASE_NOTES.md";
  if (await fileExists(releaseNotesPath)) {
    pass("RELEASE_NOTES.md exists");
  } else {
    fail("RELEASE_NOTES.md missing");
  }

  const licensePath = "LICENSE";
  if (await fileExists(licensePath)) {
    const license = await readFile(path.join(root, licensePath), "utf8");
    if (license.includes("MIT")) {
      pass("LICENSE exists (MIT)");
    } else {
      warn("LICENSE exists but may not be MIT");
    }
  } else {
    fail("LICENSE missing");
  }

  const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
  if (packageJson.name === "open-tools-starter") {
    pass("package.json name is template name (correct for template project)");
  } else {
    pass(`package.json name: ${packageJson.name}`);
  }

  const hardcodedCount = (readme.match(/open-tools-starter/gi) || []).length;
  if (hardcodedCount > 10) {
    warn(`README contains ${hardcodedCount} references to "open-tools-starter" - may need update when copying to new project`);
  } else {
    pass(`README has reasonable template references (${hardcodedCount})`);
  }

  const docsFiles = [
    "docs/PROJECT_LEVELS.md",
    "docs/MODULE_MATRIX.md",
    "docs/NEW_PROJECT_START_GUIDE.md",
    "docs/TEMPLATE_MAINTENANCE.md",
    "docs/VERSIONING_GUIDE.md",
  ];

  let docCount = 0;
  for (const doc of docsFiles) {
    if (await fileExists(doc)) docCount++;
  }

  if (docCount >= 4) {
    pass(`sufficient documentation exists (${docCount}/${docsFiles.length})`);
  } else {
    warn(`some documentation missing (${docCount}/${docsFiles.length})`);
  }

  const configFiles = [
    "src/config/projectProfiles.ts",
    "src/config/moduleRegistry.ts",
  ];

  for (const config of configFiles) {
    if (await fileExists(config)) {
      const content = await readFile(path.join(root, config), "utf8");
      if (content.includes("required") || content.includes("recommended")) {
        pass(`${config} has module status definitions`);
      }
    }
  }

  console.log("========================================================");
  const total = passes.length + warnings.length + failures.length;
  console.log(`\nSummary:`);
  console.log(`  PASS: ${passes.length}`);
  console.log(`  WARN: ${warnings.length}`);
  console.log(`  FAIL: ${failures.length}`);

  if (failures.length > 0) {
    console.error(`\nTemplate Usability Test FAIL: ${failures.length} issue(s)`);
    process.exit(1);
  }

  if (warnings.length > 0) {
    console.warn(`\nTemplate Usability Test passed with ${warnings.length} warning(s)`);
  } else {
    console.log(`\nTemplate Usability Test PASS`);
  }
}

run().catch((err) => {
  console.error("Template Usability Test error:", err.message);
  process.exit(1);
});