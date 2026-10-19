import React, { useRef } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"

interface InteractiveCardProps {
  title?: string
  subtitle?: string
  badge?: string
}

export const InteractiveCard: React.FC<InteractiveCardProps> = ({
  title = "Spatial Intelligence Card",
  subtitle = "Hover and tilt with spring physics, dynamic glare reflection and depth layers.",
  badge = "Interactive 3D Tilt",
}) => {
  const cardRef = useRef<HTMLDivElement>(null)

  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  // Spring configuration for smooth buttery rotation
  const springConfig = { damping: 20, stiffness: 150, mass: 0.6 }
  const smoothMouseX = useSpring(mouseX, springConfig)
  const smoothMouseY = useSpring(mouseY, springConfig)

  const rotateX = useTransform(smoothMouseY, [0, 1], [15, -15])
  const rotateY = useTransform(smoothMouseX, [0, 1], [-15, 15])
  const glareX = useTransform(smoothMouseX, [0, 1], ["0%", "100%"])
  const glareY = useTransform(smoothMouseY, [0, 1], ["0%", "100%"])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    mouseX.set(0.5)
    mouseY.set(0.5)
  }

  return (
    <div className="w-full flex items-center justify-center py-6 [perspective:1000px]">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full max-w-sm rounded-2xl p-6 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-2xl cursor-pointer group overflow-hidden"
      >
        {/* Dynamic Glare Effect */}
        <motion.div
          style={{
            background: useTransform(
              [glareX, glareY],
              ([gx, gy]) =>
                `radial-gradient(circle 250px at ${gx} ${gy}, rgba(255,255,255,0.15), transparent 70%)`
            ),
          }}
          className="absolute inset-0 pointer-events-none rounded-2xl z-10"
        />

        {/* Card Header & Content */}
        <div style={{ transform: "translateZ(30px)" }} className="relative z-20">
          <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 rounded-full mb-3">
            {badge}
          </span>
          <h4 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-200 transition-colors">
            {title}
          </h4>
          <p className="text-sm text-slate-400 leading-relaxed mb-6">
            {subtitle}
          </p>

          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>Framer Motion Physics</span>
            <span className="text-cyan-400 font-bold group-hover:translate-x-1 transition-transform">
              Explore →
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
