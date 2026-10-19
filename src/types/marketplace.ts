import { CatalogueItem } from "./catalogue"

export type MarketplaceSection =
  | "components"
  | "themes"
  | "templates"
  | "apps"
  | "icons"
  | "video"
  | "bookmarks"

// 1. Theme Data Models
export interface ThemeColorPalette {
  background: string
  foreground: string
  card: string
  cardForeground: string
  primary: string
  primaryForeground: string
  secondary: string
  secondaryForeground: string
  muted: string
  mutedForeground: string
  accent: string
  accentForeground: string
  destructive: string
  destructiveForeground: string
  border: string
  input: string
  ring: string
}

export interface ThemeItem {
  id: string
  name: string
  slug: string
  description: string
  author: {
    name: string
    url?: string
  }
  license: string
  colorFamily: "neutral" | "cyber" | "warm" | "cool" | "dark" | "light" | "colorful"
  appearance: "dark" | "light" | "dual"
  designStyle: "Minimal" | "High-Contrast" | "Glassmorphic" | "Cyberpunk" | "Neomorphic" | "Corporate"
  framework: "Tailwind CSS v4" | "shadcn/ui" | "CSS Variables"
  tokens: {
    dark: ThemeColorPalette
    light: ThemeColorPalette
    radius: string
    fontSans: string
    fontMono: string
  }
  cssVariables: string
  tailwindConfigSnippet: string
  provenance: {
    origin: string
    repository?: string
  }
  tags: string[]
}

// 2. Template Data Models
export interface TemplatePage {
  name: string
  path: string
  description: string
}

export interface TemplateItem {
  id: string
  name: string
  slug: string
  description: string
  category: "SaaS" | "Portfolio" | "Dashboard" | "E-Commerce" | "Agency" | "Docs" | "Blog" | "AI Application"
  framework: "Next.js 15" | "React 19 + Vite" | "Astro" | "Remix"
  author: {
    name: string
    url?: string
  }
  license: string
  pageCount: number
  pages: TemplatePage[]
  dependencies: string[]
  previewCoverUrl?: string
  previewType: "full-page" | "iframe" | "interactive-mock"
  setupInstructions: string[]
  scaffoldFiles: {
    path: string
    content: string
  }[]
  provenance: {
    origin: string
    repository?: string
  }
  tags: string[]
}

// 3. App Data Models
export type AppRuntimeType = "runnable-react" | "starter-blueprint"

export interface AppItem {
  id: string
  name: string
  slug: string
  description: string
  category: "Productivity" | "Developer Tool" | "Interactive Widget" | "Data Visualization" | "Utility"
  appType: AppRuntimeType
  author: {
    name: string
    url?: string
  }
  license: string
  version: string
  features: string[]
  dependencies: string[]
  sourceCode?: string
  previewCoverUrl?: string
  tags: string[]
  provenance: {
    origin: string
    repository?: string
  }
}

// 4. Icon Data Models
export interface IconItem {
  id: string
  name: string
  slug: string
  family: "Lucide" | "Heroicons" | "Tabler" | "Remix"
  category: "Navigation" | "Interface" | "Development" | "Media" | "Communication" | "Actions" | "Commerce" | "Arrows"
  keywords: string[]
  svgPath: string
  viewBox: string
  license: string
  author: string
}

// 5. Video & Motion Data Models
export interface VideoItem {
  id: string
  name: string
  slug: string
  description: string
  category: "Background Loops" | "Hero Motion" | "Interface Animations" | "Device Mockups" | "Transitions" | "Data & Charts"
  motionEngine: "CSS Animation" | "Canvas 60fps" | "Three.js WebGL" | "Remotion"
  aspectRatio: "16:9" | "1:1" | "9:16"
  durationSeconds: number
  fps: number
  author: {
    name: string
    url?: string
  }
  license: string
  animationCode?: string
  remotionSnippet?: string
  posterColor: string
  tags: string[]
  provenance: {
    origin: string
  }
}

// 6. Bookmarks & Boards Data Models
export interface CollectionBoard {
  id: string
  title: string
  description: string
  coverColor: string
  itemIds: string[]
  createdAt: string
  updatedAt: string
}

export interface BookmarkedItemMeta {
  id: string
  section: MarketplaceSection
  title: string
  subtitle: string
  category: string
  coverUrl?: string
  badgeLabel: string
  dateAdded: string
}
