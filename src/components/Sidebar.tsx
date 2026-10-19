import React from "react"
import { MarketplaceSection } from "../types/marketplace"
import {
  Layers,
  Palette,
  Layout,
  Cpu,
  Shapes,
  Film,
  Bookmark,
  Sparkles,
  Wand2,
  ChevronLeft,
  ChevronRight,
  FolderOpen
} from "lucide-react"

interface SidebarProps {
  activeSection: MarketplaceSection
  onSelectSection: (section: MarketplaceSection) => void
  onOpenPromptStudio: () => void
  onOpenWebsiteBuilder: () => void
  activeSubApp: "none" | "prompt-studio" | "website-builder"
  itemCounts: {
    components: number
    themes: number
    templates: number
    apps: number
    icons: number
    video: number
    bookmarks: number
  }
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSelectSection,
  onOpenPromptStudio,
  onOpenWebsiteBuilder,
  activeSubApp,
  itemCounts,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const navigationItems = [
    {
      id: "components" as MarketplaceSection,
      name: "Components",
      icon: Layers,
      count: itemCounts.components
    },
    {
      id: "themes" as MarketplaceSection,
      name: "Themes",
      icon: Palette,
      count: itemCounts.themes
    },
    {
      id: "templates" as MarketplaceSection,
      name: "Templates",
      icon: Layout,
      count: itemCounts.templates
    },
    {
      id: "apps" as MarketplaceSection,
      name: "Apps",
      icon: Cpu,
      count: itemCounts.apps
    },
    {
      id: "icons" as MarketplaceSection,
      name: "Icons",
      icon: Shapes,
      count: itemCounts.icons
    },
    {
      id: "video" as MarketplaceSection,
      name: "Video & Motion",
      icon: Film,
      count: itemCounts.video
    }
  ]

  if (isCollapsed) {
    return (
      <aside className="hidden lg:flex w-12 shrink-0 bg-surface-subtle/80 border-r border-border-subtle flex-col justify-between py-3 items-center select-none z-30 transition-all duration-200">
        <div className="flex flex-col items-center gap-4 w-full">
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="p-1.5 rounded-md hover:bg-surface-raised text-text-muted hover:text-text-primary transition-colors cursor-pointer"
              title="Expand sidebar"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          <div className="flex flex-col items-center gap-1 w-full px-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = activeSection === item.id && activeSubApp === "none"
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectSection(item.id)}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                    isActive
                      ? "bg-surface-raised text-text-primary shadow-sm"
                      : "text-text-muted hover:text-text-primary hover:bg-surface-raised"
                  }`}
                  title={`${item.name} (${item.count})`}
                >
                  <Icon className="w-4 h-4" />
                </button>
              )
            })}
          </div>
        </div>

        <button
          onClick={() => onSelectSection("bookmarks")}
          className={`w-9 h-9 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
            activeSection === "bookmarks" && activeSubApp === "none"
              ? "bg-surface-raised text-text-primary shadow-sm"
              : "text-text-muted hover:text-text-primary hover:bg-surface-raised"
          }`}
          title={`Bookmarks (${itemCounts.bookmarks})`}
        >
          <Bookmark className="w-4 h-4" />
        </button>
      </aside>
    )
  }

  return (
    <aside className="hidden lg:flex w-56 shrink-0 bg-surface-subtle/70 border-r border-border-subtle flex-col justify-between select-none z-30 transition-all duration-200">
      <div className="flex flex-col p-2.5">
        {/* Header with Collapse Button */}
        <div className="flex items-center justify-between px-2 py-1.5 mb-2">
          <span className="text-[11px] font-medium text-text-muted uppercase tracking-wider">
            Catalogue
          </span>
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="p-1 rounded hover:bg-surface-raised text-text-muted hover:text-text-primary transition-colors cursor-pointer"
              title="Collapse sidebar"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-0.5">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id && activeSubApp === "none"

            return (
              <button
                key={item.id}
                onClick={() => onSelectSection(item.id)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  isActive
                    ? "bg-surface-raised text-text-primary font-medium"
                    : "text-text-muted hover:bg-surface-raised/70 hover:text-text-primary"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{item.name}</span>
                </div>
                <span className="text-[11px] font-mono text-text-muted/70 tabular-nums">
                  {item.count.toLocaleString()}
                </span>
              </button>
            )
          })}
        </nav>

        {/* Workspace Studios */}
        <div className="px-2 pt-4 pb-1">
          <span className="text-[11px] font-medium text-text-muted uppercase tracking-wider">
            Workspace
          </span>
        </div>

        <div className="flex flex-col gap-0.5">
          <button
            onClick={() => onSelectSection("bookmarks")}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
              activeSection === "bookmarks" && activeSubApp === "none"
                ? "bg-surface-raised text-text-primary font-medium"
                : "text-text-muted hover:bg-surface-raised/70 hover:text-text-primary"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Bookmark className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Saved Bookmarks</span>
            </div>
            <span className="text-[11px] font-mono text-text-muted/70 tabular-nums">
              {itemCounts.bookmarks}
            </span>
          </button>

          <button
            onClick={onOpenPromptStudio}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
              activeSubApp === "prompt-studio"
                ? "bg-surface-raised text-text-primary font-medium"
                : "text-text-muted hover:bg-surface-raised/70 hover:text-text-primary"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Sparkles className="w-3.5 h-3.5 shrink-0 text-amber-400" />
              <span className="truncate">Prompt Studio</span>
            </div>
          </button>

          <button
            onClick={onOpenWebsiteBuilder}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
              activeSubApp === "website-builder"
                ? "bg-surface-raised text-text-primary font-medium"
                : "text-text-muted hover:bg-surface-raised/70 hover:text-text-primary"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Wand2 className="w-3.5 h-3.5 shrink-0 text-blue-400" />
              <span className="truncate">Website Builder</span>
            </div>
          </button>
        </div>
      </div>

      {/* Clean minimal footer */}
      <div className="p-3 border-t border-border-subtle flex items-center justify-between text-xs text-text-muted">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-terminal-emerald" />
          <span className="text-[11px] font-mono">Registry Ready</span>
        </div>
        <span className="text-[10px] font-mono text-text-muted/60">v2.5</span>
      </div>
    </aside>
  )
}
