# ElementraUI — Catalogue Schema & Data Specifications

**Version:** 1.0.0  
**Target Brand:** ElementraUI (*Discover. Preview. Build.*)

---

## 1. Overview

This document specifies the exact TypeScript interfaces and JSON schema rules governing catalogue records in **ElementraUI**. Every record in `src/data/fullCatalogue.json` (162 core items) and `public/data/awesome-catalogue.json` (6,591 community items) conforms to these standards.

---

## 2. Master Item Schema (`CatalogueItem`)

Located in [`src/types/catalogue.ts`](file:///e:/21st.dev%20work/src/types/catalogue.ts):

```typescript
export interface CatalogueItem {
  /** Unique deterministic identifier, e.g., 'floating-sphere-3d', 'magicui-lens' */
  id: string

  /** Display name of the resource, e.g., 'Interactive 3D Floating Sphere' */
  name: string

  /** URL-safe slug for deep linking (?item=<slug>) */
  slug: string

  /** High-level resource type */
  itemType: "component" | "block" | "template" | "design-reference" | "shader" | "webgl-3d" | "prompt" | "theme"

  /** Categorical grouping */
  category:
    | "3D & WebGL"
    | "Shaders & Canvas"
    | "Heroes & Landing"
    | "Typography & Motion"
    | "Cards & Bento"
    | "Navigation & Menus"
    | "Visual Effects"
    | "Forms & Inputs"
    | "Full Templates"
    | "AI Prompts"
    | "Design References"
    | "Theme Presets"

  /** Primary animation or graphics engine */
  motionEngine: "Framer Motion" | "Three.js" | "GLSL" | "CSS / Canvas" | "None"

  /** Flag indicating whether the component has an installation command */
  isInstallable: boolean

  /** Installation mechanism type */
  installationType?: "cli" | "css-tokens" | "manual"

  /** Terminal install command (e.g., 'npx shadcn@latest add ...') */
  installCommand?: string

  /** Flag indicating if the resource has a verified visual preview */
  isWorkingPreview: boolean

  /** Honest status of the preview */
  previewStatus: "verified" | "partial" | "reference-only" | "unavailable" | "error"

  /** Human-readable explanation of any preview limitations */
  previewDiagnostic?: string

  /** Substantive description of component behavior and purpose */
  description: string

  /** Search and filtering tags */
  tags: string[]

  /** Open-source license (e.g., 'MIT', 'Apache-2.0') */
  license: string

  /** NPM dependencies required to execute the component */
  dependencies: string[]

  /** Shadcn registry dependencies */
  registryDependencies?: string[]

  /** Author credit and profile metadata */
  author: {
    name: string
    url?: string
    avatar?: string
  }

  /** Origin and modification provenance */
  provenance: {
    origin: string
    repository: string
    licenseUrl: string
    importDate: string
    modificationStatus: "unmodified-upstream" | "adapted-for-local" | "original-implementation" | "design-reference-only"
    commitHash?: string
  }

  /** Raw TSX/JSX source code string for standalone React execution */
  componentCode?: string

  /** Optional demo harness code */
  demoCode?: string

  /** Top-level renderer dispatch hint */
  previewType: "component" | "iframe" | "reference-card"

  /** AI Prompt Studio configuration (if itemType === 'prompt') */
  promptData?: {
    tool: "Cursor" | "Claude Code" | "Windsurf" | "Codex" | "v0"
    framework: string
    promptText: string
    suggestedTokens?: string
  }

  /** Curated design study observations (if itemType === 'design-reference') */
  referenceData?: {
    websiteUrl: string
    designObservations: string[]
    reimplementationPlan: string[]
  }

  /** Source repository namespace */
  sourceRepo?: "elementraui" | "21st-local" | "awesome-components"

  /** Community metadata (if imported from Awesome Components) */
  awesomeData?: {
    bucket: string
    author: string
    authorName: string
    component: string
    componentName: string
    variant: string
    variantName: string
    promptPath: string
    htmlPath: string
    screenshotPath: string
    promptUrl: string
    htmlUrl: string
    screenshotUrl: string
    hasPrompt: boolean
    hasHtml: boolean
    hasScreenshot: boolean
  }
}
```

---

## 3. Honest Preview Classification

The helper function `getHonestPreviewKind(item: CatalogueItem)` programmatically evaluates a resource's physical assets to return one of 8 distinct capability classifications:

| Kind | Required Evidence | Selected Renderer | Badge UI |
| :--- | :--- | :--- | :--- |
| **`executable-verified`** | Non-empty `componentCode` with verified dependencies or theme token | `IsolatedReactRenderer` / `ThemeRenderer` | Emerald (`Interactive preview`) |
| **`html-snapshot`** | Verified `rendered.html` file on disk with `size > 0` bytes | `StaticHtmlRenderer` | Cyan (`HTML preview`) |
| **`screenshot-reference`** | Verified `screenshot.png` with PNG magic header | `ScreenshotRenderer` | Purple (`Static screenshot`) |
| **`prompt-blueprint`** | `item.promptData` or `awesomeData.hasPrompt` | `BlueprintRenderer` | Amber (`Prompt blueprint`) |
| **`template-preview`** | Multi-page routing layout or template spec | `TemplateRenderer` | Indigo (`Template layout`) |
| **`design-reference`** | `item.referenceData` with study observations | `BlueprintRenderer` | Violet (`Design reference`) |
| **`source-unavailable`** | CLI registry item awaiting local code mirroring | `BlueprintRenderer` | Slate (`Registry blueprint`) |
| **`preview-error`** | Corrupt asset or runtime compiler crash | `PreviewErrorBoundary` | Rose (`Preview error`) |
