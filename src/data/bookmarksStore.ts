import { CollectionBoard, BookmarkedItemMeta, MarketplaceSection } from "../types/marketplace"

const STORAGE_KEY_BOARDS = "elementraui_custom_boards_v1"
const STORAGE_KEY_BOOKMARKS = "elementraui_bookmarks_metadata_v1"
const STORAGE_KEY_FAVORITES = "elementraui_favorites"

// Legacy fallback keys
const LEGACY_STORAGE_KEY_BOARDS = "21st_local_custom_boards_v1"
const LEGACY_STORAGE_KEY_BOOKMARKS = "21st_local_bookmarks_metadata_v1"
const LEGACY_FAVORITES_KEY = "21st_local_favorites"

export interface BookmarksState {
  savedItemIds: string[]
  itemsMeta: Record<string, BookmarkedItemMeta>
  boards: CollectionBoard[]
}

const DEFAULT_BOARDS: CollectionBoard[] = [
  {
    id: "board-all",
    title: "All Saved Assets",
    description: "Master cross-section library of all bookmarked components, themes, templates, apps, and icons.",
    coverColor: "from-cyan-500 to-blue-600",
    itemIds: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "board-components",
    title: "Favorite Components",
    description: "Curated UI components for upcoming sprint builds.",
    coverColor: "from-emerald-500 to-teal-600",
    itemIds: ["floating-sphere-3d", "magicui-lens", "magicui-magic-card"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "board-themes",
    title: "Design System Inspiration",
    description: "Saved palettes and design token specifications.",
    coverColor: "from-purple-500 to-indigo-600",
    itemIds: ["theme-zinc-modernist", "theme-cyber-neon-contrast"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

export function loadBookmarksStore(): BookmarksState {
  try {
    // 1. Read existing custom boards (prefer ElementraUI key, fallback to legacy)
    let boards: CollectionBoard[] = DEFAULT_BOARDS
    const savedBoardsRaw = localStorage.getItem(STORAGE_KEY_BOARDS) || localStorage.getItem(LEGACY_STORAGE_KEY_BOARDS)
    if (savedBoardsRaw) {
      boards = JSON.parse(savedBoardsRaw)
    }

    // 2. Read saved items metadata (prefer ElementraUI key, fallback to legacy)
    let itemsMeta: Record<string, BookmarkedItemMeta> = {}
    const savedMetaRaw = localStorage.getItem(STORAGE_KEY_BOOKMARKS) || localStorage.getItem(LEGACY_STORAGE_KEY_BOOKMARKS)
    if (savedMetaRaw) {
      itemsMeta = JSON.parse(savedMetaRaw)
    }

    // 3. Migrate legacy favorites safely without data loss
    const legacyFavsRaw = localStorage.getItem(STORAGE_KEY_FAVORITES) || localStorage.getItem(LEGACY_FAVORITES_KEY)
    let legacyIds: string[] = []
    if (legacyFavsRaw) {
      legacyIds = JSON.parse(legacyFavsRaw)
    }

    // Ensure all legacy items are in the master list
    const allSet = new Set<string>([...legacyIds, ...Object.keys(itemsMeta)])
    boards.forEach((b) => b.itemIds.forEach((id) => allSet.add(id)))

    const savedItemIds = Array.from(allSet)

    // Sync back to boards[0] (All Saved)
    const allBoard = boards.find((b) => b.id === "board-all")
    if (allBoard) {
      allBoard.itemIds = savedItemIds
    }

    return {
      savedItemIds,
      itemsMeta,
      boards
    }
  } catch (err) {
    console.warn("Could not load bookmarks store:", err)
    return {
      savedItemIds: ["floating-sphere-3d", "magicui-lens", "magicui-magic-card"],
      itemsMeta: {},
      boards: DEFAULT_BOARDS
    }
  }
}

export function saveBookmarksStore(state: BookmarksState): void {
  try {
    localStorage.setItem(STORAGE_KEY_BOARDS, JSON.stringify(state.boards))
    localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(state.itemsMeta))
    localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(state.savedItemIds))
    // Also keep legacy keys in sync for backward compatibility
    localStorage.setItem(LEGACY_STORAGE_KEY_BOARDS, JSON.stringify(state.boards))
    localStorage.setItem(LEGACY_STORAGE_KEY_BOOKMARKS, JSON.stringify(state.itemsMeta))
    localStorage.setItem(LEGACY_FAVORITES_KEY, JSON.stringify(state.savedItemIds))
  } catch (err) {
    console.warn("Could not persist bookmarks store:", err)
  }
}
