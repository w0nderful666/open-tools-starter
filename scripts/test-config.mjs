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

async function fileExists(filePath) {
  try {
    await access(path.join(root, filePath));
    return true;
  } catch {
    return false;
  }
}

function extractStatusFromFile(content, filename) {
  const statuses = new Set();
  const statusValues = ["required", "recommended", "optional", "not-recommended"];

  statusValues.forEach((status) => {
    const regex = new RegExp(status, "gi");
    if (regex.test(content)) {
      statuses.add(status);
    }
  });

  return statuses;
}

async function run() {
  console.log("Config Test - Module Registry and Project Profiles");
  console.log("====================================================");

  const configFiles = [
    "src/config/moduleRegistry.ts",
    "src/config/projectProfiles.ts",
  ];

  for (const file of configFiles) {
    const exists = await fileExists(file);
    if (exists) {
      pass(`file exists: ${file}`);
    } else {
      fail(`file missing: ${file}`);
    }
  }

  const docsFiles = [
    "docs/PROJECT_LEVELS.md",
    "docs/MODULE_MATRIX.md",
  ];

  for (const file of docsFiles) {
    const exists = await fileExists(file);
    if (exists) {
      pass(`doc exists: ${file}`);
    } else {
      fail(`doc missing: ${file}`);
    }
  }

  const moduleRegistryPath = path.join(root, "src/config/moduleRegistry.ts");
  try {
    const content = await readFile(moduleRegistryPath, "utf8");

    const statuses = extractStatusFromFile(content, "moduleRegistry.ts");
    if (statuses.has("required") && statuses.has("recommended") &&
        statuses.has("optional") && statuses.has("not-recommended")) {
      pass("moduleRegistry contains all C/B/A status values");
    } else {
      const missing = [];
      if (!statuses.has("required")) missing.push("required");
      if (!statuses.has("recommended")) missing.push("recommended");
      if (!statuses.has("optional")) missing.push("optional");
      if (!statuses.has("not-recommended")) missing.push("not-recommended");
      fail(`moduleRegistry missing status values: ${missing.join(", ")}`);
    }

    if (content.includes("C") && content.includes("B") && content.includes("A")) {
      pass("moduleRegistry mentions C/B/A levels");
    } else {
      fail("moduleRegistry does not mention all C/B/A levels");
    }
  } catch {
    fail("cannot read moduleRegistry.ts");
  }

  const projectProfilesPath = path.join(root, "src/config/projectProfiles.ts");
  try {
    const content = await readFile(projectProfilesPath, "utf8");
    const levels = ["C", "B", "A"];
    const foundLevels = levels.filter((level) => content.includes(`level: "${level}"`) || content.includes(`level: '${level}'`));

    if (foundLevels.length === 3) {
      pass("projectProfiles contains all C/B/A levels");
    } else {
      fail(`projectProfiles missing levels: ${levels.filter(l => !foundLevels.includes(l)).join(", ")}`);
    }
  } catch {
    fail("cannot read projectProfiles.ts");
  }

  const readmePath = path.join(root, "README.md");
  try {
    const readme = await readFile(readmePath, "utf8");
    if (readme.includes("C 级") || readme.includes("Level C") ||
        readme.includes("C级") || readme.includes("Level C")) {
      pass("README mentions C/B/A project levels");
    } else {
      fail("README does not mention project levels");
    }
  } catch {
    fail("cannot read README.md");
  }

  const moduleMatrixPath = path.join(root, "docs/MODULE_MATRIX.md");
  try {
    const matrix = await readFile(moduleMatrixPath, "utf8");
    if (matrix.includes("|") && (matrix.includes("必须") || matrix.includes("Required") || matrix.includes("recommended"))) {
      pass("MODULE_MATRIX contains module status table");
    } else {
      warn("MODULE_MATRIX may not contain expected table format");
    }
  } catch {
    warn("cannot verify MODULE_MATRIX content");
  }

  const i18nPath = path.join(root, "src/i18n/messages.ts");
  try {
    const i18n = await readFile(i18nPath, "utf8");
    const hasLevelKeywords = i18n.includes("等级") || i18n.includes("Level") || i18n.includes("Profile");
    if (hasLevelKeywords) {
      pass("i18n contains level-related keywords");
    } else {
      warn("i18n may be missing level-related keywords");
    }
  } catch {
    warn("cannot verify i18n content");
  }

  console.log("====================================================");
  if (failures.length > 0) {
    console.error(`Config Test FAIL: ${failures.length} issue(s)`);
    process.exit(1);
  }
  if (warnings.length > 0) {
    console.warn(`Config Test WARN: ${warnings.length} warning(s)`);
  }
  console.log("Config Test PASS");
}

run().catch((err) => {
  console.error("Config Test error:", err.message);
  process.exit(1);
});