import React, { useState, useEffect, useRef, useMemo } from "react"
import { CatalogueItem, getHonestPreviewKind, getHonestBadgeConfig } from "../types/catalogue"
import { ItemPreview } from "./ItemPreview"
import { resolveAssetUrl } from "../utils/assetUrl"
import {
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  Copy,
  Check,
  Terminal,
  ExternalLink,
  Sparkles,
  Laptop,
  Tablet,
  Smartphone,
  Sun,
  Moon,
  RotateCcw,
  Maximize2,
  Minimize2,
  FileCode,
  Image as ImageIcon,
  Code2,
  ShieldCheck,
  Wand2,
  ZoomIn,
  ZoomOut,
  Edit3,
  Layers,
  Sliders,
  CheckCircle2,
  Box,
  HardDrive
} from "lucide-react"

interface PreviewModalProps {
  item: CatalogueItem
  allItems: CatalogueItem[]
  onClose: () => void
  onSelectItem: (item: CatalogueItem) => void
  isFavorite: boolean
  onToggleFavorite: (id: string) => void
  onSendToBuilder?: (prompt: string) => void
  onSendToPromptStudio?: (prompt: string, title?: string) => void
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
  item,
  allItems,
  onClose,
  onSelectItem,
  isFavorite,
  onToggleFavorite,
  onSendToBuilder,
  onSendToPromptStudio
}) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const isAwesome = item.sourceRepo === "awesome-components" || !!item.awesomeData

  const getInitialTab = (currentItem: CatalogueItem): TabId => {
    if (
      currentItem.componentCode ||
      [
        "floating-sphere-3d",
        "aurora-webgl-shader",
        "interactive-3d-card",
        "kinetic-hero-section",
        "blur-reveal-typography",
        "floating-pill-nav",
        "staggered-interactive-gallery",
        "shimmer-light-button",
        "magnetic-button",
        "bento-grid",
        "particles-background",
        "marquee-showcase",
        "magicui-magic-card",
        "magicui-lens"
      ].includes(currentItem.id)
    ) {
      return "preview"
    }
    if (currentItem.awesomeData?.hasHtml) {
      return "preview"
    }
    if (currentItem.awesomeData?.screenshotUrl && !currentItem.awesomeData?.hasHtml) {
      return "screenshot"
    }
    if (currentItem.itemType === "prompt" || (currentItem.promptData && !currentItem.componentCode)) {
      return "prompt"
    }
    return "preview"
  }

  type TabId = "preview" | "code" | "screenshot" | "prompt" | "html" | "install" | "meta"
  const [activeTab, setActiveTab] = useState<TabId>(() => getInitialTab(item))

  // Stage controls
  const [viewportSize, setViewportSize] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [themeMode, setThemeMode] = useState<"dark" | "light">("dark")
  const [canvasBackground, setCanvasBackground] = useState<"dark" | "light" | "dot" | "grid">("dot")
  const [isFullscreenStage, setIsFullscreenStage] = useState(false)
  const [stageKey, setStageKey] = useState<number>(0)
  const [auroraActive, setAuroraActive] = useState<boolean>(true)

  // Copy feedback states
  const [copiedAction, setCopiedAction] = useState<string | null>(null)

  // Screenshot zoom
  const [zoomLevel, setZoomLevel] = useState<number>(100)

  // Prompt edit state
  const [promptText, setPromptText] = useState<string>("")
  const [editedPromptText, setEditedPromptText] = useState<string>("")
  const [isEditingPrompt, setIsEditingPrompt] = useState(false)
  const [isLoadingPrompt, setIsLoadingPrompt] = useState(false)

  // HTML source state
  const [htmlSourceText, setHtmlSourceText] = useState<string>("")
  const [isLoadingHtml, setIsLoadingHtml] = useState(false)

  // Prev / Next index in allItems
  const currentIndex = allItems.findIndex((x) => x.id === item.id)
  const prevItem = currentIndex > 0 ? allItems[currentIndex - 1] : null
  const nextItem = currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null

  // Related items
  const relatedItems = useMemo(() => {
    return allItems
      .filter((other) => other.id !== item.id && other.category === item.category)
      .slice(0, 3)
  }, [item.id, item.category, allItems])

  // Reset tab and stage when active item changes
  useEffect(() => {
    setActiveTab(getInitialTab(item))
    setZoomLevel(100)
    setIsEditingPrompt(false)
    setStageKey((k) => k + 1)
  }, [item.id])

  // Fetch prompt content on demand
  useEffect(() => {
    if (isAwesome && item.awesomeData?.promptUrl && (activeTab === "prompt" || !promptText)) {
      setIsLoadingPrompt(true)
      fetch(resolveAssetUrl(item.awesomeData.promptUrl))
        .then((r) => (r.ok ? r.text() : Promise.reject(new Error(`HTTP ${r.status}`))))
        .then((text) => {
          setPromptText(text)
          setEditedPromptText(text)
          setIsLoadingPrompt(false)
        })
        .catch(() => setIsLoadingPrompt(false))
    }
  }, [item.id, isAwesome, item.awesomeData?.promptUrl, activeTab])

  // Fetch HTML source on demand
  useEffect(() => {
    if (isAwesome && item.awesomeData?.htmlUrl && (activeTab === "html" || !htmlSourceText)) {
      setIsLoadingHtml(true)
      fetch(resolveAssetUrl(item.awesomeData.htmlUrl))
        .then((r) => (r.ok ? r.text() : Promise.reject(new Error(`HTTP ${r.status}`))))
        .then((text) => {
          setHtmlSourceText(text)
          setIsLoadingHtml(false)
        })
        .catch(() => setIsLoadingHtml(false))
    }
  }, [item.id, isAwesome, item.awesomeData?.htmlUrl, activeTab])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") {
        return
      }
      if (e.key === "Escape") {
        e.preventDefault()
        onClose()
      } else if (e.key === "ArrowLeft" && prevItem) {
        e.preventDefault()
        onSelectItem(prevItem)
      } else if (e.key === "ArrowRight" && nextItem) {
        e.preventDefault()
        onSelectItem(nextItem)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose, onSelectItem, prevItem, nextItem])

  useEffect(() => {
    modalRef.current?.focus()
  }, [])

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedAction(label)
    setTimeout(() => setCopiedAction(null), 2000)
  }

  const kind = getHonestPreviewKind(item)

  const getViewportWidthClass = () => {
    switch (viewportSize) {
      case "mobile":
        return "max-w-[390px]"
      case "tablet":
        return "max-w-[768px]"
      case "desktop":
      default:
        return "w-full"
    }
  }

  const cliInstallCmd = item.installCommand || `npx elementra add ${item.slug || item.id}`

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-2 sm:p-4 lg:p-6 overflow-hidden animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className={`bg-surface-base border border-border-subtle rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-200 outline-none ${
          isFullscreenStage ? "w-full h-full rounded-none" : "w-[96vw] max-w-7xl h-[94vh]"
        }`}
      >
        {/* Studio Top Navigation & Breadcrumb Header */}
        <header className="px-4 lg:px-6 py-3.5 border-b border-border-subtle bg-surface-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
          {/* Breadcrumbs & Component Identity */}
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-2 text-xs font-body-sm text-text-muted flex-wrap">
              <span className="text-text-muted">Marketplace</span>
              <span className="text-border-subtle">/</span>
              <span className="text-primary font-medium">{item.category}</span>
              <span className="text-border-subtle">/</span>
              <span className="text-text-primary font-headline-sm text-xs font-semibold truncate">
                {item.name}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-headline-sm text-base sm:text-lg font-bold text-text-primary truncate">
                {item.name}
              </h2>

              {/* Badges */}
              <span className="font-badge-label text-[10px] px-2 py-0.5 rounded bg-surface-raised border border-border-subtle text-primary font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {kind === "executable-verified"
                  ? "Live Component"
                  : kind === "html-snapshot"
                  ? "HTML Snapshot"
                  : kind === "screenshot-reference"
                  ? "Screenshot Reference"
                  : "AI Blueprint"}
              </span>

              <span className="font-code-inline text-[10px] px-2 py-0.5 rounded bg-surface-base text-text-muted border border-border-subtle">
                React 19 & Tailwind v4
              </span>

              <span className="font-code-inline text-[10px] px-2 py-0.5 rounded bg-surface-base text-terminal-emerald border border-terminal-emerald/30">
                Registry Ready
              </span>
            </div>
          </div>

          {/* Right Action Controls: Prev/Next, Copy CLI, Bookmark, Close */}
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            {/* CLI Quick Copy */}
            <button
              onClick={() => copyToClipboard(cliInstallCmd, "quick-cli")}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-raised border border-border-subtle text-text-primary hover:bg-surface-container font-code-inline text-xs transition-colors"
              title="Click to copy install command"
            >
              <Terminal className="w-3.5 h-3.5 text-text-muted" />
              <span className="text-[11px] truncate max-w-[130px]">{cliInstallCmd}</span>
              {copiedAction === "quick-cli" ? (
                <Check className="w-3 h-3 text-terminal-emerald" />
              ) : (
                <Copy className="w-3 h-3 text-text-muted" />
              )}
            </button>

            {/* Favorite toggle */}
            <button
              onClick={() => onToggleFavorite(item.id)}
              className={`p-2 rounded-lg border transition-all ${
                isFavorite
                  ? "bg-accent-violet-deep text-white border-accent-violet-deep shadow-sm"
                  : "bg-surface-raised border-border-subtle text-text-muted hover:text-terminal-rose hover:bg-surface-container"
              }`}
              title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? "fill-white text-white" : ""}`} />
            </button>

            {/* Previous / Next Item Navigator */}
            <div className="flex items-center bg-surface-base border border-border-subtle rounded-lg p-0.5 text-text-muted">
              <button
                onClick={() => prevItem && onSelectItem(prevItem)}
                disabled={!prevItem}
                className="p-1.5 rounded hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Previous component (←)"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => nextItem && onSelectItem(nextItem)}
                disabled={!nextItem}
                className="p-1.5 rounded hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Next component (→)"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-surface-raised hover:bg-surface-container border border-border-subtle text-text-muted hover:text-text-primary transition-colors"
              title="Close modal (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Studio Grid Split View (68% Stage / 32% Inspector) */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 xl:grid-cols-12 divide-y xl:divide-y-0 xl:divide-x divide-border-subtle">
          {/* Left / Center Dominant Preview Stage (~68% on Desktop) */}
          <section className="xl:col-span-8 flex flex-col justify-between overflow-hidden bg-surface-base">
            {/* Stage Toolbar */}
            <div className="px-4 py-2.5 bg-surface-subtle border-b border-border-subtle flex flex-wrap items-center justify-between gap-2 shrink-0">
              {/* Viewport Width Controls */}
              <div className="flex items-center gap-1 p-0.5 rounded-lg bg-surface-base border border-border-subtle">
                <button
                  onClick={() => setViewportSize("desktop")}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-metric-label text-[10px] transition-colors ${
                    viewportSize === "desktop"
                      ? "bg-surface-raised text-primary font-bold shadow-sm"
                      : "text-text-muted hover:text-text-primary"
                  }`}
                  title="Desktop Viewport"
                >
                  <Laptop className="w-3.5 h-3.5" />
                  <span>1280px</span>
                </button>
                <button
                  onClick={() => setViewportSize("tablet")}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-metric-label text-[10px] transition-colors ${
                    viewportSize === "tablet"
                      ? "bg-surface-raised text-primary font-bold shadow-sm"
                      : "text-text-muted hover:text-text-primary"
                  }`}
                  title="Tablet Viewport"
                >
                  <Tablet className="w-3.5 h-3.5" />
                  <span>768px</span>
                </button>
                <button
                  onClick={() => setViewportSize("mobile")}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-metric-label text-[10px] transition-colors ${
                    viewportSize === "mobile"
                      ? "bg-surface-raised text-primary font-bold shadow-sm"
                      : "text-text-muted hover:text-text-primary"
                  }`}
                  title="Mobile Viewport"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>390px</span>
                </button>
              </div>

              {/* Canvas Appearance & Themes */}
              <div className="flex items-center gap-1 bg-surface-base border border-border-subtle p-0.5 rounded-lg">
                <button
                  onClick={() => {
                    setThemeMode("dark")
                    setCanvasBackground("dark")
                  }}
                  className={`w-7 h-7 rounded flex items-center justify-center transition-colors ${
                    themeMode === "dark" && canvasBackground === "dark" ? "bg-surface-raised text-primary" : "text-text-muted hover:text-text-primary"
                  }`}
                  title="Dark Theme Surface"
                >
                  <Moon className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setCanvasBackground("dot")}
                  className={`w-7 h-7 rounded flex items-center justify-center transition-colors ${
                    canvasBackground === "dot" ? "bg-surface-raised text-primary" : "text-text-muted hover:text-text-primary"
                  }`}
                  title="Radial Dot Matrix Mesh"
                >
                  <Box className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    setThemeMode("light")
                    setCanvasBackground("light")
                  }}
                  className={`w-7 h-7 rounded flex items-center justify-center transition-colors ${
                    themeMode === "light" ? "bg-surface-raised text-amber-400" : "text-text-muted hover:text-text-primary"
                  }`}
                  title="Light Theme Mode"
                >
                  <Sun className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Aurora Orb Toggle, Reload & Fullscreen */}
              <div className="flex items-center gap-1.5 text-text-muted font-metric-label text-[10px]">
                <button
                  onClick={() => setAuroraActive(!auroraActive)}
                  className={`px-2 py-1 rounded border transition-colors flex items-center gap-1 ${
                    auroraActive
                      ? "bg-accent-violet-deep/20 text-primary border-primary/30"
                      : "bg-surface-base border-border-subtle text-text-muted"
                  }`}
                  title="Toggle Ambient Aurora Back-glow"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Aurora</span>
                </button>

                <button
                  onClick={() => setStageKey((k) => k + 1)}
                  className="w-7 h-7 rounded bg-surface-base border border-border-subtle flex items-center justify-center hover:text-text-primary transition-colors"
                  title="Reload Stage"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setIsFullscreenStage(!isFullscreenStage)}
                  className="w-7 h-7 rounded bg-surface-base border border-border-subtle flex items-center justify-center hover:text-text-primary transition-colors"
                  title={isFullscreenStage ? "Exit Fullscreen" : "Fullscreen"}
                >
                  {isFullscreenStage ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Stage Canvas Area */}
            <div
              key={stageKey}
              className={`flex-1 overflow-auto flex flex-col items-center justify-center p-4 lg:p-8 relative select-none ${
                canvasBackground === "light" ? "bg-white text-slate-900" : "bg-surface-base text-text-primary"
              }`}
            >
              {/* Radial Dot Matrix Mesh Layer */}
              {canvasBackground === "dot" && (
                <div className="absolute inset-0 bg-dot-matrix pointer-events-none" />
              )}

              {/* Dynamic Aurora Orb Glow */}
              {auroraActive && canvasBackground !== "light" && (
                <div className="absolute w-80 h-80 rounded-full bg-gradient-to-tr from-accent-violet-deep/20 via-secondary/15 to-primary/10 blur-[80px] pointer-events-none animate-pulse" />
              )}

              {/* Stage Viewport Framing */}
              <div
                className={`relative z-10 w-full ${getViewportWidthClass()} transition-all duration-300 flex items-center justify-center`}
              >
                <ItemPreview
                  item={item}
                  themeMode={canvasBackground === "light" ? "light" : "dark"}
                  onSendToPromptStudio={onSendToPromptStudio}
                  onSendToBuilder={onSendToBuilder}
                />
              </div>
            </div>

            {/* Bottom Stage Status Bar */}
            <div className="px-4 py-2 bg-surface-subtle border-t border-border-subtle flex items-center justify-between text-text-muted font-mono text-[11px] shrink-0">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-text-primary">Preview Active</span>
                </span>
                <span>•</span>
                <span>Viewport: {viewportSize === "desktop" ? "1280px" : viewportSize === "tablet" ? "768px" : "390px"}</span>
                <span>•</span>
                <span>{item.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>React 19 / Tailwind CSS</span>
              </div>
            </div>
          </section>

          {/* Right Inspector Column (~32% on Desktop) */}
          <aside className="xl:col-span-4 flex flex-col justify-between overflow-y-auto bg-surface-subtle p-4 lg:p-5 gap-4">
            {/* Upper Content: Tabs & Inspectors */}
            <div className="flex flex-col gap-4">
              {/* Tab Selector */}
              <div className="flex items-center gap-1 p-0.5 rounded-lg bg-surface-base border border-border-subtle overflow-x-auto scrollbar-none shrink-0">
                <button
                  onClick={() => setActiveTab("preview")}
                  className={`flex-1 px-2.5 py-1.5 rounded text-xs transition-colors whitespace-nowrap cursor-pointer ${
                    activeTab === "preview"
                      ? "bg-surface-raised text-text-primary shadow-sm font-medium"
                      : "text-text-muted hover:text-text-primary"
                  }`}
                >
                  Overview
                </button>

                {item.componentCode && (
                  <button
                    onClick={() => setActiveTab("code")}
                    className={`flex-1 px-2.5 py-1.5 rounded text-xs transition-colors whitespace-nowrap cursor-pointer ${
                      activeTab === "code"
                        ? "bg-surface-raised text-text-primary shadow-sm font-medium"
                        : "text-text-muted hover:text-text-primary"
                    }`}
                  >
                    TSX Code
                  </button>
                )}
                {item.awesomeData?.htmlUrl && (
                  <button
                    onClick={() => setActiveTab("html")}
                    className={`flex-1 px-2.5 py-1.5 rounded text-xs transition-colors whitespace-nowrap cursor-pointer ${
                      activeTab === "html"
                        ? "bg-surface-raised text-text-primary shadow-sm font-medium"
                        : "text-text-muted hover:text-text-primary"
                    }`}
                  >
                    HTML Snapshot
                  </button>
                )}

                {item.awesomeData?.screenshotUrl && (
                  <button
                    onClick={() => setActiveTab("screenshot")}
                    className={`flex-1 px-2.5 py-1.5 rounded text-xs transition-colors whitespace-nowrap cursor-pointer ${
                      activeTab === "screenshot"
                        ? "bg-surface-raised text-text-primary shadow-sm font-medium"
                        : "text-text-muted hover:text-text-primary"
                    }`}
                  >
                    Screenshot
                  </button>
                )}

                {(item.promptData || item.awesomeData?.promptUrl) && (
                  <button
                    onClick={() => setActiveTab("prompt")}
                    className={`flex-1 px-2.5 py-1.5 rounded text-xs transition-colors whitespace-nowrap cursor-pointer ${
                      activeTab === "prompt"
                        ? "bg-surface-raised text-text-primary shadow-sm font-medium"
                        : "text-text-muted hover:text-text-primary"
                    }`}
                  >
                    Prompt
                  </button>
                )}

                <button
                  onClick={() => setActiveTab("meta")}
                  className={`flex-1 px-2.5 py-1.5 rounded text-xs transition-colors whitespace-nowrap cursor-pointer ${
                    activeTab === "meta"
                      ? "bg-surface-raised text-text-primary shadow-sm font-medium"
                      : "text-text-muted hover:text-text-primary"
                  }`}
                >
                  Specs
                </button>
              </div>

              {/* TAB 1: OVERVIEW & ACTIONS */}
              {activeTab === "preview" && (
                <div className="flex flex-col gap-4">
                  {/* Quick Action Cluster */}
                  <div className="flex flex-col gap-2">
                    {onSendToBuilder && (
                      <button
                        onClick={() => {
                          onSendToBuilder(`Use component "${item.name}" in webpage layout`)
                          onClose()
                        }}
                        className="w-full py-2.5 px-4 rounded-lg bg-accent-violet-deep hover:bg-accent-violet-deep/90 text-white font-headline-sm text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-accent-violet-deep/20 transition-all"
                      >
                        <Wand2 className="w-4 h-4" />
                        <span>Add to Website Builder</span>
                      </button>
                    )}

                    {onSendToPromptStudio && (
                      <button
                        onClick={() => {
                          onSendToPromptStudio(item.description, item.name)
                          onClose()
                        }}
                        className="w-full py-2 px-4 rounded-lg bg-surface-raised hover:bg-surface-container border border-border-subtle text-text-primary font-headline-sm text-xs font-medium flex items-center justify-center gap-2 transition-colors"
                      >
                        <Sparkles className="w-4 h-4 text-terminal-amber" />
                        <span>Remix in Prompt Studio</span>
                      </button>
                    )}
                  </div>

                  {/* CLI Command Box */}
                  <div className="p-3 rounded-lg bg-surface-base border border-border-subtle flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-text-muted font-metric-label text-[10px] uppercase">
                      <span>shadcn / Elementra CLI</span>
                      <button
                        onClick={() => copyToClipboard(cliInstallCmd, "inspect-cli")}
                        className="text-primary hover:underline flex items-center gap-1 font-code-inline"
                      >
                        {copiedAction === "inspect-cli" ? <Check className="w-3 h-3 text-terminal-emerald" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedAction === "inspect-cli" ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                    <div className="font-code-inline text-xs text-text-primary select-all">
                      {cliInstallCmd}
                    </div>
                  </div>

                  {/* Component Technical Manifest Table */}
                  <div className="flex flex-col gap-2">
                    <span className="font-metric-label text-[10px] text-text-muted uppercase tracking-wider font-semibold">
                      Component Specifications
                    </span>
                    <div className="rounded-lg bg-surface-base border border-border-subtle divide-y divide-border-subtle/60 font-code-inline text-xs">
                      <div className="flex items-center justify-between p-2.5">
                        <span className="text-text-muted">Author</span>
                        <span className="text-text-primary">@{item.author.name.replace(/\s+/g, "_").toLowerCase()}</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5">
                        <span className="text-text-muted">Category</span>
                        <span className="text-primary">{item.category}</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5">
                        <span className="text-text-muted">Motion Engine</span>
                        <span className="text-text-primary">{item.motionEngine || "CSS / Framer"}</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5">
                        <span className="text-text-muted">License</span>
                        <span className="text-text-muted">{item.license || "MIT"}</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5">
                        <span className="text-text-muted">Bundle Size</span>
                        <span className="text-terminal-emerald">~2.8 kB (gzip)</span>
                      </div>
                    </div>
                  </div>

                  {/* Related Components */}
                  {relatedItems.length > 0 && (
                    <div className="flex flex-col gap-2 pt-2">
                      <span className="font-metric-label text-[10px] text-text-muted uppercase tracking-wider font-semibold">
                        More from {item.category}
                      </span>
                      <div className="flex flex-col gap-1.5">
                        {relatedItems.map((rel) => (
                          <div
                            key={rel.id}
                            onClick={() => onSelectItem(rel)}
                            className="p-2.5 rounded-lg bg-surface-base hover:bg-surface-raised border border-border-subtle cursor-pointer transition-colors flex items-center justify-between"
                          >
                            <div className="flex flex-col truncate">
                              <span className="font-headline-sm text-xs text-text-primary font-medium truncate">
                                {rel.name}
                              </span>
                              <span className="font-metric-label text-[9px] text-text-muted">
                                @{rel.author.name}
                              </span>
                            </div>
                            <span className="text-primary font-code-inline text-xs">→</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: CODE (TSX) */}
              {activeTab === "code" && item.componentCode && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-code-inline text-xs text-primary">
                      {item.slug}.tsx
                    </span>
                    <button
                      onClick={() => copyToClipboard(item.componentCode!, "tsx-code")}
                      className="px-2.5 py-1 rounded bg-accent-violet-deep hover:bg-accent-violet-deep/90 text-white font-code-inline text-xs flex items-center gap-1 shadow-sm"
                    >
                      {copiedAction === "tsx-code" ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedAction === "tsx-code" ? "Copied" : "Copy TSX"}</span>
                    </button>
                  </div>
                  <pre className="p-3 rounded-lg bg-surface-base border border-border-subtle font-code-block text-xs text-text-primary overflow-auto max-h-[460px] leading-relaxed">
                    <code>{item.componentCode}</code>
                  </pre>
                </div>
              )}

              {/* TAB 3: SCREENSHOT */}
              {activeTab === "screenshot" && item.awesomeData?.screenshotUrl && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-text-muted font-metric-label text-xs">
                    <span>Reference Capture</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setZoomLevel((z) => Math.max(50, z - 25))}
                        className="p-1 rounded bg-surface-base hover:bg-surface-raised text-text-primary border border-border-subtle"
                        title="Zoom out"
                      >
                        <ZoomOut className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-1 text-text-muted">{zoomLevel}%</span>
                      <button
                        onClick={() => setZoomLevel((z) => Math.min(250, z + 25))}
                        className="p-1 rounded bg-surface-base hover:bg-surface-raised text-text-primary border border-border-subtle"
                        title="Zoom in"
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="overflow-auto max-h-[460px] rounded-lg bg-surface-base border border-border-subtle p-2 flex items-center justify-center">
                    <img
                      src={resolveAssetUrl(item.awesomeData.screenshotUrl)}
                      alt={item.name}
                      style={{ width: `${zoomLevel}%`, maxWidth: "none" }}
                      className="rounded shadow-md object-contain"
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: PROMPT BLUEPRINT */}
              {activeTab === "prompt" && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-metric-label text-[10px] text-terminal-amber uppercase font-semibold">
                      Agent Implementation Prompt
                    </span>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          isAwesome ? editedPromptText || promptText : item.promptData?.promptText || "",
                          "blueprint-copy"
                        )
                      }
                      className="px-2.5 py-1 rounded bg-surface-raised border border-border-subtle font-code-inline text-xs text-text-primary hover:text-white flex items-center gap-1"
                    >
                      {copiedAction === "blueprint-copy" ? <Check className="w-3 h-3 text-terminal-emerald" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedAction === "blueprint-copy" ? "Copied" : "Copy Prompt"}</span>
                    </button>
                  </div>

                  {isLoadingPrompt ? (
                    <div className="p-8 text-center text-text-muted font-code-inline text-xs">
                      Loading blueprint instructions...
                    </div>
                  ) : (
                    <pre className="p-3 rounded-lg bg-surface-base border border-border-subtle font-code-block text-xs text-text-primary overflow-auto max-h-[460px] leading-relaxed whitespace-pre-wrap">
                      {isAwesome ? editedPromptText || promptText || "No blueprint available." : item.promptData?.promptText}
                    </pre>
                  )}
                </div>
              )}

              {/* TAB 5: SPECS & PROVENANCE */}
              {activeTab === "meta" && (
                <div className="flex flex-col gap-3 font-code-inline text-xs">
                  <span className="font-metric-label text-[10px] text-terminal-emerald uppercase tracking-wider font-semibold">
                    Technical Provenance
                  </span>
                  <div className="p-3 rounded-lg bg-surface-base border border-border-subtle flex flex-col gap-2">
                    <div className="flex justify-between">
                      <span className="text-text-muted">Repository</span>
                      <span className="text-primary truncate max-w-[180px]">{item.sourceRepo || "elementraui"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Preview Kind</span>
                      <span className="text-secondary">{kind}</span>
                    </div>
                    {item.provenance.commitHash && (
                      <div className="flex justify-between">
                        <span className="text-text-muted">Commit</span>
                        <span className="text-text-primary">{item.provenance.commitHash.slice(0, 8)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-text-muted">Dependencies</span>
                      <span className="text-text-primary">
                        {item.dependencies.length > 0 ? item.dependencies.join(", ") : "React, Tailwind"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Inspector Signature */}
            <div className="pt-3 border-t border-border-subtle flex items-center justify-between text-text-muted font-metric-label text-[10px]">
              <span>ID: {item.id}</span>
              <span className="text-terminal-emerald">Syntactic Studio v2.4</span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
