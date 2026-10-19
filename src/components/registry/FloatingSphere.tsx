import React, { useEffect, useRef } from "react"
import * as THREE from "three"

interface FloatingSphereProps {
  color?: string
  wireframe?: boolean
  particleCount?: number
}

export const FloatingSphere: React.FC<FloatingSphereProps> = ({
  color = "#38bdf8",
  wireframe = true,
  particleCount = 50,
}) => {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const current = mountRef.current
    if (!current) return

    // Scene, Camera, Renderer
    const scene = new THREE.Scene()
    const width = current.clientWidth || 300
    const height = current.clientHeight || 300
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    current.appendChild(renderer.domElement)

    // Main Sphere
    const geometry = new THREE.IcosahedronGeometry(1.6, 3)
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(color),
      wireframe,
      transparent: true,
      opacity: 0.8,
    })
    const sphere = new THREE.Mesh(geometry, material)
    scene.add(sphere)

    // Inner Core
    const coreGeo = new THREE.SphereGeometry(0.8, 16, 16)
    const coreMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#ec4899"),
      wireframe: false,
      transparent: true,
      opacity: 0.6,
    })
    const core = new THREE.Mesh(coreGeo, coreMat)
    scene.add(core)

    // Animation Loop
    let animationFrameId: number
    const clock = new THREE.Clock()

    const animate = () => {
      const elapsedTime = clock.getElapsedTime()
      sphere.rotation.x = elapsedTime * 0.2
      sphere.rotation.y = elapsedTime * 0.3
      core.rotation.y = -elapsedTime * 0.4
      
      const scale = 1 + Math.sin(elapsedTime * 2) * 0.05
      core.scale.set(scale, scale, scale)

      renderer.render(scene, camera)
      animationFrameId = requestAnimationFrame(animate)
    }
    animate()

    // Resize listener
    const handleResize = () => {
      if (!current) return
      const w = current.clientWidth
      const h = current.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", handleResize)
      renderer.dispose()
      geometry.dispose()
      material.dispose()
      coreGeo.dispose()
      coreMat.dispose()
      if (current.contains(renderer.domElement)) {
        current.removeChild(renderer.domElement)
      }
    }
  }, [color, wireframe, particleCount])

  return (
    <div className="relative w-full h-full min-h-[300px] flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      <div ref={mountRef} className="w-full h-full min-h-[300px] flex items-center justify-center cursor-grab active:cursor-grabbing" />
      <div className="absolute bottom-4 left-4 text-xs font-mono text-cyan-400 bg-slate-900/80 px-2 py-1 rounded border border-cyan-800/40">
        Three.js Interactive Core (WebGL)
      </div>
    </div>
  )
}
