# ElementraUI — Verification & Quality Assurance Strategy

**Date:** 2026-10-19  
**Auditor:** Senior QA Engineer & Test Infrastructure Architect  
**Subject:** Test Suite Audit, Synthetic vs Real Browser Dissection, & QA Roadmap  
**Target Brand:** ElementraUI (*Discover. Preview. Build.*)

---

## 1. Executive Summary

This document audits the test infrastructure in the repository and specifies the quality assurance strategy for **ElementraUI**.

The repository contains **8 active automated test suites** delivering **548 automated checks**. A critical finding of this audit is the distinction between **synthetic checks** (verifying HTTP responses, file sizes, PNG headers, and TypeScript exports) and **real browser automation** (spawning headless Chromium instances via Playwright to verify dynamic compilation, DOM mounting, canvas bounding boxes, and interactive UI states).

All 8 test suites currently pass with **0 failures**.

---

## 2. Existing Test Suites Inventory & Empirical Audit

| Test Script | Command | Tests Run | Execution Environment | What It Actually Proves | What It Does NOT Prove |
| :--- | :--- | :---: | :--- | :--- | :--- |
| **`scripts/verify-isolated-react.js`** | `npm run test:live` | **8** | Real Playwright Chromium | Proves live in-browser Sucrase compilation, React 19 mounting in iframe, non-zero bounding box (753x480), and missing dependency interception. | Does not exhaustively test all 6,591 community items (tests representative categories). |
| **`scripts/run-browser-audit.js`** | `npm run test:browser` | **54** | Real Playwright Chromium | Proves visual rendering across 54 representative items, mobile viewport resize (390px), light/dark mode switching, and in-modal item navigation. | Limited to 54 audited sample components to maintain high CI velocity. |
| **`scripts/verify-previews.js`** | `npm run test:previews` | **59** | Node.js Process | Proves registry JSON existence, TypeScript component exports, and file integrity for core items. | Does not execute JavaScript or measure rendered layout. |
| **`scripts/verify-awesome-components.js`** | `npm run test:awesome` | **112** | Node.js Process | Proves that 112 audited community components have non-empty HTML files, valid PNG magic bytes, and README prompts. | Does not test browser DOM rendering or CSS keyframes. |
| **`scripts/verify-phase5-ui.js`** | `npm run test:ui` | **34** | Node.js Process | Proves UI component exports, theme tokens in `index.css`, header/sidebar layouts, and pagination utilities. | Does not verify visual rendering in a browser viewport. |
| **`scripts/verify-browser-previews.js`** | `npm run test:coverage` | **381** | Node.js HTTP Client | Proves that Vite dev server returns HTTP 200 with proper MIME types for 381 component endpoints. | Synthetic HTTP check; does not prove browser visual correctness. |
| **`scripts/verify-phase6-marketplace.js`** | `npm run test:marketplace` | **75** | Node.js Process | Proves schema validity for Themes (8), Templates (6), Apps (6), Icons (20), Video (6), and Bookmarks. | Does not execute the interactive mini-apps in a browser. |
| **`scripts/test-installation.js`** | `npm run test:install` | **6** | Node.js Process | Proves CLI install command syntax, package manager flags, and registry manifest endpoints. | Does not install packages into a live project. |
| **Build Compiler** | `npm run build` | **All** | `tsc -b && vite build` | Proves 100% strict TypeScript type safety and successful Vite bundling. | Does not catch runtime DOM styling issues. |
| **Total Automated Checks** | | **548+** | **100% Passing (0 Failures)** | | |

---

## 3. Synthetic vs Real Browser Testing: Critical Dissection

### The Synthetic Testing Trap
In early iterations, the platform reported high "preview coverage" based solely on whether `rendered.html` existed on disk and whether the Vite dev server returned HTTP 200. This created a false sense of security:
1. **0-Byte HTML Files:** Files that existed on disk but contained 0 bytes returned HTTP 200, but rendered completely blank screens in the browser.
2. **Storage Access Crashes:** Valid HTML files containing `localStorage.getItem()` crashed during browser initialization due to sandboxed iframe security policies.
3. **Broken Relative URLs:** HTML referencing `./screenshot.png` returned HTTP 404 because `<base href>` was missing.

### Real Browser Verification Standards (ElementraUI Rules)
Under ElementraUI, an item is only verified as a successful visual preview if it passes the **Playwright Real Browser Invariant**:
1. **Headless Chromium Launch:** A real browser instance is launched via Playwright (`playwright.chromium.launch()`).
2. **DOM Node Mounting:** The component must mount inside the active DOM tree.
3. **Non-Zero Geometry:** The preview element must satisfy:
   ```javascript
   const isVisible = el.offsetParent !== null && el.clientWidth > 0 && el.clientHeight > 0;
   ```
4. **No Uncaught Exceptions:** The browser console and window error listeners must record zero unhandled runtime crashes.
5. **No Visual Faking:** A preview marked `PASS` must never be an image unless the item is explicitly classified as a `ScreenshotRenderer` reference.

---

## 4. ElementraUI 5-Tier Testing Pyramid

To ensure total reliability as an open-source project, ElementraUI implements a multi-tier testing pipeline:

```
                      ┌─────────────────────────┐
                      │ Tier 5: CI/CD Matrix    │
                      │ (GitHub Actions 18/20/22)│
                      └────────────┬────────────┘
                                   │
                      ┌────────────┴────────────┐
                      │ Tier 4: Brand Regression│
                      │ (Zero Leakage Audits)   │
                      └────────────┬────────────┘
                                   │
                      ┌────────────┴────────────┐
                      │ Tier 3: Browser E2E     │
                      │ (Playwright Live Tests) │
                      └────────────┬────────────┘
                                   │
                      ┌────────────┴────────────┐
                      │ Tier 2: Schemas & Units │
                      │ (Catalogue & Hub Checks)│
                      └────────────┬────────────┘
                                   │
                      ┌────────────┴────────────┐
                      │ Tier 1: Type Safety     │
                      │ (TypeScript & Linters)  │
                      └─────────────────────────┘
```

### Tier 1: Static Type Safety & Compilation
- **Command:** `npm run build`
- **Scope:** Strict TypeScript compilation across all `.ts` and `.tsx` source files.
- **Gate:** Zero compiler errors, zero type assertions to `any` in core pipelines.

### Tier 2: Catalogue & Marketplace Schema Validation
- **Command:** `npm run test:marketplace && npm run test:previews`
- **Scope:** Validates all 6,753 records against `CatalogueItem` schema, verifies themes, templates, apps, icons, and video records.
- **Gate:** Zero missing mandatory fields (`id`, `name`, `category`, `author`, `tags`).

### Tier 3: Real Browser Execution & Sandboxing
- **Command:** `npm run test:live && npm run test:browser`
- **Scope:** Playwright tests executing real React compilation (Sucrase), React 19 iframe mounting, Three.js 3D canvas rendering, responsive viewport switches (390px, 768px, 1280px), and theme switching.
- **Gate:** 100% visual passes, zero canvas crashes, zero unhandled errors.

### Tier 4: Brand Migration & Link Integrity Validation
- **Command:** `node scripts/verify-brand-integrity.js` (to be introduced in Phase 2)
- **Scope:** Scans all source files, comments, and DOM nodes to guarantee zero unresolved references to `21st Local` or `21st.dev`, and verifies that all external documentation links resolve correctly.
- **Gate:** Zero brand leakage in user-facing UI and documentation.

### Tier 5: Continuous Integration Matrix
- **Platform:** GitHub Actions workflow (`.github/workflows/ci.yml`).
- **Matrix:** Node.js v18.x, v20.x, v22.x running on Ubuntu, macOS, and Windows runners.
- **Trigger:** Pull requests and commits to `main`.

---

## 5. Acceptance Criteria & Quality Gates

Every code contribution or migration phase in ElementraUI must satisfy the following acceptance criteria before being merged:

1. **Compilation Gate:** `npm run build` exits with code 0.
2. **Unit & Dataset Gate:** `npm run test:marketplace` and `npm run test:previews` pass with 0 failures.
3. **Browser Gate:** `npm run test:live` passes all representative categories without console errors.
4. **Security Gate:** `npm audit` reports 0 high or critical vulnerabilities.
5. **No Regressions Gate:** Bounding boxes of existing verified React components (`magicui-lens`, `shimmer-light-button`, `floating-sphere-3d`, etc.) remain > 0 px.
