# ElementraUI — Known Limitations & Technical Constraints

**Version:** 1.0.0  
**Target Brand:** ElementraUI (*Discover. Preview. Build.*)

---

## 1. Overview

In accordance with our core commitment to **Honest Capabilities & Zero Visual Faking**, this document records known technical boundaries and limitations across the platform.

---

## 2. Component Execution Limitations

### 2.1 Unbundled Radix UI Dependencies
* **Condition:** When an imported component relies on `@radix-ui/react-*` packages (e.g., `@radix-ui/react-slider`, `@radix-ui/react-dialog`) that are not yet bundled into `/vendor/isolated-react-runtime.js`.
* **Behavior:** The preview engine cleanly halts compilation and renders a **Diagnostic Warning Banner** stating that the dependency is unbundled, providing the exact `npm install` command.
* **Mitigation:** Future releases will bundle the top 10 most common Radix UI primitives into the offline vendor bundle.

### 2.2 Community Awesome Components Datatype
* **Condition:** The 6,591 imported community components contain pre-rendered HTML DOM snapshots (`rendered.html`) rather than standalone `.tsx` module files.
* **Behavior:** These items are rendered in sandboxed iframes. While fully visual and responsive to CSS/JS interactions, they cannot be modified in-memory as arbitrary React props.
* **Mitigation:** The AI Prompt Studio allows developers to convert any community HTML snapshot into clean React 19 + Tailwind TSX code via 1-click prompt handoffs.

### 2.3 Corrupt Upstream Assets on Disk (7 Records)
* **Condition:** Exactly 1 HTML snapshot (`awesome-0xurvish-bucket-default`) and 6 upstream community screenshots are 0-byte or corrupted files in the upstream archive.
* **Behavior:** The preview engine catches these 0-byte files, avoids crashing, and renders a diagnostic blueprint explaining that the upstream asset is unavailable.

---

## 3. Storage & Browser Constraints

### 3.1 Chromium GPU Context Recycling
* **Condition:** Rapidly opening and closing dozens of Three.js/WebGL preview modals in a single browsing session can leave orphaned WebGL contexts in Chromium's GPU process.
* **Mitigation:** The preview modal forcibly destroys the iframe DOM node on close, but prolonged intensive 3D sessions may benefit from a browser refresh.

### 3.2 Offline Tailwind Play Compilation
* **Condition:** The offline `/vendor/tailwind-play.js` engine dynamically compiles Tailwind v3/v4 classes inside sandboxed iframes. On low-powered mobile devices, very large HTML snapshots (30,000+ characters) may take 150–300ms to evaluate styling.
