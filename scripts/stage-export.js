import fs from "node:fs";
import path from "node:path";

const sourceRoot = path.resolve(".");
const stagingDir = path.resolve("E:/staging_export/21st-local-project");

console.log("=== 21st Local Export Staging Tool ===");
console.log(`Source:  ${sourceRoot}`);
console.log(`Staging: ${stagingDir}`);

// Clean existing staging directory if it exists
if (fs.existsSync(stagingDir)) {
  console.log("Removing previous staging directory...");
  fs.rmSync(stagingDir, { recursive: true, force: true });
}
fs.mkdirSync(stagingDir, { recursive: true });

// Copy directory with exclusion rules
function copyDirRecursive(src, dest, excludeNames = []) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    if (excludeNames.includes(entry.name)) {
      continue;
    }
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath, excludeNames);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 1. Copy source code, public data, scripts, test-install
console.log("Copying src/...");
copyDirRecursive(path.join(sourceRoot, "src"), path.join(stagingDir, "src"));

console.log("Copying public/...");
copyDirRecursive(path.join(sourceRoot, "public"), path.join(stagingDir, "public"));

console.log("Copying scripts/...");
copyDirRecursive(path.join(sourceRoot, "scripts"), path.join(stagingDir, "scripts"));

if (fs.existsSync(path.join(sourceRoot, "test-install"))) {
  console.log("Copying test-install/...");
  copyDirRecursive(path.join(sourceRoot, "test-install"), path.join(stagingDir, "test-install"));
}

// 2. Copy root files
const rootFiles = [
  "package.json",
  "package-lock.json",
  "tsconfig.json",
  "vite.config.ts",
  "index.html",
  "README.md",
  ".env.example",
  "component_inventory.csv",
  "AWESOME_COMPONENTS_IMPORT_REPORT.md",
  "MASTER_COMPLETION_REPORT.md",
  "NEXT_STEPS.md",
  "PHASE3_AUDIT.md",
  "PHASE4_1_AUDIT.md",
  "PHASE4_1_REPORT.md",
  "PHASE4_REPORT.md",
  "PHASE5_UI_OVERHAUL_REPORT.md",
  "PHASE6_MARKETPLACE_REPORT.md",
  "PREVIEW_COVERAGE_REPORT.md",
  "RECON_REPORT.md"
];

for (const file of rootFiles) {
  const src = path.join(sourceRoot, file);
  if (fs.existsSync(src)) {
    console.log(`Copying root file: ${file}`);
    fs.copyFileSync(src, path.join(stagingDir, file));
  }
}

// 3. Copy .cache/awesome-components (excluding .git)
console.log("Copying .cache/awesome-components (excluding .git)...");
const cacheSrc = path.join(sourceRoot, ".cache/awesome-components");
const cacheDest = path.join(stagingDir, ".cache/awesome-components");
copyDirRecursive(cacheSrc, cacheDest, [".git"]);

console.log("\nStaging completed successfully.");
