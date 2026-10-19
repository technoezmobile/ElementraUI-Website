import React, { useEffect, useRef } from "react"

export interface ParticlesBackgroundProps {
  particleCount?: number
  lineColor?: string
  particleColor?: string
}

export const ParticlesBackground: React.FC<ParticlesBackgroundProps> = ({
  particleCount = 45,
  lineColor = "rgba(56, 189, 248, 0.15)",
  particleColor = "rgba(56, 189, 248, 0.8)",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animId: number
    const width = (canvas.width = canvas.parentElement?.clientWidth || 500)
    const height = (canvas.height = canvas.parentElement?.clientHeight || 320)

    interface Particle {
      x: number
      y: number
      vx: number
      vy: number
      radius: number
    }

    const particles: Particle[] = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      radius: Math.random() * 1.5 + 1,
    }))

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0 || p.x > width) p.vx *= -1
        if (p.y < 0 || p.y > height) p.vy *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = particleColor
        ctx.fill()

        // Draw connecting lines between proximate particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 90) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = lineColor
            ctx.lineWidth = 0.8 * (1 - dist / 90)
            ctx.stroke()
          }
        }
      }

      animId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animId)
    }
  }, [particleCount, lineColor, particleColor])

  return (
    <div className="relative w-full h-[320px] rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
      <div className="relative z-10 text-center p-6 bg-slate-900/60 backdrop-blur-md rounded-xl border border-slate-800 max-w-sm">
        <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold block mb-1">
          Canvas Constellation Engine
        </span>
        <h4 className="text-sm font-bold text-white mb-1">Interactive Particle Network</h4>
        <p className="text-xs text-slate-400 font-mono">
          Lightweight 60 FPS HTML5 Canvas simulation with proximity vector networking.
        </p>
      </div>
    </div>
  )
}
