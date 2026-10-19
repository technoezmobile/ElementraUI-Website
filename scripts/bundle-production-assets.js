import fs from "node:fs";
import path from "node:path";

console.log("=================================================================");
console.log("   ELEMENTRAUI: PRODUCTION STATIC ASSET BUNDLER                  ");
console.log("=================================================================\n");

const startTime = Date.now();

// 1. Resolve source asset directory with clear priority
const candidateSrcs = [
  path.resolve("community-assets/components"),
  path.resolve(".cache/awesome-components/components")
];

let srcDir = null;
for (const cand of candidateSrcs) {
  if (fs.existsSync(cand) && fs.statSync(cand).isDirectory()) {
    srcDir = cand;
    break;
  }
}

if (!srcDir) {
  console.error("✗ ERROR: Required community asset directory not found.");
  console.error("  Expected one of:");
  for (const c of candidateSrcs) {
    console.error(`    - ${c}`);
  }
  console.error("  Cannot produce a production-ready build without community preview assets.\n");
  process.exit(1);
}

const distDir = path.resolve("dist/awesome-components");
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

console.log(`Source directory:      ${srcDir}`);
console.log(`Destination directory: ${distDir}\n`);
console.log("Bundling community preview assets (HTML, PNG, SVG, CSS, JS, MD)...");

const ALLOWED_EXTENSIONS = new Set([
  ".html",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".svg",
  ".css",
  ".js",
  ".json",
  ".md"
]);

let copiedCount = 0;
let skippedCount = 0;
let totalBytes = 0;

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (ALLOWED_EXTENSIONS.has(ext)) {
        const srcStat = fs.statSync(srcPath);
        totalBytes += srcStat.size;

        // Incremental check: if dest exists with same size, skip copy
        if (fs.existsSync(destPath)) {
          const destStat = fs.statSync(destPath);
          if (destStat.size === srcStat.size) {
            skippedCount++;
            continue;
          }
        }

        fs.copyFileSync(srcPath, destPath);
        copiedCount++;
      }
    }
  }
}

try {
  copyDirRecursive(srcDir, distDir);
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  const totalFiles = copiedCount + skippedCount;

  if (totalFiles === 0) {
    console.error("✗ ERROR: Source directory exists but contains zero valid preview assets.");
    process.exit(1);
  }

  console.log("\n--- Asset Bundling Summary ---");
  console.log(`  Total assets evaluated: ${totalFiles}`);
  console.log(`  Newly copied:           ${copiedCount}`);
  console.log(`  Up-to-date (cached):    ${skippedCount}`);
  console.log(`  Total payload:          ${(totalBytes / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`  Elapsed time:           ${duration}s`);
  console.log("✓ Successfully bundled preview assets into dist/awesome-components!\n");
} catch (err) {
  console.error("✗ Asset bundling error:", err);
  process.exit(1);
}
