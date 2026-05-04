import { existsSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { Worker } from "node:worker_threads";

const root = process.cwd();

function parseRounds() {
  const roundsArg = process.argv.find((arg) => arg.startsWith("--rounds="));
  const roundsIndex = process.argv.findIndex((arg) => arg === "--rounds");
  const roundsValue = roundsArg?.split("=")[1]
    ?? (roundsIndex >= 0 ? process.argv[roundsIndex + 1] : undefined)
    ?? process.argv.find((arg) => /^\d+$/.test(arg))
    ?? process.env.PRESSURE_ROUNDS
    ?? "3";

  return parseInt(roundsValue, 10);
}

const rounds = parseRounds();

const maxRounds = 20;
const validRounds = Number.isFinite(rounds)
  ? Math.min(Math.max(rounds, 1), maxRounds)
  : 3;

console.log("Pressure Test - High Intensity Quality Check");
console.log("===============================================");
console.log(`Running ${validRounds} round(s) of tests`);
console.log("");

let failedRound = null;
let totalFailures = 0;

const testCommands = [
  { name: "test:static", file: "scripts/test-static.mjs" },
  { name: "test:config", file: "scripts/test-config.mjs" },
  { name: "test:docs", file: "scripts/test-docs.mjs" },
  { name: "test:health", file: "scripts/test-project-health.mjs" },
  { name: "test:privacy", file: "scripts/test-privacy-boundary.mjs" },
  { name: "test:usability", file: "scripts/test-template-usability.mjs" },
  { name: "preflight", file: "scripts/preflight.mjs" },
];

if (existsSync(path.join(root, "dist"))) {
  testCommands.push({ name: "test:dist", file: "scripts/test-dist.mjs" });
  testCommands.push({ name: "test:ui", file: "scripts/test-ui-contract.mjs" });
}

function runScriptInWorker(test) {
  return new Promise((resolve) => {
    const worker = new Worker(pathToFileURL(path.join(root, test.file)), {
      stdout: true,
      stderr: true,
    });

    let output = "";
    worker.stdout?.on("data", (chunk) => {
      output += chunk.toString();
    });
    worker.stderr?.on("data", (chunk) => {
      output += chunk.toString();
    });

    worker.on("error", (error) => {
      resolve({ ok: false, output: error.message });
    });

    worker.on("exit", (code) => {
      resolve({ ok: code === 0, output });
    });
  });
}

for (let round = 1; round <= validRounds; round++) {
  console.log(`--- Round ${round}/${validRounds} ---`);

  for (const test of testCommands) {
    const result = await runScriptInWorker(test);

    if (result.ok) {
      console.log(`  ${test.name}: PASS`);
    } else {
      console.error(`  ${test.name}: FAIL`);
      if (result.output) {
        console.error(result.output.slice(0, 500));
      }
      failedRound = round;
      totalFailures++;
      break;
    }
  }

  if (failedRound !== null) {
    break;
  }

  console.log("");
}

console.log("===============================================");

if (failedRound !== null) {
  console.error(`Pressure Test FAILED at round ${failedRound}`);
  console.error(`Total failures: ${totalFailures}`);
  process.exit(1);
}

console.log(`Pressure Test PASSED - ${validRounds} round(s) completed`);
console.log("All tests passed consistently across multiple runs");
