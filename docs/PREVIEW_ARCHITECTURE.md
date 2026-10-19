# ElementraUI — Component Preview Engine Architecture

**Date:** 2026-10-19  
**Auditor:** UI Infrastructure & Security Architect  
**Subject:** Multi-Tier Isolated Execution, Sandboxing Invariants, & Preview Pipeline Specifications  
**Target Brand:** ElementraUI (*Discover. Preview. Build.*)

---

## 1. Executive Summary

The **ElementraUI Component Preview Engine** provides isolated, reliable visual rendering across all **6,753 catalogue records** without faking previews, without crashing the host application, and without exposing the parent application to untrusted third-party code.

The engine dynamically routes each record to its optimal execution sandbox based on honest capability detection:
1. **Live Executable React Components (14 Core Items):** Compiled in-browser via Sucrase and mounted inside an isolated iframe powered by a bundled offline React 19 runtime.
2. **Interactive HTML/CSS Snapshots (6,590 Community Items):** Rendered in a secure, sandboxed iframe with local offline Tailwind CSS and an in-memory storage polyfill.
3. **Registry CLI Specifications (138 Upstream Items):** Rendered as interactive CLI Scaffolding Blueprints with 1-click terminal commands and dependency graphs.
4. **Theme & Template Blueprints (8 Themes + 6 Starters):** Rendered via dedicated interactive swatches and multi-page responsive viewports.
5. **Static Screenshot References (Explicit Fallbacks):** Labeled transparently as image references when no executable code or DOM snapshot exists.

---

## 2. Root Cause Analysis: Why Previews Previously Showed Images

Prior to the preview engine overhaul, the platform suffered from four systemic defects that caused it to display static screenshots rather than interactive UI:

### Defect 1: Lack of In-Browser Compilation & Dependency Bundling
* **Mechanism:** The catalogue contained raw TSX/JSX source strings (`item.componentCode`). Because browsers cannot natively parse JSX or TypeScript, the application could only render components that were explicitly imported into a hardcoded switch statement.
* **Result:** Any component not hardcoded into the bundle failed to execute, triggering fallback logic that displayed `screenshot.png`.

### Defect 2: Metatype Conflation of Community Records
* **Mechanism:** The 6,591 imported Awesome Components records do not contain standalone `.tsx` modules—they contain pre-rendered HTML DOM structures (`rendered.html`). The legacy previewer checked exclusively for React exports; when none were found, it assumed the item was non-executable and displayed a static image.
* **Result:** Over 6,500 fully functional interactive HTML snapshots were masked behind static PNG images.

### Defect 3: Storage Access Crashes in Sandboxed Iframes
* **Mechanism:** Sandboxed iframes configured with `sandbox="allow-scripts"` (strictly omitting `allow-same-origin`) throw an uncatchable `DOMException: SecurityError: Failed to read the 'localStorage' property from 'Window'` whenever embedded scripts touch storage.
* **Result:** Upstream community scripts crashed during initialization, producing blank canvases that triggered immediate fallback to screenshot images.

### Defect 4: External CDN Dependency & Network Brittleness
* **Mechanism:** HTML snapshots previously injected Tailwind CSS via `https://cdn.tailwindcss.com`.
* **Result:** In offline environments or under network latency, scripts timed out, preventing CSS compilation and rendering broken unstyled content.

---

## 3. High-Level Architecture & Routing Pipeline

The engine coordinates rendering through [`PreviewEngine.tsx`](file:///e:/21st.dev%20work/src/components/preview/PreviewEngine.tsx), routing items to dedicated renderers enclosed by a fault-isolating React Error Boundary:

```
                            ┌─────────────────────────┐
                            │      CatalogueItem      │
                            └────────────┬────────────┘
                                         │
                                         ▼
                            ┌─────────────────────────┐
                            │      PreviewEngine      │
                            │  (Capability Dispatch)  │
                            └────────────┬────────────┘
                                         │
        ┌──────────────┬─────────────────┼─────────────────┬──────────────┐
        ▼              ▼                 ▼                 ▼              ▼
┌──────────────┐┌──────────────┐  ┌──────────────┐  ┌──────────────┐┌──────────────┐
│IsolatedReact ││ StaticHtml   │  │  Blueprint   │  │  Theme &     ││  Screenshot  │
│  Renderer    ││   Renderer   │  │   Renderer   │  │ Template     ││   Renderer   │
│(Sucrase + R19││(Offline TW + │  │(CLI Registry/│  │  Renderers   ││ (Explicit    │
│ bundled deps)││Mock Storage) │  │Prompt Studio)│  │ (Swatches/VP)││  Reference)  │
└──────┬───────┘└──────┬───────┘  └──────┬───────┘  └──────┬───────┘└──────┬───────┘
       │              │                  │                 │               │
       └──────────────┴──────────────────┼─────────────────┴───────────────┘
                                         ▼
                            ┌─────────────────────────┐
                            │  PreviewErrorBoundary   │
                            │ (Crash & Error Trap)    │
                            └─────────────────────────┘
```

---

## 4. Modular Renderer Specifications

All renderers are located in [`src/components/preview/`](file:///e:/21st.dev%20work/src/components/preview/):

### 1. `IsolatedReactRenderer.tsx` (Live Executable React Pipeline)
- **Compilation Engine:** Compiles TSX/JSX in the browser using `sucrase` (`transforms: ["jsx", "typescript"]`).
- **Offline Runtime Bundle:** Loads [`public/vendor/isolated-react-runtime.js`](file:///e:/21st.dev%20work/public/vendor/isolated-react-runtime.js) (1.96 MB bundled via esbuild), exposing global runtime objects:
  - `window.React` & `window.ReactDOM` (React 19.3.1)
  - `window.FramerMotion` (Framer Motion 12.43.0)
  - `window.LucideReact` (Lucide React 1.59.0)
  - `window.Three` (Three.js 0.174.0)
  - `window.clsx` & `window.tailwindMerge`
- **Dependency Interception:** Pre-scans source code for unbundled imports (e.g., `@radix-ui/react-slider`). If an unbundled dependency is detected, it renders a **Clean Diagnostic Notice** showing the missing package and copyable install command rather than crashing.
- **Syntax Error Reporting:** Displays precise compiler errors with line and column markers in a high-contrast diagnostic overlay.

### 2. `StaticHtmlRenderer.tsx` (Sandboxed HTML Snapshot Pipeline)
- **Sandboxing Invariant:** Wrapped in an iframe with strict `sandbox="allow-scripts"`. `allow-same-origin` is **strictly omitted**, preventing untrusted scripts from accessing host cookies, localStorage, or parent DOM.
- **In-Memory Storage Mock:** Injects a mock storage polyfill prior to script execution:
  ```javascript
  const dummyStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {}, clear: () => {} };
  Object.defineProperty(window, 'localStorage', { value: dummyStorage, writable: false });
  Object.defineProperty(window, 'sessionStorage', { value: dummyStorage, writable: false });
  ```
- **Local Tailwind Runtime:** Injects `/vendor/tailwind-play.js` for instant, offline utility class styling.
- **Relative Asset Resolution:** Injects `<base href="/awesome-components/.../">` to ensure relative image and font paths resolve seamlessly.
- **Fail-Safe Timeout:** 5-second fetch watchdog; if the HTML fails to load or contains 0 bytes, it falls back gracefully to screenshot inspection.

### 3. `BlueprintRenderer.tsx` (CLI Registry & Prompt Specifications)
- Renders upstream registry items awaiting local React mirroring (e.g., `shadcn-accordion`).
- Displays the exact CLI command (`npx shadcn@latest add ...`), component dependencies, and raw registry JSON.
- Provides 1-click handoff buttons to **AI Prompt Studio** and **Website Builder**.

### 4. `ScreenshotRenderer.tsx` (Transparent Visual Reference)
- Used only when explicitly selected by the user or when an item has no executable code or DOM snapshot.
- Features real-time zoom controls (50%, 75%, 100%, 150%, 200%), fit-to-canvas mode, and image dimension verification.

### 5. `PreviewErrorBoundary.tsx` (Fault Isolation Boundary)
- React Class Component implementing `componentDidCatch`.
- Traps runtime errors occurring during React rendering or WebGL canvas initialization.
- Isolates failures to the preview canvas without impacting sidebar navigation, search, or active tabs.
- Provides a 1-click "Reset Preview Canvas" button.

---

## 5. Security Invariants & Isolation Boundaries

| Boundary | Enforcement Mechanism | Risk Mitigated |
| :--- | :--- | :--- |
| **Cross-Site Scripting (XSS)** | `sandbox="allow-scripts"` (strictly omitting `allow-same-origin`) | Third-party community code cannot read host cookies, auth tokens, or parent DOM. |
| **Storage Security Errors** | In-memory dummy storage polyfill injected before script tags | Eliminates uncatchable `DOMException` when scripts access `localStorage`. |
| **Path Traversal Attacks** | Middleware in `vite.config.ts` validates paths against `.cache/awesome-components` root | Prevents malicious HTTP requests from escaping the cache folder via `../` traversal. |
| **Main-Thread GPU Crashes** | WebGL context loss listeners and Error Boundary traps | Corrupt 3D shaders or WebGL memory leaks are caught and isolated to the preview frame. |
| **Network Snooping / CDNs** | All runtimes served locally via `/vendor/` | Prevents IP tracking and guarantees 100% offline functionality. |

---

## 6. Identified Architectural Gaps & Recommendations

### Gap 1: Production Static Asset Serving
* **Finding:** In development, `vite.config.ts` dynamically intercepts `/awesome-components/*` via middleware. In a production static export (`npm run build`), Vite does not bundle `.cache/awesome-components/components/` into `dist/`.
* **Impact:** In a static hosting environment (e.g., GitHub Pages, Cloudflare Pages, Vercel), HTML snapshots and screenshots return 404.
* **ElementraUI Recommendation:** Add a build task (`npm run build:assets` or Vite rollup copy plugin) to selectively package verified HTML/screenshot assets into `dist/awesome-components/` or provide an optional pre-compressed asset bundle.

### Gap 2: WebGL Context & Iframe Memory Recycling
* **Finding:** Rapidly opening dozens of Three.js/WebGL preview modals in a single session can accumulate disconnected WebGL contexts in Chromium.
* **ElementraUI Recommendation:** In `PreviewModal.tsx`, ensure the iframe `srcDoc` is explicitly set to `""` and detached from the DOM during cleanup (`useEffect` teardown) to force immediate garbage collection of GPU memory.

### Gap 3: Radix UI Dynamic Runtime Resolution
* **Finding:** The offline runtime bundle currently includes React 19, Framer Motion, Three.js, Lucide, and Tailwind utilities. When users import components relying on `@radix-ui/react-*`, the preview engine currently halts and displays a diagnostic warning.
* **ElementraUI Recommendation:** Extend `scripts/build-isolated-runtime.js` to bundle the top 10 most common Radix primitives (`@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-tabs`, `@radix-ui/react-tooltip`, etc.) into `isolated-react-runtime.js`, expanding live React execution coverage to virtually all shadcn/ui components.
