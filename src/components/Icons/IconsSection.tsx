import React, { useState, useMemo } from "react"
import { IconItem } from "../../types/marketplace"
import { verifiedIconsData } from "../../data/iconsData"
import {
  Shapes,
  Search,
  Copy,
  Check,
  Download,
  Wand2,
  Bookmark,
  Sun,
  Moon,
  Sliders,
  Sparkles
} from "lucide-react"

interface IconsSectionProps {
  onInsertIntoBuilder: (iconSvg: string, iconName: string) => void
  onToggleBookmark: (id: string, item: IconItem) => void
  isBookmarked: (id: string) => boolean
}

export const IconsSection: React.FC<IconsSectionProps> = ({
  onInsertIntoBuilder,
  onToggleBookmark,
  isBookmarked
}) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [iconSize, setIconSize] = useState<number>(24)
  const [strokeWidth, setStrokeWidth] = useState<number>(2)
  const [backgroundTheme, setBackgroundTheme] = useState<"dark" | "light">("dark")
  const [selectedIcon, setSelectedIcon] = useState<IconItem | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const categories = ["All", "Navigation", "Interface", "Development", "Media", "Actions", "Arrows"]

  const filteredIcons = useMemo(() => {
    return verifiedIconsData.filter((icon) => {
      if (selectedCategory !== "All" && icon.category !== selectedCategory) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        return (
          icon.name.toLowerCase().includes(q) ||
          icon.slug.toLowerCase().includes(q) ||
          icon.keywords.some((k) => k.toLowerCase().includes(q))
        )
      }
      return true
    })
  }, [searchQuery, selectedCategory])

  const copySvg = (icon: IconItem) => {
    const svgCode = `<svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="${icon.viewBox}" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${icon.svgPath}</svg>`
    navigator.clipboard.writeText(svgCode)
    setCopiedId(icon.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const copyReact = (icon: IconItem) => {
    const reactCode = `import React from "react";\n\nexport const ${icon.name.replace(/\s+/g, "")}Icon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (\n  <svg xmlns="http://www.w3.org/2000/svg" width={${iconSize}} height={${iconSize}} viewBox="${icon.viewBox}" fill="none" stroke="currentColor" strokeWidth={${strokeWidth}} strokeLinecap="round" strokeLinejoin="round" {...props}>\n    ${icon.svgPath}\n  </svg>\n);`
    navigator.clipboard.writeText(reactCode)
    setCopiedId(`${icon.id}-react`)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const downloadSvg = (icon: IconItem) => {
    const svgCode = `<svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="${icon.viewBox}" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${icon.svgPath}</svg>`
    const blob = new Blob([svgCode], { type: "image/svg+xml" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${icon.slug}.svg`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex-1 flex flex-col p-4 lg:p-6 space-y-6 bg-surface-base">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-subtle">
        <div>
          <div className="flex items-center gap-2">
            <Shapes className="w-5 h-5 text-primary" />
            <h2 className="font-headline-lg text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
              Icon Discovery & Vector Workspace
            </h2>
          </div>
          <p className="font-body-sm text-xs text-text-muted mt-1 leading-relaxed">
            Searchable, accessible SVG vector icons with real-time size scaling, stroke controls, and multi-format exports.
          </p>
        </div>
      </div>

      {/* Control & Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-surface-subtle border border-border-subtle p-3 rounded-xl">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, meaning..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-surface-base border border-border-subtle text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-violet-deep font-body-md"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-accent-violet-deep text-white shadow-sm font-semibold"
                  : "bg-surface-base border border-border-subtle text-text-muted hover:text-text-primary hover:bg-surface-raised"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Size, Stroke & Background controls */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end border-t md:border-t-0 pt-2 md:pt-0 border-slate-800">
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
            <span>Size:</span>
            <input
              type="range"
              min={16}
              max={48}
              value={iconSize}
              onChange={(e) => setIconSize(Number(e.target.value))}
              className="w-16 h-1.5 accent-cyan-400 cursor-pointer"
            />
            <span className="w-6 text-[10px]">{iconSize}px</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
            <span>Stroke:</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.5}
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(Number(e.target.value))}
              className="w-14 h-1.5 accent-cyan-400 cursor-pointer"
            />
            <span className="w-4 text-[10px]">{strokeWidth}</span>
          </div>

          <button
            onClick={() => setBackgroundTheme(backgroundTheme === "dark" ? "light" : "dark")}
            className="p-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
            title="Toggle background preview"
          >
            {backgroundTheme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Dense Icons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {filteredIcons.map((icon) => {
          const isSaved = isBookmarked(icon.id)

          return (
            <div
              key={icon.id}
              onClick={() => setSelectedIcon(icon)}
              className={`rounded-2xl border transition-all p-3.5 flex flex-col justify-between items-center cursor-pointer group text-center ${
                backgroundTheme === "dark"
                  ? "bg-slate-950/70 border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900/80"
                  : "bg-white border-slate-200 text-slate-900 hover:border-cyan-600 shadow-sm"
              }`}
            >
              <div className="w-full flex items-center justify-between">
                <span className="text-[9px] font-mono uppercase text-slate-500">{icon.family}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleBookmark(icon.id, icon)
                  }}
                  className={`p-1 rounded-md transition-colors ${
                    isSaved ? "text-rose-400" : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  <Bookmark className={`w-3 h-3 ${isSaved ? "fill-rose-400" : ""}`} />
                </button>
              </div>

              {/* Real SVG rendering */}
              <div className="py-4 flex items-center justify-center transition-transform group-hover:scale-110 duration-150">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={iconSize}
                  height={iconSize}
                  viewBox={icon.viewBox}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={backgroundTheme === "dark" ? "text-slate-200" : "text-slate-900"}
                  dangerouslySetInnerHTML={{ __html: icon.svgPath }}
                />
              </div>

              <div className="w-full truncate">
                <span className="text-xs font-semibold block truncate">{icon.name}</span>
                <span className="text-[10px] text-slate-500 truncate block mt-0.5">{icon.category}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Icon Detail Modal */}
      {selectedIcon && (
        <IconDetailModal
          icon={selectedIcon}
          iconSize={iconSize}
          strokeWidth={strokeWidth}
          backgroundTheme={backgroundTheme}
          onClose={() => setSelectedIcon(null)}
          onCopySvg={() => copySvg(selectedIcon)}
          onCopyReact={() => copyReact(selectedIcon)}
          onDownloadSvg={() => downloadSvg(selectedIcon)}
          onInsertIntoBuilder={() => {
            const svgCode = `<svg xmlns="http://www.w3.org/2000/svg" width="${iconSize}" height="${iconSize}" viewBox="${selectedIcon.viewBox}" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${selectedIcon.svgPath}</svg>`
            onInsertIntoBuilder(svgCode, selectedIcon.name)
            setSelectedIcon(null)
          }}
          isCopiedSvg={copiedId === selectedIcon.id}
          isCopiedReact={copiedId === `${selectedIcon.id}-react`}
        />
      )}
    </div>
  )
}

interface IconDetailModalProps {
  icon: IconItem
  iconSize: number
  strokeWidth: number
  backgroundTheme: "dark" | "light"
  onClose: () => void
  onCopySvg: () => void
  onCopyReact: () => void
  onDownloadSvg: () => void
  onInsertIntoBuilder: () => void
  isCopiedSvg: boolean
  isCopiedReact: boolean
}

const IconDetailModal: React.FC<IconDetailModalProps> = ({
  icon,
  iconSize,
  strokeWidth,
  backgroundTheme,
  onClose,
  onCopySvg,
  onCopyReact,
  onDownloadSvg,
  onInsertIntoBuilder,
  isCopiedSvg,
  isCopiedReact
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-[#090a10] border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col space-y-5"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white">{icon.name}</h2>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mt-0.5">
              <span>Family: {icon.family}</span>
              <span>•</span>
              <span>License: {icon.license}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white">
            ✕
          </button>
        </div>

        {/* Large Stage Display */}
        <div
          className={`h-48 rounded-2xl border flex items-center justify-center shadow-inner ${
            backgroundTheme === "dark"
              ? "bg-[#06070b] border-slate-800 text-cyan-400"
              : "bg-white border-slate-200 text-slate-900"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={Math.max(iconSize * 2, 64)}
            height={Math.max(iconSize * 2, 64)}
            viewBox={icon.viewBox}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            dangerouslySetInnerHTML={{ __html: icon.svgPath }}
          />
        </div>

        {/* Keywords */}
        <div className="flex flex-wrap gap-1.5">
          {icon.keywords.map((k) => (
            <span
              key={k}
              className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300"
            >
              #{k}
            </span>
          ))}
        </div>

        {/* Export Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
          <button
            onClick={onCopySvg}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
          >
            {isCopiedSvg ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isCopiedSvg ? "Copied SVG" : "Copy SVG"}</span>
          </button>

          <button
            onClick={onCopyReact}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
          >
            {isCopiedReact ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isCopiedReact ? "Copied React" : "Copy React JSX"}</span>
          </button>

          <button
            onClick={onDownloadSvg}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .svg</span>
          </button>
        </div>

        {/* Builder Insertion Handoff */}
        <button
          onClick={onInsertIntoBuilder}
          className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-cyan-600/20"
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>Insert Icon into Website Builder</span>
        </button>
      </div>
    </div>
  )
}
