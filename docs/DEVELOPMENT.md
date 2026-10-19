# ElementraUI — Local Development Guide

**Version:** 1.0.0  
**Target Brand:** ElementraUI (*Discover. Preview. Build.*)

---

## 1. Prerequisites

- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher
- **Modern Browser**: Chrome, Edge, Safari, or Firefox with WebGL enabled

---

## 2. Quick Start

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/elementraui/elementraui.git
cd elementraui
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser.

The Vite development server runs with:
- Instant Hot Module Replacement (HMR).
- Dynamic `/awesome-components/*` static serving middleware mapping directly to `.cache/awesome-components/components`.
- Tailwind CSS v4 JIT compilation.

---

## 3. Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts local development server on port 5173. |
| `npm run build` | Runs strict TypeScript type-checking (`tsc -b`) and Vite production bundle. |
| `npm run build:static` | Builds production bundle and copies offline component assets into `dist/awesome-components/`. |
| `npm run preview` | Starts local preview server from the `dist/` production build. |
| `npm run test:live` | Runs real Chromium Playwright tests on the 8 representative preview categories. |
| `npm run test:browser` | Runs real Chromium Playwright audit across 54 representative items. |
| `npm run test:marketplace` | Validates all 7 marketplace hub schemas and pipelines (75 tests). |
| `npm run test:previews` | Validates core React implementations and JSON registry endpoints (59 tests). |
| `npm run test:awesome` | Validates community HTML snapshots, PNG magic headers, and prompts (112 tests). |
| `npm run test:coverage` | Runs HTTP status and payload size checks across catalogue items (381 tests). |
| `npm run test:install` | Verifies component installation into a test project (6 tests). |
| `npm run audit:coverage` | Generates a 12-metric dataset health report (`PREVIEW_COVERAGE_REPORT.md`). |

---

## 4. Building the Isolated React Runtime

If you update React, Framer Motion, or Three.js dependencies, recompile the offline runtime bundle:
```bash
node scripts/build-isolated-runtime.js
```
This generates `public/vendor/isolated-react-runtime.js` (1.96 MB bundled via esbuild), exposing global runtime objects for sandboxed iframes.

---

## 5. Coding Standards

- **TypeScript Strict Mode:** All code in `src/` must pass `tsc -b` with zero errors.
- **Component Isolation:** Never run arbitrary third-party component code directly inside the parent application tree. Always use `IsolatedReactRenderer` or `StaticHtmlRenderer`.
- **Keyboard Accessibility:** All interactive elements must have visible focus rings (`focus-visible:ring-2`) and keyboard event listeners (`Enter`, `Space`, `Escape`).
