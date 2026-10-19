# ElementraUI — GitHub Release Checklist

This checklist documents the pre-release, packaging, and publication criteria for the **ElementraUI** website repository (`elementraui`).

---

## 1. Pre-Release Quality Verifications

- [x] **Repository Rebranding:** All product identifiers migrated to **ElementraUI** (*Discover. Preview. Build.*).
- [x] **Brand Assets:** Vector brand marks created and verified (`public/elementraui-icon.svg`, `public/elementraui-logo.svg`).
- [x] **TypeScript Type Check:** `npx tsc -b` passes with 0 errors and 0 warnings.
- [x] **Production Static Build:** `npm run build` compiles with exit code 0 into `dist/`.
- [x] **Production Asset Bundling:** `npm run build:static` bundles offline preview assets into `dist/awesome-components/`.
- [x] **Dependency Security:** `npm audit` reports 0 known vulnerabilities.
- [x] **Independent QA Audit:** Full browser test run in Playwright Chromium (`scripts/qa-browser-tests.js`) passes 29/29 assertions.
- [x] **Representative Live Previews:** 8 representative preview categories audited in Playwright (`scripts/verify-isolated-react.js`) with 100% passes.
- [x] **Multi-Hub Marketplace Integrity:** All 7 hubs (Components, Themes, Templates, Apps, Icons, Video, Bookmarks) validated with 75 automated checks.
- [x] **Backward Compatibility:** Legacy bookmark storage keys (`21st_local_*`) migrate cleanly without data loss.

---

## 2. Packaging & File Inclusion

- [x] **Configuration Files Included:**
  - `package.json` (name: `"elementraui"`, version: `"1.0.0"`)
  - `package-lock.json`
  - `vite.config.ts`
  - `tsconfig.json`
  - `.gitignore`
  - `.editorconfig`
  - `.env.example`
- [x] **Documentation Included:**
  - Root `README.md`
  - Root `LICENSE` (MIT License)
  - `CONTRIBUTING.md`
  - `CODE_OF_CONDUCT.md`
  - `SECURITY.md`
  - `CHANGELOG.md`
  - Complete `docs/` technical architecture suite (16 markdown specifications)
- [x] **Source Code & Data Included:**
  - `src/` (All components, types, libraries, styles, and seed registries)
  - `public/` (Logos, offline vendor runtime, registry specifications, catalogue data)
  - `scripts/` (Automated testing and verification suites)
  - `.cache/awesome-components/components/` & `data/` (Local visual preview assets and upstream index)

---

## 3. Exclusion & Sanitization Criteria

- [x] **No Node Modules:** `node_modules/` strictly excluded.
- [x] **No Git Histories:** `.git/` and `.cache/awesome-components/.git/` strictly excluded.
- [x] **No Secrets or Credentials:** Verified zero API keys, personal access tokens, or private certificates.
- [x] **No Temporary Artifacts:** `artifacts/`, `test-install/`, `extracted_stitch_design/`, `exports/`, `staging/`, `release/` excluded.
- [x] **No Duplicate Generated Assets:** `.cache/awesome-components/generated-components/` excluded.
- [x] **No Local OS Metadata:** `.DS_Store`, `Thumbs.db`, `.idea/`, `*.local` excluded.

---

## 4. GitHub Repository Configuration (Post-Publication)

When publication is explicitly authorized by the project owner:
1. **Repository Name:** `elementraui`
2. **Organization / Account:** Owner GitHub account
3. **Description:** `ElementraUI — Discover. Preview. Build. Open-source UI component marketplace & developer resource library.`
4. **Website URL:** Production deployment URL
5. **Topics:** `react`, `typescript`, `tailwindcss`, `ui-components`, `marketplace`, `developer-tools`, `shadcn-ui`, `component-library`, `design-system`
6. **Default Branch:** `main`
7. **License:** MIT License
