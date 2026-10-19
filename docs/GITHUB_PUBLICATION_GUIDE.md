# ElementraUI: GitHub Publication & Release Guide

**Document Version:** 1.0.0  
**Date:** October 19, 2026  
**Audience:** Repository Maintainers, Release Managers, and Project Owners  
**Target Repositories:**
1. `https://github.com/<org-or-user>/elementraui` (Website Marketplace & Resource Hub)
2. `https://github.com/<org-or-user>/elementraui-skill` (Portable AI Coding Skill & Tooling)

---

> [!IMPORTANT]
> **Zero-Execution Policy:** This guide outlines the exact, verified preparation steps and terminal commands required to publish both repositories. In accordance with safety policies, **no remote repositories have been published, no commits have been pushed, and no credentials have been transmitted.** All commands in this guide are prepared for manual review and owner authorization.

---

## 1. Overview & Publication Strategy

The ElementraUI ecosystem is organized into two completely decoupled, self-contained open-source repositories:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ELEMENTRAUI ECOSYSTEM                           │
└───────────────────┬────────────────────────────────┬───────────────────┘
                    │                                │
                    ▼                                ▼
┌──────────────────────────────────────┐┌──────────────────────────────────────┐
│        REPOSITORY 1: elementraui     ││     REPOSITORY 2: elementraui-skill  │
├──────────────────────────────────────┤├──────────────────────────────────────┤
│ • Full-stack UI component marketplace││ • Standalone AI pair-programming skill│
│ • 6,750+ indexed components & themes ││ • Standard YAML frontmatter format   │
│ • Isolated in-browser React sandboxes││ • Adapters: Cursor, Windsurf, Claude │
│ • Sandboxed HTML offline snapshots   ││ • Zero-dependency discovery CLI      │
│ • 8 automated verification suites    ││ • 39/39 automated validation checks  │
│ • Target: Web developers & designers ││ • Target: AI coding agents & IDEs    │
└──────────────────────────────────────┘└──────────────────────────────────────┘
```

---

## 2. Repository 1: `elementraui` (Website Marketplace)

### 2.1 Repository Metadata & Recommended Settings
- **Repository Name:** `elementraui`
- **Short Description:** `The open-source UI component discovery marketplace, design-engineering platform, and offline developer resource library.`
- **Website URL:** `https://elementraui.dev` (or GitHub Pages / Cloudflare Pages deployment URL)
- **Visibility:** Public
- **License:** MIT License
- **Topics (Tags):**  
  `react`, `typescript`, `tailwind-css`, `ui-components`, `marketplace`, `design-system`, `framer-motion`, `threejs`, `component-library`, `developer-tools`
- **Features to Enable:**
  - [x] **Issues:** Enabled (using `.github/ISSUE_TEMPLATE/`)
  - [x] **Discussions:** Enabled (Categories: Announcements, Ideas, Show and Tell, Q&A)
  - [x] **Pull Requests:** Enabled (using `.github/PULL_REQUEST_TEMPLATE.md`)
  - [x] **GitHub Actions:** Enabled (running `.github/workflows/ci.yml`)
- **Branch Protection Rules (`main` branch):**
  - Require a pull request before merging (at least 1 approving review).
  - Require status checks to pass before merging:
    - `build-and-test` (from `.github/workflows/ci.yml`)
  - Require linear history (recommended).
  - Include administrators in branch protection.

### 2.2 Complete File Tree
```
elementraui/
├── .editorconfig
├── .env.example
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   ├── component_submission.md
│   │   ├── config.yml
│   │   └── feature_request.md
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── workflows/
│       └── ci.yml
├── .gitignore
├── CHANGELOG.md
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── docs/
│   ├── ADDING_RESOURCES.md
│   ├── ARCHITECTURE.md
│   ├── CATALOGUE_AUDIT.md
│   ├── CATALOGUE_SCHEMA.md
│   ├── CHANGELOG.md
│   ├── DEVELOPMENT.md
│   ├── FINAL_RELEASE_AUDIT.md
│   ├── GITHUB_PUBLICATION_GUIDE.md
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
├── index.html
├── LICENSE
├── package-lock.json
├── package.json
├── public/
│   ├── data/
│   │   └── awesome-catalogue.json
│   ├── elementraui-icon.svg
│   ├── elementraui-logo.svg
│   ├── r/
│   └── vendor/
│       ├── babel.min.js
│       ├── framer-motion.js
│       ├── isolated-react-runtime.js
│       ├── react-dom.production.min.js
│       ├── react.production.min.js
│       ├── tailwindcss.js
│       └── three.min.js
├── README.md
├── scripts/
│   ├── analyze-awesome-components.js
│   ├── audit-dataset-health.js
│   ├── build-isolated-runtime.js
│   ├── bundle-production-assets.js
│   ├── deep-audit.js
│   ├── generate-registry.js
│   ├── generate-registry.ts
│   ├── import-awesome-components.js
│   ├── importer.js
│   ├── qa-browser-tests.js
│   ├── run-browser-audit.js
│   ├── scan-secrets.js
│   ├── test-50-http.js
│   ├── test-installation.js
│   ├── verify-awesome-components.js
│   ├── verify-browser-previews.js
│   ├── verify-isolated-react.js
│   ├── verify-phase5-ui.js
│   ├── verify-phase6-marketplace.js
│   └── verify-previews.js
├── SECURITY.md
├── src/
│   ├── App.tsx
│   ├── components/
│   │   ├── AwesomeCommunityPreviewModal.tsx
│   │   ├── CatalogueCard.tsx
│   │   ├── CategoryFilters.tsx
│   │   ├── CoreCatalogueGrid.tsx
│   │   ├── CuratedCollectionsHub.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── Footer.tsx
│   │   ├── GlobalSearchModal.tsx
│   │   ├── ItemPreview.tsx
│   │   ├── MarketplaceHeader.tsx
│   │   ├── MiniAppsHub.tsx
│   │   ├── Navigation.tsx
│   │   ├── PersonalWorkspaceHub.tsx
│   │   ├── PreviewErrorBoundary.tsx
│   │   ├── PreviewModal.tsx
│   │   ├── PromptStudioHub.tsx
│   │   ├── TemplatesHub.tsx
│   │   ├── ThemesHub.tsx
│   │   ├── VectorIconsHub.tsx
│   │   ├── VideoMotionHub.tsx
│   │   └── WebsiteBuilderHub.tsx
│   ├── data/
│   │   ├── catalogue.ts
│   │   ├── fullCatalogue.json
│   │   ├── miniAppsData.ts
│   │   ├── mockData.ts
│   │   ├── motionData.ts
│   │   ├── promptData.ts
│   │   ├── templatesData.ts
│   │   ├── themesData.ts
│   │   └── vectorIconsData.ts
│   ├── index.css
│   ├── lib/
│   │   ├── omniboxSearch.ts
│   │   ├── storage.ts
│   │   ├── themeApplier.ts
│   │   └── utils.ts
│   ├── main.tsx
│   └── types/
│       ├── catalogue.ts
│       └── marketplace.ts
├── tsconfig.json
└── vite.config.ts
```

### 2.3 Step-by-Step Git Commands to Publish `elementraui`

> [!CAUTION]
> Execute these commands only in a designated, clean publish directory or after owner approval.

```bash
# 1. Navigate to the release directory or fresh working copy
cd /path/to/publish/elementraui

# 2. Extract ElementraUI-Website-Source.zip into the clean directory
# (Alternatively, stage files directly from the verified staging/elementraui folder)
unzip /path/to/release/ElementraUI-Website-Source.zip -d .

# 3. Initialize Git repository
git init -b main

# 4. Configure local git author identity
git config user.name "ElementraUI Release Bot"
git config user.email "releases@elementraui.dev"

# 5. Stage all tracked project files
git add .

# 6. Verify staged status (ensure node_modules and .env are absent)
git status

# 7. Commit initial repository state
git commit -m "feat: initial commit for ElementraUI Component Marketplace v1.0.0"

# 8. Add remote GitHub origin
# Replace <YOUR-ORG-OR-USERNAME> with your actual GitHub account or organization
git remote add origin https://github.com/<YOUR-ORG-OR-USERNAME>/elementraui.git

# 9. Create signed or annotated release tag
git tag -a v1.0.0 -m "Release v1.0.0: ElementraUI Component Marketplace & Resource Hub"

# 10. Push default branch and release tags (REQUIRES OWNER AUTHORIZATION)
git push -u origin main
git push origin v1.0.0
```

### 2.4 Creating GitHub Release `v1.0.0`
Using the GitHub Web UI or GitHub CLI (`gh`):
```bash
# Using GitHub CLI:
gh release create v1.0.0 \
  --title "ElementraUI v1.0.0 — Discover. Preview. Build." \
  --notes-file docs/CHANGELOG.md \
  release/ElementraUI-Website-Source.zip#ElementraUI-Website-Source.zip
```
**Release Body Highlights:**
- Attach `ElementraUI-Website-Source.zip` (473.98 MB).
- Note SHA-256 Checksum: `e9bbc9077e1391b73fa5568b9d672e4de93d54ca48cac1068c5f7bbfa35c3a78`.

---

## 3. Repository 2: `elementraui-skill` (AI Coding Skill)

### 3.1 Repository Metadata & Recommended Settings
- **Repository Name:** `elementraui-skill`
- **Short Description:** `The official AI coding skill for ElementraUI. Discovers, evaluates, inspects, and safely integrates UI components, themes, and templates into web projects.`
- **Website URL:** `https://github.com/<YOUR-ORG-OR-USERNAME>/elementraui`
- **Visibility:** Public
- **License:** MIT License
- **Topics (Tags):**  
  `ai-skill`, `cursor`, `windsurf`, `claude-code`, `antigravity`, `ui-components`, `pair-programming`, `copilot`, `mcp`, `code-generation`
- **Features to Enable:**
  - [x] **Issues:** Enabled (using `.github/ISSUE_TEMPLATE/`)
  - [x] **Pull Requests:** Enabled (using `.github/PULL_REQUEST_TEMPLATE.md`)
  - [x] **GitHub Actions:** Enabled (running `.github/workflows/validate.yml`)
- **Branch Protection Rules (`main` branch):**
  - Require status checks to pass before merging:
    - `validate-skill` (from `.github/workflows/validate.yml`)

### 3.2 Complete File Tree
```
elementraui-skill/
├── .editorconfig
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── adapter_request.md
│   │   ├── bug_report.md
│   │   └── config.yml
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── workflows/
│       └── validate.yml
├── .gitignore
├── adapters/
│   ├── antigravity/
│   │   └── README.md
│   ├── claude-code/
│   │   └── SKILL.md
│   ├── cursor/
│   │   └── elementraui.mdc
│   ├── generic/
│   │   └── system-prompt.md
│   └── windsurf/
│       └── .windsurfrules
├── CHANGELOG.md
├── CONTRIBUTING.md
├── docs/
│   ├── CONFIGURATION.md
│   ├── EXAMPLES.md
│   ├── INSTALLATION.md
│   ├── OVERVIEW.md
│   ├── RELEASE.md
│   ├── RESOURCE_TYPES.md
│   ├── SUPPORTED_AGENTS.md
│   ├── TESTING.md
│   ├── TROUBLESHOOTING.md
│   ├── USAGE.md
│   └── WORKFLOW.md
├── examples/
│   ├── handling-screenshots-honestly.md
│   ├── html-snapshot-adaptation.md
│   ├── missing-dependency-recovery.md
│   └── react-tailwind-integration.md
├── LICENSE
├── package.json
├── README.md
├── references/
│   ├── classification-guide.md
│   ├── resource-schema.json
│   └── workflow-cheat-sheet.md
├── scripts/
│   ├── elementra-cli.js
│   └── validate-skill.js
├── SECURITY.md
└── SKILL.md
```

### 3.3 Step-by-Step Git Commands to Publish `elementraui-skill`

```bash
# 1. Navigate to the elementraui-skill repository folder
cd /path/to/elementraui-skill

# 2. Initialize Git repository
git init -b main

# 3. Configure local git author identity
git config user.name "ElementraUI Release Bot"
git config user.email "releases@elementraui.dev"

# 4. Stage all tracked files
git add .

# 5. Verify status (clean working tree)
git status

# 6. Commit initial repository state
git commit -m "feat: initial commit for ElementraUI AI Coding Skill v1.0.0"

# 7. Add remote GitHub origin
# Replace <YOUR-ORG-OR-USERNAME> with your actual GitHub account or organization
git remote add origin https://github.com/<YOUR-ORG-OR-USERNAME>/elementraui-skill.git

# 8. Create release tag
git tag -a v1.0.0 -m "Release v1.0.0: ElementraUI AI Coding Skill"

# 9. Push default branch and release tags (REQUIRES OWNER AUTHORIZATION)
git push -u origin main
git push origin v1.0.0
```

### 3.4 Creating GitHub Release `v1.0.0`
```bash
# Using GitHub CLI:
gh release create v1.0.0 \
  --title "ElementraUI Skill v1.0.0 — AI Component Assistant" \
  --notes-file CHANGELOG.md \
  release/ElementraUI-Skill.zip#ElementraUI-Skill.zip
```
**Release Body Highlights:**
- Attach `ElementraUI-Skill.zip` (40.33 KB).
- Note SHA-256 Checksum: `428dee2c76fb2ed1f68de0ceb4c500a2935143830d75f530b55d629d52e1a189`.

---

## 4. Licence & Attribution Requirements for Owner Approval

Before public launch, the repository owner should review and sign off on the following legal and attribution items:

### 4.1 Permissive MIT License
Both `elementraui` and `elementraui-skill` are published under the standard **MIT License**. The root `LICENSE` file attributes:
```
Copyright (c) 2026 ElementraUI Contributors
```
*Action for Owner:* Confirm whether the copyright header should list "ElementraUI Contributors" or an individual/organization name (e.g. "Acme Corp / John Doe").

### 4.2 Upstream Community Component Provenance
ElementraUI indexes 6,591 open-source community components:
- Upstream authors retain their original copyrights (primarily MIT, Apache-2.0, ISC, and BSD licenses).
- Every component card and modal in ElementraUI explicitly presents author attribution, original source links, and upstream license metadata.
- Previews run in strict sandboxed iframes without redistributing uncredited binary assets.
*Action for Owner:* Approve maintaining community provenance records in `public/data/awesome-catalogue.json` and `.cache/awesome-components/`.

### 4.3 Trademark & Naming Clearance
- The project has been fully migrated away from previous legacy names to the distinctive brand **ElementraUI**.
*Action for Owner:* Verify trademark clearance for "ElementraUI" in your jurisdiction if commercial registration is anticipated.

---

## 5. Security & Privacy Audit Confirmation

A deep, automated scan was conducted across both repository trees prior to release packaging:
- **No Private Keys / API Keys:** Zero AWS, OpenAI, GitHub, or private tokens detected.
- **No Environment Files:** `.env`, `.env.local`, and `.env.production` are strictly excluded in `.gitignore` and absent from archives.
- **No Leaked Machine Paths:** Hardcoded developer paths (`/Users/...`, `C:\Users\...`) have been sanitized from code and documentation.
- **Iframe Sandboxing Verification:** The preview engine enforces `sandbox="allow-scripts"` and explicitly omits `allow-same-origin`, preventing DOM access to the host application.

---

## 6. Future Updates & Maintenance Protocol

### 6.1 Semantic Versioning (`SemVer`)
Both repositories strictly adhere to Semantic Versioning (`MAJOR.MINOR.PATCH`):
- `MAJOR` (e.g., `2.0.0`): Breaking changes to catalogue schema, component props, or skill frontmatter syntax.
- `MINOR` (e.g., `1.1.0`): New components, new themes, new platform adapters, or new marketplace hubs.
- `PATCH` (e.g., `1.0.1`): Bug fixes in preview renderers, documentation corrections, or dependency updates.

### 6.2 Contributing New Components to `elementraui`
Community contributions follow this workflow:
1. Contributor forks `elementraui`.
2. Creates branch `feat/add-<component-name>`.
3. Adds component TSX file to `src/components/` (or submits a PR using `.github/ISSUE_TEMPLATE/component_submission.md`).
4. Runs verification suite: `npm run build && npm run test:previews`.
5. Submits PR targeting `main`.

### 6.3 Contributing Adapters to `elementraui-skill`
1. Fork `elementraui-skill`.
2. Add platform adapter to `adapters/<agent-name>/`.
3. Add corresponding entry in `docs/SUPPORTED_AGENTS.md` and `docs/INSTALLATION.md`.
4. Run `node scripts/validate-skill.js` (must pass 100%).
5. Submit PR targeting `main`.

---

## 7. Pre-Publication Checklist

| Item | Requirement | Status | Owner Approval Required |
| :---: | :--- | :---: | :---: |
| 1 | `elementraui` passes `npx tsc -b` with 0 errors | **PASS** | No |
| 2 | `elementraui` passes `npx vite build` cleanly | **PASS** | No |
| 3 | `elementraui` passes all 8 test suites (548 checks) | **PASS** | No |
| 4 | `elementraui-skill` passes `node scripts/validate-skill.js` (39/39) | **PASS** | No |
| 5 | Both packages verified with 0 Windows backslashes | **PASS** | No |
| 6 | Both packages verified with 0 `node_modules` or `.git` | **PASS** | No |
| 7 | Issue & PR templates added to both repositories | **PASS** | No |
| 8 | GitHub Actions CI workflows configured for both repos | **PASS** | No |
| 9 | Owner selects target GitHub Organization or Username | **PENDING** | **YES** |
| 10 | Owner authorizes executing `git push` to GitHub | **PENDING** | **YES** |

---

## 8. Summary of Next Actions for Owner

1. **Create GitHub Repositories:**  
   Log in to GitHub and create the two empty repositories:
   - `https://github.com/<your-org>/elementraui`
   - `https://github.com/<your-org>/elementraui-skill`
2. **Review Publication Guide:**  
   Review [docs/GITHUB_PUBLICATION_GUIDE.md](file:///e:/21st.dev%20work/docs/GITHUB_PUBLICATION_GUIDE.md) and confirm the copyright holder name in `LICENSE`.
3. **Execute Push Commands:**  
   Run the git commands documented in Section 2.3 and Section 3.3.
4. **Publish Release v1.0.0:**  
   Create the GitHub Releases and upload the pre-packaged archives in [`release/`](file:///e:/21st.dev%20work/release/).
