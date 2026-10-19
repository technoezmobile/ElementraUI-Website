import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const ROOT_DIR = process.cwd();
const testDir = path.resolve(ROOT_DIR, "release/test-extract");
const zipFile = path.resolve(ROOT_DIR, "release/ElementraUI-Website-Source.zip");
const rootModules = path.resolve(ROOT_DIR, "node_modules");

if (fs.existsSync(testDir)) {
  fs.rmSync(testDir, { recursive: true, force: true });
}
fs.mkdirSync(testDir, { recursive: true });

console.log("Extracting archive via Python...");
const pyExtract = `import zipfile; zf = zipfile.ZipFile(r'${zipFile}'); zf.extractall(r'${testDir}'); zf.close()`;
execSync(`python -c "${pyExtract}"`, { stdio: "inherit" });

console.log("Creating junction to node_modules...");
execSync(`cmd /c mklink /J "${path.join(testDir, "node_modules")}" "${rootModules}"`, { stdio: "inherit" });

console.log("\n--- 1. Typecheck: tsc -b ---");
execSync("npx tsc -b", { cwd: testDir, stdio: "inherit" });
console.log("✓ tsc -b passed with 0 errors!");

console.log("\n--- 2. Production Build: vite build ---");
execSync("npx vite build", { cwd: testDir, stdio: "inherit" });
console.log("✓ vite build passed!");

console.log("\n--- 3. Dataset Integrity Audit ---");
execSync("node scripts/audit-dataset-health.js", { cwd: testDir, stdio: "inherit" });
console.log("✓ Dataset health audit passed!");

console.log("\nCleaning up test directory...");
execSync(`cmd /c rmdir "${path.join(testDir, "node_modules")}"`, { stdio: "inherit" });
fs.rmSync(testDir, { recursive: true, force: true });
console.log("✓ SUCCESS: Clean extraction, tsc, vite build, and dataset audit all passed cleanly!");
