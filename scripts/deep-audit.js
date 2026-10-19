import fs from "node:fs";
import path from "node:path";

console.log("Starting Deep Codebase & Catalogue Audit for ElementraUI migration...\n");

const corePath = path.resolve("src/data/fullCatalogue.json");
const awesomePath = path.resolve("public/data/awesome-catalogue.json");

const coreItems = JSON.parse(fs.readFileSync(corePath, "utf8"));
const awesomeItems = JSON.parse(fs.readFileSync(awesomePath, "utf8"));

// 1. Record counts & Duplicates
console.log(`Core records: ${coreItems.length}`);
console.log(`Awesome records: ${awesomeItems.length}`);
console.log(`Total: ${coreItems.length + awesomeItems.length}`);

const idMap = new Map();
const duplicates = [];
const allItems = [...coreItems, ...awesomeItems];

for (const item of allItems) {
  if (idMap.has(item.id)) {
    duplicates.push({ id: item.id, first: idMap.get(item.id), second: item });
  } else {
    idMap.set(item.id, item);
  }
}
console.log(`Duplicate IDs found: ${duplicates.length}`);

// 2. Malformed records
let missingName = 0;
let missingCategory = 0;
let missingAuthor = 0;
let missingDescription = 0;
let missingTags = 0;
let malformedRecords = [];

for (const item of allItems) {
  let issues = [];
  if (!item.name || typeof item.name !== "string" || item.name.trim() === "") issues.push("missing-name");
  if (!item.category || typeof item.category !== "string") issues.push("missing-category");
  if (!item.author || !item.author.name) issues.push("missing-author");
  if (item.description === undefined || item.description === null) issues.push("missing-description");
  if (!Array.isArray(item.tags)) issues.push("missing-tags");
  
  if (issues.length > 0) {
    malformedRecords.push({ id: item.id, issues });
  }
}
console.log(`Malformed records: ${malformedRecords.length}`);

// 3. Installability Classification
let installableCount = 0;
let installableWithoutCommand = 0;
let nonInstallableWithCommand = 0;
let shadcnRegistryCount = 0;
let npmInstallCount = 0;

for (const item of allItems) {
  if (item.isInstallable) {
    installableCount++;
    if (!item.installCommand) installableWithoutCommand++;
    if (item.installCommand?.includes("shadcn") || item.installCommand?.includes("magicui")) shadcnRegistryCount++;
    if (item.installCommand?.startsWith("npm i") || item.installCommand?.startsWith("pnpm add")) npmInstallCount++;
  } else {
    if (item.installCommand) nonInstallableWithCommand++;
  }
}
console.log(`Installable items: ${installableCount}`);
console.log(`Installable without command: ${installableWithoutCommand}`);
console.log(`Non-installable with command: ${nonInstallableWithCommand}`);
console.log(`Registry (shadcn/magicui) install: ${shadcnRegistryCount}`);
console.log(`NPM package install: ${npmInstallCount}`);

// 4. Resource Types Breakdown
const itemTypes = {};
const previewStatuses = {};
let hasComponentCode = 0;
let hasHtmlFile = 0;
let hasScreenshot = 0;
let hasPrompt = 0;

for (const item of allItems) {
  itemTypes[item.itemType || "unspecified"] = (itemTypes[item.itemType || "unspecified"] || 0) + 1;
  previewStatuses[item.previewStatus || "unspecified"] = (previewStatuses[item.previewStatus || "unspecified"] || 0) + 1;
  if (item.componentCode && item.componentCode.trim().length > 0) hasComponentCode++;
  if (item.awesomeData?.htmlPath || item.previewType === "html") hasHtmlFile++;
  if (item.awesomeData?.screenshotPath || item.previewImage) hasScreenshot++;
  if (item.promptData || item.awesomeData?.hasPrompt) hasPrompt++;
}

console.log("\nItem Types:", itemTypes);
console.log("Preview Statuses:", previewStatuses);
console.log(`Has Component Code (React TSX): ${hasComponentCode}`);
console.log(`Has HTML snapshot pointer: ${hasHtmlFile}`);
console.log(`Has Screenshot pointer: ${hasScreenshot}`);
console.log(`Has Prompt: ${hasPrompt}`);

// 5. Check URLs in catalogue
let invalidUrls = 0;
let emptyUrls = 0;
for (const item of allItems) {
  if (item.demoUrl) {
    if (!item.demoUrl.startsWith("http://") && !item.demoUrl.startsWith("https://") && !item.demoUrl.startsWith("/")) {
      invalidUrls++;
    }
  }
  if (item.author?.avatarUrl && !item.author.avatarUrl.startsWith("http") && !item.author.avatarUrl.startsWith("/")) {
    invalidUrls++;
  }
}
console.log(`Invalid URL schemes detected: ${invalidUrls}`);

// 6. Marketplace Sections Data
const themesData = (await import("../src/data/themesData.ts")).verifiedThemesData;
const templatesData = (await import("../src/data/templatesData.ts")).verifiedTemplatesData;
const appsData = (await import("../src/data/appsData.ts")).verifiedAppsData;
const iconsData = (await import("../src/data/iconsData.ts")).verifiedIconsData;
const videoData = (await import("../src/data/videoData.ts")).verifiedVideoData;

console.log("\nMarketplace Sections Counts:");
console.log(`Themes: ${themesData.length}`);
console.log(`Templates: ${templatesData.length}`);
console.log(`Apps: ${appsData.length}`);
console.log(`Icons: ${iconsData.length}`);
console.log(`Video: ${videoData.length}`);

// 7. Output findings to a JSON file for report inclusion
fs.writeFileSync("artifacts/deep-audit-summary.json", JSON.stringify({
  coreRecords: coreItems.length,
  awesomeRecords: awesomeItems.length,
  totalRecords: allItems.length,
  duplicates,
  malformedRecords,
  installableCount,
  installableWithoutCommand,
  nonInstallableWithCommand,
  shadcnRegistryCount,
  npmInstallCount,
  itemTypes,
  previewStatuses,
  hasComponentCode,
  hasHtmlFile,
  hasScreenshot,
  hasPrompt,
  invalidUrls,
  marketplaceCounts: {
    themes: themesData.length,
    templates: templatesData.length,
    apps: appsData.length,
    icons: iconsData.length,
    video: videoData.length
  }
}, null, 2));

console.log("\nSaved audit summary to artifacts/deep-audit-summary.json");
