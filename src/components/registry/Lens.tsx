import React, { useState, useRef, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

export interface Position {
  x: number
  y: number
}

export interface LensProps {
  children: React.ReactNode
  zoomFactor?: number
  lensSize?: number
  position?: Position
  defaultPosition?: Position
  isStatic?: boolean
  duration?: number
  lensColor?: string
  ariaLabel?: string
  className?: string
}

export const Lens: React.FC<LensProps> = ({
  children,
  zoomFactor = 1.75,
  lensSize = 160,
  isStatic = false,
  position = { x: 100, y: 100 },
  defaultPosition,
  duration = 0.15,
  lensColor = "black",
  ariaLabel = "Zoom Area",
  className = "",
}) => {
  const [isHovering, setIsHovering] = useState(false)
  const [mousePosition, setMousePosition] = useState<Position>(position)
  const containerRef = useRef<HTMLDivElement>(null)

  const currentPosition = useMemo(() => {
    if (isStatic) return position
    if (defaultPosition && !isHovering) return defaultPosition
    return mousePosition
  }, [isStatic, position, defaultPosition, isHovering, mousePosition])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") setIsHovering(false)
  }, [])

  const maskImage = `radial-gradient(circle ${lensSize / 2}px at ${currentPosition.x}px ${currentPosition.y}px, ${lensColor} 100%, transparent 100%)`

  const LensContent = useMemo(() => {
    const { x, y } = currentPosition
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration }}
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{
          maskImage,
          WebkitMaskImage: maskImage,
          transformOrigin: `${x}px ${y}px`,
          zIndex: 50,
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            transform: `scale(${zoomFactor})`,
            transformOrigin: `${x}px ${y}px`,
          }}
        >
          {children}
        </div>
        {/* Visual lens ring border */}
        <div
          className="absolute rounded-full border-2 border-cyan-400/80 shadow-lg shadow-cyan-500/20 pointer-events-none"
          style={{
            width: `${lensSize}px`,
            height: `${lensSize}px`,
            left: `${x - lensSize / 2}px`,
            top: `${y - lensSize / 2}px`,
          }}
        />
      </motion.div>
    )
  }, [currentPosition, maskImage, zoomFactor, children, duration, lensSize])

  return (
    <div
      ref={containerRef}
      className={`relative z-20 overflow-hidden rounded-2xl select-none ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
      onKeyDown={handleKeyDown}
      role="region"
      aria-label={ariaLabel}
      tabIndex={0}
    >
      {children}
      {isStatic || defaultPosition ? (
        LensContent
      ) : (
        <AnimatePresence mode="popLayout">
          {isHovering && LensContent}
        </AnimatePresence>
      )}
    </div>
  )
}

/**
 * Interactive Demo Preview showcasing real zoom effect over fine detail
 */
export const LensDemo: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center p-4">
      <Lens zoomFactor={2.0} lensSize={180} className="w-full max-w-md border border-slate-800 bg-slate-950 p-6 shadow-2xl cursor-crosshair">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">
              Magic UI Lens • Optical Zoom Engine
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40">
              Hover to Zoom (2.0x)
            </span>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="text-sm font-bold text-white tracking-wide">High-Density Silicon Microcircuit</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-mono">
              Hover your cursor over this card to activate the dynamic magnification lens. The lens uses radial gradient masking with zero layout shift, magnifying micro-details smoothly in real time.
            </p>
            <div className="grid grid-cols-3 gap-2 pt-2 text-[10px] font-mono text-cyan-300">
              <div className="p-2 rounded bg-black/60 border border-slate-800">
                <span className="text-slate-500 block">Frequency</span>
                <span className="font-bold">4.80 GHz</span>
              </div>
              <div className="p-2 rounded bg-black/60 border border-slate-800">
                <span className="text-slate-500 block">Thermal</span>
                <span className="font-bold">34.2 °C</span>
              </div>
              <div className="p-2 rounded bg-black/60 border border-slate-800">
                <span className="text-slate-500 block">Bandwidth</span>
                <span className="font-bold">128 GB/s</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center justify-between font-mono pt-1">
            <span>Move cursor across boundaries</span>
            <span className="text-cyan-400">Radial Mask: Active</span>
          </div>
        </div>
      </Lens>
    </div>
  )
}
