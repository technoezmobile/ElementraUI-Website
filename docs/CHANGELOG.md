# ElementraUI — Changelog

All notable changes to **ElementraUI** are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-10-19

### Brand Transformation: 21st Local &rarr; ElementraUI
- Formally rebranded the platform as **ElementraUI: Discover. Preview. Build.**
- Designed and integrated custom SVG geometric brand marks: `public/elementraui-icon.svg` and `public/elementraui-logo.svg`.
- Cleaned up brand references across all 17 presentation components in `src/`, headers, sidebar docks, modals, spotlights, and empty states.
- Implemented backward-compatible storage migration in `bookmarksStore.ts` (preserving legacy `21st_local_*` data with zero loss).
- Configured package metadata (`package.json`) to `elementraui` v1.0.0.

### Added
- **Production Static Asset Bundler:** Added `scripts/bundle-production-assets.js` and `npm run build:static` to automatically package offline component preview assets into `dist/awesome-components/`.
- **Root MIT License:** Added official root `LICENSE` file granting permissive open-source rights.
- **Formal Architectural Documentation Suite:**
  - `docs/ARCHITECTURE.md`
  - `docs/CATALOGUE_SCHEMA.md`
  - `docs/ADDING_RESOURCES.md`
  - `docs/DEVELOPMENT.md`
  - `docs/TESTING.md`
  - `docs/SECURITY.md`
  - `docs/KNOWN_LIMITATIONS.md`
  - `docs/PROJECT_AUDIT.md`
  - `docs/CATALOGUE_AUDIT.md`
  - `docs/PREVIEW_ARCHITECTURE.md`
  - `docs/TESTING_STRATEGY.md`
  - `docs/MIGRATION_PLAN.md`
- **1-Click Theme Token Copy:** Added direct CSS Variables export in `DetailPanel.tsx` for theme records without displaying blank terminal boxes.

### Fixed
- Fixed installability classification in `src/data/fullCatalogue.json` for theme records (`theme-zinc-modernist` and `theme-cyber-neon-contrast`).
- Fixed source repository filtering in `src/App.tsx` and `src/components/DiscoveryToolbar.tsx`.
- Resolved lucide-react missing import in `DetailPanel.tsx`.

### Verified
- 8 automated test suites passing with 100% assertions:
  - `npm run test:live`: 8/8 Scenarios Passed (Playwright Chromium)
  - `npm run test:browser`: 54/54 Items Passed (Playwright Chromium)
  - `npm run test:marketplace`: 75/75 Passed
  - `npm run test:previews`: 59/59 Passed
  - `npm run test:awesome`: 112/112 Passed
  - `npm run test:coverage`: 381/381 Passed
  - `npm run test:install`: 6/6 Passed
  - `npm run build`: Exit Code 0 (clean TypeScript 5.7 & Vite 6 build)
