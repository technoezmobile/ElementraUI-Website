import fs from "node:fs";
import path from "node:path";

// Ingestion script for awesome-components
const args = process.argv.slice(2);
const isDryRun = args.includes("--dry-run");
const limitIndex = args.indexOf("--limit");
const limit = limitIndex !== -1 ? parseInt(args[limitIndex + 1], 10) : Infinity;

const repoRoot = fs.existsSync(path.resolve("community-assets"))
  ? path.resolve("community-assets")
  : path.resolve(".cache/awesome-components");
const dataJsonPath = path.join(repoRoot, "data", "components.json");
const outputJsonPath = path.resolve("public/data/awesome-catalogue.json");
const publicDataDir = path.resolve("public/data");

console.log(`=== Awesome Components Ingestion Adapter ===`);
console.log(`Source Repo: ${repoRoot}`);
console.log(`Mode: ${isDryRun ? "DRY RUN (no files will be written)" : "LIVE INGESTION"}`);
if (Number.isFinite(limit)) {
  console.log(`Item Limit: ${limit}`);
}

// Security: Path Traversal Protection
function isPathSafe(base, relative) {
  if (!relative || typeof relative !== "string") return false;
  if (relative.includes("\0") || relative.includes("..")) return false;
  const resolved = path.resolve(base, relative);
  return resolved.startsWith(base);
}

// Intelligent Categorization Heuristic
function categorizeComponent(componentName, authorName, variantName) {
  const s = `${componentName} ${authorName} ${variantName}`.toLowerCase();
  
  if (s.includes("hero") || s.includes("landing") || s.includes("banner") || s.includes("header") || s.includes("cta") || s.includes("showcase")) {
    return "Heroes & Landing";
  }
  if (s.includes("nav") || s.includes("menu") || s.includes("sidebar") || s.includes("tab") || s.includes("breadcrumb") || s.includes("navbar") || s.includes("pagination")) {
    return "Navigation & Menus";
  }
  if (s.includes("form") || s.includes("input") || s.includes("login") || s.includes("signin") || s.includes("signup") || s.includes("auth") || s.includes("search") || s.includes("select") || s.includes("checkbox") || s.includes("switch") || s.includes("slider") || s.includes("upload") || s.includes("picker") || s.includes("field")) {
    return "Forms & Inputs";
  }
  if (s.includes("3d") || s.includes("sphere") || s.includes("cube") || s.includes("mesh") || s.includes("canvas") || s.includes("three") || s.includes("orbit") || s.includes("spline")) {
    return "3D & WebGL";
  }
  if (s.includes("shader") || s.includes("glsl") || s.includes("wave") || s.includes("aurora") || s.includes("gradient") || s.includes("blur") || s.includes("background") || s.includes("particles")) {
    return "Shaders & Canvas";
  }
  if (s.includes("text") || s.includes("typography") || s.includes("type") || s.includes("marquee") || s.includes("scroll") || s.includes("motion") || s.includes("animate") || s.includes("reveal") || s.includes("counter")) {
    return "Typography & Motion";
  }
  if (s.includes("button") || s.includes("badge") || s.includes("tooltip") || s.includes("modal") || s.includes("dialog") || s.includes("popover") || s.includes("dropdown") || s.includes("toast") || s.includes("effect") || s.includes("avatar") || s.includes("icon") || s.includes("spinner") || s.includes("toggle") || s.includes("rating")) {
    return "Visual Effects";
  }
  if (s.includes("template") || s.includes("dashboard") || s.includes("portfolio") || s.includes("agency") || s.includes("ecommerce") || s.includes("layout") || s.includes("page")) {
    return "Full Templates";
  }
  return "Cards & Bento";
}

// Determine motion engine
function detectMotionEngine(componentName, promptText = "") {
  const s = `${componentName} ${promptText}`.toLowerCase();
  if (s.includes("three") || s.includes("webgl")) return "Three.js";
  if (s.includes("shader") || s.includes("glsl")) return "GLSL";
  if (s.includes("framer-motion") || s.includes("framer motion") || s.includes("motion.")) return "Framer Motion";
  if (s.includes("animate") || s.includes("transition") || s.includes("canvas")) return "CSS / Canvas";
  return "None";
}

// Generate human-friendly title
function formatTitle(name) {
  if (!name) return "";
  return name
    .replace(/[-_]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

async function runImport() {
  if (!fs.existsSync(dataJsonPath)) {
    console.error(`Error: Upstream metadata not found at ${dataJsonPath}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(dataJsonPath, "utf8");
  const upstreamItems = JSON.parse(raw);
  console.log(`Discovered ${upstreamItems.length} records in data/components.json`);

  let gitCommitHash = "87e9f787c81ce3fc9c73d37f890fb3e8d2d19ef6";
  try {
    const gitHead = fs.readFileSync(path.join(repoRoot, ".git/HEAD"), "utf8").trim();
    if (gitHead.startsWith("ref: ")) {
      const refPath = path.join(repoRoot, ".git", gitHead.slice(5));
      if (fs.existsSync(refPath)) {
        gitCommitHash = fs.readFileSync(refPath, "utf8").trim();
      }
    } else if (gitHead.length === 40) {
      gitCommitHash = gitHead;
    }
  } catch (err) {
    // fallback to pinned commit hash
  }

  const importedCatalogue = [];
  const seenKeys = new Set();
  const categoryCounts = {};
  const authorCounts = {};
  let skippedDuplicates = 0;
  let skippedMissingFiles = 0;
  let pathTraversalRejections = 0;

  const totalToProcess = Math.min(upstreamItems.length, limit);

  for (let i = 0; i < totalToProcess; i++) {
    const item = upstreamItems[i];
    const key = `${item.author}/${item.component}/${item.variant}`.toLowerCase();

    // Deduplication check
    if (seenKeys.has(key)) {
      skippedDuplicates++;
      continue;
    }
    seenKeys.add(key);

    // Path safety validation
    if (
      !isPathSafe(repoRoot, item.path) ||
      !isPathSafe(repoRoot, item.promptPath) ||
      !isPathSafe(repoRoot, item.htmlPath) ||
      !isPathSafe(repoRoot, item.screenshotPath)
    ) {
      pathTraversalRejections++;
      continue;
    }

    const fullReadmePath = path.join(repoRoot, item.path);
    const fullPromptPath = path.join(repoRoot, item.promptPath);
    const fullHtmlPath = path.join(repoRoot, item.htmlPath);
    const fullScreenshotPath = path.join(repoRoot, item.screenshotPath);

    const hasReadme = fs.existsSync(fullReadmePath);
    const hasPrompt = fs.existsSync(fullPromptPath);
    const hasHtml = fs.existsSync(fullHtmlPath);
    const hasScreenshot = fs.existsSync(fullScreenshotPath);

    // Ensure core assets exist
    if (!hasPrompt || !hasHtml || !hasScreenshot) {
      skippedMissingFiles++;
      continue;
    }

    const componentTitle = item.componentName || formatTitle(item.component);
    const variantTitle = item.variantName || formatTitle(item.variant);
    const authorDisplayName = item.authorName || item.author;
    const category = categorizeComponent(item.component, item.author, item.variant);
    const motionEngine = detectMotionEngine(item.component);

    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    authorCounts[authorDisplayName] = (authorCounts[authorDisplayName] || 0) + 1;

    // Clean URL paths for Vite static serving
    const cleanPromptUrl = `/awesome-components/${item.promptPath.replace(/^components\//, "")}`;
    const cleanHtmlUrl = `/awesome-components/${item.htmlPath.replace(/^components\//, "")}`;
    const cleanScreenshotUrl = `/awesome-components/${item.screenshotPath.replace(/^components\//, "")}`;

    // Standardized CatalogueItem structure
    const catalogueRecord = {
      id: `awesome-${item.author}-${item.component}-${item.variant}`.replace(/[^a-zA-Z0-9_-]/g, "-"),
      name: variantTitle.toLowerCase() !== "default" ? `${componentTitle} (${variantTitle})` : componentTitle,
      slug: `${item.component}-${item.variant}`.replace(/[^a-zA-Z0-9_-]/g, "-"),
      itemType: category === "Full Templates" ? "template" : category === "Heroes & Landing" ? "block" : "component",
      category,
      motionEngine,
      isInstallable: false,
      isWorkingPreview: true,
      previewStatus: "verified",
      previewDiagnostic: "HTML Snapshot & Prompt Reference",
      description: `${componentTitle} component reference by ${authorDisplayName} from the Awesome Components repository. Includes live rendered HTML snapshot, preview screenshot, and implementation prompt.`,
      tags: [
        "awesome-components",
        item.author.toLowerCase(),
        item.component.toLowerCase(),
        item.variant.toLowerCase(),
        category.toLowerCase().replace(/[^a-z0-9]+/g, "-")
      ],
      license: "MIT",
      dependencies: ["react", "tailwindcss"],
      author: {
        name: authorDisplayName,
        url: `https://github.com/wundercorp/awesome-components/tree/main/components/${item.bucket}/${item.author}`
      },
      provenance: {
        origin: "Awesome Components",
        repository: "https://github.com/wundercorp/awesome-components.git",
        commitHash: gitCommitHash,
        licenseUrl: "https://github.com/wundercorp/awesome-components/blob/main/LICENSE",
        importDate: new Date().toISOString().split("T")[0],
        modificationStatus: "unmodified-upstream"
      },
      previewType: "iframe",
      sourceRepo: "awesome-components",
      awesomeData: {
        bucket: item.bucket,
        author: item.author,
        authorName: authorDisplayName,
        component: item.component,
        componentName: componentTitle,
        variant: item.variant,
        variantName: variantTitle,
        promptPath: item.promptPath,
        htmlPath: item.htmlPath,
        screenshotPath: item.screenshotPath,
        promptUrl: cleanPromptUrl,
        htmlUrl: cleanHtmlUrl,
        screenshotUrl: cleanScreenshotUrl,
        hasPrompt: true,
        hasHtml: true,
        hasScreenshot: true
      }
    };

    importedCatalogue.push(catalogueRecord);
  }

  console.log(`\n=== Ingestion Processing Results ===`);
  console.log(`Successfully Processed: ${importedCatalogue.length}`);
  console.log(`Skipped Duplicates: ${skippedDuplicates}`);
  console.log(`Skipped Missing Files: ${skippedMissingFiles}`);
  console.log(`Path Traversal Rejections: ${pathTraversalRejections}`);
  console.log(`Unique Contributing Authors: ${Object.keys(authorCounts).length}`);
  console.log(`Categories Generated: ${Object.keys(categoryCounts).length}`);
  console.log(`\nCategory Breakdown:`);
  console.table(categoryCounts);

  if (!isDryRun) {
    if (!fs.existsSync(publicDataDir)) {
      fs.mkdirSync(publicDataDir, { recursive: true });
    }
    console.log(`Writing normalized catalogue to: ${outputJsonPath}`);
    fs.writeFileSync(outputJsonPath, JSON.stringify(importedCatalogue, null, 2), "utf8");
    const fileSizeMB = (fs.statSync(outputJsonPath).size / (1024 * 1024)).toFixed(2);
    console.log(`Saved ${importedCatalogue.length} records (${fileSizeMB} MB) successfully.`);
  } else {
    console.log(`\nDRY RUN completed. No files were written to disk.`);
  }
}

runImport().catch((err) => {
  console.error("Fatal import error:", err);
  process.exit(1);
});
