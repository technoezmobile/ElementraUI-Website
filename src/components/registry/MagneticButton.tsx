import React, { useRef } from "react"
import { motion, useSpring } from "framer-motion"

export interface MagneticButtonProps {
  children?: React.ReactNode
  strength?: number
  className?: string
  onClick?: () => void
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children = "Explore Ecosystem",
  strength = 35,
  className = "",
  onClick,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null)

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 }
  const x = useSpring(0, springConfig)
  const y = useSpring(0, springConfig)

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = buttonRef.current?.getBoundingClientRect()
    if (!rect) return
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const distanceX = (e.clientX - centerX) / (rect.width / 2)
    const distanceY = (e.clientY - centerY) / (rect.height / 2)

    x.set(distanceX * strength)
    y.set(distanceY * strength)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ x, y }}
      whileTap={{ scale: 0.95 }}
      className={`relative px-7 py-3 rounded-xl font-semibold text-xs tracking-wide uppercase text-white bg-slate-900 border border-cyan-500/40 shadow-lg shadow-cyan-950/40 hover:border-cyan-400 hover:shadow-cyan-500/20 transition-colors cursor-pointer select-none ${className}`}
    >
      <span className="relative z-10 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        {children}
      </span>
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
    </motion.button>
  )
}

export const MagneticButtonDemo: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center p-8 space-y-4">
      <div className="text-center mb-2">
        <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40">
          Physics-Based Cursor Attraction
        </span>
        <h4 className="text-base font-bold text-white mt-2">Magnetic Attraction Button</h4>
        <p className="text-xs text-slate-400 max-w-sm mt-0.5">
          Move your cursor near or across the button to experience physics spring pull towards your pointer.
        </p>
      </div>
      <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center w-full max-w-sm">
        <MagneticButton strength={30}>
          Magnetic Spring Pull
        </MagneticButton>
      </div>
    </div>
  )
}
