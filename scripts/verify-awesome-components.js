import fs from "node:fs";
import path from "node:path";

console.log("=== Awesome Components Automated Verification Suite ===\n");

const cataloguePath = path.resolve("public/data/awesome-catalogue.json");
const repoRoot = fs.existsSync(path.resolve("community-assets"))
  ? path.resolve("community-assets")
  : path.resolve(".cache/awesome-components");

let passedTests = 0;
let failedTests = 0;

function assert(condition, testName, details = "") {
  if (condition) {
    console.log(`  ✓ [PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`  ✗ [FAIL] ${testName}${details ? " - " + details : ""}`);
    failedTests++;
  }
}

// 1. Dataset Integrity & Schema Tests
console.log("Suite 1: Catalogue Dataset & Schema Integrity");
assert(fs.existsSync(cataloguePath), "Catalogue JSON exists at public/data/awesome-catalogue.json");

let catalogue = [];
try {
  const raw = fs.readFileSync(cataloguePath, "utf8");
  catalogue = JSON.parse(raw);
  assert(true, "Catalogue JSON parsed successfully");
} catch (err) {
  assert(false, "Catalogue JSON parsed successfully", err.message);
}

assert(catalogue.length === 6591, `Catalogue contains exactly 6,591 records (actual: ${catalogue.length})`);

// 2. Cross-Section Sampling (Beginning, Middle, End)
console.log("\nSuite 2: Beginning, Middle & End Dataset Sampling Integrity");
const sampleIndices = [
  0, 1, 2, 5,                       // Beginning
  2500, 3295, 3300, 4500,           // Middle
  6585, 6588, 6589, 6590            // End
];

const pngMagic = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

for (const idx of sampleIndices) {
  const item = catalogue[idx];
  assert(!!item, `Sample record at index ${idx} exists`);
  if (!item) continue;

  const desc = `[Index ${idx}: ${item.author.name}/${item.name}]`;

  // Metadata completeness
  const hasMeta = !!(
    item.id &&
    item.name &&
    item.slug &&
    item.author?.name &&
    item.category &&
    item.provenance?.repository &&
    item.provenance?.commitHash &&
    item.awesomeData?.bucket &&
    item.awesomeData?.variant
  );
  assert(hasMeta, `${desc} Metadata complete`);

  // Physical files existence
  const screenshotFile = path.join(repoRoot, item.awesomeData.screenshotPath);
  const htmlFile = path.join(repoRoot, item.awesomeData.htmlPath);
  const promptFile = path.join(repoRoot, item.awesomeData.promptPath);

  assert(fs.existsSync(screenshotFile), `${desc} Screenshot exists on disk`);
  assert(fs.existsSync(htmlFile), `${desc} Rendered HTML exists on disk`);
  assert(fs.existsSync(promptFile), `${desc} Prompt markdown exists on disk`);

  // PNG magic number check
  if (fs.existsSync(screenshotFile)) {
    const header = Buffer.alloc(8);
    const fd = fs.openSync(screenshotFile, "r");
    fs.readSync(fd, header, 0, 8, 0);
    fs.closeSync(fd);
    assert(header.equals(pngMagic), `${desc} Screenshot is genuine valid PNG (magic: ${header.toString("hex")})`);
  }

  // HTML content check
  if (fs.existsSync(htmlFile)) {
    const htmlStat = fs.statSync(htmlFile);
    assert(htmlStat.size > 50, `${desc} HTML snapshot has valid size (${htmlStat.size} bytes)`);
  }

  // Prompt content check
  if (fs.existsSync(promptFile)) {
    const promptTxt = fs.readFileSync(promptFile, "utf8");
    assert(promptTxt.length > 50, `${desc} Prompt has substantive instructions (${promptTxt.length} chars)`);
  }
}

// 3. Search Indexing & Filtering Verification
console.log("\nSuite 3: Search Indexing & Query Benchmarks");

// Search by keyword "login"
const loginMatches = catalogue.filter((item) => {
  const q = "login";
  return (
    item.name.toLowerCase().includes(q) ||
    item.description.toLowerCase().includes(q) ||
    item.tags.some((t) => t.toLowerCase().includes(q))
  );
});
assert(loginMatches.length > 0, `Keyword search 'login' returns matching components (found: ${loginMatches.length})`);

// Search by category "Forms & Inputs"
const formsMatches = catalogue.filter((item) => item.category === "Forms & Inputs");
assert(formsMatches.length >= 800, `Category filter 'Forms & Inputs' returns substantive results (found: ${formsMatches.length})`);

// Search by category "Heroes & Landing"
const heroMatches = catalogue.filter((item) => item.category === "Heroes & Landing");
assert(heroMatches.length >= 400, `Category filter 'Heroes & Landing' returns substantive results (found: ${heroMatches.length})`);

// Search by top author "Ruixenui"
const ruixenMatches = catalogue.filter((item) => item.author.name.toLowerCase().includes("ruixen"));
assert(ruixenMatches.length > 100, `Author search 'Ruixenui' returns components (found: ${ruixenMatches.length})`);

// 4. Safe Iframe Sandboxing & Traversal Security
console.log("\nSuite 4: Security, Isolation & Path Traversal Protections");

// Path traversal validation test
function isPathSafe(base, relative) {
  if (!relative || typeof relative !== "string") return false;
  if (relative.includes("\0") || relative.includes("..")) return false;
  const resolved = path.resolve(base, relative);
  return resolved.startsWith(base);
}

const safePath = "components/0-9/0xurvish/animated-collection/default/rendered.html";
const unsafeTraversal1 = "../../package.json";
const unsafeTraversal2 = "components/../../../etc/passwd";
const unsafeTraversal3 = "components/0-9/0xurvish/../../../../secrets.env";

assert(isPathSafe(repoRoot, safePath), "Safe relative path is accepted");
assert(!isPathSafe(repoRoot, unsafeTraversal1), "Directory traversal payload 1 rejected");
assert(!isPathSafe(repoRoot, unsafeTraversal2), "Directory traversal payload 2 rejected");
assert(!isPathSafe(repoRoot, unsafeTraversal3), "Directory traversal payload 3 rejected");

// Sandbox policy verification
const detailPanelSource = fs.readFileSync(path.resolve("src/components/ItemPreview.tsx"), "utf8");
assert(
  detailPanelSource.includes('sandbox="allow-scripts"'),
  "Preview iframe sandbox strictly uses sandbox='allow-scripts' without allow-same-origin or allow-top-navigation"
);

// 5. Component-to-Prompt & Studio Handoff Verification
console.log("\nSuite 5: Component-to-Prompt & Studio Handoff Pipeline");
const firstSample = catalogue[0];
const samplePromptPath = path.join(repoRoot, firstSample.awesomeData.promptPath);
const samplePromptContent = fs.readFileSync(samplePromptPath, "utf8");

assert(samplePromptContent.includes("Recreate this component in a React"), "Prompt contains clear agent goal instructions");
assert(samplePromptContent.includes(firstSample.awesomeData.component), "Prompt contains matching component slug");

// App.tsx handoff hook verification
const appSource = fs.readFileSync(path.resolve("src/App.tsx"), "utf8");
assert(appSource.includes("onSendToBuilder={handleSendToBuilder}"), "App.tsx connects onSendToBuilder handoff");
assert(appSource.includes("onSendToPromptStudio={handleSendToPromptStudio}"), "App.tsx connects onSendToPromptStudio handoff");

console.log("\n========================================================");
console.log(`Verification Summary: ${passedTests} Passed, ${failedTests} Failed.`);
console.log("========================================================\n");

if (failedTests > 0) {
  process.exit(1);
}
