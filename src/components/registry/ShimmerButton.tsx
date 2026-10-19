import React from "react"
import { motion } from "framer-motion"

interface ShimmerButtonProps {
  children?: React.ReactNode
  shimmerColor?: string
  className?: string
  onClick?: () => void
}

export const ShimmerButton: React.FC<ShimmerButtonProps> = ({
  children = "Deploy to Local Stack",
  shimmerColor = "#38bdf8",
  onClick,
}) => {
  return (
    <div className="w-full flex items-center justify-center p-8 bg-slate-950 border border-slate-800 rounded-xl">
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className="relative px-8 py-3.5 rounded-xl font-semibold text-sm text-white overflow-hidden shadow-2xl bg-slate-900 border border-slate-700/80 group cursor-pointer"
      >
        {/* Shimmer light beam animation */}
        <motion.div
          animate={{
            x: ["-100%", "200%"],
          }}
          transition={{
            repeat: Infinity,
            duration: 2.2,
            ease: "easeInOut",
          }}
          style={{
            background: `linear-gradient(90deg, transparent, ${shimmerColor}40, transparent)`,
          }}
          className="absolute inset-y-0 w-24 -skew-x-12 pointer-events-none"
        />

        {/* Glow backdrop */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />

        <span className="relative z-10 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 group-hover:animate-ping" />
          {children}
        </span>
      </motion.button>
    </div>
  )
}
