import fs from "node:fs";
import path from "node:path";

const repoRoot = fs.existsSync(path.resolve("community-assets"))
  ? path.resolve("community-assets")
  : path.resolve(".cache/awesome-components");
const dataJsonPath = path.join(repoRoot, "data", "components.json");
const componentsDir = path.join(repoRoot, "components");

console.log("Analyzing repository at:", repoRoot);

if (!fs.existsSync(repoRoot)) {
  console.error("Repository not found at:", repoRoot);
  process.exit(1);
}

// 1. Check data/components.json
let jsonComponents = [];
let jsonExists = fs.existsSync(dataJsonPath);
if (jsonExists) {
  try {
    const raw = fs.readFileSync(dataJsonPath, "utf8");
    jsonComponents = JSON.parse(raw);
    console.log(`data/components.json found with ${jsonComponents.length} entries.`);
  } catch (err) {
    console.error("Error parsing data/components.json:", err.message);
  }
}

// 2. Validate all records in data/components.json
let validJsonRecords = 0;
let jsonMissingFiles = {
  readme: 0,
  prompt: 0,
  html: 0,
  screenshot: 0
};
let authorsSet = new Set();
let componentsSet = new Set();
let variantsSet = new Set();
let bucketsSet = new Set();
let promptCount = 0;
let htmlCount = 0;
let screenshotCount = 0;
let duplicateIds = new Set();
let seenIds = new Set();

for (const item of jsonComponents) {
  const id = `${item.author}/${item.component}/${item.variant}`;
  if (seenIds.has(id)) {
    duplicateIds.add(id);
  } else {
    seenIds.add(id);
  }

  bucketsSet.add(item.bucket);
  authorsSet.add(item.author);
  componentsSet.add(item.component);
  variantsSet.add(item.variant);

  const hasReadme = fs.existsSync(path.join(repoRoot, item.path));
  const hasPrompt = fs.existsSync(path.join(repoRoot, item.promptPath));
  const hasHtml = fs.existsSync(path.join(repoRoot, item.htmlPath));
  const hasScreenshot = fs.existsSync(path.join(repoRoot, item.screenshotPath));

  if (!hasReadme) jsonMissingFiles.readme++;
  if (hasPrompt) promptCount++; else jsonMissingFiles.prompt++;
  if (hasHtml) htmlCount++; else jsonMissingFiles.html++;
  if (hasScreenshot) screenshotCount++; else jsonMissingFiles.screenshot++;

  if (hasReadme && hasPrompt && hasHtml && hasScreenshot) {
    validJsonRecords++;
  }
}

// 3. Scan filesystem directly under components/ to see if there are directories NOT in components.json
console.log("Scanning filesystem under components/...");
let fsBuckets = 0;
let fsAuthors = 0;
let fsComponents = 0;
let fsVariants = 0;
let fsDiscoveredRecords = 0;
let fsMissingFiles = {
  readme: 0,
  prompt: 0,
  html: 0,
  screenshot: 0
};

const buckets = fs.readdirSync(componentsDir, { withFileTypes: true })
  .filter(d => d.isDirectory() && !d.name.startsWith("."));
fsBuckets = buckets.length;

for (const b of buckets) {
  const bucketPath = path.join(componentsDir, b.name);
  const authors = fs.readdirSync(bucketPath, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith("."));
  fsAuthors += authors.length;

  for (const a of authors) {
    const authorPath = path.join(bucketPath, a.name);
    const comps = fs.readdirSync(authorPath, { withFileTypes: true })
      .filter(d => d.isDirectory() && !d.name.startsWith("."));
    fsComponents += comps.length;

    for (const c of comps) {
      const compPath = path.join(authorPath, c.name);
      const vars = fs.readdirSync(compPath, { withFileTypes: true })
        .filter(d => d.isDirectory() && !d.name.startsWith("."));
      fsVariants += vars.length;

      for (const v of vars) {
        fsDiscoveredRecords++;
        const varPath = path.join(compPath, v.name);
        if (!fs.existsSync(path.join(varPath, "README.md"))) fsMissingFiles.readme++;
        if (!fs.existsSync(path.join(varPath, "prompt.md"))) fsMissingFiles.prompt++;
        if (!fs.existsSync(path.join(varPath, "rendered.html"))) fsMissingFiles.html++;
        if (!fs.existsSync(path.join(varPath, "screenshot.png"))) fsMissingFiles.screenshot++;
      }
    }
  }
}

// 4. Sample top authors
const authorCounts = {};
for (const item of jsonComponents) {
  authorCounts[item.authorName || item.author] = (authorCounts[item.authorName || item.author] || 0) + 1;
}
const sortedAuthors = Object.entries(authorCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 15);

// 5. Total size of screenshots and HTML
console.log("\n================ REPOSITORY AUDIT SUMMARY ================");
console.log(`JSON Index Available: ${jsonExists}`);
console.log(`Total Records in components.json: ${jsonComponents.length}`);
console.log(`Total Filesystem Variant Directories Discovered: ${fsDiscoveredRecords}`);
console.log(`Unique Buckets: ${bucketsSet.size} (FS: ${fsBuckets})`);
console.log(`Unique Authors: ${authorsSet.size} (FS: ${fsAuthors})`);
console.log(`Unique Components: ${componentsSet.size}`);
console.log(`Unique Variants: ${variantsSet.size}`);
console.log(`Total Valid Records (all 4 files present): ${validJsonRecords}`);
console.log(`Duplicate IDs: ${duplicateIds.size}`);
console.log(`Prompts Found: ${promptCount} (Missing: ${jsonMissingFiles.prompt})`);
console.log(`Rendered HTML Snapshots Found: ${htmlCount} (Missing: ${jsonMissingFiles.html})`);
console.log(`Screenshots Found: ${screenshotCount} (Missing: ${jsonMissingFiles.screenshot})`);
console.log(`README Files Missing: ${jsonMissingFiles.readme}`);
console.log("\nTop 15 Authors:");
sortedAuthors.forEach(([author, count], idx) => {
  console.log(`  ${idx + 1}. ${author}: ${count} components`);
});
console.log("=========================================================\n");
