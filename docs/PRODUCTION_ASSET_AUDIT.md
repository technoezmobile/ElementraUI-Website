# ElementraUI: Production Asset Pipeline Audit Note

**Date:** October 19, 2026  
**Auditor:** Senior Infrastructure & QA Engineer  
**Scope:** Production asset delivery, catalogue reference resolution, Vite build pipeline, and static hosting readiness.

---

## 1. Executive Findings

| Area | Current State | Defect / Vulnerability | Required Remedy |
| :--- | :--- | :--- | :--- |
| **Asset Source Directory** | `community-assets/components/` contains 26,734 files (6,591 HTML, 6,591 PNG, 13,552 MD, 616.24 MB). | `scripts/bundle-production-assets.js` hardcodes `.cache/awesome-components/components`. In clean checkouts, `.cache` does not exist; script silently skips bundling and exits 0. | Point source resolution to `community-assets/components/` with fallback to `.cache/`. Fail with non-zero exit code if no assets found. |
| **Build Scripts** | `npm run build` runs `tsc -b && vite build`. `npm run build:static` runs `bundle-production-assets.js`. | `npm run build` completely omits community preview assets from `dist/`. Anyone running standard `npm run build` produces a broken static site where all 6,591 previews 404. | Integrate asset bundling directly into the production build process (`npm run build` and `npm run build:static`), ensuring `dist/` is always self-contained. |
| **Missing Markdown Bundling** | `bundle-production-assets.js` only copied `[.html, .png, .svg, .css, .js, .json]`. | `item.awesomeData.promptUrl` (`.../prompt.md`) is fetched by `DetailPanel.tsx` and `PreviewModal.tsx`. MD files were omitted, causing prompt inspection tabs to 404 in production. | Include `.md` files in asset bundling. |
| **Subpath & BASE_URL** | Hardcoded absolute paths (`/awesome-components/...`, `/data/...`, `/vendor/...`) used across `src/App.tsx`, `StaticHtmlRenderer.tsx`, `CatalogueGrid.tsx`, `DetailPanel.tsx`, and `PreviewModal.tsx`. | Deployment under a subpath (e.g. GitHub Pages `https://user.github.io/elementraui/`) will request root `/awesome-components` and fail with 404s. | Implement a centralized `resolveAssetUrl(path)` utility that respects `import.meta.env.BASE_URL`. |
| **Catalogue Reference Consistency** | 6,591 community items reference `/awesome-components/...`. | If assets are copied to `dist/awesome-components`, paths match perfectly. If `dist/community-assets` is also needed, support both through aliasing. | Bundle assets into `dist/awesome-components` (matching the catalogue URLs), and ensure preview/dev servers map both `/awesome-components` and `/community-assets`. |
| **Linting Infrastructure** | `npm run lint` invokes `eslint .`. | `eslint` is not installed in `node_modules` and missing from `devDependencies` and `package-lock.json`. Command fails immediately. | Install ESLint + TypeScript ESLint packages, configure a clean `eslint.config.js` conforming to React 19 + TypeScript 5.7, and verify `npm run lint`. |
| **CI Workflow** | `.github/workflows/ci.yml` runs build and static checks. | CI does not run production asset validation or browser tests against the production build. | Update CI to run asset validation and production-served Playwright tests. |

---

## 2. Full Asset Lifecycle Trace

```
1. Original Asset:
   community-assets/components/<bucket>/<author>/<component>/<variant>/[rendered.html | screenshot.png | prompt.md]
      ↓
2. Build Ingestion & Bundling:
   scripts/bundle-production-assets.js (or Vite build plugin) reads community-assets/components/
      ↓
3. Production Output:
   dist/awesome-components/<bucket>/<author>/<component>/<variant>/[rendered.html | screenshot.png | prompt.md]
      ↓
4. Catalogue Record Reference:
   public/data/awesome-catalogue.json specifies:
   - htmlUrl: "/awesome-components/.../rendered.html"
   - screenshotUrl: "/awesome-components/.../screenshot.png"
   - promptUrl: "/awesome-components/.../prompt.md"
      ↓
5. Browser Request (with BASE_URL resolution):
   resolveAssetUrl(item.awesomeData.htmlUrl) -> `${BASE_URL}awesome-components/.../rendered.html`
      ↓
6. Rendered Preview:
   - StaticHtmlRenderer wraps in sandbox="allow-scripts" iframe with injected local /vendor/tailwind-play.js
   - ScreenshotRenderer renders <img> with onError fallback
   - Missing/corrupt asset -> fallback banner displayed
```

---

## 3. Plan of Action

1. **Fix Asset Bundler (`scripts/bundle-production-assets.js`):**
   - Resolve source directory with clear priority:
     1. `community-assets/components` (primary)
     2. `.cache/awesome-components/components` (legacy fallback)
   - If neither exists, fail with a clear, descriptive error and non-zero exit code.
   - Include `.md` files alongside `.html`, `.png`, `.svg`, `.css`, `.js`, `.json`.
   - Copy to `dist/awesome-components`.
   - Prevent redundant copying when files are unchanged (incremental/timestamp or size check) for speed.
2. **Make Production Build Self-Contained:**
   - Update `package.json` scripts:
     - `"build": "tsc -b && vite build && node scripts/bundle-production-assets.js"`
     - `"build:static": "npm run build"`
   - Ensure `npm run build` always creates a production-ready `dist/` with all assets.
3. **Subpath & BASE_URL Compatibility:**
   - Create `src/utils/assetUrl.ts` exporting `resolveAssetUrl(path: string): string`.
   - Update `src/App.tsx` (`fetch(resolveAssetUrl("data/awesome-catalogue.json"))`).
   - Update `StaticHtmlRenderer.tsx`, `ScreenshotRenderer.tsx`, `DetailPanel.tsx`, `PreviewModal.tsx`, `CatalogueGrid.tsx` to use `resolveAssetUrl`.
4. **Catalogue-to-Asset Validator (`scripts/validate-catalogue-assets.js`):**
   - Read `public/data/awesome-catalogue.json` and `src/data/fullCatalogue.json`.
   - Check every referenced source asset exists on disk.
   - Check every referenced production asset exists in `dist/` after build.
   - Check for zero-byte files.
   - Return non-zero exit code on missing required production assets.
5. **Install & Configure ESLint:**
   - Install `eslint`, `@eslint/js`, `typescript-eslint`, `eslint-plugin-react-hooks`.
   - Create standard flat config `eslint.config.js`.
   - Verify `npm run lint` passes or reports real actionable issues.
6. **Production Playwright Browser Testing:**
   - Run tests against `dist/` served via `vite preview` or local static server.
   - Test React components, HTML snapshots, screenshots, fallbacks, modals, responsive layout, console errors, and network failures.
7. **CI & Documentation:**
   - Update `.github/workflows/ci.yml` and `docs/`.
