import React, { useState, useEffect } from "react"
import {
  Search,
  Terminal,
  Copy,
  Check,
  Bookmark,
  Sparkles,
  Wand2,
  Menu,
  X
} from "lucide-react"
import { MarketplaceSection } from "../types/marketplace"

interface HeaderProps {
  activeSection: MarketplaceSection
  onSelectSection: (section: MarketplaceSection) => void
  totalItemCount: number
  bookmarksCount: number
  onOpenSearch: () => void
  onOpenPromptStudio: () => void
  onOpenWebsiteBuilder: () => void
  activeSubApp: "none" | "prompt-studio" | "website-builder"
}

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  onSelectSection,
  totalItemCount,
  bookmarksCount,
  onOpenSearch,
  onOpenPromptStudio,
  onOpenWebsiteBuilder,
  activeSubApp
}) => {
  const [copiedCli, setCopiedCli] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Listen for keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        onOpenSearch()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onOpenSearch])

  const handleCopyCli = () => {
    navigator.clipboard.writeText("npx elementra pull")
    setCopiedCli(true)
    setTimeout(() => setCopiedCli(false), 2000)
  }

  const navLinks: { id: MarketplaceSection; label: string }[] = [
    { id: "components", label: "Components" },
    { id: "themes", label: "Themes" },
    { id: "templates", label: "Templates" },
    { id: "apps", label: "Apps" },
    { id: "icons", label: "Icons" },
    { id: "video", label: "Video & Motion" }
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border-subtle bg-surface-base/95 backdrop-blur-md">
      <div className="mx-auto flex h-13 max-w-[1720px] items-center justify-between px-4 sm:px-6">
        {/* Left: ElementraUI Logo & Wordmark */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => {
              onSelectSection("components")
              setMobileMenuOpen(false)
            }}
            className="flex items-center gap-2.5 outline-none group text-left cursor-pointer"
          >
            {/* ElementraUI Authentic Symbol */}
            <div className="w-7 h-7 rounded-lg bg-surface-raised border border-border-subtle flex items-center justify-center p-1 group-hover:border-accent-violet-deep/50 transition-colors">
              <img src="/elementraui-icon.svg" alt="ElementraUI Mark" className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-tight text-text-primary group-hover:text-white transition-colors">
                  Elementra<span className="text-accent-violet-deep">UI</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-raised border border-border-subtle text-text-muted">
                  v1.0
                </span>
              </div>
              <span className="text-[9px] font-mono text-text-muted/70 tracking-wider hidden sm:block">
                DISCOVER • PREVIEW • BUILD
              </span>
            </div>
          </button>

          {/* Desktop Marketplace Navigation */}
          <nav className="hidden lg:flex items-center gap-1 ml-2">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id && activeSubApp === "none"
              return (
                <button
                  key={link.id}
                  onClick={() => onSelectSection(link.id)}
                  className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors cursor-pointer ${
                    isActive
                      ? "bg-surface-raised text-text-primary shadow-sm"
                      : "text-text-muted hover:text-text-primary hover:bg-surface-subtle"
                  }`}
                >
                  {link.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Center: Command Bar Search Pill */}
        <div className="flex-1 max-w-md mx-4 hidden sm:block">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between bg-surface-subtle hover:bg-surface-raised border border-border-subtle hover:border-text-muted/30 rounded-lg px-3 py-1.5 transition-all text-left cursor-pointer group"
          >
            <div className="flex items-center gap-2 text-text-muted group-hover:text-text-primary min-w-0">
              <Search className="w-3.5 h-3.5 text-text-muted shrink-0" />
              <span className="text-xs text-text-muted truncate">
                Search 6,700+ components, themes & templates...
              </span>
            </div>
            <kbd className="pointer-events-none inline-flex items-center gap-0.5 text-[10px] font-mono uppercase text-text-muted bg-surface-base px-1.5 py-0.5 rounded border border-border-subtle">
              <span>⌘K</span>
            </kbd>
          </button>
        </div>

        {/* Right: Studio Shortcuts, Bookmarks, and CLI */}
        <div className="flex items-center gap-2">
          {/* Mobile search button */}
          <button
            onClick={onOpenSearch}
            className="sm:hidden p-2 text-text-muted hover:text-text-primary rounded-lg hover:bg-surface-subtle"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Prompt Studio pill */}
          <button
            onClick={onOpenPromptStudio}
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeSubApp === "prompt-studio"
                ? "bg-accent-violet-deep text-white"
                : "text-text-muted hover:text-text-primary hover:bg-surface-subtle"
            }`}
            title="AI Prompt Studio"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Prompt Studio</span>
          </button>

          {/* Website Builder pill */}
          <button
            onClick={onOpenWebsiteBuilder}
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeSubApp === "website-builder"
                ? "bg-accent-violet-deep text-white"
                : "text-text-muted hover:text-text-primary hover:bg-surface-subtle"
            }`}
            title="Website Builder"
          >
            <Wand2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Builder</span>
          </button>

          {/* CLI copy button */}
          <button
            onClick={handleCopyCli}
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-subtle hover:bg-surface-raised border border-border-subtle text-text-muted hover:text-text-primary font-mono text-xs transition-colors cursor-pointer"
            title="Copy CLI command"
          >
            <Terminal className="w-3.5 h-3.5 text-text-muted" />
            <span className="text-[11px]">npx elementra pull</span>
            {copiedCli ? (
              <Check className="w-3 h-3 text-terminal-emerald" />
            ) : (
              <Copy className="w-3 h-3 text-text-muted" />
            )}
          </button>

          {/* Bookmarks */}
          <button
            onClick={() => onSelectSection("bookmarks")}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
              activeSection === "bookmarks" && activeSubApp === "none"
                ? "bg-surface-raised border-border-subtle text-text-primary"
                : "border-border-subtle text-text-muted hover:text-text-primary hover:bg-surface-subtle"
            }`}
            title="Saved Bookmarks"
          >
            <Bookmark className={`w-3.5 h-3.5 ${bookmarksCount > 0 ? "fill-current text-primary" : ""}`} />
            <span className="text-xs font-mono">{bookmarksCount}</span>
          </button>

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-text-muted hover:text-text-primary rounded-lg hover:bg-surface-subtle cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border-subtle bg-surface-base px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onSelectSection(link.id)
                setMobileMenuOpen(false)
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium ${
                activeSection === link.id && activeSubApp === "none"
                  ? "bg-surface-raised text-text-primary"
                  : "text-text-muted hover:text-text-primary hover:bg-surface-subtle"
              }`}
            >
              <span>{link.label}</span>
            </button>
          ))}
          <div className="pt-2 border-t border-border-subtle flex gap-2">
            <button
              onClick={() => {
                onOpenPromptStudio()
                setMobileMenuOpen(false)
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-surface-subtle border border-border-subtle text-xs font-medium text-text-primary"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Prompt Studio</span>
            </button>
            <button
              onClick={() => {
                onOpenWebsiteBuilder()
                setMobileMenuOpen(false)
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-surface-subtle border border-border-subtle text-xs font-medium text-text-primary"
            >
              <Wand2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Builder</span>
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
