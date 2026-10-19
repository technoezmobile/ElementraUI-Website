import React from "react"
import { CatalogueItem } from "../../types/catalogue"
import { Sparkles } from "lucide-react"

interface TemplateRendererProps {
  item: CatalogueItem
}

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({ item }) => {
  return (
    <div
      className="w-full max-w-2xl p-4 flex flex-col space-y-4"
      data-testid="template-layout-card"
      data-preview-kind="template-layout"
    >
      {/* Mock Browser Window Chrome */}
      <div className="w-full rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <div className="flex items-center gap-1 px-3 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400">
            <span className="text-cyan-400 font-bold">https://</span>
            <span>devtool-saas-starter.preview</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/50 text-cyan-400 font-bold">
            Next.js 15
          </span>
        </div>

        {/* Wireframe Mock Navigation Bar */}
        <div className="px-6 py-3 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-cyan-500 flex items-center justify-center text-slate-950 font-bold text-xs">
              21
            </div>
            <span className="text-xs font-bold text-white tracking-tight">DevTool Platform</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-xs font-medium text-slate-400">
            <span className="text-cyan-400 font-semibold">Overview</span>
            <span>Features</span>
            <span>Pricing</span>
            <span>Docs</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 rounded-lg bg-cyan-500 text-slate-950 font-semibold text-xs cursor-pointer">
              Get Started
            </button>
          </div>
        </div>

        {/* Wireframe Mock Hero Layout */}
        <div className="p-6 text-center space-y-4 bg-gradient-to-b from-slate-900/80 to-slate-950">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 font-semibold">
            <Sparkles className="w-3 h-3" /> Full Multi-Page Production Template
          </span>
          <h2 className="text-2xl font-extrabold text-white tracking-tight max-w-lg mx-auto">
            {item.name}
          </h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            {item.description}
          </p>
          <div className="flex items-center justify-center gap-3 pt-1">
            <button className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer">
              Explore Included Pages
            </button>
            <button className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-200 font-medium text-xs transition-colors cursor-pointer">
              View Scaffolding Spec
            </button>
          </div>

          {/* Layout Page / Feature Modules */}
          <div className="grid grid-cols-3 gap-3 pt-3 text-left">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">App Router</span>
              <p className="text-xs font-semibold text-slate-200">5 Pages Included</p>
              <p className="text-[11px] text-slate-500">Landing, Pricing, Docs, Auth, Changelog</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">Modular UI</span>
              <p className="text-xs font-semibold text-slate-200">12+ Components</p>
              <p className="text-[11px] text-slate-500">Bento cards, Pricing slider, Hero glow</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">Styling</span>
              <p className="text-xs font-semibold text-slate-200">Tailwind + Radix</p>
              <p className="text-[11px] text-slate-500">Dark / Light modes & OKLCH tokens</p>
            </div>
          </div>
        </div>
      </div>

      {/* CLI Scaffolding command */}
      {item.installCommand && (
        <div className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">Scaffold Command:</span>
          <code className="text-cyan-300 font-bold">{item.installCommand}</code>
        </div>
      )}
    </div>
  )
}
