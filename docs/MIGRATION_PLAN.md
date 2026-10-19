# ElementraUI — Comprehensive Migration & Transition Plan

**Date:** 2026-10-19  
**Architect:** Full-Stack Infrastructure Architect & Open-Source Maintainer  
**Target Identity:**  
- **Product Name:** ElementraUI  
- **Website Title:** ElementraUI UI Component Marketplace  
- **Tagline:** *Discover. Preview. Build.*  
- **Intended Web Repository:** `elementraui`  
- **Intended AI Skill Repository:** `elementraui-skill`  

---

## 1. Executive Summary & Vision

The objective of this migration plan is to transition the self-hosted component platform previously known as **21st Local** (`21stlocal`) into **ElementraUI**: a premier, developer-focused, open-source UI component marketplace, design-engineering workspace, and AI-native component registry.

### Core Transition Principles
1. **Zero Data Loss:** Preserve all 6,753 catalogue records, user bookmarks, custom boards, and curated marketplace assets.
2. **Honest Capabilities:** Maintain rigorous distinctions between live React TSX components, sandboxed HTML snapshots, CLI registry blueprints, and design references.
3. **No Visual Faking:** Guarantee that every preview is a true, sandboxed DOM element or explicit reference.
4. **Clean Decoupling:** Rebrand all application layers, metadata, assets, and documentation to ElementraUI without breaking legacy local data migrations.
5. **Open-Source Ready:** Equip the project with a root MIT license, GitHub Actions CI workflows, and a companion AI skill (`elementraui-skill`).

---

## 2. Target Brand Specifications & Design Language

| Attribute | Specification |
| :--- | :--- |
| **Brand Name** | **ElementraUI** |
| **Full Title** | **ElementraUI UI Component Marketplace** |
| **Tagline** | **Discover. Preview. Build.** |
| **Color Palette** | OLED Black (`#09090B`), Deep Violet Accent (`#6366F1`), Violet Glow (`rgba(99,102,241,0.15)`), Muted Zinc (`#A1A1AA`), Pure Text (`#F4F4F5`). |
| **Typography** | Geist Sans (Headlines), Inter (Body UI), JetBrains Mono (Code & Terminal). |
| **Visual Philosophy** | High-density developer utility, dark-mode first, syntactic void aesthetics, fluid micro-interactions, zero-shift preview lightboxes. |
| **Target Repositories** | `github.com/<org>/elementraui` & `github.com/<org>/elementraui-skill` |

---

## 3. Phased Implementation Roadmap

```
Phase 1: Codebase Audit & Baseline Verification [COMPLETED]
   │
   ▼
Phase 2: Brand Identity, Asset Generation, & Domain Alignment
   │
   ▼
Phase 3: UI Polish, Typography, & Navigation Enhancements
   │
   ▼
Phase 4: Preview Engine & Build Pipeline Hardening
   │
   ▼
Phase 5: Catalogue & Registry Refinement
   │
   ▼
Phase 6: ElementraUI AI Assistant Skill (elementraui-skill)
   │
   ▼
Phase 7: Packaging, Open-Source Governance, & GitHub Publication
```

---

### Phase 1: Codebase Audit & Baseline Verification (Completed)
* **Goal:** Document the exact current state of the codebase, catalogue records, test suites, and preview architecture without making destructive modifications.
* **Deliverables Generated:**
  - [`docs/PROJECT_AUDIT.md`](file:///e:/21st.dev%20work/docs/PROJECT_AUDIT.md): Complete architecture, technology stack, and dependency health.
  - [`docs/CATALOGUE_AUDIT.md`](file:///e:/21st.dev%20work/docs/CATALOGUE_AUDIT.md): Empirical audit of all 6,753 records, schemas, and anomaly logs.
  - [`docs/PREVIEW_ARCHITECTURE.md`](file:///e:/21st.dev%20work/docs/PREVIEW_ARCHITECTURE.md): Multi-tier isolated execution, sandboxing invariants, and security specifications.
  - [`docs/TESTING_STRATEGY.md`](file:///e:/21st.dev%20work/docs/TESTING_STRATEGY.md): Dissection of synthetic vs real browser testing with Playwright standards.
  - [`docs/MIGRATION_PLAN.md`](file:///e:/21st.dev%20work/docs/MIGRATION_PLAN.md): This comprehensive phased migration blueprint.
* **Acceptance Gate:** All 8 test suites pass (100%), 0 build errors, 0 npm vulnerabilities.

---

### Phase 2: Brand Identity, Asset Generation, & Domain Alignment
* **Goal:** Rebrand the application, scripts, and metadata to ElementraUI while preserving data compatibility.
* **Action Items:**
  1. **Package & HTML Shell:**
     - Update `package.json`: `"name": "elementraui"`, `"description": "ElementraUI — UI Component Marketplace"`.
     - Update `index.html`: Update title to `ElementraUI — UI Component Marketplace`, add OpenGraph meta tags, description, and tagline.
     - Generate brand SVG logo and favicon: `public/elementraui-logo.svg` and `public/elementraui-icon.svg`.
  2. **UI Brand Text Migration (17 Files):**
     - `src/components/Header.tsx`: Replace legacy logo and title with ElementraUI logo and branding.
     - `src/components/Sidebar.tsx`: Update branding text and badges.
     - `src/components/MarketplaceSpotlight.tsx`: Update hero copy to *"ElementraUI Spotlight: Discover. Preview. Build."*
     - `src/components/CatalogueGrid.tsx` & `DetailPanel.tsx`: Update attribution tags.
     - `src/components/PromptStudio/PromptStudio.tsx`: Update prompt system instructions.
     - `src/components/WebsiteBuilder/WebsiteBuilder.tsx`: Update builder title and export comments.
  3. **Data & Storage Compatibility:**
     - `src/data/bookmarksStore.ts`: Keep backwards-compatible read migration from `21st_local_bookmarks` to `elementraui_bookmarks`.
     - `src/data/fullCatalogue.json`: Update `sourceRepo` from `"21st-local"` to `"elementraui"`.
  4. **Scripts & Test Suite Banners:**
     - Update console banners across all 24 scripts in `scripts/` to `ELEMENTRAUI: ...`.
* **Acceptance Gate:** `npm run build` passes; `npm run test:live` and `npm run test:browser` pass; zero occurrences of `21st Local` in user-facing UI.

---

### Phase 3: UI Polish, Typography, & Navigation Enhancements
* **Goal:** Refine the user experience to ensure high-density, developer-first aesthetics inspired by modern design engineering tools.
* **Action Items:**
  1. **Header & Navigation Dock:**
     - Streamline the header bar with prominent ElementraUI branding, active hub pill indicators, and quick-action studio buttons.
     - Improve Sidebar collapse animation and keyboard accessibility.
  2. **Marketplace Cards & Grid:**
     - Polish component card hover states with subtle border glows (`rgba(99,102,241,0.2)`).
     - Standardize capability badges: `React Live` (Emerald), `HTML Sandbox` (Blue), `CLI Spec` (Zinc), `Screenshot` (Amber).
  3. **Zero-Shift Centerpiece Modal:**
     - Enhance the lightbox preview modal with smooth entry transitions, sticky toolbar controls, responsive viewport resizing (Desktop, Tablet, Mobile), and full-screen view mode.
  4. **Marketplace Hubs Polish:**
     - Polish Themes swatches with high-contrast copy buttons.
     - Enhance Templates file-tree view with syntax-highlighted code tabs.
     - Ensure all 6 runnable mini-apps maintain full responsiveness across small viewports.
* **Acceptance Gate:** Visual review passes across 1920px (Desktop), 1024px (Tablet), and 390px (Mobile) with 0 layout shifts.

---

### Phase 4: Preview Engine & Build Pipeline Hardening
* **Goal:** Eliminate production deployment limitations and optimize iframe runtime resource consumption.
* **Action Items:**
  1. **Production Static Asset Pipeline:**
     - Create `scripts/bundle-production-assets.js` to automatically copy `.cache/awesome-components/components/` into `dist/awesome-components/` during `npm run build`.
     - Ensure relative asset URLs resolve in static hosting environments (Vercel, Cloudflare, Netlify).
  2. **Iframe Memory & Context Recycling:**
     - Add explicit teardown in `PreviewModal.tsx` on unmount (`iframe.srcDoc = ""`, detach event listeners) to eliminate WebGL memory leaks during prolonged sessions.
  3. **Runtime Dependency Expansion:**
     - Update `scripts/build-isolated-runtime.js` to bundle popular Radix UI primitives (`dialog`, `dropdown-menu`, `tabs`, `tooltip`, `popover`) into `public/vendor/isolated-react-runtime.js`.
* **Acceptance Gate:** `npm run build && npm run preview` correctly renders HTML snapshots and WebGL components from `dist/` without dev server middleware.

---

### Phase 5: Catalogue & Registry Refinement
* **Goal:** Clean up metadata inconsistencies and enhance component installation workflows.
* **Action Items:**
  1. **Fix Theme Installability Metadata:**
     - Update `theme-zinc-modernist` and `theme-cyber-neon-contrast` in `src/data/fullCatalogue.json`: Set `installationType: "css-tokens"` and provide a 1-click "Copy Theme Tokens" snippet instead of an empty CLI terminal.
  2. **Enhance CLI Scaffolding:**
     - Provide universal package manager tabs (npm, pnpm, yarn, bun) in the installation panel.
  3. **Registry Endpoint Generation:**
     - Run `node scripts/generate-registry.js` to update all JSON endpoints in `public/r/` with ElementraUI registry URLs.
* **Acceptance Gate:** `npm run test:install` and `npm run test:marketplace` pass with 100% assertions.

---

### Phase 6: ElementraUI AI Assistant Skill (`elementraui-skill`)
* **Goal:** Build the companion open-source AI skill repository allowing AI agents to discover, preview, and install components.
* **Action Items:**
  1. **Skill Specification & Architecture:**
     - Define `SKILL.md` frontmatter, tool definitions, and system prompts.
     - Implement search, inspect, and install actions for AI coding agents (Antigravity, Cursor, Claude Code, Gemini CLI).
  2. **CLI & MCP Tooling:**
     - Provide lightweight CLI utilities to search the ElementraUI registry by natural language query (e.g., `elementra search "bento grid with framer motion"`).
     - Provide JSON output mode for direct agent consumption.
  3. **Integration Documentation:**
     - Document how developers can install and activate the skill in their AI workflows.
* **Acceptance Gate:** AI skill correctly queries registry endpoints and outputs formatted component code.

---

### Phase 7: Packaging, Open-Source Governance, & GitHub Publication
* **Goal:** Package the repository cleanly, establish open-source licensing, and configure CI/CD.
* **Action Items:**
  1. **Git Initialization:**
     - Initialize Git repository: `git init`.
     - Configure comprehensive `.gitignore` (ignoring node_modules, dist, temp caches, while preserving essential data and vendor runtimes).
  2. **Open-Source Governance:**
     - Add root `LICENSE` (MIT License).
     - Add `CONTRIBUTING.md` detailing contribution standards, component submission guidelines, and code of conduct.
     - Add `SECURITY.md` detailing security policies and vulnerability reporting.
  3. **Documentation:**
     - Create a comprehensive, production-grade `README.md` featuring:
       - Badges (License, Build, Tests, Version).
       - Product screenshots and animated preview GIFs.
       - Quick start guide and architecture overview.
       - Marketplace features breakdown.
       - Verification commands and testing philosophy.
  4. **GitHub Actions CI Pipeline:**
     - Create `.github/workflows/ci.yml`:
       - Run linting, TypeScript build, schema tests, and Playwright browser tests across Node.js 18, 20, and 22.
* **Acceptance Gate:** Clean initial commit, all workflows pass locally, ready for push to `github.com/<org>/elementraui`.

---

## 4. Risk Assessment & Mitigation Strategies

| Risk | Impact | Likelihood | Mitigation Strategy |
| :--- | :--- | :--- | :--- |
| **Breaking Existing User Bookmarks** | High | Low | Implement automatic backward-compatible storage migration in `bookmarksStore.ts` that reads legacy `21st_local_bookmarks` and migrates to `elementraui_bookmarks`. |
| **Breaking Upstream Awesome Component Paths** | High | Low | Preserve the exact directory structure under `.cache/awesome-components/components/` and retain `/awesome-components` middleware alias. |
| **Playwright Test Failures on Linux CI** | Medium | Medium | Include `@playwright/test` system dependencies in GitHub Actions (`npx playwright install --with-deps chromium`). |
| **Production Build Size Exceeding Limits** | Medium | Low | Use lazy loading for large marketplace datasets (`awesome-catalogue.json` is already loaded asynchronously on demand via `fetch`). |

---

## 5. Summary of Deliverables & Next Steps

With Phase 1 complete, all findings and migration roadmaps are permanently documented:
1. `docs/PROJECT_AUDIT.md`
2. `docs/CATALOGUE_AUDIT.md`
3. `docs/PREVIEW_ARCHITECTURE.md`
4. `docs/TESTING_STRATEGY.md`
5. `docs/MIGRATION_PLAN.md`

**Status:** Awaiting user approval to proceed with Phase 2 (Brand Identity, Asset Generation, & Domain Alignment).
