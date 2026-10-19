import { RegistryComponent } from "../types/registry"

export const componentsData: RegistryComponent[] = [
  {
    id: "floating-sphere-3d",
    name: "Interactive 3D Floating Sphere",
    slug: "floating-sphere",
    category: "3D",
    author: {
      name: "Three.js Community / Local",
      url: "https://threejs.org",
    },
    description: "Hardware-accelerated 3D dual-layer icosahedron sphere with wireframe shading, pulsating inner core, and auto-rotation using Three.js WebGL.",
    tags: ["3D", "WebGL", "Three.js", "Icosahedron", "Interactive"],
    license: "MIT",
    dependencies: ["three", "@types/three"],
    provenance: {
      origin: "Local 3D WebGL Implementation",
      repository: "https://github.com/mrdoob/three.js",
      licenseUrl: "https://github.com/mrdoob/three.js/blob/dev/LICENSE",
    },
    installCommand: "npx shadcn@latest add http://localhost:5173/r/floating-sphere.json",
    componentCode: `import React, { useEffect, useRef } from "react"
import * as THREE from "three"

export const FloatingSphere: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const current = mountRef.current
    if (!current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, current.clientWidth / current.clientHeight, 0.1, 1000)
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(current.clientWidth, current.clientHeight)
    current.appendChild(renderer.domElement)

    const geometry = new THREE.IcosahedronGeometry(1.6, 3)
    const material = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true, transparent: true, opacity: 0.8 })
    const sphere = new THREE.Mesh(geometry, material)
    scene.add(sphere)

    let animId: number
    const animate = () => {
      sphere.rotation.x += 0.005
      sphere.rotation.y += 0.008
      renderer.render(scene, camera)
      animId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      renderer.dispose()
      if (current.contains(renderer.domElement)) current.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} className="w-full h-full min-h-[300px]" />
}`,
    demoCode: `<FloatingSphere color="#38bdf8" wireframe={true} />`,
  },
  {
    id: "aurora-webgl-shader",
    name: "Real-time Aurora Wave Shader",
    slug: "aurora-shader",
    category: "Shaders",
    author: {
      name: "GLSL Community / Local",
      url: "https://thebookofshaders.com",
    },
    description: "Full-screen procedural GLSL fragment shader rendering undulating wave interference patterns, 2D value noise, and dynamic neon color gradients at 60 FPS.",
    tags: ["Shaders", "GLSL", "Fragment Shader", "WebGL", "Noise"],
    license: "MIT",
    dependencies: ["react"],
    provenance: {
      origin: "WebGL GLSL Procedural Shader Engine",
      repository: "https://thebookofshaders.com",
      licenseUrl: "https://opensource.org/licenses/MIT",
    },
    installCommand: "npx shadcn@latest add http://localhost:5173/r/aurora-shader.json",
    componentCode: `// Procedural WebGL Fragment Shader
const fragmentShader = \`
  precision highp float;
  uniform vec2 u_resolution;
  uniform float u_time;
  // Dynamic waves & noise calculation
  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    // ...
    gl_FragColor = vec4(col, 1.0);
  }
\`;`,
    demoCode: `<AuroraShader />`,
  },
  {
    id: "interactive-3d-card",
    name: "Interactive 3D Spring Tilt Card",
    slug: "interactive-card",
    category: "3D",
    author: {
      name: "Framer Motion / Local",
      url: "https://motion.dev",
    },
    description: "Physics-based 3D perspective tilt card with spring dampening, dynamic glare sheen highlights tracking cursor coordinates, and depth z-translation.",
    tags: ["3D", "Framer Motion", "Spring Physics", "Tilt", "Glare"],
    license: "MIT",
    dependencies: ["framer-motion", "react"],
    provenance: {
      origin: "Motion Primitives / Framer Motion",
      repository: "https://github.com/ibelick/motion-primitives",
      licenseUrl: "https://github.com/ibelick/motion-primitives/blob/main/LICENSE",
    },
    installCommand: "npx shadcn@latest add http://localhost:5173/r/interactive-card.json",
    componentCode: `import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"

export const InteractiveCard = () => {
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)
  const rotateX = useTransform(useSpring(mouseY), [0, 1], [15, -15])
  const rotateY = useTransform(useSpring(mouseX), [0, 1], [-15, 15])
  return (
    <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}>
      {/* 3D Content */}
    </motion.div>
  )
}`,
    demoCode: `<InteractiveCard title="Spatial Intelligence" badge="Interactive 3D" />`,
  },
  {
    id: "kinetic-hero-section",
    name: "Kinetic Glow Landing Hero",
    slug: "kinetic-hero",
    category: "Heroes",
    author: {
      name: "Magic UI / Local",
      url: "https://magicui.design",
    },
    description: "Modern SaaS landing page hero section featuring animated status pill badge, staggered text entrance, and subtle radial gradient kinetic background blur.",
    tags: ["Heroes", "Landing Page", "Kinetic", "Framer Motion", "SaaS"],
    license: "MIT",
    dependencies: ["framer-motion", "clsx", "tailwind-merge"],
    provenance: {
      origin: "Magic UI Landing Patterns",
      repository: "https://github.com/magicuidesign/magicui",
      licenseUrl: "https://github.com/magicuidesign/magicui/blob/main/LICENSE",
    },
    installCommand: "npx shadcn@latest add http://localhost:5173/r/kinetic-hero.json",
    componentCode: `export const KineticHero = () => {
  return (
    <div className="relative w-full rounded-2xl bg-slate-950 p-12 text-center">
      {/* Staggered animated hero elements */}
    </div>
  )
}`,
    demoCode: `<KineticHero headline="Craft interfaces with code precision." />`,
  },
  {
    id: "blur-reveal-typography",
    name: "Staggered Blur-In Typography",
    slug: "blur-reveal-text",
    category: "Typography",
    author: {
      name: "Motion Primitives / Local",
      url: "https://motion-primitives.com",
    },
    description: "Cinematic text entrance animation with per-word CSS blur decimation, spring translation, and staggered opacity reveal.",
    tags: ["Typography", "Text Animation", "Blur", "Motion", "CSS Filter"],
    license: "MIT",
    dependencies: ["framer-motion"],
    provenance: {
      origin: "Motion Primitives Text Blur",
      repository: "https://github.com/ibelick/motion-primitives",
      licenseUrl: "https://github.com/ibelick/motion-primitives/blob/main/LICENSE",
    },
    installCommand: "npx shadcn@latest add http://localhost:5173/r/blur-reveal-text.json",
    componentCode: `// Word-by-word blur filter stagger animation`,
    demoCode: `<BlurRevealText text="Typography in Motion — Engineered for Impact" />`,
  },
  {
    id: "floating-pill-nav",
    name: "Floating Spring Pill Navigation",
    slug: "floating-pill-nav",
    category: "Navigation",
    author: {
      name: "Kokonut UI / Local",
      url: "https://kokonutui.com",
    },
    description: "Floating dock navigation bar with smooth spring layoutId bubble transition between active items, backdrop blur glass, and Lucide icons.",
    tags: ["Navigation", "Navbar", "Pill", "Spring Animation", "LayoutId"],
    license: "MIT",
    dependencies: ["framer-motion", "lucide-react"],
    provenance: {
      origin: "Kokonut UI Dock Navigation",
      repository: "https://github.com/kokonut-labs/kokonutui",
      licenseUrl: "https://github.com/kokonut-labs/kokonutui/blob/main/LICENSE",
    },
    installCommand: "npx shadcn@latest add http://localhost:5173/r/floating-pill-nav.json",
    componentCode: `// Floating navigation pill with layoutId active background`,
    demoCode: `<FloatingPillNav />`,
  },
  {
    id: "staggered-interactive-gallery",
    name: "Expanding Card Layout Gallery",
    slug: "staggered-gallery",
    category: "Galleries",
    author: {
      name: "Framer Motion / Local",
      url: "https://motion.dev",
    },
    description: "Responsive grid gallery with interactive hover lifts and fluid spring layout morphing into an expanded modal backdrop preview.",
    tags: ["Galleries", "Grid", "Modal", "Layout Morph", "Cards"],
    license: "MIT",
    dependencies: ["framer-motion"],
    provenance: {
      origin: "Framer Motion Shared Layout",
      repository: "https://github.com/motiondivision/motion",
      licenseUrl: "https://github.com/motiondivision/motion/blob/main/LICENSE.md",
    },
    installCommand: "npx shadcn@latest add http://localhost:5173/r/staggered-gallery.json",
    componentCode: `// Card gallery with AnimatePresence expanding modal overlay`,
    demoCode: `<StaggeredGallery />`,
  },
  {
    id: "shimmer-light-button",
    name: "Shimmer Beam Action Button",
    slug: "shimmer-button",
    category: "Effects",
    author: {
      name: "Magic UI / Local",
      url: "https://magicui.design",
    },
    description: "Interactive button effect with continuous skewed gradient shimmer reflection, hover scale physics, and subtle ping status indicator.",
    tags: ["Effects", "Button", "Shimmer", "Glow", "CSS Gradient"],
    license: "MIT",
    dependencies: ["framer-motion"],
    provenance: {
      origin: "Magic UI Shimmer Effect",
      repository: "https://github.com/magicuidesign/magicui",
      licenseUrl: "https://github.com/magicuidesign/magicui/blob/main/LICENSE",
    },
    installCommand: "npx shadcn@latest add http://localhost:5173/r/shimmer-button.json",
    componentCode: `// Shimmer light beam button with Framer Motion loop`,
    demoCode: `<ShimmerButton>Deploy to Local Stack</ShimmerButton>`,
  },
]
