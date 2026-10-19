# ElementraUI — System & Application Architecture

**Version:** 1.0.0  
**Tagline:** *Discover. Preview. Build.*  
**Author:** ElementraUI Core Engineering Team

---

## 1. High-Level Architectural Vision

**ElementraUI** is a modern, developer-first, open-source UI component marketplace and design-engineering workspace. It allows developers and design engineers to search, inspect, live-preview, and integrate over 6,750+ verified components, themes, templates, runnable mini-apps, vector icons, and motion loops.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 ELEMENTRAUI PLATFORM                                   │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                      Header Bar                                        │
│  [Logo / Wordmark]   [Global Search ⌘K]   [Prompt Studio]   [Website Builder]  [CLI]   │
├───────────────────┬────────────────────────────────────────────────────────────────────┤
│   Left Sidebar    │                          Main Workspace                            │
│ ───────────────── │ ────────────────────────────────────────────────────────────────── │
│ • Components      │ 1. Homepage & Spotlight Shelves (Curated Live Components)          │
│ • Themes          │ 2. Discovery Toolbar (Filters, Search, Viewport & Sorting)         │
│ • Templates       │ 3. Responsive Component Grid (4/3 Aspect Ratio, Badges, Actions)   │
│ • Apps            │ 4. Specialized Hub Views:                                          │
│ • Icons           │    - Themes (CSS Variables, Live Color Swatches, 1-Click Copy)    │
│ • Video & Motion  │    - Templates (Multi-Page Blueprints, Tree View, CLI Scaffolding) │
│ • Bookmarks       │    - Apps (6 Runnable Mini-Apps: Kanban, Markdown, Pomodoro, etc.) │
│ ───────────────── │    - Icons (20 Vector SVG Suites, Size/Stroke Sliders, JSX Export) │
│ • Prompt Studio   │    - Video & Motion (Remotion Compositions & CSS Loops)            │
│ • Website Builder │    - Bookmarks (Cross-Section Board Management, JSON Export/Import)│
└───────────────────┴────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼ (Click Card / URL ?item=...)
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                     Centerpiece Zero-Shift Preview Lightbox Modal                      │
│ ────────────────────────────────────────────────────────────────────────────────────── │
│  • Isolated Multi-Tier Preview Engine (Live React / Sandboxed HTML / Blueprints)       │
│  • Viewport Resizer (Desktop 100%, Tablet 768px, Mobile 390px, Fullscreen)             │
│  • Context Tabs: Preview | Source Code | Installation | Metadata & Provenance          │
│  • Keyboard Shortcuts: Esc to close, Arrow keys for in-place adjacent navigation       │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Subsystems

### 2.1 Navigation & URL Synchronization
* **Single-Page Application (SPA):** Built with React 19 and Vite 6 without heavyweight router libraries, ensuring zero layout shift and sub-10ms navigation.
* **History API Synchronization:** Opening a component modal synchronizes the browser URL via `window.history.pushState(..., "", "?item=<slug-or-id>")`.
* **Deep Linking & Popstate:** Entering a URL with `?item=floating-sphere-3d` directly restores the modal centerpiece. The browser's back/forward buttons cleanly open and close modals without full page reloads.

### 2.2 Master Datasets & Loading Pipeline
* **Full Catalogue (`src/data/fullCatalogue.json`):** 162 curated items containing local React TSX code strings, theme token specifications, and registry manifests. Loaded synchronously at startup.
* **Awesome Community Dataset (`public/data/awesome-catalogue.json`):** 6,591 normalized community items. Loaded asynchronously in the background via `fetch("/data/awesome-catalogue.json")` with zero main-thread freezing.
* **Marketplace Hubs (`src/data/`):** Dedicated datasets for Themes (8), Templates (6), Apps (6), Icons (20), and Video (6).
* **Universal Bookmarks Store (`src/data/bookmarksStore.ts`):** Client-side `localStorage` store with automatic backward-compatible schema migration.

### 2.3 Modular Preview Pipeline
Managed by [`src/components/preview/PreviewEngine.tsx`](file:///e:/21st.dev%20work/src/components/preview/PreviewEngine.tsx) and wrapped in a fault-isolating `PreviewErrorBoundary`:
* **`IsolatedReactRenderer`**: Compiles TSX/JSX dynamically in the browser via `sucrase` and mounts inside an iframe loaded with offline bundled React 19, Framer Motion, and Three.js runtime (`/vendor/isolated-react-runtime.js`).
* **`StaticHtmlRenderer`**: Renders community HTML snapshots inside a strict sandboxed iframe (`sandbox="allow-scripts"`), with in-memory storage polyfills and offline Tailwind CSS (`/vendor/tailwind-play.js`).
* **`BlueprintRenderer`**: Renders CLI scaffolding commands, dependencies, and AI Prompt Studio handoffs for upstream registry items.
* **`ScreenshotRenderer`**: High-fidelity zoomable image viewer for static screenshot references.
* **`ThemeRenderer` & `TemplateRenderer`**: Interactive color token showcases and multi-page application scaffolding visualizers.

---

## 3. Technology Stack

- **Runtime & Bundler:** React 19 (`react@^19.0.0`, `react-dom@^19.0.0`), Vite 6 (`vite@^6.1.0`), TypeScript 5.7.
- **Styling:** Tailwind CSS v4 (`tailwindcss@^4.0.8`) with `@tailwindcss/vite`.
- **In-Browser Transpiler:** Sucrase (`sucrase@^3.35.1`).
- **Icons & Graphics:** Lucide React (`lucide-react@^1.16.0`), Three.js (`three@^0.174.0`).
- **Animations:** Framer Motion (`framer-motion@^12.4.7`).
- **Testing:** Playwright (`@playwright/test@^1.64.1`) for headless Chromium verification.
