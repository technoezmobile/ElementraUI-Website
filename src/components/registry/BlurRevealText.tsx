import React from "react"
import { motion } from "framer-motion"

interface BlurRevealTextProps {
  text?: string
  delay?: number
}

export const BlurRevealText: React.FC<BlurRevealTextProps> = ({
  text = "Typography in Motion — Engineered for Impact",
  delay = 0.05,
}) => {
  const words = text.split(" ")

  return (
    <div className="w-full p-8 rounded-xl bg-slate-950 border border-slate-800 text-center flex flex-col items-center justify-center min-h-[180px]">
      <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight flex flex-wrap justify-center gap-x-2 gap-y-1">
        {words.map((word, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, filter: "blur(12px)", y: 10 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{
              duration: 0.8,
              delay: index * delay,
              ease: [0.2, 0.65, 0.3, 0.9],
            }}
            className="inline-block"
          >
            {word}
          </motion.span>
        ))}
      </h2>
      <p className="text-xs text-slate-500 font-mono mt-4">
        Smooth CSS Filter Blur-In via Framer Motion
      </p>
    </div>
  )
}
