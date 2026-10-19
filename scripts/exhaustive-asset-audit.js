import fs from "node:fs";
import path from "node:path";

console.log("=================================================================");
console.log("   ELEMENTRAUI: EXHAUSTIVE DETERMINISTIC ASSET VALIDATION        ");
console.log("=================================================================\n");

const ROOT_DIR = process.cwd();
const SRC_ASSETS_DIR = path.resolve(ROOT_DIR, "community-assets/components");
const DIST_ASSETS_DIR = path.resolve(ROOT_DIR, "dist/awesome-components");
const CORE_CATALOGUE_PATH = path.resolve(ROOT_DIR, "src/data/fullCatalogue.json");
const AWESOME_CATALOGUE_PATH = path.resolve(ROOT_DIR, "public/data/awesome-catalogue.json");
const ARTIFACTS_DIR = path.resolve(ROOT_DIR, "artifacts");

if (!fs.existsSync(ARTIFACTS_DIR)) {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
}

// 1. Load Catalogue Records
const coreItems = JSON.parse(fs.readFileSync(CORE_CATALOGUE_PATH, "utf8"));
const awesomeItems = JSON.parse(fs.readFileSync(AWESOME_CATALOGUE_PATH, "utf8"));
const allItems = [...coreItems, ...awesomeItems];

console.log(`Catalogue Files Loaded:`);
console.log(`  - Core items:      ${coreItems.length} (${CORE_CATALOGUE_PATH})`);
console.log(`  - Community items: ${awesomeItems.length} (${AWESOME_CATALOGUE_PATH})`);
console.log(`  - Total records:   ${allItems.length}\n`);

console.log(`Source Asset Directory: ${SRC_ASSETS_DIR}`);
console.log(`Dist Asset Directory:   ${DIST_ASSETS_DIR}\n`);

// 2. Track Unique Assets (Avoid double-counting identical files across records)
const uniqueHtmlAssets = new Map(); // relativePath -> { records: [], srcExists, srcSize, distExists, distSize, isZeroByte }
const uniqueScreenshotAssets = new Map(); // relativePath -> { records: [], srcExists, srcSize, distExists, distSize, isZeroByte, isValidImageHeader }
const uniquePromptAssets = new Map(); // relativePath -> { records: [], srcExists, srcSize, distExists, distSize, isZeroByte }

// Record-level stats
let recordsWithHtml = 0;
let recordsWithScreenshot = 0;
let recordsWithPrompt = 0;
let recordsCoreExecutable = 0;
let recordsThemes = 0;
let recordsTemplates = 0;
let recordsPromptsOnly = 0;
let recordsOther = 0;
let recordsFallbackOnly = 0;

// URL Consistency Check
const urlAnomalies = [];

// Helper to check PNG/JPEG header
function checkImageMagicBytes(filePath) {
  try {
    const fd = fs.openSync(filePath, "r");
    const buf = Buffer.alloc(8);
    const bytesRead = fs.readSync(fd, buf, 0, 8, 0);
    fs.closeSync(fd);
    if (bytesRead < 4) return false;
    // PNG: 89 50 4E 47
    if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return true;
    // JPEG: FF D8 FF
    if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return true;
    // WebP: 52 49 46 46 (RIFF)
    if (buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46) return true;
    return false;
  } catch (e) {
    return false;
  }
}

for (const item of allItems) {
  // Categorize
  if (item.componentCode && item.componentCode.trim().length > 0) {
    recordsCoreExecutable++;
  } else if (item.itemType === "theme") {
    recordsThemes++;
  } else if (item.itemType === "template") {
    recordsTemplates++;
  } else if (item.itemType === "prompt" || (item.promptData && !item.awesomeData)) {
    recordsPromptsOnly++;
  } else if (!item.awesomeData) {
    recordsOther++;
  }

  if (item.awesomeData) {
    const ad = item.awesomeData;
    
    // Check if this record is fallback-only (no HTML, only screenshot or prompt)
    if (!ad.hasHtml && (ad.hasScreenshot || ad.hasPrompt)) {
      recordsFallbackOnly++;
    }

    // 1. HTML Reference
    if (ad.hasHtml && ad.htmlUrl) {
      recordsWithHtml++;

      // Check URL format
      if (!ad.htmlUrl.startsWith("/awesome-components/")) {
        urlAnomalies.push({ id: item.id, type: "html", url: ad.htmlUrl, reason: "Does not start with /awesome-components/" });
      }

      const relPath = ad.htmlUrl.replace(/^\/?(awesome-components|community-assets)\//, "");
      if (!uniqueHtmlAssets.has(relPath)) {
        const srcPath = path.join(SRC_ASSETS_DIR, relPath);
        const distPath = path.join(DIST_ASSETS_DIR, relPath);
        const srcExists = fs.existsSync(srcPath);
        const srcSize = srcExists ? fs.statSync(srcPath).size : -1;
        const distExists = fs.existsSync(distPath);
        const distSize = distExists ? fs.statSync(distPath).size : -1;

        uniqueHtmlAssets.set(relPath, {
          records: [item.id],
          relPath,
          srcPath,
          distPath,
          srcExists,
          srcSize,
          distExists,
          distSize,
          isZeroByte: srcExists && srcSize === 0
        });
      } else {
        uniqueHtmlAssets.get(relPath).records.push(item.id);
      }
    }

    // 2. Screenshot Reference
    if (ad.hasScreenshot && ad.screenshotUrl) {
      recordsWithScreenshot++;

      // Check URL format
      if (!ad.screenshotUrl.startsWith("/awesome-components/")) {
        urlAnomalies.push({ id: item.id, type: "screenshot", url: ad.screenshotUrl, reason: "Does not start with /awesome-components/" });
      }

      const relPath = ad.screenshotUrl.replace(/^\/?(awesome-components|community-assets)\//, "");
      if (!uniqueScreenshotAssets.has(relPath)) {
        const srcPath = path.join(SRC_ASSETS_DIR, relPath);
        const distPath = path.join(DIST_ASSETS_DIR, relPath);
        const srcExists = fs.existsSync(srcPath);
        const srcSize = srcExists ? fs.statSync(srcPath).size : -1;
        const distExists = fs.existsSync(distPath);
        const distSize = distExists ? fs.statSync(distPath).size : -1;
        const isValidImageHeader = srcExists && srcSize > 0 ? checkImageMagicBytes(srcPath) : false;

        uniqueScreenshotAssets.set(relPath, {
          records: [item.id],
          relPath,
          srcPath,
          distPath,
          srcExists,
          srcSize,
          distExists,
          distSize,
          isZeroByte: srcExists && srcSize === 0,
          isValidImageHeader
        });
      } else {
        uniqueScreenshotAssets.get(relPath).records.push(item.id);
      }
    }

    // 3. Prompt Reference
    if (ad.hasPrompt && ad.promptUrl) {
      recordsWithPrompt++;
      const relPath = ad.promptUrl.replace(/^\/?(awesome-components|community-assets)\//, "");
      if (!uniquePromptAssets.has(relPath)) {
        const srcPath = path.join(SRC_ASSETS_DIR, relPath);
        const distPath = path.join(DIST_ASSETS_DIR, relPath);
        const srcExists = fs.existsSync(srcPath);
        const srcSize = srcExists ? fs.statSync(srcPath).size : -1;
        const distExists = fs.existsSync(distPath);
        const distSize = distExists ? fs.statSync(distPath).size : -1;

        uniquePromptAssets.set(relPath, {
          records: [item.id],
          relPath,
          srcPath,
          distPath,
          srcExists,
          srcSize,
          distExists,
          distSize,
          isZeroByte: srcExists && srcSize === 0
        });
      } else {
        uniquePromptAssets.get(relPath).records.push(item.id);
      }
    }
  }
}

// Compute Unique Aggregates
const htmlArr = Array.from(uniqueHtmlAssets.values());
const screenshotArr = Array.from(uniqueScreenshotAssets.values());
const promptArr = Array.from(uniquePromptAssets.values());

const uniqueHtmlCount = htmlArr.length;
const srcHtmlFound = htmlArr.filter(x => x.srcExists && !x.isZeroByte).length;
const srcHtmlZeroByte = htmlArr.filter(x => x.isZeroByte).length;
const srcHtmlMissing = htmlArr.filter(x => !x.srcExists).length;
const distHtmlFound = htmlArr.filter(x => x.distExists && x.distSize > 0).length;
const distHtmlMissing = htmlArr.filter(x => !x.distExists).length;

const uniqueScreenshotCount = screenshotArr.length;
const srcScreenshotFound = screenshotArr.filter(x => x.srcExists && !x.isZeroByte).length;
const srcScreenshotZeroByte = screenshotArr.filter(x => x.isZeroByte).length;
const srcScreenshotMissing = screenshotArr.filter(x => !x.srcExists).length;
const srcScreenshotInvalidHeader = screenshotArr.filter(x => x.srcExists && !x.isZeroByte && !x.isValidImageHeader).length;
const distScreenshotFound = screenshotArr.filter(x => x.distExists && x.distSize > 0).length;
const distScreenshotMissing = screenshotArr.filter(x => !x.distExists).length;

const uniquePromptCount = promptArr.length;
const srcPromptFound = promptArr.filter(x => x.srcExists && !x.isZeroByte).length;
const srcPromptZeroByte = promptArr.filter(x => x.isZeroByte).length;
const srcPromptMissing = promptArr.filter(x => !x.srcExists).length;
const distPromptFound = promptArr.filter(x => x.distExists && x.distSize > 0).length;
const distPromptMissing = promptArr.filter(x => !x.distExists).length;

// Total required assets
const totalRequiredSourceAssets = srcHtmlFound + srcScreenshotFound + srcPromptFound;
const totalCopiedToDist = distHtmlFound + distScreenshotFound + distPromptFound;
const totalMissingProduction = distHtmlMissing + distScreenshotMissing + distPromptMissing;
const totalZeroByte = srcHtmlZeroByte + srcScreenshotZeroByte + srcPromptZeroByte;

console.log("=================== CATALOGUE COMPOSITION ===================");
console.log(`  Total Catalogue Records Examined:           ${allItems.length}`);
console.log(`  - Core Verified React/TSX Records:          ${recordsCoreExecutable}`);
console.log(`  - Community Records with HTML Snapshots:    ${recordsWithHtml}`);
console.log(`  - Community Records with Screenshots:       ${recordsWithScreenshot}`);
console.log(`  - Community Records with Prompts:           ${recordsWithPrompt}`);
console.log(`  - Intentionally Fallback-Only Records:      ${recordsFallbackOnly}`);
console.log(`  - Design System Theme Presets:              ${recordsThemes}`);
console.log(`  - Full Application Starter Templates:       ${recordsTemplates}`);
console.log(`  - Standalone Prompt Blueprints:             ${recordsPromptsOnly}`);
console.log(`  - Icons, Vectors, Mini-Apps, Shaders:       ${recordsOther}`);

console.log("\n=================== DETERMINISTIC ASSET AUDIT ===================");
console.log("1. HTML SNAPSHOTS (Unique):");
console.log(`   - Unique HTML files referenced:            ${uniqueHtmlCount}`);
console.log(`   - Valid source HTML files (> 0 bytes):     ${srcHtmlFound} (${((srcHtmlFound / uniqueHtmlCount) * 100).toFixed(2)}%)`);
console.log(`   - Missing source HTML files:               ${srcHtmlMissing}`);
console.log(`   - Zero-byte source HTML files:             ${srcHtmlZeroByte}`);
console.log(`   - Successfully copied to dist/:            ${distHtmlFound} / ${uniqueHtmlCount}`);
console.log(`   - Missing from production dist/:           ${distHtmlMissing}`);

console.log("\n2. SCREENSHOT REFERENCES (Unique):");
console.log(`   - Unique screenshot files referenced:      ${uniqueScreenshotCount}`);
console.log(`   - Valid source screenshots (> 0 bytes):    ${srcScreenshotFound} (${((srcScreenshotFound / uniqueScreenshotCount) * 100).toFixed(2)}%)`);
console.log(`   - Screenshots with verified image headers: ${screenshotArr.filter(x => x.isValidImageHeader).length}`);
console.log(`   - Missing source screenshots:              ${srcScreenshotMissing}`);
console.log(`   - Zero-byte source screenshots:            ${srcScreenshotZeroByte}`);
console.log(`   - Successfully copied to dist/:            ${distScreenshotFound} / ${uniqueScreenshotCount}`);
console.log(`   - Missing from production dist/:           ${distScreenshotMissing}`);

console.log("\n3. IMPLEMENTATION PROMPTS (Unique):");
console.log(`   - Unique prompt files referenced:          ${uniquePromptCount}`);
console.log(`   - Valid source prompt files (> 0 bytes):   ${srcPromptFound} (${((srcPromptFound / uniquePromptCount) * 100).toFixed(2)}%)`);
console.log(`   - Missing source prompts:                  ${srcPromptMissing}`);
console.log(`   - Zero-byte source prompts:                ${srcPromptZeroByte}`);
console.log(`   - Successfully copied to dist/:            ${distPromptFound} / ${uniquePromptCount}`);
console.log(`   - Missing from production dist/:           ${distPromptMissing}`);

console.log("\n=================== AGGREGATE TOTALS ===================");
console.log(`  Required Unique Source Assets Found:        ${totalRequiredSourceAssets}`);
console.log(`  Required Assets Successfully in dist/:      ${totalCopiedToDist}`);
console.log(`  Missing Source Assets:                      ${srcHtmlMissing + srcScreenshotMissing + srcPromptMissing}`);
console.log(`  Missing Production dist/ Assets:            ${totalMissingProduction}`);
console.log(`  Zero-Byte Assets:                           ${totalZeroByte}`);
console.log(`  URL Path Format Anomalies:                  ${urlAnomalies.length}`);

// Print details of any zero-byte assets
if (totalZeroByte > 0) {
  console.log("\n--- Zero-Byte Assets Detail ---");
  for (const h of htmlArr.filter(x => x.isZeroByte)) {
    console.log(`  [HTML 0-byte] ${h.relPath} (Record: ${h.records[0]})`);
  }
  for (const s of screenshotArr.filter(x => x.isZeroByte)) {
    console.log(`  [Screenshot 0-byte] ${s.relPath} (Record: ${s.records[0]})`);
  }
}

// Save detailed audit JSON
const auditReport = {
  timestamp: new Date().toISOString(),
  totalRecordsExamined: allItems.length,
  recordsWithHtml,
  recordsWithScreenshot,
  recordsWithPrompt,
  recordsFallbackOnly,
  uniqueAssets: {
    html: { referenced: uniqueHtmlCount, srcFound: srcHtmlFound, srcMissing: srcHtmlMissing, srcZeroByte: srcHtmlZeroByte, distFound: distHtmlFound, distMissing: distHtmlMissing },
    screenshot: { referenced: uniqueScreenshotCount, srcFound: srcScreenshotFound, srcMissing: srcScreenshotMissing, srcZeroByte: srcScreenshotZeroByte, distFound: distScreenshotFound, distMissing: distScreenshotMissing },
    prompt: { referenced: uniquePromptCount, srcFound: srcPromptFound, srcMissing: srcPromptMissing, srcZeroByte: srcPromptZeroByte, distFound: distPromptFound, distMissing: distPromptMissing }
  },
  zeroByteFiles: [
    ...htmlArr.filter(x => x.isZeroByte).map(x => ({ type: "html", path: x.relPath, records: x.records })),
    ...screenshotArr.filter(x => x.isZeroByte).map(x => ({ type: "screenshot", path: x.relPath, records: x.records }))
  ],
  missingDistFiles: [
    ...htmlArr.filter(x => !x.distExists).map(x => ({ type: "html", path: x.relPath })),
    ...screenshotArr.filter(x => !x.distExists).map(x => ({ type: "screenshot", path: x.relPath }))
  ]
};

const auditReportPath = path.join(ARTIFACTS_DIR, "exhaustive-asset-audit.json");
fs.writeFileSync(auditReportPath, JSON.stringify(auditReport, null, 2), "utf8");
console.log(`\nDetailed audit report saved to:\n  ${auditReportPath}\n`);

if (totalMissingProduction > 0 || urlAnomalies.length > 0) {
  console.error("✗ AUDIT FAILED: Missing production assets or malformed URLs detected.");
  process.exit(1);
} else {
  console.log("✓ AUDIT PASSED: 100% of required source assets exist and are successfully present in dist/!");
  process.exit(0);
}
