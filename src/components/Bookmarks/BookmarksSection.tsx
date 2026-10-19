import React, { useState } from "react"
import { CollectionBoard, BookmarkedItemMeta, MarketplaceSection } from "../../types/marketplace"
import { BookmarksState } from "../../data/bookmarksStore"
import {
  Bookmark,
  FolderPlus,
  Trash2,
  Share2,
  Download,
  Plus,
  Check,
  Search,
  Layers,
  Palette,
  Layout,
  Cpu,
  Shapes,
  Film,
  Sparkles,
  ExternalLink,
  Code2
} from "lucide-react"

interface BookmarksSectionProps {
  bookmarksState: BookmarksState
  onUpdateBookmarksState: (newState: BookmarksState) => void
  onOpenItemById: (id: string, section?: MarketplaceSection) => void
}

export const BookmarksSection: React.FC<BookmarksSectionProps> = ({
  bookmarksState,
  onUpdateBookmarksState,
  onOpenItemById
}) => {
  const [selectedBoardId, setSelectedBoardId] = useState<string>("board-all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreatingBoard, setIsCreatingBoard] = useState(false)
  const [newBoardTitle, setNewBoardTitle] = useState("")
  const [newBoardDesc, setNewBoardDesc] = useState("")
  const [newBoardColor, setNewBoardColor] = useState("from-accent-violet-deep to-primary")
  const [copiedExport, setCopiedExport] = useState(false)

  const activeBoard =
    bookmarksState.boards.find((b) => b.id === selectedBoardId) || bookmarksState.boards[0]

  const colorOptions = [
    "from-accent-violet-deep to-primary",
    "from-secondary to-blue-600",
    "from-terminal-emerald to-teal-500",
    "from-terminal-amber to-rose-500",
    "from-terminal-rose to-purple-600",
    "from-surface-raised to-surface-bright"
  ]

  const handleCreateBoard = () => {
    if (!newBoardTitle.trim()) return
    const newBoard: CollectionBoard = {
      id: `board-${Date.now()}`,
      title: newBoardTitle.trim(),
      description: newBoardDesc.trim() || "Custom collection board.",
      coverColor: newBoardColor,
      itemIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    const updatedBoards = [...bookmarksState.boards, newBoard]
    onUpdateBookmarksState({ ...bookmarksState, boards: updatedBoards })
    setSelectedBoardId(newBoard.id)
    setIsCreatingBoard(false)
    setNewBoardTitle("")
    setNewBoardDesc("")
  }

  const handleDeleteBoard = (id: string) => {
    if (id === "board-all") return
    const updatedBoards = bookmarksState.boards.filter((b) => b.id !== id)
    onUpdateBookmarksState({ ...bookmarksState, boards: updatedBoards })
    setSelectedBoardId("board-all")
  }

  const handleRemoveFromBoard = (itemId: string) => {
    const updatedBoards = bookmarksState.boards.map((b) => {
      if (b.id === selectedBoardId || selectedBoardId === "board-all") {
        return { ...b, itemIds: b.itemIds.filter((id) => id !== itemId) }
      }
      return b
    })
    const updatedSavedIds = bookmarksState.savedItemIds.filter((id) => id !== itemId)
    onUpdateBookmarksState({
      ...bookmarksState,
      boards: updatedBoards,
      savedItemIds: selectedBoardId === "board-all" ? updatedSavedIds : bookmarksState.savedItemIds
    })
  }

  const exportBoard = () => {
    const data = {
      board: activeBoard.title,
      description: activeBoard.description,
      exportDate: new Date().toISOString(),
      itemCount: activeBoard.itemIds.length,
      items: activeBoard.itemIds.map((id) => bookmarksState.itemsMeta[id] || { id })
    }
    navigator.clipboard.writeText(JSON.stringify(data, null, 2))
    setCopiedExport(true)
    setTimeout(() => setCopiedExport(false), 2000)
  }

  return (
    <div className="flex-1 flex flex-col p-4 lg:p-6 space-y-6 bg-surface-base">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-subtle">
        <div>
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-primary" />
            <h2 className="font-headline-lg text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
              Personal Workspace & Boards
            </h2>
          </div>
          <p className="font-body-sm text-xs text-text-muted mt-1 leading-relaxed">
            Curate design systems, inspect saved components, and export organized project boards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportBoard}
            className="px-3.5 py-1.5 rounded-lg bg-surface-raised hover:bg-surface-container border border-border-subtle text-xs font-code-inline text-text-primary flex items-center gap-1.5 transition-colors shadow-sm"
          >
            {copiedExport ? <Check className="w-3.5 h-3.5 text-terminal-emerald" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedExport ? "Board Exported!" : "Export Board JSON"}</span>
          </button>
          <button
            onClick={() => setIsCreatingBoard(true)}
            className="px-3.5 py-1.5 rounded-lg bg-accent-violet-deep hover:bg-accent-violet-deep/90 text-white font-headline-sm text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md shadow-accent-violet-deep/20"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>New Board</span>
          </button>
        </div>
      </div>

      {/* Boards Tabs Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {bookmarksState.boards.map((b) => (
          <button
            key={b.id}
            onClick={() => setSelectedBoardId(b.id)}
            className={`px-3.5 py-2 rounded-lg text-xs font-medium shrink-0 flex items-center gap-2 transition-all ${
              selectedBoardId === b.id
                ? "bg-accent-violet-deep text-white shadow-sm font-semibold"
                : "bg-surface-subtle border border-border-subtle text-text-muted hover:text-text-primary hover:bg-surface-raised"
            }`}
          >
            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${b.coverColor}`} />
            <span>{b.title}</span>
            <span
              className={`font-badge-label text-[10px] px-1.5 py-0.2 rounded ${
                selectedBoardId === b.id ? "bg-black/25 text-white/90" : "bg-surface-base text-text-muted"
              }`}
            >
              {b.itemIds.length}
            </span>
          </button>
        ))}
      </div>

      {/* Selected Board Information Banner */}
      <div className="p-4 rounded-xl bg-surface-subtle border border-border-subtle flex items-center justify-between">
        <div>
          <h3 className="font-headline-sm text-sm font-bold text-text-primary">{activeBoard.title}</h3>
          <p className="font-body-sm text-xs text-text-muted mt-0.5">{activeBoard.description}</p>
        </div>

        {activeBoard.id !== "board-all" && (
          <button
            onClick={() => handleDeleteBoard(activeBoard.id)}
            className="p-1.5 rounded-lg text-terminal-rose hover:bg-terminal-rose/10 border border-transparent hover:border-terminal-rose/30 transition-colors"
            title="Delete custom board"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Items in this Board */}
      {activeBoard.itemIds.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-3 bg-surface-subtle rounded-xl border border-border-subtle">
          <Bookmark className="w-10 h-10 text-text-muted/60" />
          <h4 className="font-headline-sm text-sm font-bold text-text-primary">No items in this board yet</h4>
          <p className="font-body-sm text-xs text-text-muted max-w-sm leading-relaxed">
            Browse Components, Themes, Templates, Apps, or Icons and click the bookmark ribbon to save items here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {activeBoard.itemIds.map((itemId) => {
            const meta = bookmarksState.itemsMeta[itemId] || {
              id: itemId,
              title: itemId,
              category: "Saved Asset",
              badgeLabel: "Bookmarked"
            }

            return (
              <div
                key={itemId}
                onClick={() => onOpenItemById(itemId, meta.section)}
                className="rounded-xl border border-border-subtle bg-surface-subtle hover:border-primary/50 hover:shadow-xl card-halo-hover transition-all p-4 flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-badge-label text-[10px] px-2 py-0.5 rounded bg-surface-base border border-border-subtle text-primary font-semibold">
                      {meta.category || "Asset"}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveFromBoard(itemId)
                      }}
                      className="p-1 rounded text-text-muted hover:text-terminal-rose transition-colors"
                      title="Remove from board"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 className="font-headline-sm text-sm font-bold text-text-primary group-hover:text-primary transition-colors truncate">
                    {meta.title || itemId}
                  </h4>
                  <p className="font-body-sm text-xs text-text-muted line-clamp-2 mt-1 leading-relaxed">
                    {meta.subtitle || `Saved asset from ${meta.section || "catalogue"}`}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-border-subtle flex items-center justify-between font-code-inline text-xs">
                  <span className="text-[10px] text-text-muted capitalize">{meta.section || "item"}</span>
                  <span className="text-primary font-semibold group-hover:translate-x-0.5 transition-transform">
                    Open →
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* New Board Modal */}
      {isCreatingBoard && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in"
          onClick={() => setIsCreatingBoard(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-surface-base border border-border-subtle rounded-2xl p-6 shadow-2xl space-y-4"
          >
            <h3 className="font-headline-sm text-lg font-bold text-text-primary">Create Custom Board</h3>
            <input
              type="text"
              value={newBoardTitle}
              onChange={(e) => setNewBoardTitle(e.target.value)}
              placeholder="Board title (e.g., Q4 Design System)"
              className="w-full px-3 py-2 rounded-lg bg-surface-subtle border border-border-subtle text-xs text-text-primary focus:outline-none focus:border-accent-violet-deep"
            />
            <textarea
              value={newBoardDesc}
              onChange={(e) => setNewBoardDesc(e.target.value)}
              rows={3}
              placeholder="Board description..."
              className="w-full px-3 py-2 rounded-lg bg-surface-subtle border border-border-subtle text-xs text-text-primary focus:outline-none focus:border-accent-violet-deep resize-none"
            />

            <div>
              <span className="font-metric-label text-[10px] text-text-muted uppercase block mb-2">Accent Gradient:</span>
              <div className="flex gap-2">
                {colorOptions.map((c) => (
                  <button
                    key={c}
                    onClick={() => setNewBoardColor(c)}
                    className={`w-7 h-7 rounded-full bg-gradient-to-r ${c} border ${
                      newBoardColor === c ? "border-white scale-110" : "border-transparent opacity-70"
                    } transition-all`}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border-subtle">
              <button
                onClick={() => setIsCreatingBoard(false)}
                className="px-4 py-2 rounded-lg bg-surface-subtle text-text-muted hover:text-text-primary text-xs font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateBoard}
                className="px-4 py-2 rounded-lg bg-accent-violet-deep hover:bg-accent-violet-deep/90 text-white text-xs font-semibold shadow-md shadow-accent-violet-deep/20"
              >
                Create Board
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
