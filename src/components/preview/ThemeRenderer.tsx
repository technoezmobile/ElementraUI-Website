import React from "react"
import { CatalogueItem } from "../../types/catalogue"
import { Palette } from "lucide-react"

interface ThemeRendererProps {
  item: CatalogueItem
  themeMode?: "dark" | "light"
}

export const ThemeRenderer: React.FC<ThemeRendererProps> = ({ item }) => {
  const isZinc = item.slug.includes("zinc")

  return (
    <div
      className="w-full max-w-lg p-6 flex flex-col items-center space-y-5"
      data-testid="theme-preset-card"
      data-preview-kind="executable-verified"
    >
      <div className="flex items-center gap-2">
        <Palette className="w-5 h-5 text-cyan-400" />
        <h3 className="text-base font-bold text-white">{item.name} Palette Showcase</h3>
      </div>

      {/* Color swatches */}
      <div className="grid grid-cols-5 gap-2 w-full">
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-center">
          <div
            className={`w-6 h-6 rounded-full mx-auto mb-1 ${
              isZinc ? "bg-zinc-900 border border-zinc-700" : "bg-black border border-slate-700"
            }`}
          />
          <span className="text-[10px] font-mono text-slate-400">Background</span>
        </div>
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-center">
          <div className={`w-6 h-6 rounded-full mx-auto mb-1 ${isZinc ? "bg-zinc-100" : "bg-cyan-400"}`} />
          <span className="text-[10px] font-mono text-slate-400">Primary</span>
        </div>
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-center">
          <div className={`w-6 h-6 rounded-full mx-auto mb-1 ${isZinc ? "bg-zinc-800" : "bg-slate-800"}`} />
          <span className="text-[10px] font-mono text-slate-400">Secondary</span>
        </div>
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-center">
          <div className={`w-6 h-6 rounded-full mx-auto mb-1 ${isZinc ? "bg-zinc-500" : "bg-blue-500"}`} />
          <span className="text-[10px] font-mono text-slate-400">Accent</span>
        </div>
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-center">
          <div className="w-6 h-6 rounded-full mx-auto mb-1 bg-rose-500" />
          <span className="text-[10px] font-mono text-slate-400">Destructive</span>
        </div>
      </div>

      {/* Live UI Mock in this theme */}
      <div
        className={`w-full p-4 rounded-xl border ${
          isZinc ? "bg-zinc-950 border-zinc-800 text-zinc-100" : "bg-slate-950 border-slate-800 text-slate-100"
        } space-y-3`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold">Theme Component Demonstration</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
              isZinc
                ? "bg-zinc-800 text-zinc-300"
                : "bg-cyan-950 text-cyan-400 border border-cyan-800/40"
            }`}
          >
            Active Tokens
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              isZinc
                ? "bg-zinc-100 text-zinc-950 hover:bg-zinc-200"
                : "bg-cyan-500 text-black hover:bg-cyan-400"
            }`}
          >
            Primary Action
          </button>
          <button
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer ${
              isZinc
                ? "border-zinc-800 hover:bg-zinc-900 text-zinc-300"
                : "border-slate-800 hover:bg-slate-900 text-slate-300"
            }`}
          >
            Outline
          </button>
        </div>
      </div>
    </div>
  )
}
