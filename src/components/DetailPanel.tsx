import React, { useState, useEffect } from "react"
import { CatalogueItem } from "../types/catalogue"
import { ItemPreview } from "./ItemPreview"
import { resolveAssetUrl } from "../utils/assetUrl"
import {
  Copy,
  Check,
  Terminal,
  ExternalLink,
  Sparkles,
  BookOpen,
  Layers,
  Palette,
  Heart,
  Laptop,
  Tablet,
  Smartphone,
  Sun,
  Moon,
  ShieldCheck,
  Code2,
  CheckCircle2,
  Info,
  AlertTriangle,
  Zap,
  Image as ImageIcon,
  FileCode,
  ZoomIn,
  ZoomOut,
  Maximize2,
  X,
  Wand2,
  Edit3,
  RotateCcw
} from "lucide-react"

interface DetailPanelProps {
  item: CatalogueItem
  isFavorite?: boolean
  onToggleFavorite?: (id: string) => void
  onSendToBuilder?: (prompt: string) => void
  onSendToPromptStudio?: (prompt: string, title?: string) => void
}

export const DetailPanel: React.FC<DetailPanelProps> = ({
  item,
  isFavorite = false,
  onToggleFavorite,
  onSendToBuilder,
  onSendToPromptStudio
}) => {
  const isAwesome = item.sourceRepo === "awesome-components" || !!item.awesomeData

  const [activeTab, setActiveTab] = useState<"preview" | "screenshot" | "prompt" | "html-source" | "code" | "meta" | "reference">("preview")
  const [copiedCmd, setCopiedCmd] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)
  const [copiedPrompt, setCopiedPrompt] = useState(false)
  const [copiedHtml, setCopiedHtml] = useState(false)
  const [viewportSize, setViewportSize] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [themeMode, setThemeMode] = useState<"dark" | "light">("dark")

  // Screenshot Zoom & Lightbox
  const [zoomLevel, setZoomLevel] = useState<number>(100)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  // Awesome Components Fetched Text Content
  const [promptText, setPromptText] = useState<string>("")
  const [editedPromptText, setEditedPromptText] = useState<string>("")
  const [isEditingPrompt, setIsEditingPrompt] = useState(false)
  const [htmlSourceText, setHtmlSourceText] = useState<string>("")
  const [isLoadingPrompt, setIsLoadingPrompt] = useState(false)
  const [isLoadingHtml, setIsLoadingHtml] = useState(false)

  // Reset tab and states when switching components
  useEffect(() => {
    setActiveTab("preview")
    setZoomLevel(100)
    setIsLightboxOpen(false)
    setIsEditingPrompt(false)
  }, [item.id])

  // Fetch prompt text on demand
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
        .catch(() => {
          setIsLoadingPrompt(false)
        })
    }
  }, [item.id, isAwesome, item.awesomeData?.promptUrl, activeTab])

  // Fetch HTML source on demand
  useEffect(() => {
    if (isAwesome && item.awesomeData?.htmlUrl && (activeTab === "html-source" || !htmlSourceText)) {
      setIsLoadingHtml(true)
      fetch(resolveAssetUrl(item.awesomeData.htmlUrl))
        .then((r) => (r.ok ? r.text() : Promise.reject(new Error(`HTTP ${r.status}`))))
        .then((text) => {
          setHtmlSourceText(text)
          setIsLoadingHtml(false)
        })
        .catch(() => {
          setIsLoadingHtml(false)
        })
    }
  }, [item.id, isAwesome, item.awesomeData?.htmlUrl, activeTab])

  const copyText = (text: string, type: "cmd" | "code" | "prompt" | "html") => {
    navigator.clipboard.writeText(text)
    if (type === "cmd") {
      setCopiedCmd(true)
      setTimeout(() => setCopiedCmd(false), 2000)
    } else if (type === "code") {
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
    } else if (type === "prompt") {
      setCopiedPrompt(true)
      setTimeout(() => setCopiedPrompt(false), 2000)
    } else {
      setCopiedHtml(true)
      setTimeout(() => setCopiedHtml(false), 2000)
    }
  }

  const getViewportWidthClass = () => {
    switch (viewportSize) {
      case "mobile":
        return "max-w-[375px]"
      case "tablet":
        return "max-w-[768px]"
      case "desktop":
      default:
        return "w-full"
    }
  }

  const renderStatusBadge = () => {
    switch (item.previewStatus) {
      case "verified":
        return (
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 flex items-center gap-1 font-semibold">
            <CheckCircle2 className="w-3 h-3" />
            Verified Preview
          </span>
        )
      case "partial":
        return (
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/60 flex items-center gap-1 font-semibold">
            <Zap className="w-3 h-3" />
            Partial Preview
          </span>
        )
      case "reference-only":
        return (
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800/60 flex items-center gap-1 font-semibold">
            <Sparkles className="w-3 h-3" />
            Reference Only
          </span>
        )
      case "unavailable":
        return (
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-700/60 flex items-center gap-1">
            <Info className="w-3 h-3" />
            Local Source Unavailable
          </span>
        )
      case "error":
        return (
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800/60 flex items-center gap-1 font-semibold">
            <AlertTriangle className="w-3 h-3" />
            Preview Error
          </span>
        )
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-xl bg-slate-900/40 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              {item.category}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">By {item.author.name}</span>
            <span className="text-slate-600">•</span>
            <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
              {item.license}
            </span>
            {isAwesome && (
              <>
                <span className="text-slate-600">•</span>
                <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">
                  awesome-components
                </span>
              </>
            )}
            <span className="text-slate-600">•</span>
            <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-800/40">
              Engine: {item.motionEngine}
            </span>
            <span className="text-slate-600">•</span>
            {renderStatusBadge()}
          </div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-extrabold text-white flex items-center gap-2.5">
              <span>{item.name}</span>
              <span className="text-xs font-normal font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {item.itemType}
              </span>
            </h2>
            {onToggleFavorite && (
              <button
                onClick={() => onToggleFavorite(item.id)}
                className={`p-1.5 rounded-lg border transition-all ${
                  isFavorite
                    ? "bg-rose-950/60 border-rose-700/60 text-rose-400 shadow-sm"
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                }`}
                title={isFavorite ? "Remove from Favorites" : "Save to Favorites"}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? "fill-rose-400" : ""}`} />
              </button>
            )}
          </div>
          <p className="text-xs text-slate-400 max-w-2xl mt-1 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Action bar for CLI, Theme Tokens, or Awesome Handoff */}
        {item.itemType === "theme" ? (
          <div className="flex flex-col items-start lg:items-end gap-1.5">
            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
              <Palette className="w-3.5 h-3.5 text-accent-violet-deep" />
              Theme Design Tokens:
            </span>
            <button
              onClick={() => {
                const tokens = `:root {\n  --background: #09090b;\n  --foreground: #f4f4f5;\n  --primary: #ffffff;\n  --secondary: #27272a;\n  --accent: #6366f1;\n  --border: #27272a;\n}`
                navigator.clipboard.writeText(tokens)
                setCopiedCmd(true)
                setTimeout(() => setCopiedCmd(false), 2000)
              }}
              className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copiedCmd ? "Copied CSS Tokens" : "Copy CSS Variables"}</span>
            </button>
          </div>
        ) : item.isInstallable && item.installCommand ? (
          <div className="flex flex-col items-start lg:items-end gap-1.5">
            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              Installation Command:
            </span>
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg overflow-hidden text-xs font-mono w-full sm:w-auto">
              <span className="px-3 py-1.5 text-slate-300 select-all max-w-[260px] sm:max-w-xs truncate">
                {item.installCommand}
              </span>
              <button
                onClick={() => copyText(item.installCommand!, "cmd")}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1 font-sans shrink-0 cursor-pointer"
              >
                {copiedCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCmd ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>
        ) : isAwesome ? (
          <div className="flex items-center gap-2 flex-wrap">
            {onSendToBuilder && (
              <button
                onClick={() => onSendToBuilder(editedPromptText || promptText || item.description)}
                className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Send to Website Builder</span>
              </button>
            )}
            {onSendToPromptStudio && (
              <button
                onClick={() => onSendToPromptStudio(editedPromptText || promptText || item.description, item.name)}
                className="px-3.5 py-1.5 rounded-lg bg-amber-600/90 hover:bg-amber-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Send to Prompt Studio</span>
              </button>
            )}
          </div>
        ) : null}
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab("preview")}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
              activeTab === "preview" ? "bg-slate-800 text-cyan-300 font-semibold" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {isAwesome ? "Preview (Snapshot)" : "Live Preview"}
          </button>

          {isAwesome && item.awesomeData?.screenshotUrl && (
            <button
              onClick={() => setActiveTab("screenshot")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
                activeTab === "screenshot" ? "bg-slate-800 text-cyan-300 font-semibold" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span>Screenshot</span>
            </button>
          )}

          {(isAwesome || item.promptData) && (
            <button
              onClick={() => setActiveTab("prompt")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
                activeTab === "prompt" ? "bg-slate-800 text-cyan-300 font-semibold" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Prompt</span>
            </button>
          )}

          {isAwesome && item.awesomeData?.htmlUrl && (
            <button
              onClick={() => setActiveTab("html-source")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
                activeTab === "html-source" ? "bg-slate-800 text-cyan-300 font-semibold" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-blue-400" />
              <span>HTML Snapshot</span>
            </button>
          )}

          {!isAwesome && item.referenceData && (
            <button
              onClick={() => setActiveTab("reference")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
                activeTab === "reference" ? "bg-slate-800 text-cyan-300 font-semibold" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>Design Observations</span>
            </button>
          )}

          {!isAwesome && item.componentCode && (
            <button
              onClick={() => setActiveTab("code")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
                activeTab === "code" ? "bg-slate-800 text-cyan-300 font-semibold" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Source Code</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab("meta")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
              activeTab === "meta" ? "bg-slate-800 text-cyan-300 font-semibold" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Metadata</span>
          </button>
        </div>

        {/* Viewport & Theme controls when in preview tab */}
        {activeTab === "preview" && (
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-slate-400">
              <button
                onClick={() => setViewportSize("desktop")}
                className={`p-1.5 rounded-md transition-colors ${
                  viewportSize === "desktop" ? "bg-slate-800 text-cyan-400" : "hover:text-slate-200"
                }`}
                title="Desktop View (100%)"
              >
                <Laptop className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewportSize("tablet")}
                className={`p-1.5 rounded-md transition-colors ${
                  viewportSize === "tablet" ? "bg-slate-800 text-cyan-400" : "hover:text-slate-200"
                }`}
                title="Tablet View (768px)"
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewportSize("mobile")}
                className={`p-1.5 rounded-md transition-colors ${
                  viewportSize === "mobile" ? "bg-slate-800 text-cyan-400" : "hover:text-slate-200"
                }`}
                title="Mobile View (375px)"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-slate-400">
              <button
                onClick={() => setThemeMode("dark")}
                className={`p-1.5 rounded-md transition-colors ${
                  themeMode === "dark" ? "bg-slate-800 text-cyan-400" : "hover:text-slate-200"
                }`}
                title="Dark Preview Theme"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setThemeMode("light")}
                className={`p-1.5 rounded-md transition-colors ${
                  themeMode === "light" ? "bg-slate-800 text-amber-400" : "hover:text-slate-200"
                }`}
                title="Light Preview Theme"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tab Panels */}
      {/* 1. Preview Tab */}
      {activeTab === "preview" && (
        <div className="flex flex-col items-center w-full">
          <div
            className={`transition-all duration-300 w-full ${getViewportWidthClass()} rounded-2xl border border-slate-800 ${
              themeMode === "light" ? "bg-slate-100" : "bg-slate-950/60"
            } p-4 sm:p-6 flex flex-col items-center justify-center min-h-[440px] shadow-inner`}
          >
            <ItemPreview item={item} themeMode={themeMode} />
          </div>
        </div>
      )}

      {/* 2. Screenshot Tab (for awesome components) */}
      {activeTab === "screenshot" && item.awesomeData?.screenshotUrl && (
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-cyan-400 font-semibold uppercase">
                Rendered Screenshot Snapshot
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400 font-mono">Zoom: {zoomLevel}%</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoomLevel((z) => Math.max(50, z - 25))}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(100)}
                className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 font-mono"
                title="Reset Zoom"
              >
                Reset
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.min(250, z + 25))}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsLightboxOpen(true)}
                className="px-2.5 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-800/60 text-cyan-300 text-xs flex items-center gap-1 font-mono transition-colors"
                title="Open in Lightbox"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Lightbox</span>
              </button>
            </div>
          </div>

          <div className="w-full overflow-auto max-h-[640px] rounded-xl bg-slate-900/50 border border-slate-800/80 p-4 flex items-center justify-center">
            <img
              src={resolveAssetUrl(item.awesomeData.screenshotUrl)}
              alt={`${item.name} Screenshot`}
              style={{ width: `${zoomLevel}%`, maxWidth: "none" }}
              className="rounded-lg shadow-2xl transition-all duration-200 border border-slate-800 cursor-zoom-in"
              onClick={() => setIsLightboxOpen(true)}
            />
          </div>

          {/* Lightbox Modal */}
          {isLightboxOpen && (
            <div
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-4 sm:p-8"
              onClick={() => setIsLightboxOpen(false)}
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
                <span className="text-sm font-bold text-white font-mono">{item.name} — Full High-Res Screenshot</span>
                <button
                  onClick={() => setIsLightboxOpen(false)}
                  className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-auto flex items-center justify-center p-4">
                <img
                  src={resolveAssetUrl(item.awesomeData.screenshotUrl)}
                  alt={`${item.name} Lightbox`}
                  className="max-h-[85vh] max-w-full rounded-xl shadow-2xl border border-slate-800 object-contain"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Prompt Tab */}
      {activeTab === "prompt" && (
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 flex-wrap gap-3">
            <div>
              <span className="text-xs font-mono text-amber-400 font-semibold uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {isAwesome ? "AI Agent Implementation Prompt" : `Target AI Tool: ${item.promptData?.tool}`}
              </span>
              <p className="text-xs text-slate-400 mt-0.5">
                {isAwesome
                  ? "Ready-to-run prompt for BuilderStudio, Cursor, Claude Code, and autonomous coding agents."
                  : `Framework: ${item.promptData?.framework}`}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {isAwesome && (
                <button
                  onClick={() => setIsEditingPrompt(!isEditingPrompt)}
                  className={`px-3 py-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition-colors font-mono ${
                    isEditingPrompt
                      ? "bg-amber-950 text-amber-300 border-amber-800"
                      : "bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800"
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditingPrompt ? "Preview Markdown" : "Edit Prompt"}</span>
                </button>
              )}
              {isAwesome && isEditingPrompt && (
                <button
                  onClick={() => setEditedPromptText(promptText)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 text-xs flex items-center gap-1 font-mono"
                  title="Reset to Original"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() =>
                  copyText(
                    isAwesome ? editedPromptText || promptText : item.promptData?.promptText || "",
                    "prompt"
                  )
                }
                className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-black font-semibold text-xs flex items-center gap-1.5 transition-colors"
              >
                {copiedPrompt ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPrompt ? "Copied" : "Copy Prompt"}</span>
              </button>
              {isAwesome && onSendToBuilder && (
                <button
                  onClick={() => onSendToBuilder(editedPromptText || promptText || item.description)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-cyan-800/60 text-cyan-400 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Send to Builder</span>
                </button>
              )}
            </div>
          </div>

          {isLoadingPrompt ? (
            <div className="p-8 text-center space-y-2">
              <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-mono text-slate-400">Loading prompt source...</p>
            </div>
          ) : isAwesome && isEditingPrompt ? (
            <div className="space-y-2">
              <textarea
                value={editedPromptText}
                onChange={(e) => setEditedPromptText(e.target.value)}
                rows={16}
                className="w-full p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-slate-200 focus:outline-none focus:border-cyan-500 leading-relaxed resize-y"
                placeholder="Edit prompt here..."
              />
              <span className="text-[11px] text-slate-500 font-mono">
                Modifications are preserved in memory during this session.
              </span>
            </div>
          ) : (
            <pre className="p-4 rounded-xl bg-slate-900 border border-slate-800/80 text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-auto">
              {isAwesome ? editedPromptText || promptText || "No prompt available." : item.promptData?.promptText}
            </pre>
          )}
        </div>
      )}

      {/* 4. HTML Snapshot Tab (for awesome components) */}
      {activeTab === "html-source" && isAwesome && (
        <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 flex-wrap gap-2">
            <div>
              <span className="text-xs font-mono text-blue-400 font-semibold uppercase flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5" />
                Rendered HTML Snapshot Source
              </span>
              <p className="text-xs text-slate-400 mt-0.5">
                Length: {htmlSourceText.length.toLocaleString()} characters • Offline local snapshot
              </p>
            </div>
            <button
              onClick={() => copyText(htmlSourceText, "html")}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              {copiedHtml ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedHtml ? "HTML Copied" : "Copy HTML"}</span>
            </button>
          </div>

          {isLoadingHtml ? (
            <div className="p-8 text-center space-y-2">
              <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-mono text-slate-400">Loading HTML snapshot source...</p>
            </div>
          ) : (
            <pre className="p-4 rounded-xl bg-slate-900 border border-slate-800/80 text-xs font-mono text-slate-300 overflow-x-auto max-h-[500px] leading-relaxed">
              <code>{htmlSourceText || "No HTML snapshot content available."}</code>
            </pre>
          )}
        </div>
      )}

      {/* 5. Reference Tab (for design-reference items) */}
      {activeTab === "reference" && item.referenceData && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-6">
          <div>
            <span className="text-xs font-mono text-cyan-400 uppercase">External Target</span>
            <h3 className="text-base font-bold text-white mt-0.5 flex items-center gap-2">
              <span>{item.referenceData.websiteUrl}</span>
              <a href={item.referenceData.websiteUrl} target="_blank" rel="noreferrer" className="text-cyan-400 hover:text-cyan-300">
                <ExternalLink className="w-4 h-4" />
              </a>
            </h3>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Architectural & Design Observations</h4>
            <ul className="space-y-1.5 text-xs text-slate-400 list-disc list-inside">
              {item.referenceData.designObservations.map((obs, idx) => (
                <li key={idx}>{obs}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">Independent Clean-Room Reimplementation Plan</h4>
            <ul className="space-y-1.5 text-xs font-mono text-slate-300">
              {item.referenceData.reimplementationPlan.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* 6. Code Tab (for core verified items) */}
      {activeTab === "code" && item.componentCode && (
        <div className="relative rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs text-slate-400 font-mono">
            <span>{item.slug}.tsx</span>
            <button
              onClick={() => copyText(item.componentCode!, "code")}
              className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? "Code Copied" : "Copy Code"}</span>
            </button>
          </div>
          <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto max-h-[460px]">
            <code>{item.componentCode}</code>
          </pre>
        </div>
      )}

      {/* 7. Metadata Tab */}
      {activeTab === "meta" && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            Verified Provenance & Ingestion Metadata
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] font-mono text-slate-500 uppercase">License</span>
              <p className="text-sm font-semibold text-emerald-400 mt-0.5">{item.license}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] font-mono text-slate-500 uppercase">Upstream Repository</span>
              <a
                href={item.provenance.repository}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-semibold text-cyan-400 hover:underline flex items-center gap-1 mt-0.5 truncate"
              >
                <span>{item.provenance.repository}</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            </div>
            {item.provenance.commitHash && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] font-mono text-slate-500 uppercase">Upstream Commit Hash</span>
                <p className="text-xs font-mono text-slate-300 mt-1 truncate">
                  {item.provenance.commitHash}
                </p>
              </div>
            )}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] font-mono text-slate-500 uppercase">Offline Asset Status</span>
              <span className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-emerald-400 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Stored Locally & Available Offline
              </span>
            </div>
            {isAwesome && item.awesomeData && (
              <>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[11px] font-mono text-slate-500 uppercase">Bucket & Variant</span>
                  <p className="text-xs font-mono text-slate-300 mt-1">
                    Bucket: {item.awesomeData.bucket} • Variant: {item.awesomeData.variant}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[11px] font-mono text-slate-500 uppercase">Relative Storage Path</span>
                  <p className="text-xs font-mono text-slate-300 mt-1 truncate">
                    {item.awesomeData.htmlPath}
                  </p>
                </div>
              </>
            )}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] font-mono text-slate-500 uppercase">Imported Origin</span>
              <p className="text-xs font-mono text-slate-300 mt-1">{item.provenance.origin}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] font-mono text-slate-500 uppercase">Import Date</span>
              <p className="text-xs font-mono text-slate-300 mt-1">{item.provenance.importDate}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-2 pt-2">
        {item.tags.map((tag: string) => (
          <span
            key={tag}
            className="px-2.5 py-1 text-xs rounded-md bg-slate-900 border border-slate-800 text-slate-400 font-mono"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  )
}
