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
  console.log("Project Health Test - Comprehensive Project Checks");
  console.log("=====================================================");

  const requiredFiles = [
    "package.json",
    "README.md",
    "RELEASE_NOTES.md",
    "LICENSE",
    "docs/PROJECT_LEVELS.md",
    "docs/MODULE_MATRIX.md",
    "docs/PROJECT_SPEC_TEMPLATE.md",
    "docs/NEW_PROJECT_START_GUIDE.md",
    "docs/COPY_TO_NEW_REPO_CHECKLIST.md",
    "public/manifest.webmanifest",
    "public/sw.js",
    "self-test.html",
    "public/self-test.js",
    ".github/workflows/pages.yml",
    "src/config/projectProfiles.ts",
    "src/config/moduleRegistry.ts",
    "src/config/siteMeta.ts",
    "src/components/ErrorBoundary.tsx",
    "src/lib/registerServiceWorker.ts",
    "src/App.tsx",
    "src/main.tsx",
    "index.html",
    "vite.config.ts",
    "tsconfig.json",
    ".gitignore",
  ];

  for (const file of requiredFiles) {
    if (await fileExists(file)) {
      pass(`required file exists: ${file}`);
    } else {
      fail(`required file missing: ${file}`);
    }
  }

  const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
  const scripts = packageJson.scripts ?? {};

  const requiredScripts = [
    "build",
    "self-test",
    "preflight",
    "test:static",
    "test:config",
    "test:docs",
    "test:dist",
    "test:pressure",
    "test:all",
    "test:ci",
  ];

  for (const script of requiredScripts) {
    if (scripts[script]) {
      pass(`package.json script exists: ${script}`);
    } else {
      fail(`package.json missing script: ${script}`);
    }
  }

  const packageVersion = packageJson.version;

  const siteMetaPath = "src/config/siteMeta.ts";
  if (await fileExists(siteMetaPath)) {
    const siteMetaContent = await readFile(path.join(root, siteMetaPath), "utf8");
    const versionMatch = siteMetaContent.match(/version:\s*"([^"]+)"/);
    const requiredFields = [
      "name",
      "shortName",
      "version",
      "description",
      "repositoryUrl",
      "demoUrl",
      "author",
      "license",
      "keywords",
      "localStoragePrefix",
    ];

    for (const field of requiredFields) {
      if (new RegExp(`${field}:\\s*`).test(siteMetaContent)) {
        pass(`siteMeta has field: ${field}`);
      } else {
        fail(`siteMeta missing field: ${field}`);
      }
    }

    if (versionMatch) {
      if (versionMatch[1] === packageVersion) {
        pass(`version consistency: package.json (${packageVersion}) matches siteMeta.ts`);
      } else {
        fail(`version mismatch: package.json (${packageVersion}) vs siteMeta.ts (${versionMatch[1]})`);
      }
    } else {
      warn("siteMeta.ts exists but version not found");
    }
  } else {
    warn("siteMeta.ts not found - consider creating for unified version management");
  }

  const configFiles = [
    "src/config/projectProfiles.ts",
    "src/config/moduleRegistry.ts",
  ];

  for (const config of configFiles) {
    if (await fileExists(config)) {
      const content = await readFile(path.join(root, config), "utf8");
      if (content.includes("C") && content.includes("B") && content.includes("A")) {
        pass(`config file contains C/B/A levels: ${config}`);
      } else {
        warn(`config file may lack C/B/A levels: ${config}`);
      }
    }
  }

  const componentFiles = [
    "src/components/Button.tsx",
    "src/components/Card.tsx",
    "src/components/Modal.tsx",
    "src/components/Toast.tsx",
    "src/components/ErrorBoundary.tsx",
  ];

  for (const component of componentFiles) {
    if (await fileExists(component)) {
      pass(`component exists: ${component}`);
    } else {
      warn(`component missing: ${component}`);
    }
  }

  const docsFiles = [
    "docs/PROJECT_LEVELS.md",
    "docs/MODULE_MATRIX.md",
    "docs/VERSIONING_GUIDE.md",
  ];

  for (const doc of docsFiles) {
    if (await fileExists(doc)) {
      pass(`documentation exists: ${doc}`);
    } else {
      warn(`documentation missing: ${doc}`);
    }
  }

  if (packageJson.license) {
    pass(`package.json has license: ${packageJson.license}`);
  } else {
    fail("package.json missing license field");
  }

  if (packageJson.repository && packageJson.homepage) {
    pass("package.json has repository and homepage");
  } else {
    fail("package.json missing repository/homepage field");
  }

  if (Array.isArray(packageJson.keywords) && packageJson.keywords.length >= 5) {
    pass("package.json has keywords");
  } else {
    fail("package.json missing useful keywords");
  }

  console.log("=====================================================");
  const total = passes.length + warnings.length + failures.length;
  console.log(`Project Health Score: ${passes.length}/${total}`);

  console.log(`\nSummary:`);
  console.log(`  PASS: ${passes.length}`);
  console.log(`  WARN: ${warnings.length}`);
  console.log(`  FAIL: ${failures.length}`);

  if (failures.length > 0) {
    console.error(`\nProject Health Test FAIL: ${failures.length} issue(s)`);
    process.exit(1);
  }

  if (warnings.length > 0) {
    console.warn(`\nProject Health Test passed with ${warnings.length} warning(s)`);
  } else {
    console.log(`\nProject Health Test PASS`);
  }
}

run().catch((err) => {
  console.error("Project Health Test error:", err.message);
  process.exit(1);
});
