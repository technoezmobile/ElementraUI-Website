# ElementraUI — Security Policy & Sandboxing Specifications

**Version:** 1.0.0  
**Target Brand:** ElementraUI (*Discover. Preview. Build.*)

---

## 1. Security Philosophy

ElementraUI renders thousands of third-party community components, HTML snapshots, and scripts. We employ a **zero-trust, multi-layered isolation architecture** to guarantee that untrusted code can never compromise the parent application or access user data.

---

## 2. Sandboxing Invariants

### 2.1 Strict Iframe Sandboxing
All component previews (React sandboxes and HTML snapshots) run inside `<iframe>` elements configured with:
```html
<iframe sandbox="allow-scripts" srcDoc={wrappedContent} />
```

**Key Invariant: `allow-same-origin` is STRICTLY OMITTED.**  
Without `allow-same-origin`:
- The iframe is treated as an opaque, unique origin.
- Scripts cannot access `window.parent`, parent cookies, session tokens, or local storage.
- Scripts cannot navigate the top-level window.

### 2.2 In-Memory Mock Storage Polyfill
Sandboxed iframes without `allow-same-origin` throw `DOMException: SecurityError` if embedded code accesses `localStorage` or `sessionStorage`. We inject an in-memory mock before any script executes:
```javascript
const dummyStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {}, clear: () => {} };
Object.defineProperty(window, 'localStorage', { value: dummyStorage, writable: false });
Object.defineProperty(window, 'sessionStorage', { value: dummyStorage, writable: false });
```
This allows scripts to run without crashing while preventing any data persistence or leakage.

### 2.3 Directory Traversal Defense
In development, the Vite middleware (`serveAwesomeComponents`) validates that requested asset paths are strictly contained within `.cache/awesome-components/components`:
```typescript
if (!targetPath.startsWith(baseDir)) {
  res.statusCode = 403;
  res.end('Forbidden: Path traversal detected');
  return;
}
```
Any attempt to access `../../etc/passwd` or host system files is immediately rejected.

### 2.4 Offline Runtimes (Zero CDN Exposure)
To prevent IP logging, tracking, or supply-chain CDN attacks, all runtimes (React 19, Framer Motion, Three.js, Tailwind Play) are hosted locally under `/vendor/`.

---

## 3. Reporting a Vulnerability

If you discover a security vulnerability in ElementraUI, please report it privately:
- **Email:** `security@elementraui.dev`
- **PGP Key:** Available upon request.

Please do not open public GitHub issues for security vulnerabilities. We will acknowledge receipt within 48 hours and coordinate a coordinated disclosure timeline.
