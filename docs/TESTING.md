# ElementraUI — Testing & Quality Assurance Guide

**Version:** 1.0.0  
**Target Brand:** ElementraUI (*Discover. Preview. Build.*)

---

## 1. Overview

ElementraUI maintains a 100% pass rate across **8 automated verification suites** comprising **548 automated checks**. Testing is divided into two distinct tiers:
1. **Real Browser Execution Tests (Playwright Chromium):** Spawns actual browser instances, compiles TSX via Sucrase, mounts iframes, and verifies DOM geometry (`clientWidth > 0`, `clientHeight > 0`, `offsetParent !== null`).
2. **Schema & Integrity Tests (Node.js):** Validates catalogue schemas, file existence, PNG magic headers, and CLI installation commands.

---

## 2. Test Suites Summary

| Suite | Command | Checks | Focus Area |
| :--- | :--- | :---: | :--- |
| **Live React Sandbox Audit** | `npm run test:live` | 8 | Real Chromium: Sucrase TSX compilation, React 19 iframe mounting, missing deps detection. |
| **Browser Preview Audit** | `npm run test:browser` | 54 | Real Chromium: 54 representative items, mobile viewports (390px), light/dark mode, modal navigation. |
| **Marketplace Hubs Suite** | `npm run test:marketplace` | 75 | Schemas & pipelines for Themes, Templates, Apps, Icons, Video, and Bookmarks. |
| **Catalogue & Registry Suite** | `npm run test:previews` | 59 | Verifies the 162 core items, TypeScript exports, and `public/r/*.json` endpoints. |
| **Community Dataset Suite** | `npm run test:awesome` | 112 | File existence, non-empty HTML DOM, PNG headers, and security path traversal. |
| **Coverage & MIME Suite** | `npm run test:coverage` | 381 | HTTP status codes, Content-Type headers, and payload verification. |
| **Project Installation Suite** | `npm run test:install` | 6 | Tests CLI component installation into a standalone test directory (`test-install/`). |
| **TypeScript Typecheck** | `npm run build` | All | Strict compiler validation (`tsc -b`). |

---

## 3. Running the Tests Locally

### Quick Smoke Test (Fastest: ~5s)
```bash
npm run test:marketplace
npm run test:install
```

### Full Headless Browser Test (Playwright: ~25s)
Ensure the dev server is running on `http://localhost:5173/`, then run:
```bash
npm run test:live
npm run test:browser
```

### Complete Quality Assurance Sweep
```bash
npm run build
npm run test:marketplace
npm run test:previews
npm run test:awesome
npm run test:install
npm run test:live
npm run test:browser
```

---

## 4. Continuous Integration (CI) Standards

Pull requests must satisfy the following Quality Gates:
1. `npm run build` exits with code 0.
2. `npm run test:live` reports 0 failures.
3. `npm run test:marketplace` reports 75/75 passes.
4. `npm audit` reports 0 high or critical vulnerabilities.
