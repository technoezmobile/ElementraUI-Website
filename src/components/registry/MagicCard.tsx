import React, { useCallback, useRef } from "react"
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion"

export interface MagicCardProps {
  children?: React.ReactNode
  className?: string
  gradientSize?: number
  gradientColor?: string
  gradientOpacity?: number
  gradientFrom?: string
  gradientTo?: string
}

export const MagicCard: React.FC<MagicCardProps> = ({
  children,
  className = "",
  gradientSize = 250,
  gradientColor = "rgba(56, 189, 248, 0.12)",
  gradientOpacity = 0.8,
  gradientFrom = "#38bdf8",
  gradientTo = "#818cf8",
}) => {
  const cardRef = useRef<HTMLDivElement>(null)

  const mouseX = useMotionValue(-gradientSize)
  const mouseY = useMotionValue(-gradientSize)

  const springConfig = { damping: 25, stiffness: 200 }
  const smoothMouseX = useSpring(mouseX, springConfig)
  const smoothMouseY = useSpring(mouseY, springConfig)

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const rect = cardRef.current?.getBoundingClientRect()
      if (!rect) return
      mouseX.set(e.clientX - rect.left)
      mouseY.set(e.clientY - rect.top)
    },
    [mouseX, mouseY]
  )

  const handlePointerLeave = useCallback(() => {
    mouseX.set(-gradientSize)
    mouseY.set(-gradientSize)
  }, [mouseX, mouseY, gradientSize])

  const borderGradient = useMotionTemplate`radial-gradient(${gradientSize}px circle at ${smoothMouseX}px ${smoothMouseY}px, ${gradientFrom}, ${gradientTo}, transparent 100%)`
  const innerSpotlight = useMotionTemplate`radial-gradient(${gradientSize}px circle at ${smoothMouseX}px ${smoothMouseY}px, ${gradientColor}, transparent 100%)`

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`group relative overflow-hidden rounded-2xl p-[1px] bg-slate-800/80 transition-all duration-300 ${className}`}
    >
      {/* Outer border spotlight following cursor */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
        style={{
          background: borderGradient,
        }}
      />

      {/* Inner card surface */}
      <div className="relative rounded-[15px] bg-slate-950 p-6 h-full z-20 overflow-hidden">
        {/* Subtle inner spotlight wash */}
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
          style={{
            background: innerSpotlight,
            opacity: gradientOpacity,
          }}
        />
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  )
}

/**
 * Interactive Demo Preview showcasing real cursor spotlight border tracking
 */
export const MagicCardDemo: React.FC = () => {
  return (
    <div className="w-full flex items-center justify-center p-4">
      <MagicCard className="w-full max-w-md shadow-2xl cursor-default">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">
              Magic UI • Spotlight Card
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-800/40">
              Interactive Spotlight
            </span>
          </div>

          <div>
            <h4 className="text-lg font-bold text-white mb-1">
              Dynamic Radial Border Spotlight
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Move your pointer across this card. Notice how the border smoothly illuminates with an animated dual-color radial gradient tracking your exact cursor coordinates in real time.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80">
              <span className="text-[10px] font-mono text-cyan-400 block uppercase">Spotlight Radius</span>
              <span className="text-xs font-bold text-slate-200">250px Radial</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80">
              <span className="text-[10px] font-mono text-indigo-400 block uppercase">Spring Physics</span>
              <span className="text-xs font-bold text-slate-200">Damping 25 / Stiff 200</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px] font-mono text-slate-400">
            <span>Hover borders to test tracking</span>
            <span className="text-emerald-400 font-semibold">✓ GPU Accelerated</span>
          </div>
        </div>
      </MagicCard>
    </div>
  )
}
