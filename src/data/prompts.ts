import { PromptTemplate } from "../types/prompt"

export const initialPrompts: PromptTemplate[] = [
  {
    id: "prompt-saas-enterprise-landing",
    title: "Enterprise SaaS Landing Page Architecture",
    category: "Landing Pages",
    tool: "Claude Code",
    framework: "Next.js 15 App Router (React 19) + Tailwind CSS v4",
    designObjective: "Create a world-class, high-converting enterprise SaaS landing page with dark obsidian aesthetic, kinetic gradient blur, and interactive product demo block.",
    constraints: [
      "Zero layout shifts during font loading",
      "Tailwind CSS v4 OKLCH dark palette",
      "Framer Motion layout transitions with spring physics",
      "WCAG AA accessible color contrast"
    ],
    exclusions: [
      "No generic stock placeholder images",
      "No heavy external font CDNs without preconnect",
      "No uncompressed asset dependencies"
    ],
    relevantComponents: ["kinetic-hero-section", "floating-pill-nav", "shimmer-light-button", "bento-grid"],
    tags: ["SaaS", "Landing Page", "Obsidian Dark", "Enterprise", "Claude Code"],
    version: 1,
    updatedAt: "2026-10-18",
    promptText: `Act as a senior frontend design engineer at a premier design agency. Build an enterprise-grade SaaS landing page for an autonomous developer platform with the following requirements:

1. ARCHITECTURE & LAYOUT:
   - Sticky frosted-glass navbar with island pill navigation, animated active state indicator, and GitHub star badge.
   - Hero section featuring an animated status badge ("v2.0 Production Ready"), high-impact typography with word-level spring entrance, and a dual-button CTA suite (Primary Shimmer Button + Secondary Outline).
   - Radial kinetic glow backdrop with subtle background animation.
   - Interactive Bento Grid showcase with 4 modular feature cards, custom SVG icons, and hover depth.
   - Infinite hardware-accelerated partner logo marquee with pause-on-hover.
   - Multi-tier pricing table with Annual/Monthly billing toggle and savings badge.
   - Clean dark-mode footer with newsletter subscription input and status indicator.

2. TECHNICAL STACK:
   - Framework: Next.js 15 (React 19) with TypeScript
   - Styling: Tailwind CSS v4 using semantic tokens (--background, --foreground, --primary, --border)
   - Motion: Framer Motion spring dampening (stiffness: 150, damping: 20)
   - Icons: Lucide React

3. ACCESSIBILITY & CONTRAST:
   - All interactive controls have distinct focus-visible rings (ring-2 ring-cyan-400).
   - Ensure 4.5:1 text-to-background contrast ratio on all body elements.`
  },
  {
    id: "prompt-realtime-observability-dashboard",
    title: "Real-time Telemetry & Observability Dashboard",
    category: "Dashboards",
    tool: "Cursor",
    framework: "React 19 + Tailwind CSS v4 + Lucide React",
    designObjective: "Build a high-density, low-latency telemetry monitoring dashboard with real-time metric cards, sparkline charts, and live incident stream.",
    constraints: [
      "High information density without visual clutter",
      "Monospace figures for zero jitter on numerical updates",
      "Responsive collapsible sidebar with keyboard navigation"
    ],
    exclusions: [
      "No heavy charting libraries where SVG or canvas suffices",
      "No bright saturated backgrounds that cause eye fatigue"
    ],
    relevantComponents: ["interactive-3d-card", "particles-background", "bento-grid"],
    tags: ["Dashboard", "Telemetry", "Observability", "Cursor", "Metrics"],
    version: 1,
    updatedAt: "2026-10-18",
    promptText: `Act as a principal systems UI architect. Create a real-time developer observability dashboard in TypeScript:

1. LAYOUT & HIERARCHY:
   - Fixed header with environment switcher (Production / Staging / Edge), global search input (Cmd+K shortcut), and live WebSocket connection heartbeat indicator.
   - Left-hand collapsible icon rail navigation with tooltips.
   - Top KPI metric row: Throughput (RPS), P99 Latency (ms), Error Rate (%), Active Nodes. Each card includes a simulated SVG sparkline and 24h delta pill.
   - Central split panel:
     - Left: Real-time service topology graph or canvas particle network.
     - Right: Live streaming log event stream with monospace formatting and severity color badges (INFO, WARN, CRIT).

2. DESIGN SYSTEM:
   - Background: OLED black (#07080c) with subtle 1px border grid (#1a1d26).
   - Accents: Electric Emerald (#10b981) for healthy status, Neon Rose (#f43f5e) for anomalies, Cyan (#06b6d4) for latency.
   - Typography: Geist Sans or Inter for interface, JetBrains Mono with tabular-nums for numeric counters.`
  },
  {
    id: "prompt-3d-creative-developer-portfolio",
    title: "Creative Developer Portfolio with Three.js WebGL",
    category: "Portfolios",
    tool: "Windsurf",
    framework: "React 19 + Three.js + Framer Motion + Tailwind CSS",
    designObjective: "Build an unforgettable personal portfolio for a creative developer with hardware-accelerated 3D geometry, magnetic buttons, and smooth staggered media showcase.",
    constraints: [
      "Three.js canvas MUST have complete cleanup on unmount (cancelAnimationFrame, dispose geometries/materials)",
      "Cap pixel ratio at Math.min(window.devicePixelRatio, 2) to protect mobile batteries",
      "Maintain 60 FPS across desktop and mobile"
    ],
    exclusions: [
      "Do not block page scroll with pointer events on 3D canvas (use pointer-events-none on canvas)",
      "No large uncompressed 3D models"
    ],
    relevantComponents: ["floating-sphere-3d", "magnetic-button", "staggered-interactive-gallery"],
    tags: ["Portfolio", "Creative Dev", "Three.js", "WebGL", "Windsurf"],
    version: 1,
    updatedAt: "2026-10-18",
    promptText: `Act as an award-winning creative developer. Build a creative engineering portfolio with Three.js WebGL integration:

1. 3D WEBGL HERO CANVAS:
   - Background canvas rendering a dual-layer floating icosahedron wireframe sphere with pulsating neon core.
   - Smooth mouse coordinate parallax with subtle auto-rotation.
   - Headline overlay: "Creative Technologist & Design Systems Architect" with staggered blur-in reveal.
   - Magnetic action button that pulls towards cursor coordinates on hover.

2. SHOWCASE & WORK GALLERY:
   - Staggered responsive 3-column project showcase with image hover scale and tag pills.
   - Interactive 3D tilt cards for featured open-source libraries.
   - Tech stack ticker with infinite horizontal marquee.
   - Interactive terminal drawer at bottom showing recent git commits and contact links.`
  },
  {
    id: "prompt-optical-zoom-ecommerce",
    title: "Luxury Product Showcase with Optical Zoom Lens",
    category: "E-Commerce",
    tool: "v0",
    framework: "Next.js 15 + Tailwind CSS v4 + Framer Motion",
    designObjective: "Create a luxury product detail section featuring an interactive magnification lens for inspecting fine textures, dynamic thumbnail carousel, and fluid purchase drawer.",
    constraints: [
      "Lens magnification must track pointer with zero layout jump",
      "Radial gradient mask with circular boundary rim",
      "Seamless mobile touch fallback"
    ],
    exclusions: [
      "No third-party jQuery zoom plugins",
      "No low-resolution image scaling"
    ],
    relevantComponents: ["magicui-lens", "magicui-magic-card", "shimmer-light-button"],
    tags: ["E-Commerce", "Lens", "Product Detail", "Luxury", "v0"],
    version: 1,
    updatedAt: "2026-10-18",
    promptText: `Create a luxury hardware product showcase page in React with an interactive magnification lens:

1. INTERACTIVE OPTICAL LENS:
   - Implement an interactive Lens component that reveals a 2.0x magnification of the product imagery on hover.
   - Use dynamic CSS radial-gradient masking with transformOrigin matching exact mouse client coordinates.
   - Add a subtle luminous cyan circular border ring around the active lens glass.

2. PRODUCT CONFIGURATOR:
   - Finish options: Obsidian Matte, Brushed Titanium, Cyber Silver with interactive color swatches.
   - Spec checklist: Frequency, Thermal Dissipation, Bandwidth.
   - Action Suite: Shimmer Beam Action Button ("Pre-Order Unit") with real-time stock availability pulse.`
  },
  {
    id: "prompt-procedural-shader-hero",
    title: "Procedural WebGL Aurora Shader Experience",
    category: "Shaders & Effects",
    tool: "Claude Code",
    framework: "React 19 + Raw WebGL / GLSL + Tailwind CSS",
    designObjective: "Implement a full-screen procedural GLSL fragment shader rendering undulating aurora wave interference patterns, 2D value noise, and dynamic neon color gradients.",
    constraints: [
      "Pure raw WebGL 1.0 or 2.0 (zero heavy 3D engine overhead)",
      "High precision float uniforms with u_time and u_resolution",
      "Resize listener updating canvas buffer dimensions"
    ],
    exclusions: [
      "No pre-rendered video loops",
      "No CPU-based canvas pixel iteration"
    ],
    relevantComponents: ["aurora-webgl-shader", "blur-reveal-typography", "magnetic-button"],
    tags: ["Shader", "GLSL", "Aurora", "WebGL", "Claude Code"],
    version: 1,
    updatedAt: "2026-10-18",
    promptText: `Implement a production procedural WebGL fragment shader hero in TypeScript:

1. GLSL FRAGMENT SHADER PIPELINE:
   - Screen-aligned quad vertex shader.
   - Procedural 2D hash and value noise algorithm in fragment shader.
   - Undulating wave interference equations driven by u_time uniform.
   - Dynamic 3-point color gradient: Dark Violet (#140c38), Electric Cyan (#38bdf8), and Neon Magenta (#f43f5e).
   - High-performance 60 FPS rendering with minimal GPU memory footprint.

2. HERO CONTENT OVERLAY:
   - Centered typography: "The Architecture of Light" with blurred text reveal.
   - Backdrop blur floating pill navigation.
   - Magnetic action button linked to shader parameter controls.`
  },
  {
    id: "prompt-clean-room-website-replication",
    title: "Clean-Room Website Replication Blueprint",
    category: "Replication & References",
    tool: "Cursor",
    framework: "React 19 + Tailwind CSS v4",
    designObjective: "Reverse-engineer and cleanly replicate an existing web design reference into independent, legally compliant, accessible components without copying proprietary code.",
    constraints: [
      "Original code only — zero copy-paste of proprietary markup or styles",
      "Reconstruct visual rhythm, typography proportions, and spacing independently",
      "Document architecture observations and reconstruction roadmap"
    ],
    exclusions: [
      "Do not download or scrape private proprietary assets",
      "Do not copy copyrighted brand logos"
    ],
    relevantComponents: ["bento-grid", "magicui-magic-card", "floating-pill-nav"],
    tags: ["Clean-Room", "Replication", "Design Study", "Cursor", "Reverse Engineering"],
    version: 1,
    updatedAt: "2026-10-18",
    promptText: `Act as a senior software reverse-engineering and design-systems engineer. Given a design reference or screenshot:

1. ARCHITECTURAL DECONSTRUCTION:
   - Measure typographic hierarchy: Display headline size, line-height ratio, tracking.
   - Identify vertical rhythm: Grid margins, container widths (max-w-7xl, max-w-5xl), component gaps.
   - Map color tokens: Surface colors, border contrast ratios, semantic accents.
   - Analyze motion cues: Easing curves (ease-out, spring physics), hover states, page transition behavior.

2. CLEAN-ROOM RECONSTRUCTION:
   - Write clean, original semantic TypeScript components.
   - Implement layout using Tailwind CSS utility classes.
   - Replace proprietary assets with royalty-free SVG icons or vector canvas shapes.
   - Ensure full responsive adaptation from mobile (375px) through 4K displays.`
  }
]
