import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface GalleryCard {
  id: number
  title: string
  category: string
  color: string
}

export const StaggeredGallery: React.FC = () => {
  const cards: GalleryCard[] = [
    { id: 1, title: "Neon Cyberspace", category: "WebGL Shader", color: "from-cyan-500 to-blue-600" },
    { id: 2, title: "Quantum Spheres", category: "Three.js 3D", color: "from-purple-500 to-pink-600" },
    { id: 3, title: "Prismatic Wave", category: "Fragment Effects", color: "from-emerald-400 to-teal-600" },
    { id: 4, title: "Aurora Borealis", category: "GLSL Compute", color: "from-amber-400 to-orange-600" },
  ]

  const [selectedId, setSelectedId] = useState<number | null>(null)

  return (
    <div className="w-full p-6 bg-slate-950 border border-slate-800 rounded-xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map((card) => (
          <motion.div
            key={card.id}
            layoutId={`card-${card.id}`}
            onClick={() => setSelectedId(card.id)}
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="p-5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer overflow-hidden relative group"
          >
            <div className={`h-24 rounded-lg bg-gradient-to-r ${card.color} mb-3 opacity-80 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-sm tracking-wider uppercase`}>
              Preview
            </div>
            <span className="text-xs font-mono text-cyan-400">{card.category}</span>
            <h4 className="text-base font-bold text-white mt-0.5">{card.title}</h4>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedId(null)}
          >
            {cards
              .filter((c) => c.id === selectedId)
              .map((c) => (
                <motion.div
                  key={c.id}
                  layoutId={`card-${c.id}`}
                  className="w-full max-w-md p-6 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className={`h-40 rounded-xl bg-gradient-to-r ${c.color} mb-4 flex items-center justify-center text-white font-bold text-lg`}>
                    Full Screen View
                  </div>
                  <span className="text-xs font-mono text-cyan-400">{c.category}</span>
                  <h3 className="text-xl font-bold text-white mb-2">{c.title}</h3>
                  <p className="text-sm text-slate-400 mb-6">
                    Expanded view demonstrating spring transition between gallery thumbnail and modal overlay.
                  </p>
                  <button
                    onClick={() => setSelectedId(null)}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Close Dialog
                  </button>
                </motion.div>
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
