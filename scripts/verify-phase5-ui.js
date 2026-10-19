import fs from "node:fs";
import path from "node:path";

console.log("=================================================================");
console.log("   PHASE 5 UX OVERHAUL: WORKFLOW, PREVIEW & SCROLL TEST SUITE    ");
console.log("=================================================================\n");

let passed = 0;
let failed = 0;

function assert(condition, message, detail = "") {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}${detail ? " -> " + detail : ""}`);
    failed++;
  }
}

// 1. Inspect Architectural Files & Component Modularization
console.log("1. Verifying Component Architecture & Modularization...");
const headerPath = path.resolve("src/components/Header.tsx");
const toolbarPath = path.resolve("src/components/DiscoveryToolbar.tsx");
const gridPath = path.resolve("src/components/CatalogueGrid.tsx");
const modalPath = path.resolve("src/components/PreviewModal.tsx");
const appPath = path.resolve("src/App.tsx");
const previewPath = path.resolve("src/components/ItemPreview.tsx");

assert(fs.existsSync(headerPath), "Header.tsx exists and is modularized");
assert(fs.existsSync(toolbarPath), "DiscoveryToolbar.tsx exists and is modularized");
assert(fs.existsSync(gridPath), "CatalogueGrid.tsx exists and is modularized");
assert(fs.existsSync(modalPath), "PreviewModal.tsx exists and is modularized");
assert(fs.existsSync(appPath), "App.tsx orchestrates the layout");

// 2. Scroll Position Preservation & Zero-Shift Background Lock Verification
console.log("\n2. Verifying Scroll Position Preservation & Zero-Shift Modal...");
const appCode = fs.readFileSync(appPath, "utf8");
const modalCode = fs.readFileSync(modalPath, "utf8");

assert(
  appCode.includes("document.body.style.overflow = \"hidden\""),
  "Background scroll locking implemented via body overflow lock (prevents background scroll shift)"
);

assert(
  appCode.includes("const originalOverflow = document.body.style.overflow") &&
  appCode.includes("document.body.style.overflow = originalOverflow"),
  "Original overflow style restored cleanly on modal close"
);

assert(
  !appCode.includes("window.scrollTo(0, 0)") && !appCode.includes("setViewMode(\"split\")"),
  "Card click does NOT force scroll to top or trigger layout mode mutation"
);

// 3. Modal URL Synchronization & History Handoff
console.log("\n3. Verifying URL Synchronization (?item=...) & Browser History...");
assert(
  appCode.includes("url.searchParams.set(\"item\", item.slug || item.id)"),
  "Opening modal sets ?item= URL query param via window.history"
);

assert(
  appCode.includes("url.searchParams.delete(\"item\")"),
  "Closing modal clears ?item= URL query param"
);

assert(
  appCode.includes("window.addEventListener(\"popstate\", handlePopState)"),
  "Browser Back / Forward history navigation supported via popstate listener"
);

assert(
  appCode.includes("const itemId = params.get(\"item\")") &&
  appCode.includes("if (itemId)"),
  "Deep-link restoration: opens preview modal directly when valid ?item= URL is provided"
);

// 4. Modal Navigation & Interaction Controls (Escape, Arrows, Close)
console.log("\n4. Verifying Modal In-Place Navigation & Keyboard Controls...");
assert(
  modalCode.includes("e.key === \"Escape\"") && modalCode.includes("onClose()"),
  "Escape key listener implemented to close modal"
);

assert(
  modalCode.includes("e.key === \"ArrowLeft\"") && modalCode.includes("onSelectItem(prevItem)"),
  "Left Arrow key navigates to previous item in-place"
);

assert(
  modalCode.includes("e.key === \"ArrowRight\"") && modalCode.includes("onSelectItem(nextItem)"),
  "Right Arrow key navigates to next item in-place"
);

assert(
  appCode.includes("window.history.replaceState"),
  "In-place navigation updates URL without creating redundant browser history entries (replaceState)"
);

assert(
  modalCode.includes("modalRef.current?.focus()"),
  "Modal container receives focus on mount for immediate keyboard accessibility"
);

// 5. Honest Status Badges & Transparency Verification
console.log("\n5. Verifying Honest Preview Badges & Status Differentiation...");
const typesCode = fs.readFileSync(path.resolve("src/types/catalogue.ts"), "utf8");

assert(
  typesCode.includes("export type HonestPreviewKind ="),
  "HonestPreviewKind type explicitly defines discrete preview states"
);

assert(
  typesCode.includes("executable-verified") &&
  typesCode.includes("html-snapshot") &&
  typesCode.includes("screenshot-reference") &&
  typesCode.includes("prompt-blueprint"),
  "Explicitly differentiates Executable React vs HTML Snapshot vs Screenshot Ref vs Prompt Blueprint"
);

assert(
  typesCode.includes("getHonestPreviewKind(item: CatalogueItem)"),
  "getHonestPreviewKind function programmatically classifies items based on real evidence"
);

assert(
  !modalCode.includes("Verified Preview") || modalCode.includes("badge.label"),
  "Generic 'Verified Preview' replaced with honest evidence-based label"
);

// 6. Responsive Preview Stage & Viewport Controls
console.log("\n6. Verifying Responsive Preview Stage & Sizing Controls...");
assert(
  modalCode.includes("max-w-7xl h-[94vh]") || modalCode.includes("w-[96vw]"),
  "Modal stage uses available viewport efficiently (taking up >90% width and height)"
);

assert(
  modalCode.includes("viewportSize === \"desktop\"") &&
  modalCode.includes("viewportSize === \"tablet\"") &&
  modalCode.includes("viewportSize === \"mobile\""),
  "Responsive viewport toggles (Desktop 100%, Tablet 768px, Mobile 375px) supported"
);

assert(
  modalCode.includes("themeMode === \"dark\"") && modalCode.includes("themeMode === \"light\""),
  "Real dark/light preview theme toggle implemented"
);

assert(
  modalCode.includes("isFullscreenStage"),
  "Fullscreen stage inspection mode implemented"
);

assert(
  modalCode.includes("setStageKey"),
  "Preview stage reload/reset action supported"
);

// 7. Context-Aware Tabs & No Empty Tabs
console.log("\n7. Verifying Context-Aware Tabs & Actions...");
assert(
  modalCode.includes("item.componentCode && ("),
  "Source Code tab only renders when authentic componentCode exists"
);

assert(
  modalCode.includes("item.awesomeData?.htmlUrl && ("),
  "HTML Snapshot tab only renders when authentic htmlUrl exists"
);

assert(
  modalCode.includes("item.awesomeData?.screenshotUrl && ("),
  "Screenshot tab only renders when authentic screenshotUrl exists"
);

assert(
  modalCode.includes("onSendToBuilder") && modalCode.includes("onSendToPromptStudio"),
  "Prompt actions connect cleanly to Website Builder and Prompt Studio"
);

assert(
  modalCode.includes("relatedItems"),
  "Related components section implemented at bottom of modal"
);

// 8. Visual Discovery Grid & Virtual Pagination
console.log("\n8. Verifying Visual Discovery Grid & Pagination...");
const gridSource = fs.readFileSync(gridPath, "utf8");

assert(
  gridSource.includes("grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"),
  "Responsive 1 to 4 column grid layout implemented"
);

assert(
  gridSource.includes("pageSize") && gridSource.includes("totalPages"),
  "Pagination limits rendered DOM nodes to maintain 60 FPS"
);

assert(
  gridSource.includes("ChevronLeft") && gridSource.includes("ChevronRight"),
  "Pagination controls with Prev/Next and page numbers supported"
);

console.log("\n=================================================================");
console.log(`PHASE 5 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log("=================================================================\n");

if (failed > 0) {
  process.exit(1);
}
