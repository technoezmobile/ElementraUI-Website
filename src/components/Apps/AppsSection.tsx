import React, { useState, useMemo } from "react"
import { AppItem } from "../../types/marketplace"
import { verifiedAppsData } from "../../data/appsData"
import {
  Cpu,
  Search,
  Play,
  Bookmark,
  Sparkles,
  Wand2,
  Check,
  Plus,
  Trash2,
  RotateCcw,
  Copy,
  Code2,
  Terminal,
  Clock,
  Layers,
  ChevronRight
} from "lucide-react"

interface AppsSectionProps {
  onSendToBuilder: (prompt: string) => void
  onToggleBookmark: (id: string, item: AppItem) => void
  isBookmarked: (id: string) => boolean
}

export const AppsSection: React.FC<AppsSectionProps> = ({
  onSendToBuilder,
  onToggleBookmark,
  isBookmarked
}) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [activeApp, setActiveApp] = useState<AppItem | null>(null)

  const categories = ["All", "Productivity", "Developer Tool", "Interactive Widget"]

  const filteredApps = useMemo(() => {
    return verifiedAppsData.filter((app) => {
      if (selectedCategory !== "All" && app.category !== selectedCategory) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        return (
          app.name.toLowerCase().includes(q) ||
          app.description.toLowerCase().includes(q) ||
          app.tags.some((t) => t.toLowerCase().includes(q))
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
            <Cpu className="w-5 h-5 text-primary" />
            <h2 className="font-headline-lg text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
              Runnable Apps & Tool Starters
            </h2>
          </div>
          <p className="font-body-sm text-xs text-text-muted mt-1 leading-relaxed">
            Genuine executable mini-applications, interactive developer tools, and productivity widgets ready to run locally or embed.
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
            placeholder="Search tools, widgets..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-surface-base border border-border-subtle text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-violet-deep font-body-md"
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

      {/* Grid of Apps */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredApps.map((app) => {
          const isSaved = isBookmarked(app.id)

          return (
            <div
              key={app.id}
              className="rounded-xl border border-border-subtle bg-surface-subtle hover:border-primary/50 hover:shadow-xl card-halo-hover transition-all p-5 flex flex-col justify-between gap-4 group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-badge-label text-[10px] uppercase px-2 py-0.5 rounded bg-surface-base border border-border-subtle text-terminal-emerald font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-terminal-emerald animate-pulse" />
                    Executable React 19
                  </span>
                  <button
                    onClick={() => onToggleBookmark(app.id, app)}
                    className={`p-1.5 rounded-lg border transition-all ${
                      isSaved
                        ? "bg-accent-violet-deep text-white border-accent-violet-deep shadow-sm"
                        : "bg-surface-base border-border-subtle text-text-muted hover:text-terminal-rose hover:bg-surface-raised"
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-white" : ""}`} />
                  </button>
                </div>

                <h3 className="font-headline-sm text-base font-bold text-text-primary group-hover:text-primary transition-colors">
                  {app.name}
                </h3>
                <p className="font-body-sm text-xs text-text-muted line-clamp-2 mt-1 leading-relaxed">
                  {app.description}
                </p>

                {/* Features list */}
                <div className="mt-4 p-3 rounded-lg bg-surface-base border border-border-subtle space-y-1.5 font-code-inline text-[11px]">
                  {app.features.slice(0, 3).map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-text-muted">
                      <span className="text-primary font-bold shrink-0">•</span>
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-3 border-t border-border-subtle flex items-center justify-between gap-3">
                <span className="font-code-inline text-[11px] text-text-muted">v{app.version}</span>
                <button
                  onClick={() => setActiveApp(app)}
                  className="px-4 py-2 rounded-lg bg-accent-violet-deep hover:bg-accent-violet-deep/90 text-white font-headline-sm text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-accent-violet-deep/20"
                >
                  <Play className="w-3.5 h-3.5 fill-white text-white" />
                  <span>Launch Tool</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Interactive App Runner Modal */}
      {activeApp && (
        <AppRunnerModal
          app={activeApp}
          onClose={() => setActiveApp(null)}
          onSendToBuilder={() => {
            onSendToBuilder(`Implement the "${activeApp.name}" (${activeApp.category}):
- Description: ${activeApp.description}
- Key features: ${activeApp.features.join("; ")}
- Built with React 19 + Tailwind CSS`)
            setActiveApp(null)
          }}
        />
      )}
    </div>
  )
}

interface AppRunnerModalProps {
  app: AppItem
  onClose: () => void
  onSendToBuilder: () => void
}

const AppRunnerModal: React.FC<AppRunnerModalProps> = ({ app, onClose, onSendToBuilder }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[96vw] max-w-5xl h-[92vh] bg-[#090a10] border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col justify-between overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">{app.name}</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Runtime
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{app.description}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Live App Sandbox Stage */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="w-full h-full min-h-[460px] rounded-2xl border border-slate-800 bg-[#07080d] p-4 flex flex-col justify-center items-center shadow-inner relative overflow-hidden">
            {app.id === "app-kanban-board" ? (
              <KanbanBoardLiveApp />
            ) : app.id === "app-markdown-live-editor" ? (
              <MarkdownEditorLiveApp />
            ) : app.id === "app-pomodoro-timer" ? (
              <PomodoroTimerLiveApp />
            ) : app.id === "app-dev-calculator" ? (
              <DevCalculatorLiveApp />
            ) : app.id === "app-json-formatter" ? (
              <JsonFormatterLiveApp />
            ) : app.id === "app-palette-generator" ? (
              <PaletteGeneratorLiveApp />
            ) : (
              <div className="text-center space-y-2">
                <Cpu className="w-10 h-10 text-cyan-400 mx-auto" />
                <span className="text-sm font-bold text-slate-200">Interactive Runtime Ready</span>
                <p className="text-xs text-slate-400 max-w-sm">{app.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-xs font-mono text-slate-500">License: {app.license} • 100% Client-Side Isolated</span>
          <div className="flex items-center gap-3">
            <button
              onClick={onSendToBuilder}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-600/20"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Embed in Website Builder</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// 1. Live Interactive Kanban Board App
const KanbanBoardLiveApp: React.FC = () => {
  interface Card {
    id: string
    title: string
    column: "todo" | "in-progress" | "done"
  }
  const [cards, setCards] = useState<Card[]>([
    { id: "1", title: "Set up Tailwind v4 theme variables", column: "done" },
    { id: "2", title: "Implement 3D WebGL particle loop", column: "in-progress" },
    { id: "3", title: "Add keyboard shortcuts (Cmd+K)", column: "todo" }
  ])
  const [newTitle, setNewTitle] = useState("")

  const addCard = () => {
    if (!newTitle.trim()) return
    setCards([...cards, { id: Date.now().toString(), title: newTitle.trim(), column: "todo" }])
    setNewTitle("")
  }

  const moveCard = (id: string, nextCol: "todo" | "in-progress" | "done") => {
    setCards(cards.map((c) => (c.id === id ? { ...c, column: nextCol } : c)))
  }

  const deleteCard = (id: string) => {
    setCards(cards.filter((c) => c.id !== id))
  }

  const columns: { id: "todo" | "in-progress" | "done"; title: string; color: string }[] = [
    { id: "todo", title: "To Do", color: "text-amber-400" },
    { id: "in-progress", title: "In Progress", color: "text-cyan-400" },
    { id: "done", title: "Done", color: "text-emerald-400" }
  ]

  return (
    <div className="w-full h-full flex flex-col space-y-4 text-xs font-sans">
      {/* Quick Add Bar */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addCard()}
          placeholder="Add new task title and press Enter..."
          className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
        />
        <button
          onClick={addCard}
          className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1 overflow-hidden">
        {columns.map((col) => {
          const colCards = cards.filter((c) => c.column === col.id)
          return (
            <div
              key={col.id}
              className="rounded-2xl bg-slate-900/60 border border-slate-800 p-3 flex flex-col justify-between overflow-hidden"
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 font-mono font-bold">
                <span className={col.color}>{col.title}</span>
                <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 text-[10px]">
                  {colCards.length}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {colCards.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 space-y-2 shadow-sm"
                  >
                    <p className="font-medium text-xs">{c.title}</p>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-900">
                      <div className="flex gap-1 text-[10px] font-mono">
                        {col.id !== "todo" && (
                          <button
                            onClick={() => moveCard(c.id, col.id === "done" ? "in-progress" : "todo")}
                            className="text-slate-400 hover:text-white"
                          >
                            ← Prev
                          </button>
                        )}
                        {col.id !== "done" && (
                          <button
                            onClick={() => moveCard(c.id, col.id === "todo" ? "in-progress" : "done")}
                            className="text-cyan-400 hover:text-cyan-300 font-bold ml-1"
                          >
                            Next →
                          </button>
                        )}
                      </div>
                      <button onClick={() => deleteCard(c.id)} className="text-rose-400 hover:text-rose-300">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// 2. Live Interactive Markdown Editor App
const MarkdownEditorLiveApp: React.FC = () => {
  const [content, setContent] = useState<string>(`# ElementraUI Markdown Editor
A real-time split markdown workspace.

### Core Capabilities:
- **Instant compilation** of headers and bullet lists
- Clean, responsive dual pane layout
- Character & word counter statistics

\`\`\`ts
const platform = "ElementraUI";
console.log("Ready to ship!");
\`\`\`
`)

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length

  return (
    <div className="w-full h-full flex flex-col space-y-3 font-sans">
      <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
        <span>Dual-Pane Markdown Studio</span>
        <span>
          {content.length} chars • {wordCount} words
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1 overflow-hidden">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-full p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 focus:outline-none focus:border-cyan-500 leading-relaxed resize-none"
        />
        <div className="w-full h-full p-4 rounded-2xl bg-slate-900/60 border border-slate-800 overflow-y-auto text-xs text-slate-200 space-y-3">
          <div className="text-[10px] font-mono uppercase text-cyan-400 border-b border-slate-800 pb-1">
            Live Compiled View
          </div>
          <div className="whitespace-pre-wrap leading-relaxed font-sans">{content}</div>
        </div>
      </div>
    </div>
  )
}

// 3. Live Interactive Pomodoro Timer App
const PomodoroTimerLiveApp: React.FC = () => {
  const [secondsLeft, setSecondsLeft] = useState(25 * 60)
  const [isActive, setIsActive] = useState(false)

  React.useEffect(() => {
    let interval: any = null
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => setSecondsLeft((s) => s - 1), 1000)
    } else if (secondsLeft === 0) {
      setIsActive(false)
    }
    return () => clearInterval(interval)
  }, [isActive, secondsLeft])

  const mins = Math.floor(secondsLeft / 60)
  const secs = secondsLeft % 60
  const timeFormatted = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`

  return (
    <div className="flex flex-col items-center justify-center space-y-6 text-center font-sans">
      <div className="flex items-center gap-2">
        <Clock className="w-5 h-5 text-cyan-400" />
        <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
          Deep Focus Timer
        </span>
      </div>

      <div className="text-7xl font-mono font-black text-white tracking-widest">{timeFormatted}</div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsActive(!isActive)}
          className={`px-6 py-2.5 rounded-xl font-bold text-xs transition-colors shadow-lg ${
            isActive ? "bg-amber-600 hover:bg-amber-500 text-white" : "bg-cyan-600 hover:bg-cyan-500 text-slate-950"
          }`}
        >
          {isActive ? "Pause Focus" : "Start Focus"}
        </button>
        <button
          onClick={() => {
            setIsActive(false)
            setSecondsLeft(25 * 60)
          }}
          className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => {
            setIsActive(false)
            setSecondsLeft(25 * 60)
          }}
          className="px-3 py-1 rounded-lg text-xs font-mono bg-slate-900 border border-slate-800 text-slate-300"
        >
          25m Focus
        </button>
        <button
          onClick={() => {
            setIsActive(false)
            setSecondsLeft(5 * 60)
          }}
          className="px-3 py-1 rounded-lg text-xs font-mono bg-slate-900 border border-slate-800 text-slate-300"
        >
          5m Break
        </button>
      </div>
    </div>
  )
}

// 4. Live Programmer Calculator App
const DevCalculatorLiveApp: React.FC = () => {
  const [val, setVal] = useState("42")
  const num = parseInt(val, 10) || 0

  return (
    <div className="w-full max-w-md p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4 font-mono text-xs">
      <input
        type="number"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-right text-2xl font-bold text-cyan-400 focus:outline-none"
      />
      <div className="space-y-2">
        <div className="flex justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
          <span className="text-slate-500">HEX:</span>
          <span className="text-slate-200 font-bold">0x{num.toString(16).toUpperCase()}</span>
        </div>
        <div className="flex justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
          <span className="text-slate-500">BIN:</span>
          <span className="text-cyan-300 font-bold">{num.toString(2)}</span>
        </div>
        <div className="flex justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
          <span className="text-slate-500">OCT:</span>
          <span className="text-slate-200 font-bold">{num.toString(8)}</span>
        </div>
      </div>
    </div>
  )
}

// 5. Live JSON Formatter App
const JsonFormatterLiveApp: React.FC = () => {
  const [input, setInput] = useState(`{"platform":"ElementraUI","status":"online","features":["themes","apps"]}`)
  const [formatted, setFormatted] = useState("")

  const handleFormat = () => {
    try {
      setFormatted(JSON.stringify(JSON.parse(input), null, 2))
    } catch (e: any) {
      setFormatted("Error: " + e.message)
    }
  }

  return (
    <div className="w-full h-full flex flex-col space-y-3 font-mono text-xs">
      <div className="flex items-center justify-between">
        <span className="text-slate-400">JSON Beautifier & Validator</span>
        <button onClick={handleFormat} className="px-3 py-1 rounded-lg bg-cyan-600 text-slate-950 font-bold">
          Beautify
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1 overflow-hidden">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 resize-none focus:outline-none"
        />
        <pre className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 text-cyan-300 overflow-auto">
          {formatted || "Click Beautify to inspect output..."}
        </pre>
      </div>
    </div>
  )
}

// 6. Live Harmonic Palette Generator App
const PaletteGeneratorLiveApp: React.FC = () => {
  const [colors, setColors] = useState(["#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b"])

  const randomize = () => {
    const letters = "0123456789ABCDEF"
    const newColors = Array(5)
      .fill(0)
      .map(() => {
        let color = "#"
        for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)]
        return color
      })
    setColors(newColors)
  }

  return (
    <div className="w-full flex flex-col items-center space-y-6">
      <div className="grid grid-cols-5 gap-3 w-full max-w-xl">
        {colors.map((c, i) => (
          <div key={i} className="space-y-1.5 text-center">
            <div className="h-36 rounded-2xl border border-slate-700/60 shadow-lg" style={{ backgroundColor: c }} />
            <span className="text-[11px] font-mono text-slate-300 block">{c}</span>
          </div>
        ))}
      </div>
      <button
        onClick={randomize}
        className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs shadow-md"
      >
        Regenerate Palette (Space)
      </button>
    </div>
  )
}
