import React, { useState, useMemo } from "react"
import { TemplateItem } from "../../types/marketplace"
import { verifiedTemplatesData } from "../../data/templatesData"
import {
  Layout,
  Search,
  ExternalLink,
  Bookmark,
  Layers,
  Laptop,
  Tablet,
  Smartphone,
  Terminal,
  Check,
  Copy,
  Wand2,
  FileCode,
  FolderTree,
  Code2,
  Sparkles
} from "lucide-react"

interface TemplatesSectionProps {
  onSendToBuilder: (prompt: string) => void
  onToggleBookmark: (id: string, item: TemplateItem) => void
  isBookmarked: (id: string) => boolean
}

export const TemplatesSection: React.FC<TemplatesSectionProps> = ({
  onSendToBuilder,
  onToggleBookmark,
  isBookmarked
}) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateItem | null>(null)

  const categories = ["All", "SaaS", "Portfolio", "Dashboard", "Agency", "Docs", "AI Application"]

  const filteredTemplates = useMemo(() => {
    return verifiedTemplatesData.filter((t) => {
      if (selectedCategory !== "All" && t.category !== selectedCategory) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        return (
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
        )
      }
      return true
    })
  }, [searchQuery, selectedCategory])

  return (
    <div className="flex-1 flex flex-col p-4 lg:p-6 space-y-6 bg-surface-base">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-subtle">
        <div>
          <div className="flex items-center gap-2">
            <Layout className="w-5 h-5 text-primary" />
            <h2 className="font-headline-lg text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
              Website & Application Starters
            </h2>
          </div>
          <p className="font-body-sm text-xs text-text-muted mt-1 leading-relaxed">
            Full-stack, multi-page production templates with verified folder structures, dependencies, and builder scaffolding.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-surface-subtle border border-border-subtle p-3 rounded-xl">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates, frameworks, stacks..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-surface-base border border-border-subtle text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-violet-deep"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-accent-violet-deep text-white shadow-sm font-semibold"
                  : "bg-surface-base border border-border-subtle text-text-muted hover:text-text-primary hover:bg-surface-raised"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => {
          const isSaved = isBookmarked(template.id)

          return (
            <div
              key={template.id}
              onClick={() => setSelectedTemplate(template)}
              className="rounded-xl border border-border-subtle bg-surface-subtle hover:border-primary/50 hover:shadow-xl card-halo-hover transition-all cursor-pointer flex flex-col justify-between overflow-hidden group"
            >
              {/* Visual Cover Stage with Radial Dot Matrix */}
              <div className="h-48 bg-surface-base p-4 relative flex flex-col justify-between border-b border-border-subtle bg-dot-matrix">
                <div className="flex items-center justify-between relative z-10">
                  <span className="font-badge-label text-[10px] uppercase px-2 py-0.5 rounded bg-surface-raised border border-border-subtle text-primary font-semibold">
                    {template.framework}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleBookmark(template.id, template)
                    }}
                    className={`p-1.5 rounded-lg border transition-all ${
                      isSaved
                        ? "bg-accent-violet-deep text-white border-accent-violet-deep shadow-sm"
                        : "bg-surface-raised border-border-subtle text-text-muted hover:text-terminal-rose hover:bg-surface-container"
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-white" : ""}`} />
                  </button>
                </div>

                <div className="relative z-10 flex flex-col gap-1">
                  <span className="font-metric-label text-[10px] text-text-muted uppercase tracking-wider block">
                    {template.category} Architecture
                  </span>
                  <h3 className="font-headline-sm text-base font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-1">
                    {template.name}
                  </h3>
                </div>

                <div className="relative z-10 flex items-center gap-2 font-code-inline text-[10px] text-text-muted">
                  <span>{template.pageCount} Pages</span>
                  <span>•</span>
                  <span>{template.dependencies.length} Packages</span>
                </div>
              </div>

              {/* Information Body */}
              <div className="p-4 flex flex-col justify-between flex-1 gap-3.5">
                <p className="font-body-sm text-xs text-text-muted line-clamp-2 leading-relaxed">
                  {template.description}
                </p>

                {/* Page breakdown tags */}
                <div className="flex flex-wrap gap-1.5">
                  {template.pages.slice(0, 3).map((p) => (
                    <span
                      key={p.path}
                      className="font-code-inline text-[10px] px-2 py-0.5 rounded bg-surface-base border border-border-subtle text-text-muted truncate max-w-[130px]"
                    >
                      {p.name}
                    </span>
                  ))}
                  {template.pages.length > 3 && (
                    <span className="font-code-inline text-[10px] px-1.5 py-0.5 rounded bg-surface-base text-text-muted">
                      +{template.pages.length - 3} more
                    </span>
                  )}
                </div>

                {/* Card Footer */}
                <div className="pt-3 border-t border-border-subtle flex items-center justify-between font-code-inline text-xs">
                  <span className="text-text-muted truncate max-w-[140px]">
                    @{template.author.name.replace(/\s+/g, "_").toLowerCase()}
                  </span>
                  <span className="text-primary font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Inspect Starter</span>
                    <span>→</span>
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Template Detail Modal */}
      {selectedTemplate && (
        <TemplateDetailModal
          template={selectedTemplate}
          onClose={() => setSelectedTemplate(null)}
          onSendToBuilder={() => {
            onSendToBuilder(`Scaffold a complete website based on the "${selectedTemplate.name}" template architecture:
- Framework: ${selectedTemplate.framework}
- Category: ${selectedTemplate.category}
- Description: ${selectedTemplate.description}
- Pages: ${selectedTemplate.pages.map((p) => p.name).join(", ")}
- Dependencies: ${selectedTemplate.dependencies.join(", ")}`)
            setSelectedTemplate(null)
          }}
        />
      )}
    </div>
  )
}

interface TemplateDetailModalProps {
  template: TemplateItem
  onClose: () => void
  onSendToBuilder: () => void
}

const TemplateDetailModal: React.FC<TemplateDetailModalProps> = ({
  template,
  onClose,
  onSendToBuilder
}) => {
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [copiedCmd, setCopiedCmd] = useState(false)

  const getViewportClass = () => {
    switch (viewport) {
      case "mobile":
        return "max-w-[390px]"
      case "tablet":
        return "max-w-[768px]"
      case "desktop":
      default:
        return "w-full"
    }
  }

  const copySetup = () => {
    navigator.clipboard.writeText(template.setupInstructions.join("\n"))
    setCopiedCmd(true)
    setTimeout(() => setCopiedCmd(false), 2000)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[94vw] max-w-6xl h-[92vh] bg-surface-base border border-border-subtle rounded-2xl p-6 shadow-2xl flex flex-col justify-between overflow-hidden"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-border-subtle shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-headline-sm text-lg font-bold text-text-primary">{template.name}</h2>
              <span className="font-badge-label text-[10px] px-2 py-0.5 rounded bg-surface-raised border border-border-subtle text-primary font-semibold">
                {template.framework}
              </span>
            </div>
            <p className="font-body-sm text-xs text-text-muted mt-0.5">{template.description}</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Viewport switchers */}
            <div className="flex items-center bg-surface-subtle border border-border-subtle rounded-lg p-0.5 font-metric-label text-xs">
              <button
                onClick={() => setViewport("desktop")}
                className={`p-1.5 rounded transition-colors ${
                  viewport === "desktop" ? "bg-surface-raised text-primary" : "text-text-muted hover:text-text-primary"
                }`}
                title="Desktop View"
              >
                <Laptop className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewport("tablet")}
                className={`p-1.5 rounded transition-colors ${
                  viewport === "tablet" ? "bg-surface-raised text-primary" : "text-text-muted hover:text-text-primary"
                }`}
                title="Tablet View"
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewport("mobile")}
                className={`p-1.5 rounded transition-colors ${
                  viewport === "mobile" ? "bg-surface-raised text-primary" : "text-text-muted hover:text-text-primary"
                }`}
                title="Mobile View"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-surface-raised hover:bg-surface-container border border-border-subtle text-text-muted hover:text-text-primary"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-6">
          {/* Responsive Template Mockup Stage */}
          <div className="flex justify-center w-full bg-surface-subtle border border-border-subtle rounded-xl p-6 min-h-[340px] items-center bg-dot-matrix">
            <div
              className={`transition-all duration-200 ${getViewportClass()} rounded-xl border border-border-subtle bg-surface-base p-6 space-y-5 shadow-2xl text-center`}
            >
              <span className="px-3 py-1 rounded-full font-badge-label text-[10px] bg-surface-raised text-primary border border-primary/30 font-semibold">
                {template.framework} Architecture Starter
              </span>
              <h3 className="font-headline-lg text-2xl font-bold text-text-primary">{template.name}</h3>
              <p className="font-body-sm text-xs text-text-muted max-w-md mx-auto">{template.description}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-3">
                {template.pages.map((p) => (
                  <div
                    key={p.path}
                    className="p-3 rounded-lg bg-surface-subtle border border-border-subtle text-left space-y-1"
                  >
                    <span className="font-headline-sm text-xs font-semibold text-text-primary block truncate">
                      {p.name}
                    </span>
                    <span className="font-code-inline text-[10px] text-text-muted block truncate">
                      {p.path}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Directory Scaffolding & Setup Commands */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-surface-subtle border border-border-subtle space-y-2">
              <span className="font-metric-label text-[10px] uppercase font-semibold text-text-muted block">
                Terminal Setup Commands
              </span>
              <pre className="p-3 rounded-lg bg-surface-base border border-border-subtle font-code-block text-xs text-text-primary overflow-x-auto">
                <code>{template.setupInstructions.join("\n")}</code>
              </pre>
            </div>

            <div className="p-4 rounded-xl bg-surface-subtle border border-border-subtle space-y-2">
              <span className="font-metric-label text-[10px] uppercase font-semibold text-text-muted block">
                Required NPM Dependencies
              </span>
              <div className="flex flex-wrap gap-1.5">
                {template.dependencies.map((dep) => (
                  <span
                    key={dep}
                    className="font-code-inline text-[10px] px-2 py-0.5 rounded bg-surface-base border border-border-subtle text-text-primary"
                  >
                    {dep}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-border-subtle flex items-center justify-between shrink-0">
          <button
            onClick={copySetup}
            className="px-3.5 py-1.5 rounded-lg bg-surface-raised hover:bg-surface-container border border-border-subtle font-code-inline text-xs text-text-primary flex items-center gap-1.5"
          >
            {copiedCmd ? <Check className="w-3.5 h-3.5 text-terminal-emerald" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCmd ? "Setup Copied!" : "Copy Setup Commands"}</span>
          </button>

          <button
            onClick={onSendToBuilder}
            className="px-4 py-2 rounded-lg bg-accent-violet-deep hover:bg-accent-violet-deep/90 text-white font-headline-sm text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-accent-violet-deep/20"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Scaffold in Website Builder</span>
          </button>
        </div>
      </div>
    </div>
  )
}
