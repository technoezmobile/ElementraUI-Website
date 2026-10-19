export type ItemType =
  | "component"
  | "block"
  | "template"
  | "design-reference"
  | "shader"
  | "webgl-3d"
  | "prompt"
  | "theme"

export type TechCategory =
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

export type MotionEngine = "Framer Motion" | "Three.js" | "GLSL" | "CSS / Canvas" | "None"

export type PreviewStatus = "verified" | "partial" | "reference-only" | "unavailable" | "error"

export type ResourceSourceAvailability =
  | "executable-react-source"
  | "react-source-unresolved-deps"
  | "renderable-html-css"
  | "static-html-snapshot"
  | "screenshot-only"
  | "video-media"
  | "prompt-blueprint"
  | "design-reference"
  | "source-unavailable"

export type HonestPreviewKind =
  | "executable-verified"
  | "html-snapshot"
  | "screenshot-reference"
  | "prompt-blueprint"
  | "design-reference"
  | "template-preview"
  | "source-unavailable"
  | "preview-error"

export interface CatalogueItem {
  id: string
  name: string
  slug: string
  itemType: ItemType
  category: TechCategory
  motionEngine: MotionEngine
  isInstallable: boolean
  isWorkingPreview: boolean
  previewStatus: PreviewStatus
  previewDiagnostic?: string
  description: string
  tags: string[]
  license: string
  dependencies: string[]
  registryDependencies?: string[]
  author: {
    name: string
    url?: string
    avatar?: string
  }
  provenance: {
    origin: string
    repository: string
    licenseUrl: string
    importDate: string
    modificationStatus: "unmodified-upstream" | "adapted-for-local" | "original-implementation" | "design-reference-only"
    commitHash?: string
  }
  installationType?: "cli" | "css-tokens" | "manual"
  installCommand?: string
  componentCode?: string
  demoCode?: string
  previewType: "component" | "iframe" | "reference-card"
  promptData?: {
    tool: "Cursor" | "Claude Code" | "Windsurf" | "Codex" | "v0"
    framework: string
    promptText: string
    suggestedTokens?: string
  }
  referenceData?: {
    websiteUrl: string
    designObservations: string[]
    reimplementationPlan: string[]
  }
  sourceRepo?: "elementraui" | "21st-local" | "awesome-components"
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

export function getHonestPreviewKind(item: CatalogueItem): HonestPreviewKind {
  if (
    item.componentCode &&
    (item.previewStatus === "verified" ||
      item.id.startsWith("floating-sphere") ||
      item.id.startsWith("magicui-") ||
      item.id.startsWith("aurora-") ||
      item.id.startsWith("interactive-3d") ||
      item.id.startsWith("kinetic-hero") ||
      item.id.startsWith("blur-reveal") ||
      item.id.startsWith("floating-pill") ||
      item.id.startsWith("staggered-") ||
      item.id.startsWith("shimmer-") ||
      item.id.startsWith("magnetic-") ||
      item.id.startsWith("bento-") ||
      item.id.startsWith("particles-") ||
      item.id.startsWith("marquee-") ||
      item.itemType === "theme")
  ) {
    return "executable-verified"
  }
  if (item.sourceRepo === "awesome-components" && item.awesomeData?.hasHtml) {
    return "html-snapshot"
  }
  if (item.itemType === "prompt" && item.promptData) {
    return "prompt-blueprint"
  }
  if (item.itemType === "design-reference" && item.referenceData) {
    return "design-reference"
  }
  if (item.itemType === "template") {
    return "template-preview"
  }
  if (item.awesomeData?.hasScreenshot && !item.awesomeData?.hasHtml) {
    return "screenshot-reference"
  }
  if (item.previewStatus === "unavailable") {
    return "source-unavailable"
  }
  if (item.previewStatus === "error") {
    return "preview-error"
  }
  return "source-unavailable"
}

export function determineSourceAvailability(item: CatalogueItem): ResourceSourceAvailability {
  if (item.componentCode && item.componentCode.trim().length > 0) {
    const availableLibs = new Set(["react", "react-dom", "framer-motion", "three", "lucide-react", "clsx", "tailwind-merge", "tailwindcss"]);
    const hasUnresolved = item.dependencies?.some(
      (d) => !availableLibs.has(d.toLowerCase()) && !d.startsWith("@types/")
    );
    return hasUnresolved ? "react-source-unresolved-deps" : "executable-react-source";
  }
  if (item.sourceRepo === "awesome-components") {
    if (item.awesomeData?.hasHtml) return "static-html-snapshot";
    if (item.awesomeData?.hasScreenshot) return "screenshot-only";
    return "source-unavailable";
  }
  if (item.itemType === "prompt" && item.promptData) return "prompt-blueprint";
  if (item.itemType === "design-reference" && item.referenceData) return "design-reference";
  if ((item as any).videoUrl || (item.itemType as string) === "video") return "video-media";
  if (item.itemType === "theme") return "executable-react-source";
  if (item.itemType === "template") return "renderable-html-css";
  return "source-unavailable";
}

export function getHonestBadgeConfig(kind: HonestPreviewKind): {
  label: string
  bg: string
  text: string
  border: string
  dot: string
} {
  switch (kind) {
    case "executable-verified":
      return {
        label: "Interactive preview",
        bg: "bg-emerald-950/80",
        text: "text-emerald-400",
        border: "border-emerald-800/60",
        dot: "bg-emerald-400"
      }
    case "html-snapshot":
      return {
        label: "HTML preview",
        bg: "bg-cyan-950/80",
        text: "text-cyan-300",
        border: "border-cyan-800/60",
        dot: "bg-cyan-400"
      }
    case "screenshot-reference":
      return {
        label: "Static screenshot",
        bg: "bg-purple-950/80",
        text: "text-purple-300",
        border: "border-purple-800/60",
        dot: "bg-purple-400"
      }
    case "prompt-blueprint":
      return {
        label: "Prompt blueprint",
        bg: "bg-amber-950/80",
        text: "text-amber-300",
        border: "border-amber-800/60",
        dot: "bg-amber-400"
      }
    case "template-preview":
      return {
        label: "Template layout",
        bg: "bg-indigo-950/80",
        text: "text-indigo-300",
        border: "border-indigo-800/60",
        dot: "bg-indigo-400"
      }
    case "design-reference":
      return {
        label: "Design reference",
        bg: "bg-violet-950/80",
        text: "text-violet-300",
        border: "border-violet-800/60",
        dot: "bg-violet-400"
      }
    case "preview-error":
      return {
        label: "Preview error",
        bg: "bg-rose-950/80",
        text: "text-rose-300",
        border: "border-rose-800/60",
        dot: "bg-rose-500"
      }
    case "source-unavailable":
    default:
      return {
        label: "Registry blueprint",
        bg: "bg-slate-900/90",
        text: "text-slate-400",
        border: "border-slate-800",
        dot: "bg-slate-500"
      }
  }
}
