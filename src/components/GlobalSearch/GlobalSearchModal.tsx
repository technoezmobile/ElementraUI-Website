import React, { useState, useEffect, useMemo, useRef } from "react"
import { MarketplaceSection } from "../../types/marketplace"
import { CatalogueItem } from "../../types/catalogue"
import { verifiedThemesData } from "../../data/themesData"
import { verifiedTemplatesData } from "../../data/templatesData"
import { verifiedAppsData } from "../../data/appsData"
import { verifiedIconsData } from "../../data/iconsData"
import { verifiedVideoData } from "../../data/videoData"
import {
  Search,
  Layers,
  Palette,
  Layout,
  Cpu,
  Shapes,
  Film,
  Sparkles,
  ArrowRight,
  Command,
  X
} from "lucide-react"

export interface SearchResultItem {
  id: string
  title: string
  subtitle: string
  section: MarketplaceSection
  badge: string
  category: string
  originalItem?: any
}

interface GlobalSearchModalProps {
  isOpen: boolean
  onClose: () => void
  componentsCatalogue: CatalogueItem[]
  onSelectResult: (result: SearchResultItem) => void
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  componentsCatalogue,
  onSelectResult
}) => {
  const [query, setQuery] = useState("")
  const [activeSectionFilter, setActiveSectionFilter] = useState<string>("All")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      setQuery("")
    }
  }, [isOpen])

  // Multi-Section Search Aggregator
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []

    const results: SearchResultItem[] = []

    // 1. Components (match top 15 results to prevent lag)
    let compMatches = 0
    for (const item of componentsCatalogue) {
      if (compMatches >= 15) break
      if (
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.author.name.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q))
      ) {
        results.push({
          id: item.id,
          title: item.name,
          subtitle: item.description,
          section: "components",
          badge: item.sourceRepo === "awesome-components" ? "Community" : "Verified Core",
          category: item.category,
          originalItem: item
        })
        compMatches++
      }
    }

    // 2. Themes
    for (const theme of verifiedThemesData) {
      if (
        theme.name.toLowerCase().includes(q) ||
        theme.description.toLowerCase().includes(q) ||
        theme.designStyle.toLowerCase().includes(q) ||
        theme.tags.some((t) => t.toLowerCase().includes(q))
      ) {
        results.push({
          id: theme.id,
          title: theme.name,
          subtitle: theme.description,
          section: "themes",
          badge: theme.designStyle,
          category: theme.colorFamily
        })
      }
    }

    // 3. Templates
    for (const tmpl of verifiedTemplatesData) {
      if (
        tmpl.name.toLowerCase().includes(q) ||
        tmpl.description.toLowerCase().includes(q) ||
        tmpl.framework.toLowerCase().includes(q) ||
        tmpl.category.toLowerCase().includes(q)
      ) {
        results.push({
          id: tmpl.id,
          title: tmpl.name,
          subtitle: tmpl.description,
          section: "templates",
          badge: tmpl.framework,
          category: tmpl.category
        })
      }
    }

    // 4. Apps
    for (const app of verifiedAppsData) {
      if (
        app.name.toLowerCase().includes(q) ||
        app.description.toLowerCase().includes(q) ||
        app.category.toLowerCase().includes(q)
      ) {
        results.push({
          id: app.id,
          title: app.name,
          subtitle: app.description,
          section: "apps",
          badge: app.appType,
          category: app.category
        })
      }
    }

    // 5. Icons
    for (const icon of verifiedIconsData) {
      if (icon.name.toLowerCase().includes(q) || icon.keywords.some((t: string) => t.toLowerCase().includes(q))) {
        results.push({
          id: icon.id,
          title: icon.name,
          subtitle: `${icon.family} SVG Icon • ${icon.keywords.join(", ")}`,
          section: "icons",
          badge: icon.family,
          category: icon.category
        })
      }
    }

    // 6. Video & Motion
    for (const vid of verifiedVideoData) {
      if (
        vid.name.toLowerCase().includes(q) ||
        vid.description.toLowerCase().includes(q) ||
        vid.motionEngine.toLowerCase().includes(q)
      ) {
        results.push({
          id: vid.id,
          title: vid.name,
          subtitle: vid.description,
          section: "video",
          badge: vid.motionEngine,
          category: vid.category
        })
      }
    }

    return results
  }, [query, componentsCatalogue])

  const filteredResults = useMemo(() => {
    if (activeSectionFilter === "All") return searchResults
    return searchResults.filter((r) => r.section === activeSectionFilter)
  }, [searchResults, activeSectionFilter])

  const sectionCounts = useMemo(() => {
    const counts: Record<string, number> = { All: searchResults.length }
    searchResults.forEach((r) => {
      counts[r.section] = (counts[r.section] || 0) + 1
    })
    return counts
  }, [searchResults])

  if (!isOpen) return null

  const getSectionIcon = (sec: MarketplaceSection) => {
    switch (sec) {
      case "components":
        return <Layers className="w-3.5 h-3.5 text-primary" />
      case "themes":
        return <Palette className="w-3.5 h-3.5 text-secondary" />
      case "templates":
        return <Layout className="w-3.5 h-3.5 text-secondary" />
      case "apps":
        return <Cpu className="w-3.5 h-3.5 text-terminal-emerald" />
      case "icons":
        return <Shapes className="w-3.5 h-3.5 text-terminal-amber" />
      case "video":
        return <Film className="w-3.5 h-3.5 text-terminal-rose" />
      case "bookmarks":
      default:
        return <Sparkles className="w-3.5 h-3.5 text-primary" />
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/85 backdrop-blur-xl p-4 pt-16 sm:pt-24 animate-in fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-surface-base border border-border-subtle rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-border-subtle flex items-center gap-3 bg-surface-subtle">
          <Search className="w-5 h-5 text-primary shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search all 7 hubs: components, themes, templates, apps, icons, video..."
            className="w-full bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none font-body-md"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-text-muted hover:text-text-primary"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <div className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded bg-surface-raised border border-border-subtle font-badge-label text-[10px] text-text-muted">
            <span>ESC</span>
          </div>
        </div>

        {/* Section Pills */}
        {query && searchResults.length > 0 && (
          <div className="px-4 py-2 border-b border-border-subtle bg-surface-subtle/50 flex items-center gap-1.5 overflow-x-auto font-code-inline text-[11px] scrollbar-none">
            {["All", "components", "themes", "templates", "apps", "icons", "video"].map((sec) => {
              const count = sectionCounts[sec] || 0
              if (sec !== "All" && count === 0) return null

              return (
                <button
                  key={sec}
                  onClick={() => setActiveSectionFilter(sec)}
                  className={`px-2.5 py-1 rounded-lg capitalize transition-colors flex items-center gap-1.5 ${
                    activeSectionFilter === sec
                      ? "bg-accent-violet-deep text-white font-semibold shadow-sm"
                      : "text-text-muted hover:text-text-primary bg-surface-base border border-border-subtle"
                  }`}
                >
                  <span>{sec}</span>
                  <span className="opacity-75 font-badge-label">({count})</span>
                </button>
              )
            })}
          </div>
        )}

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {!query ? (
            <div className="p-8 text-center space-y-3">
              <div className="w-10 h-10 rounded-xl bg-surface-raised border border-border-subtle flex items-center justify-center text-primary mx-auto shadow-sm">
                <Command className="w-5 h-5 text-primary" />
              </div>
              <p className="font-body-sm text-xs text-text-muted">
                Type anything to search across all components, themes, templates, tools, and icons.
              </p>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <p className="font-headline-sm text-sm font-semibold text-text-primary">
                No matching assets found for "{query}"
              </p>
              <p className="font-body-sm text-xs text-text-muted">
                Try searching for keywords like "button", "landing", "neon", or "kanban".
              </p>
            </div>
          ) : (
            filteredResults.map((result) => (
              <div
                key={`${result.section}-${result.id}`}
                onClick={() => {
                  onSelectResult(result)
                  onClose()
                }}
                className="p-3 rounded-xl hover:bg-surface-raised transition-colors cursor-pointer flex items-center justify-between group gap-3 border border-transparent hover:border-border-subtle"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-lg bg-surface-base border border-border-subtle flex items-center justify-center shrink-0">
                    {getSectionIcon(result.section)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-headline-sm text-xs font-semibold text-text-primary group-hover:text-primary transition-colors truncate">
                        {result.title}
                      </span>
                      <span className="font-badge-label text-[9px] px-1.5 py-0.2 rounded bg-surface-base border border-border-subtle text-text-muted">
                        {result.badge}
                      </span>
                    </div>
                    <p className="font-body-sm text-[11px] text-text-muted truncate mt-0.5">
                      {result.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-code-inline text-[10px] text-primary capitalize hidden sm:inline">
                    {result.section}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border-subtle bg-surface-subtle font-metric-label text-[10px] text-text-muted flex items-center justify-between">
          <span>Search indexes 6,800+ design engineering assets</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  )
}
