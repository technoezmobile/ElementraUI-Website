import React from "react"
import { motion } from "framer-motion"

export interface MarqueeShowcaseProps {
  speed?: number
  pauseOnHover?: boolean
}

export const MarqueeShowcase: React.FC<MarqueeShowcaseProps> = ({
  speed = 25,
  pauseOnHover = true,
}) => {
  const tags = [
    "Three.js WebGL",
    "Framer Motion",
    "Tailwind CSS v4",
    "React 19",
    "GLSL Shaders",
    "shadcn Registry",
    "Next.js 15",
    "Spring Physics",
    "Lucide Icons",
    "Canvas 2D",
  ]

  // Double array for seamless loop
  const list = [...tags, ...tags]

  return (
    <div className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-slate-950 border border-slate-800 p-6 flex flex-col items-center">
      <div className="text-center mb-4">
        <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold block mb-1">
          Hardware-Accelerated Ticker
        </span>
        <h4 className="text-sm font-bold text-white">Infinite Horizontal Marquee</h4>
      </div>

      <div className="relative w-full overflow-hidden flex items-center group py-2">
        {/* Gradient edge fades */}
        <div className="absolute left-0 inset-y-0 w-12 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 inset-y-0 w-12 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            duration: speed,
            ease: "linear",
          }}
          className="flex items-center gap-3 whitespace-nowrap group-hover:[animation-play-state:paused]"
        >
          {list.map((item, idx) => (
            <div
              key={idx}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 shadow-sm flex items-center gap-1.5 hover:border-cyan-500/50 hover:text-cyan-300 transition-colors cursor-default"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              {item}
            </div>
          ))}
        </motion.div>
      </div>
      <span className="text-[10px] font-mono text-slate-500 mt-3">Hover to pause continuous motion loop</span>
    </div>
  )
}
