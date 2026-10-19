import React, { useState } from "react"
import { CatalogueItem } from "../types/catalogue"
import {
  Sparkles,
  Bookmark,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Copy,
  Check,
  Code2,
  Terminal,
  Layers,
  Wand2
} from "lucide-react"
import {
  BentoGrid,
  LensDemo,
  MagneticButtonDemo,
  ShimmerButton,
  AuroraShader,
  InteractiveCard
} from "./registry"

interface MarketplaceSpotlightProps {
  onOpenItem: (item: CatalogueItem) => void
  featuredItems: CatalogueItem[]
  isFavorite: (id: string) => boolean
  onToggleFavorite: (id: string) => void
  onSelectCategory?: (category: string) => void
  activeCategory?: string
}

export const MarketplaceSpotlight: React.FC<MarketplaceSpotlightProps> = ({
  onOpenItem,
  featuredItems,
  isFavorite,
  onToggleFavorite,
  onSelectCategory,
  activeCategory = "All"
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopyPrompt = (e: React.MouseEvent, item: CatalogueItem) => {
    e.stopPropagation()
    const promptText = item.promptData?.promptText || `Create a modern React + Tailwind CSS component named "${item.name}". ${item.description}`
    navigator.clipboard.writeText(promptText)
    setCopiedId(item.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Curated category shelves for rapid component discovery
  const marketingCategories = [
    { label: "Heroes & Landing", value: "Heroes & Landing", count: "1,240+" },
    { label: "Cards & Bento", value: "Cards & Bento", count: "620+" },
    { label: "Visual Effects", value: "Visual Effects", count: "340+" },
    { label: "Shaders & Canvas", value: "Shaders & Canvas", count: "180+" },
    { label: "Typography & Motion", value: "Typography & Motion", count: "660+" }
  ]

  const uiCategories = [
    { label: "Buttons & CTAs", value: "Buttons & CTAs", count: "2,040+" },
    { label: "Forms & Inputs", value: "Forms & Inputs", count: "1,520+" },
    { label: "Navigation & Menus", value: "Navigation & Menus", count: "380+" },
    { label: "AI Prompts", value: "AI Prompts", count: "250+" },
    { label: "Full Templates", value: "Full Templates", count: "110+" }
  ]

  // Curated standout interactive components with genuine executable React previews
  const liveShowcaseItems = [
    {
      id: "bento-grid",
      name: "Bento Grid Dashboard Kit",
      author: "@shadcn",
      tag: "Responsive Grid",
      component: <BentoGrid />
    },
    {
      id: "magnetic-button",
      name: "Magnetic Physics Button",
      author: "@craft_ui",
      tag: "Framer Motion",
      component: <MagneticButtonDemo />
    },
    {
      id: "magicui-lens",
      name: "Interactive Zoom Lens",
      author: "@magicui",
      tag: "Canvas FX",
      component: <LensDemo />
    },
    {
      id: "shimmer-light-button",
      name: "Shimmer Gradient Button",
      author: "@ravi_katiyar",
      tag: "CSS Animations",
      component: <ShimmerButton />
    }
  ]

  return (
    <div className="space-y-10 pb-6">
      {/* 1. ElementraUI Editorial Headline Header */}
      <section className="pt-2 pb-2">
        <div className="max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-accent-violet-deep/10 border border-accent-violet-deep/30 text-accent-violet-deep text-xs font-mono font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-violet-deep animate-pulse" />
            <span>ELEMENTRAUI • DISCOVER. PREVIEW. BUILD.</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-text-primary leading-[1.12]">
            The <span className="italic font-serif text-white underline decoration-accent-violet-deep/50 underline-offset-8">living</span> library of crafted UI components & developer tools
          </h1>
          <p className="text-sm sm:text-base text-text-muted max-w-2xl leading-relaxed">
            <span className="text-text-primary font-medium">6,750+</span> verified React components, templates, themes, and interactive sandboxes. Built for modern design engineers with isolated compilation, instant inspection, and drop-in code.
          </p>
        </div>
      </section>

      {/* 2. Curated Horizontal Category Shelves (Curated Component Shelves) */}
      <div className="space-y-4">
        {/* Marketing Blocks Shelf */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <span className="shrink-0 text-xs font-medium text-text-primary whitespace-nowrap">
            Marketing Blocks:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {marketingCategories.map((cat) => {
              const isSelected = activeCategory === cat.value
              return (
                <button
                  key={cat.value}
                  onClick={() => onSelectCategory && onSelectCategory(isSelected ? "All" : cat.value)}
                  className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-white text-black font-semibold"
                      : "bg-surface-subtle hover:bg-surface-raised border border-border-subtle text-text-muted hover:text-text-primary"
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-[10px] font-mono ${isSelected ? "text-neutral-700" : "text-text-muted/60"}`}>
                    {cat.count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* UI Primitives Shelf */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <span className="shrink-0 text-xs font-medium text-text-primary whitespace-nowrap">
            UI Primitives:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {uiCategories.map((cat) => {
              const isSelected = activeCategory === cat.value
              return (
                <button
                  key={cat.value}
                  onClick={() => onSelectCategory && onSelectCategory(isSelected ? "All" : cat.value)}
                  className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-white text-black font-semibold"
                      : "bg-surface-subtle hover:bg-surface-raised border border-border-subtle text-text-muted hover:text-text-primary"
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-[10px] font-mono ${isSelected ? "text-neutral-700" : "text-text-muted/60"}`}>
                    {cat.count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* 3. Featured Showcase River: Real Interactive Components */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <h2 className="text-sm font-semibold text-text-primary">Featured Live Components</h2>
            <span className="text-xs text-text-muted font-mono">(Interactive Previews)</span>
          </div>
          <span className="text-xs text-text-muted hidden sm:inline-block">
            Hover to test physics • Click to inspect source
          </span>
        </div>

        {/* Grid of 4 High-Fidelity Interactive Preview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {liveShowcaseItems.map((item) => {
            const fullItem = featuredItems.find((f) => f.id === item.id) || {
              id: item.id,
              name: item.name,
              category: "Cards & Bento",
              author: { name: item.author.replace("@", ""), avatar: "" },
              description: "Interactive component crafted for React & Tailwind CSS.",
              itemType: "component",
              tags: ["React", "Tailwind", "Interactive"],
              previewStatus: "verified"
            } as CatalogueItem

            const isFav = isFavorite(item.id)

            return (
              <div
                key={item.id}
                onClick={() => onOpenItem(fullItem)}
                className="group relative rounded-xl border border-border-subtle bg-surface-subtle hover:border-white/20 transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer"
              >
                {/* Large Interactive Preview Stage (Aspect 4/3) */}
                <div className="relative aspect-[4/3] w-full bg-surface-base border-b border-border-subtle overflow-hidden flex items-center justify-center p-4">
                  <div className="w-full h-full flex items-center justify-center">
                    {item.component}
                  </div>

                  {/* Hover Action Overlay Pill */}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <button
                      onClick={(e) => handleCopyPrompt(e, fullItem)}
                      className="px-2 py-1 rounded-md bg-surface-raised/90 backdrop-blur-md border border-border-subtle text-[11px] font-medium text-text-primary hover:bg-white hover:text-black transition-colors flex items-center gap-1 shadow-sm"
                      title="Copy AI Prompt"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-text-muted" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onToggleFavorite(item.id)
                      }}
                      className={`p-1.5 rounded-md backdrop-blur-md border transition-colors ${
                        isFav
                          ? "bg-white text-black border-white"
                          : "bg-surface-raised/90 border-border-subtle text-text-muted hover:text-text-primary"
                      }`}
                      title={isFav ? "Saved" : "Save bookmark"}
                    >
                      <Bookmark className={`w-3 h-3 ${isFav ? "fill-current" : ""}`} />
                    </button>
                  </div>

                  {/* Bottom Stage Tag */}
                  <div className="absolute bottom-2 left-2 pointer-events-none">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-raised/80 backdrop-blur border border-border-subtle text-text-muted">
                      {item.tag}
                    </span>
                  </div>
                </div>

                {/* Footer Metadata */}
                <div className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-5 h-5 rounded-md bg-surface-raised border border-border-subtle flex items-center justify-center text-[10px] font-bold text-text-primary shrink-0">
                      {item.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs font-medium text-text-primary truncate group-hover:text-white transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-[11px] text-text-muted/70 font-mono truncate">
                        {item.author}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-text-muted/50 group-hover:text-text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
