import React, { useState, useRef, useEffect } from "react"
import {
  Search,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  LayoutGrid,
  List,
  Filter,
  Check,
  ChevronDown,
  RotateCcw
} from "lucide-react"

export interface FilterState {
  searchQuery: string
  category: string
  source: "All" | "elementraui" | "21st-local" | "awesome-components"
  author: string
  itemType: string
  motionEngine: string
  previewStatus: string
  hasExecutable: boolean
  hasHtmlSnapshot: boolean
  hasScreenshot: boolean
  hasPrompt: boolean
  sortBy: "recent" | "name" | "category" | "author"
  viewMode: "grid" | "list"
}

interface DiscoveryToolbarProps {
  filters: FilterState
  onUpdateFilters: (updates: Partial<FilterState>) => void
  onResetFilters: () => void
  totalCount: number
  filteredCount: number
  topAuthors: string[]
}

const CATEGORIES: { label: string; value: string }[] = [
  { label: "All Categories", value: "All" },
  { label: "Cards & Bento", value: "Cards & Bento" },
  { label: "Visual Effects", value: "Visual Effects" },
  { label: "Forms & Inputs", value: "Forms & Inputs" },
  { label: "Heroes & Landing", value: "Heroes & Landing" },
  { label: "Navigation & Menus", value: "Navigation & Menus" },
  { label: "Typography & Motion", value: "Typography & Motion" },
  { label: "Shaders & Canvas", value: "Shaders & Canvas" },
  { label: "3D & WebGL", value: "3D & WebGL" },
  { label: "Full Templates", value: "Full Templates" },
  { label: "AI Prompts", value: "AI Prompts" },
  { label: "Theme Presets", value: "Theme Presets" }
]

const ITEM_TYPES: { label: string; value: string }[] = [
  { label: "All Content Types", value: "All" },
  { label: "Components", value: "component" },
  { label: "Blocks & Sections", value: "block" },
  { label: "Templates", value: "template" },
  { label: "AI Prompts", value: "prompt" },
  { label: "Themes", value: "theme" }
]

const ENGINES = ["All", "Framer Motion", "Three.js", "GLSL", "CSS / Canvas", "None"]

export const DiscoveryToolbar: React.FC<DiscoveryToolbarProps> = ({
  filters,
  onUpdateFilters,
  onResetFilters,
  totalCount,
  filteredCount,
  topAuthors
}) => {
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false)
  const [searchInput, setSearchInput] = useState(filters.searchQuery)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Keep input in sync
  useEffect(() => {
    setSearchInput(filters.searchQuery)
  }, [filters.searchQuery])

  // Debounced query update
  useEffect(() => {
    const t = setTimeout(() => {
      if (searchInput !== filters.searchQuery) {
        onUpdateFilters({ searchQuery: searchInput })
      }
    }, 150)
    return () => clearTimeout(t)
  }, [searchInput, filters.searchQuery, onUpdateFilters])

  // Keyboard '/' shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Count active non-default filters
  const activeFilterCount = [
    filters.source !== "All",
    filters.author !== "All",
    filters.itemType !== "All",
    filters.motionEngine !== "All",
    filters.hasExecutable,
    filters.hasHtmlSnapshot,
    filters.hasScreenshot,
    filters.hasPrompt,
    filters.sortBy !== "recent"
  ].filter(Boolean).length

  return (
    <div className="border-b border-border-subtle bg-surface-subtle px-4 lg:px-6 py-3.5 flex flex-col gap-3">
      {/* Row 1: Command & Search Row + Controls */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Input Container */}
        <div className="flex items-center gap-2.5 flex-1 bg-surface-base px-3.5 py-2 rounded-xl border border-border-subtle shadow-inner focus-within:border-accent-violet-deep transition-all">
          <Search className="w-4 h-4 text-text-muted shrink-0" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search 6,700+ components, shaders, templates, prompts..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="bg-transparent text-text-primary font-body-md text-xs sm:text-sm outline-none flex-1 placeholder:text-text-muted select-all"
          />
          {searchInput ? (
            <button
              onClick={() => {
                setSearchInput("")
                onUpdateFilters({ searchQuery: "" })
              }}
              className="flex items-center justify-center w-5 h-5 rounded-full bg-surface-raised text-text-muted hover:text-text-primary transition-colors"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="px-1.5 py-0.5 rounded bg-surface-raised font-badge-label text-[10px] text-text-muted border border-border-subtle/60">
              /
            </span>
          )}
        </div>

        {/* Action Cluster: Sort, Filter Drawer Toggle & View Mode */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {/* Source Tabs */}
          <div className="hidden sm:flex items-center bg-surface-base border border-border-subtle rounded-lg p-0.5 font-code-inline text-xs">
            <button
              onClick={() => onUpdateFilters({ source: "All" })}
              className={`px-2.5 py-1 rounded transition-colors ${
                filters.source === "All"
                  ? "bg-surface-raised text-text-primary font-semibold shadow-sm"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              All Sources
            </button>
            <button
              onClick={() => onUpdateFilters({ source: "elementraui" })}
              className={`px-2.5 py-1 rounded transition-colors ${
                filters.source === "elementraui" || filters.source === "21st-local"
                  ? "bg-surface-raised text-primary font-semibold shadow-sm"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              Elementra Core (162)
            </button>
            <button
              onClick={() => onUpdateFilters({ source: "awesome-components" })}
              className={`px-2.5 py-1 rounded transition-colors ${
                filters.source === "awesome-components"
                  ? "bg-surface-raised text-primary font-semibold shadow-sm"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              Awesome (6,591)
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="relative flex items-center bg-surface-base border border-border-subtle rounded-lg px-2.5 py-1.5">
            <span className="font-metric-label text-[10px] text-text-muted uppercase mr-1 tracking-wider">
              Sort:
            </span>
            <select
              value={filters.sortBy}
              onChange={(e) => onUpdateFilters({ sortBy: e.target.value as any })}
              className="bg-transparent text-text-primary font-code-inline text-xs outline-none cursor-pointer pr-1 appearance-none"
            >
              <option value="recent" className="bg-surface-subtle text-text-primary">
                Recommended
              </option>
              <option value="name" className="bg-surface-subtle text-text-primary">
                Name (A-Z)
              </option>
              <option value="category" className="bg-surface-subtle text-text-primary">
                Category
              </option>
              <option value="author" className="bg-surface-subtle text-text-primary">
                Author
              </option>
            </select>
            <ArrowUpDown className="w-3 h-3 text-text-muted pointer-events-none" />
          </div>

          {/* Filter Popover Toggle */}
          <button
            onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
              isFilterDrawerOpen || activeFilterCount > 0
                ? "bg-accent-violet-deep text-white border-accent-violet-deep shadow-sm"
                : "bg-surface-base border-border-subtle text-text-muted hover:text-text-primary hover:bg-surface-raised"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="font-code-inline text-xs">Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-white text-accent-violet-deep font-bold text-[10px] flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
            <ChevronDown
              className={`w-3 h-3 transition-transform ${isFilterDrawerOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* Density Toggle (Grid vs Compact List) */}
          <div className="flex items-center bg-surface-base border border-border-subtle p-0.5 rounded-lg">
            <button
              onClick={() => onUpdateFilters({ viewMode: "grid" })}
              className={`p-1.5 rounded transition-colors ${
                filters.viewMode === "grid"
                  ? "bg-surface-raised text-primary shadow-sm"
                  : "text-text-muted hover:text-text-primary"
              }`}
              title="Comfortable Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onUpdateFilters({ viewMode: "list" })}
              className={`p-1.5 rounded transition-colors ${
                filters.viewMode === "list"
                  ? "bg-surface-raised text-primary shadow-sm"
                  : "text-text-muted hover:text-text-primary"
              }`}
              title="Compact List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Row 2: Type Filter Pills & Quick Category Navigation */}
      <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1 scrollbar-none">
        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 shrink-0">
          {CATEGORIES.map((cat) => {
            const isActive = filters.category === cat.value
            return (
              <button
                key={cat.value}
                onClick={() => onUpdateFilters({ category: cat.value })}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-accent-violet-deep text-white shadow-sm"
                    : "bg-surface-base border border-border-subtle/80 text-text-muted hover:text-text-primary hover:bg-surface-raised"
                }`}
              >
                {cat.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Row 3: Expandable Filter Drawer */}
      {isFilterDrawerOpen && (
        <div className="p-4 rounded-xl bg-surface-base border border-border-subtle shadow-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* 1. Source Repository */}
          <div className="space-y-1.5">
            <label className="font-metric-label text-[10px] text-text-muted uppercase tracking-wider block font-semibold">
              Source Repository
            </label>
            <select
              value={filters.source}
              onChange={(e) => onUpdateFilters({ source: e.target.value as any })}
              className="w-full px-3 py-2 rounded-lg bg-surface-subtle border border-border-subtle text-xs text-text-primary focus:outline-none focus:border-primary"
            >
              <option value="All">All Sources ({totalCount.toLocaleString()})</option>
              <option value="elementraui">Elementra Core (162)</option>
              <option value="awesome-components">Awesome Components (6,591)</option>
            </select>
          </div>

          {/* 2. Contributing Author */}
          <div className="space-y-1.5">
            <label className="font-metric-label text-[10px] text-text-muted uppercase tracking-wider block font-semibold">
              Author
            </label>
            <select
              value={filters.author}
              onChange={(e) => onUpdateFilters({ author: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-surface-subtle border border-border-subtle text-xs text-text-primary focus:outline-none focus:border-primary"
            >
              <option value="All">All Authors ({topAuthors.length})</option>
              {topAuthors.map((author) => (
                <option key={author} value={author}>
                  {author}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Content Type */}
          <div className="space-y-1.5">
            <label className="font-metric-label text-[10px] text-text-muted uppercase tracking-wider block font-semibold">
              Content Type
            </label>
            <select
              value={filters.itemType}
              onChange={(e) => onUpdateFilters({ itemType: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-surface-subtle border border-border-subtle text-xs text-text-primary focus:outline-none focus:border-primary"
            >
              {ITEM_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Motion / Runtime Engine */}
          <div className="space-y-1.5">
            <label className="font-metric-label text-[10px] text-text-muted uppercase tracking-wider block font-semibold">
              Motion Engine
            </label>
            <select
              value={filters.motionEngine}
              onChange={(e) => onUpdateFilters({ motionEngine: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-surface-subtle border border-border-subtle text-xs text-text-primary focus:outline-none focus:border-primary"
            >
              {ENGINES.map((eng) => (
                <option key={eng} value={eng}>
                  {eng}
                </option>
              ))}
            </select>
          </div>

          {/* 5. Capability Toggles Row */}
          <div className="sm:col-span-2 lg:col-span-4 pt-2 border-t border-border-subtle flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4 flex-wrap text-xs text-text-muted">
              <span className="font-metric-label text-[10px] uppercase text-text-muted">Require:</span>
              <label className="flex items-center gap-1.5 cursor-pointer text-text-primary hover:text-white">
                <input
                  type="checkbox"
                  checked={filters.hasExecutable}
                  onChange={(e) => onUpdateFilters({ hasExecutable: e.target.checked })}
                  className="rounded border-border-subtle text-accent-violet-deep focus:ring-0 accent-accent-violet-deep"
                />
                <span className="font-body-sm text-xs">Executable React</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-text-primary hover:text-white">
                <input
                  type="checkbox"
                  checked={filters.hasHtmlSnapshot}
                  onChange={(e) => onUpdateFilters({ hasHtmlSnapshot: e.target.checked })}
                  className="rounded border-border-subtle text-accent-violet-deep focus:ring-0 accent-accent-violet-deep"
                />
                <span className="font-body-sm text-xs">HTML Snapshot</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-text-primary hover:text-white">
                <input
                  type="checkbox"
                  checked={filters.hasScreenshot}
                  onChange={(e) => onUpdateFilters({ hasScreenshot: e.target.checked })}
                  className="rounded border-border-subtle text-accent-violet-deep focus:ring-0 accent-accent-violet-deep"
                />
                <span className="font-body-sm text-xs">Screenshot Available</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-text-primary hover:text-white">
                <input
                  type="checkbox"
                  checked={filters.hasPrompt}
                  onChange={(e) => onUpdateFilters({ hasPrompt: e.target.checked })}
                  className="rounded border-border-subtle text-accent-violet-deep focus:ring-0 accent-accent-violet-deep"
                />
                <span className="font-body-sm text-xs">AI Blueprint / Prompt</span>
              </label>
            </div>

            <button
              onClick={onResetFilters}
              className="text-xs font-code-inline text-primary hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset all filters
            </button>
          </div>
        </div>
      )}

      {/* Row 4: Active Constraint Chips & Status Count */}
      <div className="flex items-center justify-between gap-2 flex-wrap text-xs text-text-muted pt-0.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-metric-label text-[10px] text-text-muted uppercase">
            {filteredCount === totalCount ? (
              <span>Showing all {totalCount.toLocaleString()} components</span>
            ) : (
              <span>
                Found <strong className="text-primary font-bold">{filteredCount.toLocaleString()}</strong> of{" "}
                {totalCount.toLocaleString()} items
              </span>
            )}
          </span>

          {/* Active Chips */}
          {filters.searchQuery && (
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-surface-base border border-border-subtle text-text-primary font-code-inline text-[11px] shadow-sm">
              <span className="text-secondary font-semibold">query:</span>
              <span>"{filters.searchQuery}"</span>
              <button
                onClick={() => {
                  setSearchInput("")
                  onUpdateFilters({ searchQuery: "" })
                }}
                className="hover:text-terminal-rose transition-colors ml-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {filters.category !== "All" && (
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-surface-base border border-border-subtle text-text-primary font-code-inline text-[11px] shadow-sm">
              <span className="text-primary font-semibold">category:</span>
              <span>{filters.category}</span>
              <button
                onClick={() => onUpdateFilters({ category: "All" })}
                className="hover:text-terminal-rose transition-colors ml-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {filters.source !== "All" && (
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-surface-base border border-border-subtle text-text-primary font-code-inline text-[11px] shadow-sm">
              <span className="text-secondary font-semibold">source:</span>
              <span>{filters.source === "21st-local" ? "Core" : "Awesome"}</span>
              <button
                onClick={() => onUpdateFilters({ source: "All" })}
                className="hover:text-terminal-rose transition-colors ml-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {filters.author !== "All" && (
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-surface-base border border-border-subtle text-text-primary font-code-inline text-[11px] shadow-sm">
              <span className="text-terminal-emerald font-semibold">author:</span>
              <span>{filters.author}</span>
              <button
                onClick={() => onUpdateFilters({ author: "All" })}
                className="hover:text-terminal-rose transition-colors ml-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {filters.hasExecutable && (
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-surface-base border border-border-subtle text-text-primary font-code-inline text-[11px] shadow-sm">
              <span className="text-secondary font-semibold">type:</span>
              <span>Live Component</span>
              <button
                onClick={() => onUpdateFilters({ hasExecutable: false })}
                className="hover:text-terminal-rose transition-colors ml-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {activeFilterCount > 0 && (
            <button
              onClick={onResetFilters}
              className="text-[11px] text-primary hover:underline font-code-inline ml-1"
            >
              Clear all
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
