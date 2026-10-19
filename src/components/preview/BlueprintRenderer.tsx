import React, { useState } from "react"
import { CatalogueItem } from "../../types/catalogue"
import { Sparkles, ExternalLink, Code2, Copy, Check, Wand2 } from "lucide-react"

interface BlueprintRendererProps {
  item: CatalogueItem
  themeMode?: "dark" | "light"
  onSendToPromptStudio?: (prompt: string, title?: string) => void
  onSendToBuilder?: (prompt: string) => void
}

export const BlueprintRenderer: React.FC<BlueprintRendererProps> = ({
  item,
  themeMode = "dark",
  onSendToPromptStudio,
  onSendToBuilder
}) => {
  const [copied, setCopied] = useState(false)

  // 1. AI Prompt Playground Blueprint
  if (item.itemType === "prompt" && item.promptData) {
    return (
      <div
        className="w-full max-w-xl flex flex-col items-center justify-center p-6 text-center space-y-4"
        data-testid="prompt-blueprint-card"
        data-preview-kind="prompt-blueprint"
      >
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-950/40 border border-amber-800/30">
            {item.promptData.tool} Optimized Blueprint
          </span>
          <h3 className="text-lg font-bold text-slate-100 mt-2">{item.name}</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">{item.description}</p>
        </div>
        <div className="w-full max-w-lg p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-left font-mono text-[11px] text-slate-300 max-h-48 overflow-y-auto relative space-y-2">
          <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800 pb-1 font-mono">
            <span>Target: {item.promptData.framework || "React / Tailwind"}</span>
            <span className="text-amber-400 font-semibold">{item.promptData.tool}</span>
          </div>
          <p className="text-slate-300/90 whitespace-pre-wrap">{item.promptData.promptText}</p>
        </div>
        <div className="flex items-center gap-3">
          {onSendToPromptStudio && (
            <button
              onClick={() => onSendToPromptStudio(item.promptData!.promptText, item.name)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Open in Prompt Studio</span>
            </button>
          )}
          {onSendToBuilder && (
            <button
              onClick={() => onSendToBuilder(item.promptData!.promptText)}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Send to Builder</span>
            </button>
          )}
        </div>
      </div>
    )
  }

  // 2. Design Reference Study Showcase
  if (item.itemType === "design-reference" && item.referenceData) {
    return (
      <div
        className="w-full max-w-xl flex flex-col items-center justify-center p-6 space-y-4"
        data-testid="design-reference-card"
        data-preview-kind="design-reference"
      >
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
          <ExternalLink className="w-6 h-6" />
        </div>
        <div className="text-center">
          <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-400 font-bold px-2 py-0.5 rounded bg-indigo-950/40 border border-indigo-800/30">
            Curated Design Study Reference
          </span>
          <h3 className="text-lg font-bold text-slate-100 mt-2">{item.name}</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">{item.description}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg text-left">
          <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Core Aesthetic</span>
            <p className="text-xs text-slate-200 mt-1 font-medium">{item.referenceData.designObservations[0]}</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Reimplementation Step</span>
            <p className="text-xs text-cyan-300 mt-1 font-mono">{item.referenceData.reimplementationPlan[0]}</p>
          </div>
        </div>
        {item.referenceData.websiteUrl && (
          <a
            href={item.referenceData.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
          >
            <span>Visit Reference Site ({item.referenceData.websiteUrl})</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    )
  }

  // 3. Actionable Component Blueprint & Generator for Ingested Items Pending Local Implementation
  const handleCopyCmd = () => {
    if (item.installCommand) {
      navigator.clipboard.writeText(item.installCommand)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const generatedPrompt = `Create a high-quality production React component for "${item.name}":
- Category: ${item.category}
- Description: ${item.description}
- Motion Engine: ${item.motionEngine}
- Dependencies: ${item.dependencies.join(", ") || "React, Tailwind CSS"}
- Modern Tailwind CSS styling with dark/light mode support, responsive layouts, and accessible Radix-style semantics.`

  return (
    <div
      className={`w-full max-w-xl p-6 rounded-3xl border ${
        themeMode === "light"
          ? "bg-white border-slate-300 text-slate-900 shadow-sm"
          : "bg-slate-950/90 border-slate-800 text-slate-100"
      } space-y-5`}
      data-testid="core-component-blueprint"
      data-preview-kind="source-unavailable"
    >
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400">
            Component Blueprint & Registry Spec
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
          {item.category}
        </span>
      </div>

      {/* Identity & Description */}
      <div>
        <h3 className="text-xl font-extrabold tracking-tight text-white">{item.name}</h3>
        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{item.description}</p>
      </div>

      {/* CLI Installation Command with 1-click Copy */}
      {item.installCommand && (
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Direct CLI Installation:</span>
            <button
              onClick={handleCopyCmd}
              className="text-cyan-400 hover:text-cyan-300 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy Command"}</span>
            </button>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 select-all overflow-x-auto">
            {item.installCommand}
          </div>
        </div>
      )}

      {/* Technical Spec Grid */}
      <div className="grid grid-cols-2 gap-2.5 text-[11px] font-mono">
        <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800">
          <span className="text-slate-500 block uppercase text-[10px]">Upstream Source</span>
          <span className="text-slate-200 truncate block mt-0.5 font-semibold">
            {item.provenance?.origin || "ElementraUI catalogue"}
          </span>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800">
          <span className="text-slate-500 block uppercase text-[10px]">Dependencies</span>
          <span className="text-slate-200 truncate block mt-0.5 font-semibold">
            {item.dependencies && item.dependencies.length > 0
              ? item.dependencies.join(", ")
              : "Zero dependencies"}
          </span>
        </div>
      </div>

      {/* Action Buttons: 1-click Generation in Prompt Studio or Website Builder */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center gap-3">
        {onSendToPromptStudio && (
          <button
            onClick={() => onSendToPromptStudio(generatedPrompt, item.name)}
            className="flex-1 py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-cyan-600/20 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate in Prompt Studio</span>
          </button>
        )}
        {onSendToBuilder && (
          <button
            onClick={() => onSendToBuilder(generatedPrompt)}
            className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Send to Builder</span>
          </button>
        )}
      </div>
    </div>
  )
}
