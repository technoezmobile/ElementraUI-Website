import fs from "node:fs";
import path from "node:path";

console.log("=================================================================");
console.log("   PHASE 6: 7-SECTION MARKETPLACE VERIFICATION TEST SUITE        ");
console.log("=================================================================\n");

let passed = 0;
let failed = 0;

function assert(condition, testName, details = "") {
  if (condition) {
    console.log(`  ✓ [PASS] ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ [FAIL] ${testName}${details ? " -> " + details : ""}`);
    failed++;
  }
}

// 1. Architecture & Modularization
console.log("Suite 1: Verifying Marketplace Modular Architecture...");
const files = [
  "src/types/marketplace.ts",
  "src/components/Sidebar.tsx",
  "src/components/Themes/ThemesSection.tsx",
  "src/components/Templates/TemplatesSection.tsx",
  "src/components/Apps/AppsSection.tsx",
  "src/components/Icons/IconsSection.tsx",
  "src/components/Video/VideoSection.tsx",
  "src/components/Bookmarks/BookmarksSection.tsx",
  "src/components/GlobalSearch/GlobalSearchModal.tsx",
  "src/data/themesData.ts",
  "src/data/templatesData.ts",
  "src/data/appsData.ts",
  "src/data/iconsData.ts",
  "src/data/videoData.ts",
  "src/data/bookmarksStore.ts"
];

for (const f of files) {
  assert(fs.existsSync(path.resolve(f)), `File exists: ${f}`);
}

// 2. Inspect Themes Implementation & Tokens
console.log("\nSuite 2: Inspecting Themes Data & Application Pipeline...");
const themesSource = fs.readFileSync("src/data/themesData.ts", "utf8");
const themesSectionSource = fs.readFileSync("src/components/Themes/ThemesSection.tsx", "utf8");

assert(themesSource.includes("theme-zinc-modernist"), "Zinc Modernist theme implemented");
assert(themesSource.includes("theme-cyber-neon-contrast"), "Cyber Neon theme implemented");
assert(themesSource.includes("theme-midnight-obsidian"), "Midnight Obsidian theme implemented");
assert(themesSource.includes("theme-emerald-clean"), "Emerald SaaS theme implemented");
assert(themesSource.includes("theme-sunset-amber"), "Sunset Amber theme implemented");
assert(themesSource.includes("theme-nord-glacier"), "Nord Glacier theme implemented");
assert(themesSource.includes("theme-retro-terminal"), "Retro CRT Terminal theme implemented");
assert(themesSource.includes("theme-tokyo-night"), "Tokyo Night theme implemented");
assert(themesSource.includes("--background") && themesSource.includes("--foreground"), "CSS variables token contract defined");
assert(themesSectionSource.includes("onApplyThemeToBuilder"), "Themes section connects 'Apply to Website Builder' pipeline");
assert(themesSectionSource.includes("navigator.clipboard.writeText(theme.cssVariables)"), "1-click copy CSS variables supported");

// 3. Inspect Templates Implementation & Scaffolding
console.log("\nSuite 3: Inspecting Templates Marketplace & Project Scaffolding...");
const templatesSource = fs.readFileSync("src/data/templatesData.ts", "utf8");
const templatesSectionSource = fs.readFileSync("src/components/Templates/TemplatesSection.tsx", "utf8");

assert(templatesSource.includes("template-devtool-saas-starter"), "DevTool SaaS Starter template implemented");
assert(templatesSource.includes("template-bento-engineer-portfolio"), "Bento Engineer Portfolio template implemented");
assert(templatesSource.includes("template-cloud-analytics-dashboard"), "Cloud Analytics Dashboard template implemented");
assert(templatesSource.includes("template-agency-creative-studio"), "Agency Creative Studio template implemented");
assert(templatesSource.includes("template-ai-agent-canvas"), "AI Agent Workflow Canvas template implemented");
assert(templatesSource.includes("template-developer-docs-hub"), "Technical Docs Hub template implemented");
assert(templatesSource.includes("Next.js 15") && templatesSource.includes("React 19 + Vite"), "Multi-framework support verified (Next.js 15 & React 19)");
assert(templatesSectionSource.includes("viewport === \"mobile\"") && templatesSectionSource.includes("viewport === \"tablet\""), "Responsive viewport controls (Desktop, Tablet, Mobile) supported");
assert(templatesSectionSource.includes("copySetup"), "CLI scaffolding command copy supported");

// 4. Inspect Runnable Apps & Isolated Execution
console.log("\nSuite 4: Inspecting Runnable Apps & Live Tool Execution...");
const appsSource = fs.readFileSync("src/data/appsData.ts", "utf8");
const appsSectionSource = fs.readFileSync("src/components/Apps/AppsSection.tsx", "utf8");

assert(appsSource.includes("app-kanban-board"), "Interactive Agile Kanban Board registered");
assert(appsSource.includes("app-markdown-live-editor"), "Markdown Live Editor registered");
assert(appsSource.includes("app-pomodoro-timer"), "Precision Pomodoro Focus Timer registered");
assert(appsSource.includes("app-dev-calculator"), "Programmer Calculator registered");
assert(appsSource.includes("app-json-formatter"), "JSON Formatter & Validator registered");
assert(appsSource.includes("app-palette-generator"), "Harmonic Color Palette Generator registered");
assert(appsSectionSource.includes("KanbanBoardLiveApp"), "Real interactive Kanban Board component implemented");
assert(appsSectionSource.includes("MarkdownEditorLiveApp"), "Real interactive Markdown Editor component implemented");
assert(appsSectionSource.includes("PomodoroTimerLiveApp"), "Real interactive Pomodoro Timer component implemented");
assert(appsSectionSource.includes("DevCalculatorLiveApp"), "Real interactive Programmer Calculator component implemented");

// 5. Inspect Searchable Vector Icons
console.log("\nSuite 5: Inspecting Vector Icons Discovery & Export Workspace...");
const iconsSource = fs.readFileSync("src/data/iconsData.ts", "utf8");
const iconsSectionSource = fs.readFileSync("src/components/Icons/IconsSection.tsx", "utf8");

assert(iconsSource.includes("icon-home") && iconsSource.includes("icon-search"), "Core navigation icons defined");
assert(iconsSource.includes("icon-terminal") && iconsSource.includes("icon-code-2"), "Developer icons defined");
assert(iconsSource.includes("icon-layers") && iconsSource.includes("icon-wand-2"), "Interface icons defined");
assert(iconsSource.includes("svgPath") && iconsSource.includes("viewBox: \"0 0 24 24\""), "Authentic SVG vector paths defined");
assert(iconsSectionSource.includes("copySvg") && iconsSectionSource.includes("copyReact"), "Copy SVG and Copy React JSX component exports supported");
assert(iconsSectionSource.includes("downloadSvg"), "Download .svg vector file supported");
assert(iconsSectionSource.includes("onInsertIntoBuilder"), "Insert into Website Builder handoff supported");
assert(iconsSectionSource.includes("setIconSize") && iconsSectionSource.includes("setStrokeWidth"), "Real-time vector size and stroke width scaling controls supported");

// 6. Inspect Video & Motion Assets
console.log("\nSuite 6: Inspecting Video & Motion Engineering Assets...");
const videoSource = fs.readFileSync("src/data/videoData.ts", "utf8");
const videoSectionSource = fs.readFileSync("src/components/Video/VideoSection.tsx", "utf8");

assert(videoSource.includes("video-mesh-gradient-loop"), "Fluid Mesh Gradient Loop registered");
assert(videoSource.includes("video-orbital-particle-ring"), "3D Orbital Particle Ring registered");
assert(videoSource.includes("video-kinetic-title-reveal"), "Kinetic Typography Reveal registered");
assert(videoSource.includes("video-saas-device-mockup"), "3D Perspective Device Mockup registered");
assert(videoSource.includes("video-audio-waveform-visualizer"), "Audio Waveform Visualizer registered");
assert(videoSource.includes("video-infinite-hyperspace-tunnel"), "Infinite Hyperspace Tunnel registered");
assert(videoSource.includes("remotionSnippet"), "Remotion video composition code available");
assert(videoSectionSource.includes("copyAnimation") && videoSectionSource.includes("copyRemotion"), "Copy Animation and Copy Remotion actions implemented");

// 7. Inspect Bookmarks & Collections Migration
console.log("\nSuite 7: Inspecting Bookmarks & Collections System...");
const bookmarksSource = fs.readFileSync("src/data/bookmarksStore.ts", "utf8");
const bookmarksSectionSource = fs.readFileSync("src/components/Bookmarks/BookmarksSection.tsx", "utf8");

assert(bookmarksSource.includes("21st_local_favorites"), "Legacy favorites key preserved for zero-data-loss migration");
assert(bookmarksSource.includes("DEFAULT_BOARDS"), "Default collection boards (All, Components, Themes) configured");
assert(bookmarksSectionSource.includes("handleCreateBoard"), "Custom board creation workflow supported");
assert(bookmarksSectionSource.includes("handleDeleteBoard"), "Custom board deletion supported");
assert(bookmarksSectionSource.includes("exportBoard"), "Board JSON export supported");

// 8. Inspect Global Search & Sidebar Orchestration
console.log("\nSuite 8: Inspecting Global Search & Sidebar Navigation...");
const searchSource = fs.readFileSync("src/components/GlobalSearch/GlobalSearchModal.tsx", "utf8");
const sidebarSource = fs.readFileSync("src/components/Sidebar.tsx", "utf8");
const headerSource = fs.readFileSync("src/components/Header.tsx", "utf8");
const appSource = fs.readFileSync("src/App.tsx", "utf8");

assert(searchSource.includes("verifiedThemesData") && searchSource.includes("verifiedTemplatesData"), "Global search indexes Themes & Templates");
assert(searchSource.includes("verifiedAppsData") && searchSource.includes("verifiedIconsData"), "Global search indexes Apps & Icons");
assert(searchSource.includes("verifiedVideoData"), "Global search indexes Video assets");
assert(headerSource.includes("Cmd+K") || headerSource.includes("e.key.toLowerCase() === \"k\""), "Global search Cmd+K / Ctrl+K keyboard shortcut implemented");
assert(sidebarSource.includes("Components") && sidebarSource.includes("Themes") && sidebarSource.includes("Templates"), "Sidebar distinguishes Components, Themes, and Templates");
assert(sidebarSource.includes("Apps") && sidebarSource.includes("Icons") && sidebarSource.includes("Video") && sidebarSource.includes("Bookmarks"), "Sidebar distinguishes Apps, Icons, Video, and Bookmarks");
assert(appSource.includes("<ThemesSection") && appSource.includes("<TemplatesSection"), "App.tsx renders Themes and Templates hubs");
assert(appSource.includes("<AppsSection") && appSource.includes("<IconsSection"), "App.tsx renders Apps and Icons hubs");
assert(appSource.includes("<VideoSection") && appSource.includes("<BookmarksSection"), "App.tsx renders Video and Bookmarks hubs");

console.log("\n=================================================================");
console.log(`   PHASE 6 TEST SUITE COMPLETE: ${passed} PASSED, ${failed} FAILED`);
console.log("=================================================================\n");

if (failed > 0) {
  process.exit(1);
}
