# ElementraUI — Packaging Manifest

**Archive Name:** `ElementraUI-Website-Source.zip`  
**Target Repository:** `github.com/<owner>/elementraui`  
**Package Type:** Complete, clean, portable GitHub-ready source code repository  
**Generated Date:** October 19, 2026  

---

## 1. Package Architecture & Layout

The archive extracts to a clean root layout containing only the necessary source code, configurations, data indices, visual preview assets, test suites, and documentation required to reproduce, develop, test, build, and publish ElementraUI:

```
elementraui/
├── .cache/
│   └── awesome-components/
│       ├── components/              # 6,591 component preview assets (rendered.html, screenshot.png, prompt.md)
│       ├── data/                    # Upstream components.json index
│       ├── CONTRIBUTING.md          # Upstream attribution
│       ├── LICENSE                  # Upstream MIT License
│       ├── package.json
│       ├── push.sh
│       └── README.md
├── docs/                            # Comprehensive architectural & developer documentation
│   ├── ADDING_RESOURCES.md
│   ├── ARCHITECTURE.md
│   ├── CATALOGUE_AUDIT.md
│   ├── CATALOGUE_SCHEMA.md
│   ├── CHANGELOG.md
│   ├── DEVELOPMENT.md
│   ├── KNOWN_LIMITATIONS.md
│   ├── MIGRATION_PLAN.md
│   ├── PACKAGING_MANIFEST.md
│   ├── PREVIEW_ARCHITECTURE.md
│   ├── PROJECT_AUDIT.md
│   ├── QA_REPORT.md
│   ├── RELEASE_CHECKLIST.md
│   ├── SECURITY.md
│   ├── TESTING.md
│   └── TESTING_STRATEGY.md
├── public/
│   ├── data/
│   │   ├── awesome-catalogue.json   # 6,591 normalized marketplace catalogue entries
│   │   ├── live-preview-results.json# Live verification records
│   │   └── preview-browser-audit.json
│   ├── r/                           # Shadcn-compatible JSON registry definitions
│   ├── vendor/                      # Offline bundled React 19 / Sucrase / Three.js sandbox runtime
│   ├── elementraui-icon.svg         # Official vector brand mark
│   └── elementraui-logo.svg         # Official vector logo
├── scripts/                         # Automated test runners, Playwright audits, and asset bundlers
│   ├── audit-dataset-health.js
│   ├── build-isolated-runtime.js
│   ├── bundle-production-assets.js
│   ├── importer.js
│   ├── import-awesome-components.js
│   ├── qa-browser-tests.js          # Playwright end-to-end browser QA suite (29 tests)
│   ├── run-browser-audit.js         # Deep browser audit (54 items)
│   ├── test-installation.js
│   ├── verify-awesome-components.js
│   ├── verify-browser-previews.js
│   ├── verify-isolated-react.js     # Representative live preview audit (8 categories)
│   ├── verify-phase5-ui.js
│   ├── verify-phase6-marketplace.js # Marketplace section tests (75 tests)
│   └── verify-previews.js
├── src/
│   ├── components/                  # React UI components for all 7 marketplace sections & studios
│   │   ├── Apps/                    # Runnable mini-app implementations
│   │   ├── Bookmarks/               # Cross-section collections & migration store
│   │   ├── GlobalSearch/            # Omnichannel Cmd+K search dialog
│   │   ├── Icons/                   # Vector icon studio
│   │   ├── preview/                 # Multi-engine preview rendering architecture
│   │   ├── PromptStudio/            # AI Prompt Engineering Studio
│   │   ├── registry/                # Core verified React component implementations
│   │   ├── Templates/               # Multi-page website starter specs
│   │   ├── Themes/                  # CSS variable theme palettes & swatches
│   │   ├── Video/                   # Motion engineering loops & Remotion code
│   │   ├── WebsiteBuilder/          # Interactive visual page builder
│   │   ├── CatalogueGrid.tsx        # Main component grid & list views
│   │   ├── DetailPanel.tsx          # Slide-out component inspector
│   │   ├── DiscoveryToolbar.tsx     # Filter bar, search input, and view toggles
│   │   ├── Header.tsx               # Master navigation header
│   │   ├── ItemPreview.tsx          # Preview engine facade
│   │   ├── MarketplaceSpotlight.tsx # Curated category carousel
│   │   ├── PreviewModal.tsx         # Centerpiece lightbox preview modal
│   │   └── Sidebar.tsx              # Left navigation sidebar
│   ├── data/                        # Core catalogue, seed registries, themes, templates, apps, video
│   ├── lib/                         # Utility helpers (cn, clsx, tailwind-merge)
│   ├── types/                       # TypeScript interfaces and schema contracts
│   ├── App.tsx                      # Top-level application orchestrator
│   ├── index.css                    # Tailwind CSS v4 styling & color definitions
│   └── main.tsx                     # Application entry point
├── .editorconfig                    # Consistent formatting rules across editors
├── .env.example                     # Safe environment template with documentation
├── .gitignore                       # Standardized exclusion rules for Node, build, and caches
├── CHANGELOG.md                     # Semantic version release log
├── CODE_OF_CONDUCT.md               # Contributor Covenant v2.1
├── CONTRIBUTING.md                  # Comprehensive developer contribution guidelines
├── index.html                       # Web application entry shell
├── LICENSE                          # Permissive MIT License
├── package-lock.json                # Pinned dependency lockfile
├── package.json                     # Package metadata (elementraui v1.0.0)
├── README.md                        # Authoritative product README
├── SECURITY.md                      # Security vulnerability reporting policy
├── tsconfig.json                    # TypeScript compiler configuration
└── vite.config.ts                   # Vite bundler & asset middleware configuration
```

---

## 2. Inclusions & Exclusions Summary

### Included Files
- **Essential Source:** All TypeScript (`.ts`, `.tsx`), CSS (`.css`), and HTML (`.html`) source files.
- **Dependencies & Lockfile:** `package.json` and `package-lock.json`.
- **Catalogue & Offline Assets:** All JSON registries, offline vendor scripts (`/vendor/`), and local visual preview assets (`.cache/awesome-components/components/` and `data/`).
- **Full Test Infrastructure:** All Playwright browser suites and verification scripts in `scripts/`.
- **Complete Documentation:** All 16 markdown documents in `docs/` and root repository files.

### Excluded Files & Directories
- **`node_modules/`:** Excluded (reproducible via `npm install`).
- **`.git/`:** Excluded (clean slate for initializing a new git repository).
- **`.cache/awesome-components/.git/`:** Excluded (464 MB upstream git history removed).
- **`.cache/awesome-components/generated-components/`:** Excluded (616 MB redundant duplicate snapshots removed).
- **`artifacts/`:** Excluded (temporary debugging outputs and screenshots).
- **`dist/`:** Excluded (production build output; easily recreated via `npm run build`).
- **`exports/`:** Excluded (previous ZIP export archives).
- **`extracted_stitch_design/`:** Excluded (temporary design reference).
- **`test-install/`:** Excluded (temporary CLI verification workspace).
- **`*.log`, `*.local`, `*.tsbuildinfo`:** Excluded (temporary runtime artifacts).
- **Intermediate root reports:** Root phase transition logs from earlier development (`PHASE3_AUDIT.md`, `PHASE4_REPORT.md`, `RECON_REPORT.md`, etc.) are superseded by the formal `docs/` suite.

---

## 3. Licensing Plan

- **Host Repository:** MIT License ([LICENSE](LICENSE)).
- **Third-Party Upstream Provenance:**
  - *Awesome Components:* Original work licensed under MIT by Wundercorp and community contributors. Attribution and original license preserved in `.cache/awesome-components/LICENSE`.
  - *Shadcn / Radix UI:* Permissive MIT License.
  - *Lucide Icons:* ISC License.
  - *Three.js:* MIT License.
  - *Framer Motion:* MIT License.
- **Licensing Decision Flag:** No proprietary or incompatible licenses were introduced. All core code and community indices are permissively licensed under MIT/ISC. Ready for public open-source publication under MIT.
