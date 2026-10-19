import React, { useState, useMemo } from "react"
import { ThemeItem } from "../../types/marketplace"
import { verifiedThemesData } from "../../data/themesData"
import {
  Palette,
  Search,
  Copy,
  Check,
  Wand2,
  Bookmark,
  ExternalLink,
  Sun,
  Moon,
  Layers,
  Sparkles,
  Terminal,
  Code2
} from "lucide-react"

interface ThemesSectionProps {
  onApplyThemeToBuilder: (theme: ThemeItem) => void
  onToggleBookmark: (id: string, theme: ThemeItem) => void
  isBookmarked: (id: string) => boolean
}

export const ThemesSection: React.FC<ThemesSectionProps> = ({
  onApplyThemeToBuilder,
  onToggleBookmark,
  isBookmarked
}) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFamily, setSelectedFamily] = useState<string>("All")
  const [selectedStyle, setSelectedStyle] = useState<string>("All")
  const [selectedTheme, setSelectedTheme] = useState<ThemeItem | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [exportFormat, setExportFormat] = useState<"css" | "json" | "tailwind">("css")
  const [appliedToast, setAppliedToast] = useState<string | null>(null)

  const families = ["All", "neutral", "cyber", "warm", "cool", "dark"]
  const styles = ["All", "Minimal", "Cyberpunk", "Glassmorphic", "Corporate"]

  const filteredThemes = useMemo(() => {
    return verifiedThemesData.filter((theme) => {
      if (selectedFamily !== "All" && theme.colorFamily !== selectedFamily) return false
      if (selectedStyle !== "All" && theme.designStyle !== selectedStyle) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        return (
          theme.name.toLowerCase().includes(q) ||
          theme.description.toLowerCase().includes(q) ||
          theme.tags.some((t) => t.toLowerCase().includes(q))
        )
      }
      return true
    })
  }, [searchQuery, selectedFamily, selectedStyle])

  const copyTokens = (theme: ThemeItem) => {
    if (exportFormat === "json") {
      navigator.clipboard.writeText(JSON.stringify(theme.tokens, null, 2))
    } else if (exportFormat === "tailwind") {
      navigator.clipboard.writeText(`@theme {\n  --color-primary: ${theme.tokens.dark.primary};\n  --color-background: ${theme.tokens.dark.background};\n  --color-card: ${theme.tokens.dark.card};\n  --color-border: ${theme.tokens.dark.border};\n}`)
    } else {
      navigator.clipboard.writeText(theme.cssVariables)
    }
    setCopiedId(theme.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleApply = (theme: ThemeItem) => {
    onApplyThemeToBuilder(theme)
    setAppliedToast(`Applied "${theme.name}" tokens to Website Builder`)
    setTimeout(() => setAppliedToast(null), 3000)
  }

  return (
    <div className="flex-1 flex flex-col p-4 lg:p-6 space-y-6 bg-surface-base">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-subtle">
        <div>
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" />
            <h2 className="font-headline-lg text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
              Design Systems & Themes
            </h2>
          </div>
          <p className="font-body-sm text-xs text-text-muted mt-1 leading-relaxed">
            Curated, WCAG-tested color tokens with complete CSS variables, shadcn mappings, and live UI preview.
          </p>
        </div>

        {appliedToast && (
          <div className="px-3.5 py-1.5 rounded-lg bg-surface-raised border border-primary/30 text-primary text-xs font-code-inline flex items-center gap-2 shadow-lg animate-in fade-in">
            <Check className="w-4 h-4 text-terminal-emerald" />
            <span>{appliedToast}</span>
          </div>
        )}
      </div>

      {/* Filter, Search & Export Format Row */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-surface-subtle border border-border-subtle p-3 rounded-xl">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search themes, tokens, palettes..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-surface-base border border-border-subtle text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-violet-deep"
          />
        </div>

        {/* Format Selector & Family Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-surface-base p-1 rounded-lg border border-border-subtle font-code-inline text-xs">
            <span className="font-metric-label text-[10px] text-text-muted px-2 uppercase">Family:</span>
            {families.map((fam) => (
              <button
                key={fam}
                onClick={() => setSelectedFamily(fam)}
                className={`px-2 py-0.5 rounded capitalize transition-colors ${
                  selectedFamily === fam
                    ? "bg-accent-violet-deep text-white font-semibold shadow-sm"
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                {fam}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-surface-base p-1 rounded-lg border border-border-subtle font-code-inline text-xs">
            <span className="font-metric-label text-[10px] text-text-muted px-2 uppercase">Format:</span>
            <button
              onClick={() => setExportFormat("css")}
              className={`px-2 py-0.5 rounded transition-colors ${
                exportFormat === "css"
                  ? "bg-surface-raised text-primary font-semibold"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              CSS
            </button>
            <button
              onClick={() => setExportFormat("json")}
              className={`px-2 py-0.5 rounded transition-colors ${
                exportFormat === "json"
                  ? "bg-surface-raised text-primary font-semibold"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              JSON
            </button>
            <button
              onClick={() => setExportFormat("tailwind")}
              className={`px-2 py-0.5 rounded transition-colors ${
                exportFormat === "tailwind"
                  ? "bg-surface-raised text-primary font-semibold"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              Tailwind v4
            </button>
          </div>
        </div>
      </div>

      {/* Themes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredThemes.map((theme) => {
          const isSaved = isBookmarked(theme.id)
          const darkTokens = theme.tokens.dark

          return (
            <div
              key={theme.id}
              className="rounded-xl border border-border-subtle bg-surface-subtle hover:border-primary/50 hover:shadow-xl card-halo-hover transition-all p-5 flex flex-col justify-between gap-4 group"
            >
              <div>
                {/* Header info */}
                <div className="flex items-center justify-between mb-2">
                  <span className="font-badge-label text-[10px] uppercase px-2 py-0.5 rounded bg-surface-base border border-border-subtle text-primary font-semibold">
                    {theme.designStyle}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onToggleBookmark(theme.id, theme)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isSaved
                          ? "bg-accent-violet-deep text-white border-accent-violet-deep shadow-sm"
                          : "bg-surface-base border-border-subtle text-text-muted hover:text-terminal-rose"
                      }`}
                      title={isSaved ? "Saved in Bookmarks" : "Save Theme"}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-white" : ""}`} />
                    </button>
                    <button
                      onClick={() => setSelectedTheme(theme)}
                      className="p-1.5 rounded-lg bg-surface-base border border-border-subtle text-text-muted hover:text-text-primary hover:bg-surface-raised"
                      title="Inspect Theme Details"
                    >
                      <Code2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="font-headline-sm text-base font-bold text-text-primary group-hover:text-primary transition-colors">
                  {theme.name}
                </h3>
                <p className="font-body-sm text-xs text-text-muted line-clamp-2 mt-1 leading-relaxed">
                  {theme.description}
                </p>

                {/* Semantic Palette Swatches */}
                <div className="mt-4 flex flex-col gap-1.5">
                  <span className="font-metric-label text-[10px] text-text-muted uppercase tracking-wider">
                    Semantic Color Tokens
                  </span>
                  <div className="grid grid-cols-5 gap-1.5">
                    <div className="flex flex-col gap-1">
                      <div
                        style={{ backgroundColor: darkTokens.primary }}
                        className="h-8 rounded shadow-sm border border-border-subtle/50 flex items-end p-1"
                      >
                        <span className="font-metric-label text-[8px] text-white">Pri</span>
                      </div>
                      <span className="font-code-inline text-[9px] text-text-muted truncate">
                        {darkTokens.primary}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <div
                        style={{ backgroundColor: darkTokens.card }}
                        className="h-8 rounded shadow-sm border border-border-subtle/50 flex items-end p-1"
                      >
                        <span className="font-metric-label text-[8px] text-text-muted">Crd</span>
                      </div>
                      <span className="font-code-inline text-[9px] text-text-muted truncate">
                        {darkTokens.card}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <div
                        style={{ backgroundColor: darkTokens.accent }}
                        className="h-8 rounded shadow-sm border border-border-subtle/50 flex items-end p-1"
                      >
                        <span className="font-metric-label text-[8px] text-white">Acc</span>
                      </div>
                      <span className="font-code-inline text-[9px] text-text-muted truncate">
                        {darkTokens.accent}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <div
                        style={{ backgroundColor: darkTokens.border }}
                        className="h-8 rounded shadow-sm border border-border-subtle/50 flex items-end p-1"
                      >
                        <span className="font-metric-label text-[8px] text-text-muted">Bdr</span>
                      </div>
                      <span className="font-code-inline text-[9px] text-text-muted truncate">
                        {darkTokens.border}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <div
                        style={{ backgroundColor: darkTokens.foreground }}
                        className="h-8 rounded shadow-sm border border-border-subtle/50 flex items-end p-1"
                      >
                        <span className="font-metric-label text-[8px] text-surface-base font-bold">Txt</span>
                      </div>
                      <span className="font-code-inline text-[9px] text-text-muted truncate">
                        {darkTokens.foreground}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Typography Specimen Spec */}
                <div className="mt-4 p-2.5 rounded-lg bg-surface-base border border-border-subtle flex flex-col gap-1">
                  <div className="flex items-center justify-between font-metric-label text-[9px] text-text-muted uppercase">
                    <span>Typography Pairing</span>
                    <span className="text-primary font-medium">{theme.tokens.fontSans} + {theme.tokens.fontMono}</span>
                  </div>
                  <span className="font-headline-sm text-xs text-text-primary tracking-tight">
                    The quick brown fox jumps over code
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-border-subtle flex items-center justify-between gap-2">
                <button
                  onClick={() => copyTokens(theme)}
                  className="px-3 py-1.5 rounded-lg bg-surface-base hover:bg-surface-raised border border-border-subtle text-text-primary font-code-inline text-xs flex items-center gap-1.5 transition-colors"
                >
                  {copiedId === theme.id ? (
                    <Check className="w-3.5 h-3.5 text-terminal-emerald" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedId === theme.id ? "Copied!" : "Copy Tokens"}</span>
                </button>

                <button
                  onClick={() => handleApply(theme)}
                  className="px-3 py-1.5 rounded-lg bg-accent-violet-deep hover:bg-accent-violet-deep/90 text-white font-headline-sm text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Apply to Builder</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Detail Inspection Modal */}
      {selectedTheme && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in"
          onClick={() => setSelectedTheme(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-surface-base border border-border-subtle rounded-2xl p-6 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-hidden"
          >
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <div>
                <h3 className="font-headline-sm text-lg font-bold text-text-primary">
                  {selectedTheme.name} Tokens
                </h3>
                <span className="font-metric-label text-xs text-text-muted">
                  {selectedTheme.colorFamily} • {selectedTheme.designStyle}
                </span>
              </div>
              <button
                onClick={() => setSelectedTheme(null)}
                className="p-1.5 rounded-lg bg-surface-raised hover:bg-surface-container border border-border-subtle text-text-muted hover:text-text-primary"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-auto flex flex-col gap-3">
              <span className="font-metric-label text-xs text-text-muted uppercase">CSS Variables Definition</span>
              <pre className="p-3.5 rounded-xl bg-surface-subtle border border-border-subtle font-code-block text-xs text-text-primary overflow-auto">
                <code>{selectedTheme.cssVariables}</code>
              </pre>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border-subtle">
              <button
                onClick={() => copyTokens(selectedTheme)}
                className="px-4 py-2 rounded-lg bg-surface-raised border border-border-subtle text-text-primary font-code-inline text-xs flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Definition</span>
              </button>
              <button
                onClick={() => {
                  handleApply(selectedTheme)
                  setSelectedTheme(null)
                }}
                className="px-4 py-2 rounded-lg bg-accent-violet-deep text-white font-headline-sm text-xs flex items-center gap-1.5"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Apply to Builder</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
