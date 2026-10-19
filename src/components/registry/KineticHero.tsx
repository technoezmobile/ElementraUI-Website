import React from "react"
import { motion } from "framer-motion"

interface KineticHeroProps {
  badgeText?: string
  headline?: string
  description?: string
}

export const KineticHero: React.FC<KineticHeroProps> = ({
  badgeText = "Next-Gen Component Engine",
  headline = "Craft interfaces with cinematic motion & code precision.",
  description = "A locally-hosted component ecosystem engineered for developers and autonomous coding agents. Zero third-party telemetry, 100% open.",
}) => {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 p-8 md:p-12 text-center flex flex-col items-center justify-center">
      {/* Background kinetic glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-gradient-to-tr from-cyan-600/20 to-purple-600/20 blur-[90px] pointer-events-none rounded-full" />

      {/* Pill Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-slate-900/90 border border-slate-700/80 text-cyan-300 shadow-inner mb-6 backdrop-blur-md"
      >
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        {badgeText}
      </motion.div>

      {/* Main Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-3xl md:text-5xl font-extrabold tracking-tight text-white max-w-3xl leading-tight mb-5"
      >
        {headline}
      </motion.h1>

      {/* Subdescription */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-sm md:text-base text-slate-400 max-w-xl leading-relaxed mb-8"
      >
        {description}
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="flex flex-wrap items-center justify-center gap-3"
      >
        <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium text-sm shadow-lg shadow-cyan-500/20 hover:brightness-110 active:scale-95 transition-all">
          Browse Components
        </button>
        <button className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-sm font-medium transition-all">
          Install CLI
        </button>
      </motion.div>
    </div>
  )
}
