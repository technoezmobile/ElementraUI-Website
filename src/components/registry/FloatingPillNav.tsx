import React, { useState } from "react"
import { motion } from "framer-motion"
import { Layers, Sparkles, Terminal, Code2, Database } from "lucide-react"

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
}

export const FloatingPillNav: React.FC = () => {
  const items: NavItem[] = [
    { id: "all", label: "Registry", icon: <Layers className="w-4 h-4" /> },
    { id: "3d", label: "3D & Shaders", icon: <Sparkles className="w-4 h-4" /> },
    { id: "code", label: "Inspect", icon: <Code2 className="w-4 h-4" /> },
    { id: "cli", label: "CLI & MCP", icon: <Terminal className="w-4 h-4" /> },
    { id: "data", label: "Local DB", icon: <Database className="w-4 h-4" /> },
  ]

  const [active, setActive] = useState("all")

  return (
    <div className="w-full flex items-center justify-center p-8 bg-slate-950 border border-slate-800 rounded-xl">
      <nav className="relative flex items-center gap-1 p-1.5 rounded-full bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-2xl">
        {items.map((item) => {
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`relative px-4 py-2 rounded-full text-xs font-medium flex items-center gap-2 transition-colors duration-200 z-10 ${
                isActive ? "text-cyan-300 font-semibold" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="active-pill-bubble"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  className="absolute inset-0 bg-slate-800/90 border border-cyan-500/30 rounded-full shadow-lg shadow-cyan-500/10 -z-10"
                />
              )}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
