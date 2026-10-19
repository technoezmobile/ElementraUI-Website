# ElementraUI — Owner Decisions & Governance Document

**Document Version:** 1.0.0  
**Status:** AWAITING OWNER REVIEW & SIGN-OFF  
**Target Products:** `elementraui` (Web Platform) & `elementraui-skill` (Portable AI Skill)  
**Date:** October 19, 2026  

---

## Executive Summary

Before publishing the repositories to GitHub or releasing distribution packages publicly, several key architectural, legal, and operational decisions require explicit sign-off by the repository owner / primary maintainer. 

This document outlines each decision item, evaluates the available options, highlights tradeoffs, and provides maintainer recommendations.

---

## 1. Target GitHub Destination (Account vs. Organisation)

### Context
Two public repositories are prepared for publication:
1. `elementraui` — The main component marketplace web platform.
2. `elementraui-skill` — The portable AI coding agent skill package.

### Options Evaluated

| Option | Architecture | Advantages | Disadvantages / Risks |
| :--- | :--- | :--- | :--- |
| **Option A: Dedicated GitHub Organisation** (Recommended) | `github.com/elementraui/elementraui`<br>`github.com/elementraui/elementraui-skill` | Clean branding, professional open-source appearance, fine-grained team permissions, decoupled from any single personal profile, ready for community growth. | Requires creating a GitHub organisation (free tier is sufficient). |
| **Option B: Personal User Account** | `github.com/<owner-username>/elementraui`<br>`github.com/<owner-username>/elementraui-skill` | Zero initial setup, immediate publishing under existing personal handle. | Strongly couples brand identity to a personal username; requires URL redirects if migrated to an org later; shared notification and access control limits. |

### Maintainer Recommendation
**Option A (Organisation):** Register `elementraui` as a GitHub organisation. If `elementraui` is already taken, consider `elementra-ui` or publish initially under the owner's personal account with a planned rename migration.

### Required Owner Action
- [ ] Select Option A (Organisation) or Option B (Personal).
- [ ] Specify exact GitHub handle: `github.com/________________________`.

---

## 2. Contributor Terms & Copyright Declaration

### Context
The current codebase has been cleansed of generic placeholders (e.g. `Your Name / Organization`) and now consistently declares:
- **Primary License:** MIT License.
- **Copyright Holder:** `ElementraUI Contributors` (standard open-source umbrella format).
- **Contributing Guide:** [CONTRIBUTING.md](file:///E:/21st.dev%20work/CONTRIBUTING.md).
- **Security Policy:** [SECURITY.md](file:///E:/21st.dev%20work/SECURITY.md).

### Contributor Agreement Options

| Policy | Mechanism | Pros | Cons |
| :--- | :--- | :--- | :--- |
| **Default GitHub Terms** (Recommended for launch) | Standard GitHub Terms of Service (contributions inbound are under the outbound MIT license). | Zero contributor friction; no bot setup required; standard for modern permissive MIT projects. | No formal signed assignment of copyright. |
| **Developer Certificate of Origin (DCO)** | Contributors sign commits with `git commit -s` (`Signed-off-by:`). Enforced via DCO GitHub Action or Probot. | Standard in Linux Foundation and CNCF projects; legally validates origin without transfer of copyright. | Contributors must remember `-s` flag or PRs fail checks. |
| **Contributor License Agreement (CLA)** | Contributors sign an agreement via CLA Assistant or EasyCLA. | Strongest corporate IP protection; allows license changes later if desired. | Highest contributor barrier; discourages casual open-source patches. |

### Maintainer Recommendation
Launch with **Default GitHub Terms** + MIT license. For v1.1.0, add a lightweight **DCO GitHub Action** check if external community contributions scale up.

### Required Owner Action
- [ ] Confirm copyright notice: `Copyright (c) 2026 ElementraUI Contributors`.
- [ ] Confirm contributor licensing policy (Default MIT vs DCO vs CLA).

---

## 3. Upstream Dataset Provenance & Community Asset Distribution

### Context & Provenance
The catalogue contains two distinct data tiers:
1. **Core Marketplace Resources:** Curated components with executable source code, full metadata, and native ElementraUI styling.
2. **Imported Community Dataset (`awesome-components`):** 6,591 imported community components originating from an open-source catalogue mirror.
   - Assets include:
     - 6,591 `component.json` metadata records.
     - 6,591 `screenshot.png` rendered snapshots (~934 MB uncompressed).
     - 4,000+ `rendered.html` static HTML snapshots (~158 MB uncompressed).
     - 4,000+ `prompt.md` design prompt descriptions (~135 MB uncompressed).
   - Provenance and upstream attribution are documented in `community-assets/DATASET_INFO.md` and `community-assets/LICENSE`.

### Packaging & Distribution Models

Currently, the packaging script stages `community-assets/` without any upstream `.git/` history, reducing the ZIP archive from 474 MiB to ~280 MiB compressed, while maintaining 100% offline self-containment for all 6,591 component previews.

However, GitHub repositories typically advise keeping standard git repositories under 1 GB total clone size.

| Distribution Strategy | How It Works | Developer Experience | Bandwidth / Storage | Offline Ready? |
| :--- | :--- | :--- | :--- | :--- |
| **Model 1: Full Self-Contained Release Archive (Current)** | Complete `community-assets/` bundled directly in release ZIP and repository. | Clone and run `npm run dev` with zero setup. Every preview renders offline instantly. | ~280 MB ZIP / ~1.2 GB uncompressed. Large git clone. | **100% Offline** |
| **Model 2: Git LFS for Binary Screenshots** | Code and HTML snapshots remain in Git; PNG screenshots tracked via Git LFS. | Seamless for developers with Git LFS installed. Standard git clone is fast (~250 MB). | Consumes GitHub LFS storage/bandwidth quota (1 GB free monthly). | **100% Offline** (if LFS pulled) |
| **Model 3: Separate `elementraui-assets` Repository or Submodule** | Main `elementraui` repo contains only app source and core catalogue (~15 MB). Community assets hosted in a secondary repository. | Web repository is featherlight; developers who want offline community previews clone the assets submodule. | Git history of app remains pristine and compact. | Requires submodule init or network fallback |
| **Model 4: On-Demand Download / Asset CDN** | App downloads community screenshots/HTML from a release tarball or CDN on first run or on demand via `npm run download-assets`. | Fastest initial clone (< 20 MB). Lowest repo burden. | Requires reliable external hosting / GitHub Release asset hosting. | Requires one-time download |

### Maintainer Recommendation
- **For Initial v1.0.0 Release ZIP Deliverable:** Maintain **Model 1 (Full Self-Contained Archive)** so evaluators and testers have zero network dependencies and can run the complete marketplace offline.
- **For GitHub Git Repository Publication:** Adopt **Model 3 (Separate Assets Repository)** or **Model 4 (Download Script)** to ensure `github.com/elementraui/elementraui` stays light, fast, and below GitHub's recommended 1 GB repo threshold.

### Required Owner Action
- [ ] Select preferred distribution model for the public git repository (Model 1, 2, 3, or 4).

---

## 4. Platform Compatibility & Verified vs. Unverified Status

### Context
To maintain strict technical integrity and prevent false claims in open-source documentation:
- **Google Antigravity (AGY):** Fully tested, empirically verified, automated test runner passing in live environment.
- **Claude Code, Cursor, Windsurf, GitHub Copilot:** Vendor-compliant adapter files and format configurations have been created in `elementraui-skill/adapters/`, but they have **NOT** undergone live execution verification inside external vendor runtimes.

### Proposed Governance Rule
In all documentation (`README.md`, `SUPPORTED_AGENTS.md`, `INSTALLATION.md`, marketing materials):
- **VERIFIED:** Strictly reserved for environments empirically tested and automated in CI/local suites (Google Antigravity).
- **COMMUNITY ADAPTERS / ROADMAP:** Explicitly label Cursor, Claude Code, Windsurf, Copilot, and Aider as adapter templates awaiting community verification.

### Required Owner Action
- [ ] Confirm and approve strict separation of verified vs unverified platform claims.

---

## Owner Sign-Off Checklist

```markdown
[ ] Decision 1 Approved: GitHub target is [ ] Organisation [ ] Personal
    Account Handle: _____________________________________________

[ ] Decision 2 Approved: Copyright notice and Default GitHub MIT contribution terms accepted.

[ ] Decision 3 Approved: Asset distribution model selected: [ ] 1 [ ] 2 [ ] 3 [ ] 4

[ ] Decision 4 Approved: Honest platform verification statuses approved for publication.

Owner Signature: _____________________________________________
Date:            _____________________________________________
```
