import React, { useState, useMemo, useEffect } from "react"
import { PromptTemplate, PromptCategory, TargetAITool } from "../../types/prompt"
import { initialPrompts } from "../../data/prompts"
import {
  Search,
  Sparkles,
  Copy,
  Check,
  Plus,
  SlidersHorizontal,
  Bookmark,
  ExternalLink,
  Code2,
  Layers,
  Wand2,
  BookOpen,
  Terminal,
  Save,
  Download
} from "lucide-react"

interface PromptStudioProps {
  initialPrompt?: string
  initialTitle?: string
}

export const PromptStudio: React.FC<PromptStudioProps> = ({ initialPrompt, initialTitle }) => {
  const [viewMode, setViewMode] = useState<"library" | "builder">("library")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [selectedTool, setSelectedTool] = useState<string>("All")
  const [activePromptId, setActivePromptId] = useState<string>(initialPrompts[0].id)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // LocalStorage custom prompts
  const [customPrompts, setCustomPrompts] = useState<PromptTemplate[]>(() => {
    try {
      const saved = localStorage.getItem("elementraui_custom_prompts") || localStorage.getItem("21st_local_custom_prompts")
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem("elementraui_custom_prompts", JSON.stringify(customPrompts))
      localStorage.setItem("21st_local_custom_prompts", JSON.stringify(customPrompts))
    } catch {
      // Ignore write errors
    }
  }, [customPrompts])

  // Combine initial + custom prompts
  const allPrompts = useMemo(() => {
    return [...customPrompts, ...initialPrompts]
  }, [customPrompts])

  // Builder modular state
  const [builderProject, setBuilderProject] = useState("SaaS Landing Page")
  const [builderAesthetic, setBuilderAesthetic] = useState("Obsidian Slate (#07080c)")
  const [builderStack, setBuilderStack] = useState("Next.js 15 + React 19 + Tailwind CSS v4")
  const [builderMotion, setBuilderMotion] = useState("Framer Motion Spring Physics")
  const [builderSections, setBuilderSections] = useState<string[]>([
    "Sticky Pill Navbar",
    "Kinetic Glow Hero",
    "Asymmetric Bento Grid",
    "Infinite Partner Marquee",
    "Pricing Calculator",
    "Clean Dark Footer"
  ])
  const [customGeneratedPrompt, setCustomGeneratedPrompt] = useState("")
  const [customTitle, setCustomTitle] = useState("")
  const [savedSuccess, setSavedSuccess] = useState(false)

  // Auto-generate prompt in builder mode
  useEffect(() => {
    const text = `Act as a senior frontend design engineer and technical architect. Build a production-ready ${builderProject} in TypeScript:

1. ARCHITECTURE & VISUAL DESIGN:
   - Aesthetic: ${builderAesthetic}
   - Technical Stack: ${builderStack}
   - Motion & Animation: ${builderMotion}
   - Accessibility: WCAG AA contrast, keyboard navigation, focus-visible rings

2. REQUIRED SECTION MODULES:
${builderSections.map((s, idx) => `   - Section ${idx + 1}: ${s}`).join("\n")}

3. COMPONENT INTEGRATION:
   - Use modular components with clean prop interfaces.
   - Zero layout shifts during asset or font loading.
   - Clean, idiomatic modern code.`
    setCustomGeneratedPrompt(text)
  }, [builderProject, builderAesthetic, builderStack, builderMotion, builderSections])

  const categories: string[] = [
    "All",
    "Landing Pages",
    "SaaS Websites",
    "Portfolios",
    "E-Commerce",
    "Dashboards",
    "Shaders & Effects",
    "Replication & References"
  ]

  const tools: string[] = ["All", "Claude Code", "Cursor", "Windsurf", "v0"]

  const filteredPrompts = useMemo(() => {
    return allPrompts.filter((p) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matches =
          p.title.toLowerCase().includes(q) ||
          p.designObjective.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.promptText.toLowerCase().includes(q)
        if (!matches) return false
      }
      if (selectedCategory !== "All" && p.category !== selectedCategory) return false
      if (selectedTool !== "All" && p.tool !== selectedTool) return false
      return true
    })
  }, [allPrompts, searchQuery, selectedCategory, selectedTool])

  const activePrompt = useMemo(() => {
    return allPrompts.find((p) => p.id === activePromptId) || allPrompts[0]
  }, [allPrompts, activePromptId])

  const copyPromptText = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleSaveCustomPrompt = () => {
    const newPrompt: PromptTemplate = {
      id: `custom-prompt-${Date.now()}`,
      title: customTitle.trim() || `${builderProject} Specification Prompt`,
      category: "Landing Pages",
      tool: "Claude Code",
      framework: builderStack,
      designObjective: `Custom modular specification for ${builderProject} using ${builderAesthetic}.`,
      constraints: ["Strict TypeScript", "Tailwind CSS v4 tokens"],
      exclusions: ["No legacy CSS", "No untyped props"],
      relevantComponents: ["kinetic-hero-section", "bento-grid", "shimmer-light-button"],
      tags: ["Custom", builderProject.split(" ")[0], "Modular"],
      promptText: customGeneratedPrompt,
      isCustom: true,
      version: 1,
      updatedAt: new Date().toISOString().split("T")[0]
    }
    setCustomPrompts([newPrompt, ...customPrompts])
    setActivePromptId(newPrompt.id)
    setViewMode("library")
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 2500)
  }

  const toggleBuilderSection = (section: string) => {
    setBuilderSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#07080c] text-slate-100">
      {/* Studio Header & View Mode Switcher */}
      <div className="border-b border-slate-800 bg-slate-950/80 px-6 py-4 flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-extrabold text-white">AI Prompt Studio</h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/40">
              Agent Ready
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Battle-tested system prompt blueprints and modular prompt builder for Cursor, Claude Code, and Windsurf.
          </p>
        </div>

        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 gap-1">
          <button
            onClick={() => setViewMode("library")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              viewMode === "library"
                ? "bg-cyan-500 text-black shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Prompt Library ({allPrompts.length})</span>
          </button>
          <button
            onClick={() => setViewMode("builder")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              viewMode === "builder"
                ? "bg-cyan-500 text-black shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Modular Builder</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === "library" ? (
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar List */}
          <aside className="w-80 lg:w-96 border-r border-slate-800 bg-slate-950 flex flex-col shrink-0">
            {/* Search and Category Filter */}
            <div className="p-3 border-b border-slate-800 space-y-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search prompt blueprints..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2 py-0.5 rounded text-[11px] whitespace-nowrap transition-colors ${
                      selectedCategory === cat
                        ? "bg-slate-800 text-cyan-300 font-semibold"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {filteredPrompts.map((p) => {
                const isActive = p.id === activePrompt.id
                return (
                  <button
                    key={p.id}
                    onClick={() => setActivePromptId(p.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      isActive
                        ? "bg-slate-900 border-cyan-500/50 shadow-md shadow-cyan-950/20"
                        : "bg-slate-950 border-transparent hover:bg-slate-900/60 hover:border-slate-800/80 text-slate-400"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-slate-100 truncate">{p.title}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-950/60 text-amber-300 border border-amber-800/40">
                        {p.tool}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mb-2">
                      {p.designObjective}
                    </p>
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                      <span>{p.category}</span>
                      <span>v{p.version || 1}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </aside>

          {/* Prompt Detail Area */}
          <main className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                      {activePrompt.category}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs text-slate-300">Optimized for {activePrompt.tool}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-[11px] font-mono text-cyan-400">{activePrompt.framework}</span>
                  </div>
                  <h3 className="text-2xl font-extrabold text-white">{activePrompt.title}</h3>
                  <p className="text-xs text-slate-400 max-w-2xl mt-1 leading-relaxed">
                    {activePrompt.designObjective}
                  </p>
                </div>

                <button
                  onClick={() => copyPromptText(activePrompt.promptText, activePrompt.id)}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs flex items-center gap-1.5 transition-all shadow-sm shrink-0 cursor-pointer"
                >
                  {copiedId === activePrompt.id ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Full Prompt</span>
                    </>
                  )}
                </button>
              </div>

              {/* Specs & Constraints */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold block mb-1">
                    Design Constraints
                  </span>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {activePrompt.constraints.map((c, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-400">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] font-mono text-rose-400 uppercase font-bold block mb-1">
                    Exclusions & Pitfalls to Avoid
                  </span>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {activePrompt.exclusions.map((e, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-rose-400">•</span>
                        <span>{e}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Full Prompt Display */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs font-mono text-slate-400">
                  <span>Prompt Instructions ({activePrompt.tool})</span>
                  <span>Version {activePrompt.version || 1} • {activePrompt.updatedAt}</span>
                </div>
                <pre className="p-5 text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto">
                  {activePrompt.promptText}
                </pre>
              </div>
            </div>
          </main>
        </div>
      ) : (
        /* Modular Prompt Builder Mode */
        <div className="flex-1 overflow-y-auto p-6 max-w-5xl mx-auto w-full space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-cyan-400" />
                Modular Prompt Construction Engine
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Configure architectural specifications to assemble a customized, rigorous agent prompt in real time.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1">Project Type</label>
                <select
                  value={builderProject}
                  onChange={(e) => setBuilderProject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="SaaS Landing Page">Enterprise SaaS Landing Page</option>
                  <option value="Developer Portfolio">Creative Developer Portfolio</option>
                  <option value="Observability Dashboard">Telemetry Observability Dashboard</option>
                  <option value="E-Commerce Product Showcase">Luxury E-Commerce Showcase</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1">Visual Aesthetic</label>
                <select
                  value={builderAesthetic}
                  onChange={(e) => setBuilderAesthetic(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Obsidian Slate (#07080c)">Obsidian Slate (#07080c)</option>
                  <option value="Apple Spatial Glassmorphism">Apple Spatial Glassmorphism</option>
                  <option value="Cyberpunk High-Contrast Neon">Cyberpunk High-Contrast Neon</option>
                  <option value="Minimalist Zinc Grayscale">Minimalist Zinc Grayscale</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1">Tech Stack</label>
                <select
                  value={builderStack}
                  onChange={(e) => setBuilderStack(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Next.js 15 App Router + React 19 + Tailwind CSS v4">Next.js 15 App Router + React 19 + Tailwind CSS v4</option>
                  <option value="React 19 + Vite + Tailwind CSS v4 + TypeScript">React 19 + Vite + Tailwind CSS v4 + TypeScript</option>
                  <option value="Three.js WebGL + Framer Motion + Tailwind CSS">Three.js WebGL + Framer Motion + Tailwind CSS</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1">Motion & Animation</label>
                <select
                  value={builderMotion}
                  onChange={(e) => setBuilderMotion(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Framer Motion Spring Physics (damping: 20, stiffness: 150)">Framer Motion Spring Physics</option>
                  <option value="Raw WebGL 60 FPS GLSL Canvas Shaders">Raw WebGL 60 FPS GLSL Canvas Shaders</option>
                  <option value="CSS Transitions Only (Reduced Motion Safe)">CSS Transitions Only (Reduced Motion)</option>
                </select>
              </div>
            </div>

            {/* Modular Section Toggles */}
            <div>
              <label className="text-[11px] font-mono text-slate-400 uppercase block mb-2">
                Include Section Modules
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  "Sticky Pill Navbar",
                  "Kinetic Glow Hero",
                  "Asymmetric Bento Grid",
                  "Optical Zoom Lens Showcase",
                  "Spotlight 3D Cards",
                  "Infinite Partner Marquee",
                  "Pricing Calculator",
                  "Clean Dark Footer"
                ].map((sec) => {
                  const isChecked = builderSections.includes(sec)
                  return (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => toggleBuilderSection(sec)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all border ${
                        isChecked
                          ? "bg-cyan-950 text-cyan-300 border-cyan-800/80 font-semibold"
                          : "bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300"
                      }`}
                    >
                      {isChecked ? "✓ " : "+ "}
                      {sec}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Live Generated Prompt Output */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">Live Assembled Prompt Specification:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyPromptText(customGeneratedPrompt, "builder-live")}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1 transition-colors"
                  >
                    {copiedId === "builder-live" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === "builder-live" ? "Copied" : "Copy Spec"}</span>
                  </button>
                  <button
                    onClick={handleSaveCustomPrompt}
                    className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save to Custom Prompts</span>
                  </button>
                </div>
              </div>

              <textarea
                value={customGeneratedPrompt}
                onChange={(e) => setCustomGeneratedPrompt(e.target.value)}
                rows={12}
                className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500 leading-relaxed resize-y"
              />

              {savedSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs font-mono animate-in fade-in">
                  ✓ Custom prompt specification successfully saved to your local collection!
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
