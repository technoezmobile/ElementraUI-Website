import React, { useState, useMemo, useEffect, useCallback } from "react"
import { fullCatalogueData } from "./data/catalogue"
import { CatalogueItem } from "./types/catalogue"
import { MarketplaceSection, ThemeItem, TemplateItem, AppItem, IconItem, VideoItem } from "./types/marketplace"
import { Header } from "./components/Header"
import { Sidebar } from "./components/Sidebar"
import { DiscoveryToolbar, FilterState } from "./components/DiscoveryToolbar"
import { CatalogueGrid } from "./components/CatalogueGrid"
import { MarketplaceSpotlight } from "./components/MarketplaceSpotlight"
import { PreviewModal } from "./components/PreviewModal"
import { PromptStudio } from "./components/PromptStudio/PromptStudio"
import { WebsiteBuilder } from "./components/WebsiteBuilder/WebsiteBuilder"
import { ThemesSection } from "./components/Themes/ThemesSection"
import { TemplatesSection } from "./components/Templates/TemplatesSection"
import { AppsSection } from "./components/Apps/AppsSection"
import { IconsSection } from "./components/Icons/IconsSection"
import { VideoSection } from "./components/Video/VideoSection"
import { BookmarksSection } from "./components/Bookmarks/BookmarksSection"
import { GlobalSearchModal, SearchResultItem } from "./components/GlobalSearch/GlobalSearchModal"
import { verifiedThemesData } from "./data/themesData"
import { verifiedTemplatesData } from "./data/templatesData"
import { verifiedAppsData } from "./data/appsData"
import { verifiedIconsData } from "./data/iconsData"
import { verifiedVideoData } from "./data/videoData"
import { loadBookmarksStore, saveBookmarksStore, BookmarksState } from "./data/bookmarksStore"
import { resolveAssetUrl } from "./utils/assetUrl"

export const App: React.FC = () => {
  // Navigation: 7 Marketplace Sections + 2 Workspace Studios
  const [activeSection, setActiveSection] = useState<MarketplaceSection>("components")
  const [activeSubApp, setActiveSubApp] = useState<"none" | "prompt-studio" | "website-builder">("none")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  // Master datasets
  const [awesomeCatalogue, setAwesomeCatalogue] = useState<CatalogueItem[]>([])
  const [isAwesomeLoading, setIsAwesomeLoading] = useState(true)

  // Bookmarks store with safe legacy migration
  const [bookmarksState, setBookmarksState] = useState<BookmarksState>(() => loadBookmarksStore())

  // Save bookmarks store to localStorage
  const handleUpdateBookmarksState = useCallback((newState: BookmarksState) => {
    setBookmarksState(newState)
    saveBookmarksStore(newState)
  }, [])

  // Universal toggle bookmark
  const toggleBookmark = useCallback((id: string, meta?: any) => {
    setBookmarksState((prev) => {
      const exists = prev.savedItemIds.includes(id)
      const nextSaved = exists ? prev.savedItemIds.filter((x) => x !== id) : [...prev.savedItemIds, id]

      const nextMeta = { ...prev.itemsMeta }
      if (exists) {
        delete nextMeta[id]
      } else if (meta) {
        nextMeta[id] = {
          id,
          section: meta.category ? "components" : "themes",
          title: meta.name || id,
          subtitle: meta.description || "",
          category: meta.category || meta.designStyle || "Asset",
          badgeLabel: "Saved",
          dateAdded: new Date().toISOString()
        }
      }

      // Keep default 'board-all' in sync
      const nextBoards = prev.boards.map((b) => {
        if (b.id === "board-all") {
          return { ...b, itemIds: nextSaved }
        }
        if (exists) {
          return { ...b, itemIds: b.itemIds.filter((x) => x !== id) }
        }
        return b
      })

      const newState = {
        savedItemIds: nextSaved,
        itemsMeta: nextMeta,
        boards: nextBoards
      }
      saveBookmarksStore(newState)
      return newState
    })
  }, [])

  const isBookmarked = useCallback((id: string) => {
    return bookmarksState.savedItemIds.includes(id)
  }, [bookmarksState.savedItemIds])

  // Combined master dataset: prioritize verified core items and preview-ready components
  const combinedCatalogue = useMemo(() => {
    const verifiedCore = fullCatalogueData.filter(
      (i) => i.previewStatus === "verified" || !!i.componentCode
    )
    const pendingCore = fullCatalogueData.filter(
      (i) => i.previewStatus !== "verified" && !i.componentCode
    )
    return [...verifiedCore, ...awesomeCatalogue, ...pendingCore]
  }, [awesomeCatalogue])

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    category: "All",
    source: "All",
    author: "All",
    itemType: "All",
    motionEngine: "All",
    previewStatus: "All",
    hasExecutable: false,
    hasHtmlSnapshot: false,
    hasScreenshot: false,
    hasPrompt: false,
    sortBy: "recent",
    viewMode: "grid"
  })

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(48)

  // Modal Lightbox state (Zero-shift centerpiece)
  const [selectedModalItem, setSelectedModalItem] = useState<CatalogueItem | null>(null)

  // Studio handoff prompt
  const [builderHandoffPrompt, setBuilderHandoffPrompt] = useState<string | undefined>()
  const [studioHandoffText, setStudioHandoffText] = useState<string | undefined>()
  const [studioHandoffTitle, setStudioHandoffTitle] = useState<string | undefined>()

  // Background load of awesome-catalogue.json
  useEffect(() => {
    setIsAwesomeLoading(true)
    fetch(resolveAssetUrl("data/awesome-catalogue.json"))
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((data: CatalogueItem[]) => {
        setAwesomeCatalogue(data)
        setIsAwesomeLoading(false)
      })
      .catch((err) => {
        console.warn("Could not load awesome-catalogue.json:", err)
        setIsAwesomeLoading(false)
      })
  }, [])

  // Top authors list
  const topAuthors = useMemo(() => {
    const counts: Record<string, number> = {}
    combinedCatalogue.forEach((item) => {
      const author = item.author.name
      counts[author] = (counts[author] || 0) + 1
    })
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([author]) => author)
  }, [combinedCatalogue])

  // Filter updating helper
  const handleUpdateFilters = useCallback((updates: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }))
    setCurrentPage(1)
  }, [])

  const handleResetFilters = useCallback(() => {
    setFilters({
      searchQuery: "",
      category: "All",
      source: "All",
      author: "All",
      itemType: "All",
      motionEngine: "All",
      previewStatus: "All",
      hasExecutable: false,
      hasHtmlSnapshot: false,
      hasScreenshot: false,
      hasPrompt: false,
      sortBy: "recent",
      viewMode: "grid"
    })
    setCurrentPage(1)
  }, [])

  // Multi-faceted filtering & sorting logic
  const filteredItems = useMemo(() => {
    const q = filters.searchQuery.toLowerCase().trim()

    return combinedCatalogue
      .filter((item) => {
        // Source
        if (filters.source !== "All") {
          const s = item.sourceRepo || "elementraui"
          if (filters.source === "elementraui" || filters.source === "21st-local") {
            if (s !== "elementraui" && s !== "21st-local") return false
          } else if (s !== filters.source) {
            return false
          }
        }

        // Author
        if (filters.author !== "All" && item.author.name !== filters.author) {
          return false
        }

        // Category
        if (filters.category !== "All" && item.category !== filters.category) {
          return false
        }

        // Content type
        if (filters.itemType !== "All" && item.itemType !== filters.itemType) {
          return false
        }

        // Motion Engine
        if (filters.motionEngine !== "All" && item.motionEngine !== filters.motionEngine) {
          return false
        }

        // Preview Status
        if (filters.previewStatus !== "All" && item.previewStatus !== filters.previewStatus) {
          return false
        }

        // Artifact flags
        if (filters.hasExecutable && (!item.componentCode || item.previewStatus !== "verified")) {
          return false
        }
        if (filters.hasHtmlSnapshot && !item.awesomeData?.hasHtml) {
          return false
        }
        if (filters.hasScreenshot && !item.awesomeData?.hasScreenshot) {
          return false
        }
        if (filters.hasPrompt && !item.promptData && !item.awesomeData?.hasPrompt) {
          return false
        }

        // Search query
        if (q) {
          const matchName = item.name.toLowerCase().includes(q)
          const matchDesc = item.description.toLowerCase().includes(q)
          const matchAuthor = item.author.name.toLowerCase().includes(q)
          const matchTags = item.tags.some((t) => t.toLowerCase().includes(q))
          const matchCategory = item.category.toLowerCase().includes(q)
          if (!matchName && !matchDesc && !matchAuthor && !matchTags && !matchCategory) {
            return false
          }
        }

        return true
      })
      .sort((a, b) => {
        if (filters.sortBy === "name") return a.name.localeCompare(b.name)
        if (filters.sortBy === "category") return a.category.localeCompare(b.category)
        if (filters.sortBy === "author") return a.author.name.localeCompare(b.author.name)
        return 0
      })
  }, [combinedCatalogue, filters])

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize))
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredItems.slice(start, start + pageSize)
  }, [filteredItems, currentPage, pageSize])

  // Modal Open & Close with URL Synchronization
  const handleOpenItem = useCallback((item: CatalogueItem) => {
    setSelectedModalItem(item)
    const url = new URL(window.location.href)
    url.searchParams.set("item", item.slug || item.id)
    window.history.pushState({ itemId: item.id }, "", url.toString())
  }, [])

  const handleCloseModal = useCallback(() => {
    setSelectedModalItem(null)
    const url = new URL(window.location.href)
    url.searchParams.delete("item")
    window.history.pushState({}, "", url.toString())
  }, [])

  // In-place navigation within the modal
  const handleModalSelectItem = useCallback((item: CatalogueItem) => {
    setSelectedModalItem(item)
    const url = new URL(window.location.href)
    url.searchParams.set("item", item.slug || item.id)
    window.history.replaceState({ itemId: item.id }, "", url.toString())
  }, [])

  // Lock background scroll when modal is open without shifting scroll position
  useEffect(() => {
    if (selectedModalItem) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [selectedModalItem])

  // Restore modal from URL on popstate or on initial page load
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search)
      const itemId = params.get("item")
      if (itemId) {
        const found = combinedCatalogue.find((x) => x.id === itemId || x.slug === itemId)
        if (found) setSelectedModalItem(found)
      } else {
        setSelectedModalItem(null)
      }
    }
    handlePopState()
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [combinedCatalogue])

  // Studio handoff
  const handleSendToBuilder = (prompt: string) => {
    setBuilderHandoffPrompt(prompt)
    setActiveSubApp("website-builder")
  }

  const handleSendToPromptStudio = (prompt: string, title?: string) => {
    setStudioHandoffText(prompt)
    setStudioHandoffTitle(title)
    setActiveSubApp("prompt-studio")
  }

  // Handle Global Search Result Click
  const handleSelectSearchResult = (result: SearchResultItem) => {
    if (result.section === "components" && result.originalItem) {
      handleOpenItem(result.originalItem)
    } else {
      setActiveSection(result.section)
      setActiveSubApp("none")
    }
  }

  // Handle opening item from Bookmarks
  const handleOpenBookmarkItem = (itemId: string, section?: MarketplaceSection) => {
    const comp = combinedCatalogue.find((x) => x.id === itemId)
    if (comp) {
      handleOpenItem(comp)
      return
    }
    if (section && section !== "components") {
      setActiveSection(section)
      setActiveSubApp("none")
    }
  }

  const itemCounts = {
    components: combinedCatalogue.length,
    themes: verifiedThemesData.length,
    templates: verifiedTemplatesData.length,
    apps: verifiedAppsData.length,
    icons: verifiedIconsData.length,
    video: verifiedVideoData.length,
    bookmarks: bookmarksState.savedItemIds.length
  }

  return (
    <div className="h-screen bg-surface-base text-text-primary flex flex-col font-sans overflow-hidden selection:bg-white/20 selection:text-white">
      {/* 1. Global Master Header */}
      <Header
        activeSection={activeSection}
        onSelectSection={(sec) => {
          setActiveSection(sec)
          setActiveSubApp("none")
        }}
        totalItemCount={combinedCatalogue.length + verifiedThemesData.length + verifiedTemplatesData.length + verifiedAppsData.length + verifiedIconsData.length + verifiedVideoData.length}
        bookmarksCount={bookmarksState.savedItemIds.length}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenPromptStudio={() => setActiveSubApp("prompt-studio")}
        onOpenWebsiteBuilder={() => setActiveSubApp("website-builder")}
        activeSubApp={activeSubApp}
      />

      {/* 2. Platform Main Layout with Left Sidebar + Active Hub Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          activeSection={activeSection}
          onSelectSection={(sec) => {
            setActiveSection(sec)
            setActiveSubApp("none")
          }}
          onOpenPromptStudio={() => setActiveSubApp("prompt-studio")}
          onOpenWebsiteBuilder={() => setActiveSubApp("website-builder")}
          activeSubApp={activeSubApp}
          itemCounts={itemCounts}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        />

        {/* Workspace Hub Area */}
        <div className="flex-1 overflow-y-auto flex flex-col bg-surface-base">
          {activeSubApp === "prompt-studio" ? (
            <PromptStudio initialPrompt={studioHandoffText} initialTitle={studioHandoffTitle} />
          ) : activeSubApp === "website-builder" ? (
            <WebsiteBuilder initialPrompt={builderHandoffPrompt} />
          ) : activeSection === "themes" ? (
            <ThemesSection
              onApplyThemeToBuilder={(theme) => handleSendToBuilder(`Apply "${theme.name}" design system:\n${theme.cssVariables}`)}
              onToggleBookmark={(id, t) => toggleBookmark(id, t)}
              isBookmarked={isBookmarked}
            />
          ) : activeSection === "templates" ? (
            <TemplatesSection
              onSendToBuilder={handleSendToBuilder}
              onToggleBookmark={(id, tmpl) => toggleBookmark(id, tmpl)}
              isBookmarked={isBookmarked}
            />
          ) : activeSection === "apps" ? (
            <AppsSection
              onSendToBuilder={handleSendToBuilder}
              onToggleBookmark={(id, app) => toggleBookmark(id, app)}
              isBookmarked={isBookmarked}
            />
          ) : activeSection === "icons" ? (
            <IconsSection
              onInsertIntoBuilder={(svg, name) => handleSendToBuilder(`Insert vector icon "${name}":\n${svg}`)}
              onToggleBookmark={(id, ico) => toggleBookmark(id, ico)}
              isBookmarked={isBookmarked}
            />
          ) : activeSection === "video" ? (
            <VideoSection
              onToggleBookmark={(id, vid) => toggleBookmark(id, vid)}
              isBookmarked={isBookmarked}
            />
          ) : activeSection === "bookmarks" ? (
            <BookmarksSection
              bookmarksState={bookmarksState}
              onUpdateBookmarksState={handleUpdateBookmarksState}
              onOpenItemById={handleOpenBookmarkItem}
            />
          ) : (
            /* 3. Components Hub Discovery Experience */
            <div className="flex-1 flex flex-col">
              <DiscoveryToolbar
                filters={filters}
                onUpdateFilters={handleUpdateFilters}
                onResetFilters={handleResetFilters}
                totalCount={combinedCatalogue.length}
                filteredCount={filteredItems.length}
                topAuthors={topAuthors.slice(0, 30)}
              />

              <main className="flex-1 flex flex-col">
                {currentPage === 1 && !filters.searchQuery && filters.source === "All" && (
                  <div className="p-4 lg:p-6 pb-0">
                    <MarketplaceSpotlight
                      onOpenItem={handleOpenItem}
                      featuredItems={combinedCatalogue.filter((i) => i.previewStatus === "verified" || !!i.componentCode).slice(0, 6)}
                      isFavorite={isBookmarked}
                      onToggleFavorite={(id) => {
                        const it = combinedCatalogue.find((x) => x.id === id)
                        toggleBookmark(id, it)
                      }}
                      onSelectCategory={(cat) => handleUpdateFilters({ category: cat })}
                      activeCategory={filters.category}
                    />
                  </div>
                )}

                <CatalogueGrid
                  items={paginatedItems}
                  currentPage={currentPage}
                  pageSize={pageSize}
                  totalPages={totalPages}
                  totalCount={filteredItems.length}
                  viewMode={filters.viewMode}
                  onSelectPage={setCurrentPage}
                  onSelectPageSize={(sz) => {
                    setPageSize(sz)
                    setCurrentPage(1)
                  }}
                  onOpenItem={handleOpenItem}
                  favorites={bookmarksState.savedItemIds}
                  onToggleFavorite={(id) => {
                    const it = combinedCatalogue.find((x) => x.id === id)
                    toggleBookmark(id, it)
                  }}
                  onResetFilters={handleResetFilters}
                />
              </main>
            </div>
          )}
        </div>
      </div>

      {/* 3. Centerpiece Component Preview Modal (Zero-shift background lightbox) */}
      {selectedModalItem && (
        <PreviewModal
          item={selectedModalItem}
          allItems={filteredItems.length > 0 ? filteredItems : combinedCatalogue}
          onClose={handleCloseModal}
          onSelectItem={handleModalSelectItem}
          isFavorite={isBookmarked(selectedModalItem.id)}
          onToggleFavorite={(id) => toggleBookmark(id, selectedModalItem)}
          onSendToBuilder={handleSendToBuilder}
          onSendToPromptStudio={handleSendToPromptStudio}
        />
      )}

      {/* 4. Global Multi-Section Search Modal (Cmd+K) */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        componentsCatalogue={combinedCatalogue}
        onSelectResult={handleSelectSearchResult}
      />
    </div>
  )
}

export default App
