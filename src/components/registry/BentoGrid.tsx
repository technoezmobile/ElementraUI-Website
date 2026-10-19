import React from "react"
import { motion } from "framer-motion"
import { Layers, ShieldCheck, Zap, Sparkles, Terminal, Activity } from "lucide-react"

export interface BentoItem {
  title: string
  description: string
  icon: React.ReactNode
  colSpan?: string
  badge?: string
}

export const BentoGrid: React.FC = () => {
  const items: BentoItem[] = [
    {
      title: "Self-Hosted Architecture",
      description: "Operate 100% locally with zero cloud telemetry. Your component IP and prompts stay on your metal.",
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      colSpan: "col-span-1 md:col-span-2",
      badge: "Local-First"
    },
    {
      title: "Sub-Millisecond Preview",
      description: "Hardware-accelerated WebGL and spring physics rendered natively in browser.",
      icon: <Zap className="w-5 h-5 text-amber-400" />,
      colSpan: "col-span-1",
      badge: "60 FPS"
    },
    {
      title: "Agent Prompt Studio",
      description: "Generate structured, battle-tested system runbooks for Cursor, Claude Code, and Windsurf.",
      icon: <Sparkles className="w-5 h-5 text-purple-400" />,
      colSpan: "col-span-1",
      badge: "AI Native"
    },
    {
      title: "Universal shadcn Registry",
      description: "Export components via standardized registry endpoints. One command local CLI install into any project.",
      icon: <Terminal className="w-5 h-5 text-cyan-400" />,
      colSpan: "col-span-1 md:col-span-2",
      badge: "Standardized"
    }
  ]

  return (
    <div className="w-full max-w-2xl p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {items.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.08 }}
            whileHover={{ y: -3 }}
            className={`p-5 rounded-2xl bg-slate-950/90 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between group shadow-xl ${item.colSpan}`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 group-hover:scale-105 transition-transform">
                  {item.icon}
                </div>
                {item.badge && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                    {item.badge}
                  </span>
                )}
              </div>
              <h4 className="text-sm font-bold text-white mb-1 group-hover:text-cyan-200 transition-colors">
                {item.title}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {item.description}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span>Section 0{idx + 1}</span>
              <span className="text-cyan-400 group-hover:translate-x-0.5 transition-transform">Explore →</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
