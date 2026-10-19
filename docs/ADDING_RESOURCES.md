# ElementraUI — Guide to Adding Resources

**Version:** 1.0.0  
**Target Brand:** ElementraUI (*Discover. Preview. Build.*)

---

## 1. Overview

ElementraUI accepts contributions across 7 marketplace hubs:
1. **Components** (Executable React TSX or sandboxed HTML/CSS)
2. **Themes** (CSS variable design tokens and color swatches)
3. **Templates** (Multi-page starter blueprints and project structures)
4. **Apps** (Runnable in-browser React mini-apps)
5. **Icons** (Scalable vector SVGs with sizing controls)
6. **Video & Motion** (CSS keyframe animations & Remotion compositions)
7. **AI Prompts** (Prompt engineering blueprints)

---

## 2. Adding a React Component to the Core Catalogue

To add a new verified React component with an interactive sandbox:

### Step 1: Create the Component in `src/components/registry/`
Create a clean, self-contained TypeScript file in `src/components/registry/<MyComponent>.tsx`:
```tsx
import React, { useState } from "react"
import { motion } from "framer-motion"

interface MyComponentProps {
  label?: string
}

export const MyComponent: React.FC<MyComponentProps> = ({ label = "Click Me" }) => {
  const [clicked, setClicked] = useState(false)

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setClicked(!clicked)}
      className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-medium shadow-md"
    >
      {clicked ? "Active!" : label}
    </motion.button>
  )
}
```

### Step 2: Export in `src/components/registry/index.ts`
```tsx
export * from "./MyComponent"
```

### Step 3: Add the Item Record to `src/data/fullCatalogue.json`
Add a new JSON record:
```json
{
  "id": "my-component",
  "name": "Animated Action Button",
  "slug": "animated-action-button",
  "itemType": "component",
  "category": "Heroes & Landing",
  "motionEngine": "Framer Motion",
  "isInstallable": true,
  "installationType": "cli",
  "installCommand": "npx shadcn@latest add https://elementraui.dev/r/my-component.json",
  "isWorkingPreview": true,
  "previewStatus": "verified",
  "description": "Interactive action button with spring physics and click toggle state.",
  "tags": ["Button", "Framer Motion", "Interactive", "Micro-interaction"],
  "license": "MIT",
  "dependencies": ["framer-motion", "clsx", "tailwind-merge"],
  "author": {
    "name": "YourName",
    "url": "https://github.com/yourhandle"
  },
  "provenance": {
    "origin": "Original contribution",
    "repository": "https://github.com/elementraui/elementraui",
    "licenseUrl": "https://opensource.org/licenses/MIT",
    "importDate": "2026-10-19",
    "modificationStatus": "original-implementation"
  },
  "previewType": "component",
  "sourceRepo": "elementraui",
  "componentCode": "import React, { useState } from \"react\"..."
}
```

### Step 4: Generate Registry Endpoint
Run the registry generator script:
```bash
node scripts/generate-registry.js
```
This automatically produces `public/r/my-component.json`.

### Step 5: Verify in Browser & Run Tests
```bash
npm run test:previews
npm run test:live
```

---

## 3. Adding a Theme System to the Marketplace

To contribute a new CSS variable theme to `src/data/themesData.ts`:
1. Define the palette tokens in `verifiedThemesData`:
```typescript
{
  id: "theme-emerald-clean",
  name: "Emerald Clean FinTech",
  slug: "emerald-clean",
  description: "Minimalist emerald and slate theme tailored for high-trust financial interfaces.",
  author: { name: "FinTech UI", url: "https://github.com/elementraui" },
  cssVariables: `:root {
  --background: #064e3b;
  --foreground: #ecfdf5;
  --primary: #10b981;
  --secondary: #047857;
  --accent: #34d399;
  --border: #065f46;
}`,
  swatches: [
    { label: "Background", hex: "#064E3B" },
    { label: "Primary", hex: "#10B981" },
    { label: "Secondary", hex: "#047857" },
    { label: "Accent", hex: "#34D399" },
    { label: "Border", hex: "#065F46" }
  ]
}
```
2. Verify via `npm run test:marketplace`.

---

## 4. Quality Invariants for Contributions

- **Zero Fake Screenshots:** Never provide an image for a component claiming to be an interactive React component.
- **Dependency Safety:** Supported runtime dependencies in the isolated sandbox are: React 19, ReactDOM 19, Framer Motion, Three.js, Lucide React, clsx, and tailwind-merge. If your component uses another library, ensure it is declared in `dependencies`.
- **License Integrity:** All submissions must be open source (MIT, Apache-2.0, ISC) with original author attribution.
