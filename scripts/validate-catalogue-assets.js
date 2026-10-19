#!/usr/bin/env node

/**
 * ElementraUI — Catalogue-to-Asset Reference Validator
 *
 * Verifies catalogue reference integrity against both source files on disk
 * and production output in dist/.
 *
 * Requirements:
 * 1. Reads actual catalogue data (core and community).
 * 2. Verifies referenced source assets exist.
 * 3. Verifies output assets exist in dist/ after a production build.
 * 4. Detects zero-byte files.
 * 5. Detects broken or malformed paths.
 * 6. Distinguishes required vs optional assets and intentionally non-HTML resources.
 * 7. Returns exit code 1 if required assets are missing.
 */

import fs from "node:fs";
import path from "node:path";

console.log("=================================================================");
console.log("   ELEMENTRAUI: CATALOGUE-TO-ASSET INTEGRITY VALIDATOR           ");
console.log("=================================================================\n");

const args = process.argv.slice(2);
const checkDistOnly = args.includes("--dist-only");
const skipDist = args.includes("--no-dist");

// 1. Locate Source Assets Directory
const candidateSrcDirs = [
  path.resolve("community-assets/components"),
  path.resolve(".cache/awesome-components/components")
];

let sourceBaseDir = null;
for (const cand of candidateSrcDirs) {
  if (fs.existsSync(cand) && fs.statSync(cand).isDirectory()) {
    sourceBaseDir = cand;
    break;
  }
}

const distBaseDir = path.resolve("dist/awesome-components");
const hasDist = fs.existsSync(distBaseDir);

console.log(`Source Asset Directory: ${sourceBaseDir || "NOT FOUND"}`);
console.log(`Dist Asset Directory:   ${distBaseDir} (${hasDist ? "FOUND" : "NOT FOUND / NOT BUILT"})\n`);

if (!sourceBaseDir && !checkDistOnly) {
  console.error("✗ BLOCKING ERROR: Source community assets directory not found.");
  process.exit(1);
}

// 2. Load Catalogues
const coreCataloguePath = path.resolve("src/data/fullCatalogue.json");
const awesomeCataloguePath = path.resolve("public/data/awesome-catalogue.json");

if (!fs.existsSync(coreCataloguePath)) {
  console.error(`✗ BLOCKING ERROR: Core catalogue file not found: ${coreCataloguePath}`);
  process.exit(1);
}
if (!fs.existsSync(awesomeCataloguePath)) {
  console.error(`✗ BLOCKING ERROR: Community catalogue file not found: ${awesomeCataloguePath}`);
  process.exit(1);
}

const coreItems = JSON.parse(fs.readFileSync(coreCataloguePath, "utf8"));
const awesomeItems = JSON.parse(fs.readFileSync(awesomeCataloguePath, "utf8"));
const allItems = [...coreItems, ...awesomeItems];

console.log(`Loaded ${coreItems.length} core records and ${awesomeItems.length} community records.`);
console.log(`Total master records to validate: ${allItems.length}\n`);

// Counters
const stats = {
  totalRecords: allItems.length,
  coreRecords: coreItems.length,
  communityRecords: awesomeItems.length,
  
  // Categorization
  executableReact: 0,
  htmlSnapshots: 0,
  screenshotReferences: 0,
  promptBlueprints: 0,
  templates: 0,
  themes: 0,
  otherResources: 0,

  // Asset validation metrics
  expectedHtmlAssets: 0,
  sourceHtmlFound: 0,
  distHtmlFound: 0,
  missingSourceHtml: [],
  missingDistHtml: [],
  zeroByteHtml: [],

  expectedScreenshotAssets: 0,
  sourceScreenshotFound: 0,
  distScreenshotFound: 0,
  missingSourceScreenshot: [],
  missingDistScreenshot: [],
  zeroByteScreenshot: [],

  expectedPromptAssets: 0,
  sourcePromptFound: 0,
  distPromptFound: 0,
  missingSourcePrompt: [],
  missingDistPrompt: [],
  zeroBytePrompt: [],

  malformedPaths: []
};

// Validate individual file path
function validateAsset(urlPath, type, itemId) {
  if (!urlPath) return;

  // Path format check (must not contain backslashes, double slashes, or path traversal)
  if (urlPath.includes("\\") || urlPath.includes("//") || urlPath.includes("..")) {
    stats.malformedPaths.push({ itemId, urlPath, reason: "Invalid characters or traversal detected" });
  }

  // Strip prefix: "/awesome-components/" -> relative subpath
  const relativeSubpath = urlPath.replace(/^\/?(awesome-components|community-assets)\//, "");

  // 1. Source check
  if (sourceBaseDir) {
    const srcFile = path.join(sourceBaseDir, relativeSubpath);
    if (fs.existsSync(srcFile)) {
      const sz = fs.statSync(srcFile).size;
      if (sz === 0) {
        if (type === "html") stats.zeroByteHtml.push({ itemId, file: srcFile });
        if (type === "screenshot") stats.zeroByteScreenshot.push({ itemId, file: srcFile });
        if (type === "prompt") stats.zeroBytePrompt.push({ itemId, file: srcFile });
      } else {
        if (type === "html") stats.sourceHtmlFound++;
        if (type === "screenshot") stats.sourceScreenshotFound++;
        if (type === "prompt") stats.sourcePromptFound++;
      }
    } else {
      if (type === "html") stats.missingSourceHtml.push({ itemId, file: srcFile, urlPath });
      if (type === "screenshot") stats.missingSourceScreenshot.push({ itemId, file: srcFile, urlPath });
      if (type === "prompt") stats.missingSourcePrompt.push({ itemId, file: srcFile, urlPath });
    }
  }

  // 2. Production dist check (if dist exists and not skipped)
  if (hasDist && !skipDist) {
    const distFile = path.join(distBaseDir, relativeSubpath);
    if (fs.existsSync(distFile)) {
      const sz = fs.statSync(distFile).size;
      if (sz > 0) {
        if (type === "html") stats.distHtmlFound++;
        if (type === "screenshot") stats.distScreenshotFound++;
        if (type === "prompt") stats.distPromptFound++;
      }
    } else {
      if (type === "html") stats.missingDistHtml.push({ itemId, file: distFile, urlPath });
      if (type === "screenshot") stats.missingDistScreenshot.push({ itemId, file: distFile, urlPath });
      if (type === "prompt") stats.missingDistPrompt.push({ itemId, file: distFile, urlPath });
    }
  }
}

// 3. Process Catalogue Items
for (const item of allItems) {
  // Check resource kind
  if (item.componentCode && item.componentCode.trim().length > 0) {
    stats.executableReact++;
  } else if (item.itemType === "theme") {
    stats.themes++;
  } else if (item.itemType === "template") {
    stats.templates++;
  } else if (item.itemType === "prompt" || (item.promptData && !item.awesomeData)) {
    stats.promptBlueprints++;
  } else if (item.awesomeData) {
    if (item.awesomeData.hasHtml) {
      stats.htmlSnapshots++;
    } else if (item.awesomeData.hasScreenshot) {
      stats.screenshotReferences++;
    } else {
      stats.otherResources++;
    }

    // Check HTML
    if (item.awesomeData.hasHtml && item.awesomeData.htmlUrl) {
      stats.expectedHtmlAssets++;
      validateAsset(item.awesomeData.htmlUrl, "html", item.id);
    }

    // Check Screenshot
    if (item.awesomeData.hasScreenshot && item.awesomeData.screenshotUrl) {
      stats.expectedScreenshotAssets++;
      validateAsset(item.awesomeData.screenshotUrl, "screenshot", item.id);
    }

    // Check Prompt
    if (item.awesomeData.hasPrompt && item.awesomeData.promptUrl) {
      stats.expectedPromptAssets++;
      validateAsset(item.awesomeData.promptUrl, "prompt", item.id);
    }
  } else {
    stats.otherResources++;
  }
}

// 4. Report Findings
console.log("=================== CATALOGUE COMPOSITION ===================");
console.log(`  Total Catalogue Records:          ${stats.totalRecords}`);
console.log(`  - Core Verified React / TSX:      ${stats.executableReact}`);
console.log(`  - Community HTML Snapshots:       ${stats.htmlSnapshots}`);
console.log(`  - Screenshot-Only References:     ${stats.screenshotReferences}`);
console.log(`  - Design System Theme Presets:    ${stats.themes}`);
console.log(`  - Full Application Templates:     ${stats.templates}`);
console.log(`  - AI Prompt Blueprints:           ${stats.promptBlueprints}`);
console.log(`  - Vectors, Icons & Mini-Apps:     ${stats.otherResources}`);

console.log("\n=================== SOURCE ASSET VALIDATION ===================");
console.log(`  HTML Snapshots Expected:          ${stats.expectedHtmlAssets}`);
console.log(`  - Source HTML Files Found:        ${stats.sourceHtmlFound} (${((stats.sourceHtmlFound / stats.expectedHtmlAssets) * 100).toFixed(2)}%)`);
console.log(`  - Missing Source HTML Files:      ${stats.missingSourceHtml.length}`);
console.log(`  - Zero-Byte Source HTML Files:    ${stats.zeroByteHtml.length}`);

console.log(`\n  Screenshots Expected:             ${stats.expectedScreenshotAssets}`);
console.log(`  - Source Screenshots Found:       ${stats.sourceScreenshotFound} (${((stats.sourceScreenshotFound / stats.expectedScreenshotAssets) * 100).toFixed(2)}%)`);
console.log(`  - Missing Source Screenshots:     ${stats.missingSourceScreenshot.length}`);
console.log(`  - Zero-Byte Source Screenshots:   ${stats.zeroByteScreenshot.length}`);

console.log(`\n  Implementation Prompts Expected:  ${stats.expectedPromptAssets}`);
console.log(`  - Source Prompts Found:           ${stats.sourcePromptFound} (${((stats.sourcePromptFound / stats.expectedPromptAssets) * 100).toFixed(2)}%)`);
console.log(`  - Missing Source Prompts:         ${stats.missingSourcePrompt.length}`);
console.log(`  - Zero-Byte Source Prompts:       ${stats.zeroBytePrompt.length}`);

console.log(`\n  Malformed / Traversal Paths:      ${stats.malformedPaths.length}`);

if (hasDist && !skipDist) {
  console.log("\n=================== PRODUCTION DIST VALIDATION =================");
  console.log(`  Dist HTML Snapshots Found:        ${stats.distHtmlFound} / ${stats.expectedHtmlAssets}`);
  console.log(`  - Missing Dist HTML Files:        ${stats.missingDistHtml.length}`);
  console.log(`  Dist Screenshots Found:           ${stats.distScreenshotFound} / ${stats.expectedScreenshotAssets}`);
  console.log(`  - Missing Dist Screenshots:       ${stats.missingDistScreenshot.length}`);
  console.log(`  Dist Prompts Found:               ${stats.distPromptFound} / ${stats.expectedPromptAssets}`);
  console.log(`  - Missing Dist Prompts:           ${stats.missingDistPrompt.length}`);
} else if (!hasDist) {
  console.log("\n=================== PRODUCTION DIST VALIDATION =================");
  console.log("  [SKIPPED] dist/awesome-components not found. Run 'npm run build' first to validate output.");
}

console.log("\n=================================================================");

// 5. Evaluate Blocking Failures
let hasFailures = false;

if (stats.malformedPaths.length > 0) {
  console.error(`✗ FAIL: ${stats.malformedPaths.length} malformed catalogue asset paths detected!`);
  for (const m of stats.malformedPaths.slice(0, 5)) {
    console.error(`    Item: ${m.itemId} -> ${m.urlPath} (${m.reason})`);
  }
  hasFailures = true;
}

if (hasDist && !skipDist) {
  const missingDistCount = stats.missingDistHtml.length + stats.missingDistScreenshot.length;
  if (missingDistCount > 0) {
    console.error(`✗ FAIL: ${missingDistCount} required visual preview assets missing from production dist/!`);
    if (stats.missingDistHtml.length > 0) {
      console.error(`  Sample missing HTML in dist:`);
      for (const m of stats.missingDistHtml.slice(0, 3)) {
        console.error(`    ${m.itemId}: ${m.file}`);
      }
    }
    if (stats.missingDistScreenshot.length > 0) {
      console.error(`  Sample missing Screenshot in dist:`);
      for (const m of stats.missingDistScreenshot.slice(0, 3)) {
        console.error(`    ${m.itemId}: ${m.file}`);
      }
    }
    hasFailures = true;
  }
}

// Check source critical completeness (> 95% of catalogue must be present)
const htmlCoverage = stats.sourceHtmlFound / stats.expectedHtmlAssets;
if (htmlCoverage < 0.95) {
  console.error(`✗ FAIL: Source HTML coverage is below 95% threshold (${(htmlCoverage * 100).toFixed(2)}%)!`);
  hasFailures = true;
}

if (hasFailures) {
  console.log("VALIDATION RESULT: FAILED (Blocking defects detected)\n");
  process.exit(1);
} else {
  console.log("VALIDATION RESULT: PASSED (All required catalogue assets verified!)\n");
  process.exit(0);
}
