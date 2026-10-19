import React, { useState } from "react"
import { CatalogueItem, getHonestPreviewKind } from "../types/catalogue"
import {
  Bookmark,
  Layers,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Code2,
  Copy,
  Check,
  FileCode,
  Image as ImageIcon
} from "lucide-react"
import { resolveAssetUrl } from "../utils/assetUrl"

interface CatalogueGridProps {
  items: CatalogueItem[]
  currentPage: number
  pageSize: number
  totalPages: number
  totalCount: number
  viewMode: "grid" | "list"
  onSelectPage: (page: number) => void
  onSelectPageSize: (size: number) => void
  onOpenItem: (item: CatalogueItem) => void
  favorites: string[]
  onToggleFavorite: (id: string) => void
  onResetFilters: () => void
}

export const CatalogueGrid: React.FC<CatalogueGridProps> = ({
  items,
  currentPage,
  pageSize,
  totalPages,
  totalCount,
  viewMode,
  onSelectPage,
  onSelectPageSize,
  onOpenItem,
  favorites,
  onToggleFavorite,
  onResetFilters
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopyPrompt = (e: React.MouseEvent, item: CatalogueItem) => {
    e.stopPropagation()
    const promptText =
      item.promptData?.promptText ||
      `Create a modern React component named "${item.name}" styled with Tailwind CSS. ${item.description || ""}`
    navigator.clipboard.writeText(promptText)
    setCopiedId(item.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-surface-subtle border border-border-subtle flex items-center justify-center text-text-muted">
          <Layers className="w-6 h-6 text-text-muted" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base text-text-primary font-medium">
            No matching components found
          </h3>
          <p className="text-xs text-text-muted max-w-sm mx-auto leading-relaxed">
            Try adjusting your search query, or clear your category and source filters.
          </p>
        </div>
        <button
          onClick={onResetFilters}
          className="px-4 py-2 rounded-lg bg-white text-black font-medium text-xs hover:bg-neutral-200 transition-colors cursor-pointer"
        >
          Reset all filters
        </button>
      </div>
    )
  }

  const getBadgeInfo = (kind: string) => {
    switch (kind) {
      case "executable-verified":
        return { label: "React", dot: "bg-emerald-400", text: "text-emerald-400" }
      case "html-snapshot":
        return { label: "HTML Snapshot", dot: "bg-blue-400", text: "text-blue-400" }
      case "screenshot-reference":
        return { label: "Screenshot", dot: "bg-purple-400", text: "text-purple-400" }
      case "prompt-blueprint":
        return { label: "Prompt", dot: "bg-amber-400", text: "text-amber-400" }
      default:
        return { label: "Reference", dot: "bg-neutral-400", text: "text-neutral-400" }
    }
  }

  return (
    <div className="flex-1 flex flex-col justify-between p-4 lg:p-6 space-y-8">
      {/* Items Container */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-5">
          {items.map((item) => {
            const isFav = favorites.includes(item.id)
            const kind = getHonestPreviewKind(item)
            const badge = getBadgeInfo(kind)

            return (
              <div
                key={item.id}
                data-testid="catalogue-card"
                onClick={() => onOpenItem(item)}
                className="group relative rounded-xl border border-border-subtle bg-surface-subtle hover:border-neutral-600 transition-all duration-200 flex flex-col justify-between cursor-pointer overflow-hidden"
              >
                {/* 1. Large Visual Preview Canvas (Aspect 4/3 component canvas) */}
                <div className="relative aspect-[4/3] w-full bg-[#0c0c0e] border-b border-border-subtle overflow-hidden flex items-center justify-center select-none">
                  {item.awesomeData?.screenshotUrl ? (
                    <img
                      src={resolveAssetUrl(item.awesomeData.screenshotUrl)}
                      alt={item.name}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = "none"
                      }}
                      className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  ) : item.itemType === "shader" || item.itemType === "webgl-3d" ? (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-radial from-neutral-900 to-[#0c0c0e]">
                      <div className="w-10 h-10 rounded-xl bg-surface-raised border border-border-subtle flex items-center justify-center text-text-primary mb-2 group-hover:scale-105 transition-transform">
                        <Sparkles className="w-5 h-5 text-amber-300" />
                      </div>
                      <span className="text-xs font-medium text-text-primary line-clamp-1">
                        {item.name}
                      </span>
                      <span className="text-[10px] font-mono text-text-muted mt-1">
                        Shader / WebGL
                      </span>
                    </div>
                  ) : item.itemType === "prompt" || item.promptData ? (
                    <div className="w-full h-full p-4 flex flex-col justify-between bg-[#0e0e12] font-mono text-[11px] text-text-muted">
                      <div className="flex items-center justify-between border-b border-border-subtle/60 pb-1.5 text-[10px]">
                        <span className="text-amber-400">AI Prompt Blueprint</span>
                        <span>{item.promptData?.framework || "React"}</span>
                      </div>
                      <p className="line-clamp-4 text-text-primary/80 text-[11px] leading-relaxed">
                        {item.promptData?.promptText || item.description}
                      </p>
                      <span className="text-[10px] text-text-muted/60">Click to inspect prompt</span>
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-surface-subtle">
                      <div className="w-10 h-10 rounded-xl bg-surface-base border border-border-subtle flex items-center justify-center text-text-muted mb-2 group-hover:scale-105 transition-transform">
                        <Code2 className="w-5 h-5 text-text-primary" />
                      </div>
                      <span className="text-xs font-medium text-text-primary line-clamp-1">
                        {item.name}
                      </span>
                      <span className="text-[10px] font-mono text-text-muted mt-1">
                        {item.category}
                      </span>
                    </div>
                  )}

                  {/* Top-Right Quick Action Hover Pills (Hover Action Controls) */}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <button
                      onClick={(e) => handleCopyPrompt(e, item)}
                      className="px-2 py-1 rounded-md bg-neutral-900/90 backdrop-blur-md border border-neutral-700 text-[11px] font-medium text-text-primary hover:bg-white hover:text-black transition-colors flex items-center gap-1 shadow-sm"
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
                          <span>Prompt</span>
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
                          : "bg-neutral-900/90 border-neutral-700 text-text-muted hover:text-white"
                      }`}
                      title={isFav ? "Saved in bookmarks" : "Save bookmark"}
                    >
                      <Bookmark className={`w-3 h-3 ${isFav ? "fill-current" : ""}`} />
                    </button>
                  </div>

                  {/* Top-Left Resource Type Pill */}
                  <div className="absolute top-2.5 left-2.5 pointer-events-none">
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900/85 backdrop-blur-md border border-neutral-700/80 text-text-muted">
                      <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                      <span>{badge.label}</span>
                    </span>
                  </div>
                </div>

                {/* 2. Card Footer: Author Attribution + Component Title */}
                <div className="p-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Author Avatar / Initial */}
                    <div className="w-6 h-6 rounded-md bg-surface-raised border border-border-subtle flex items-center justify-center text-[10px] font-medium text-text-primary shrink-0 uppercase">
                      {item.author.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs font-medium text-text-primary truncate group-hover:text-white transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-[11px] text-text-muted/70 truncate">
                        @{item.author.name.replace(/\s+/g, "_").toLowerCase()}
                      </p>
                    </div>
                  </div>

                  {/* Category Chip */}
                  <span className="text-[10px] font-mono text-text-muted/60 shrink-0 hidden sm:inline-block">
                    {item.category}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* Compact List View */
        <div className="rounded-xl border border-border-subtle bg-surface-subtle overflow-hidden divide-y divide-border-subtle">
          {items.map((item) => {
            const isFav = favorites.includes(item.id)
            const kind = getHonestPreviewKind(item)
            const badge = getBadgeInfo(kind)

            return (
              <div
                key={item.id}
                data-testid="catalogue-card"
                onClick={() => onOpenItem(item)}
                className="group flex items-center justify-between p-3 hover:bg-surface-raised transition-colors cursor-pointer gap-4"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-[#0c0c0e] border border-border-subtle overflow-hidden shrink-0 flex items-center justify-center">
                    {item.awesomeData?.screenshotUrl ? (
                      <img
                        src={resolveAssetUrl(item.awesomeData.screenshotUrl)}
                        alt={item.name}
                        onError={(e) => {
                          e.currentTarget.style.display = "none"
                        }}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Layers className="w-4 h-4 text-text-muted" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-xs font-medium text-text-primary group-hover:text-white transition-colors truncate">
                        {item.name}
                      </h3>
                      <span className="inline-flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.2 rounded border border-border-subtle text-text-muted">
                        <span className={`w-1 h-1 rounded-full ${badge.dot}`} />
                        <span>{badge.label}</span>
                      </span>
                    </div>
                    <p className="text-[11px] text-text-muted truncate max-w-xl">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 text-xs text-text-muted">
                  <span className="hidden md:inline font-mono text-[11px] text-text-muted/70">
                    {item.category}
                  </span>
                  <span className="hidden sm:inline font-mono text-[11px]">
                    @{item.author.name.replace(/\s+/g, "_").toLowerCase()}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleFavorite(item.id)
                    }}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      isFav
                        ? "bg-white text-black border-white"
                        : "bg-surface-base border-border-subtle text-text-muted hover:text-white"
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isFav ? "fill-current" : ""}`} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border-subtle font-mono text-xs text-text-muted">
          <div className="flex items-center gap-2">
            <span>
              Showing {Math.min((currentPage - 1) * pageSize + 1, totalCount)}–
              {Math.min(currentPage * pageSize, totalCount)} of {totalCount.toLocaleString()} items
            </span>
            <span className="text-border-subtle">•</span>
            <div className="flex items-center gap-1.5">
              <span>Per page:</span>
              <select
                value={pageSize}
                onChange={(e) => onSelectPageSize(parseInt(e.target.value, 10))}
                className="bg-surface-base border border-border-subtle rounded px-2 py-0.5 text-text-primary focus:outline-none cursor-pointer"
              >
                <option value={24}>24</option>
                <option value={48}>48</option>
                <option value={96}>96</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onSelectPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg bg-surface-base hover:bg-surface-raised border border-border-subtle text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page number buttons */}
            <div className="flex items-center gap-1 px-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let p = i + 1
                if (totalPages > 5 && currentPage > 3) {
                  p = Math.min(currentPage - 2 + i, totalPages)
                }
                return (
                  <button
                    key={p}
                    onClick={() => onSelectPage(p)}
                    className={`w-7 h-7 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                      currentPage === p
                        ? "bg-white text-black font-semibold"
                        : "bg-surface-base hover:bg-surface-raised border border-border-subtle text-text-muted"
                    }`}
                  >
                    {p}
                  </button>
                )
              })}
            </div>

            <button
              onClick={() => onSelectPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg bg-surface-base hover:bg-surface-raised border border-border-subtle text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
