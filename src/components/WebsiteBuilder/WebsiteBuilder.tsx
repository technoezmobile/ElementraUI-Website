import React, { useState, useMemo } from "react"
import { DesignBrief, WebsiteSection, GeneratedWebsiteProject } from "../../types/builder"
import {
  FloatingSphere,
  AuroraShader,
  InteractiveCard,
  KineticHero,
  FloatingPillNav,
  ShimmerButton,
  LensDemo,
  MagicCardDemo,
  MagneticButton,
  BentoGrid,
  MarqueeShowcase
} from "../registry"
import {
  Wand2,
  Layout,
  Code2,
  Eye,
  Check,
  Copy,
  Download,
  Settings2,
  Sparkles,
  Laptop,
  Tablet,
  Smartphone,
  ChevronRight,
  ShieldCheck,
  ArrowRight
} from "lucide-react"

interface WebsiteBuilderProps {
  initialPrompt?: string
}

export const WebsiteBuilder: React.FC<WebsiteBuilderProps> = ({ initialPrompt }) => {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1)
  const [viewportSize, setViewportSize] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [copiedCode, setCopiedCode] = useState(false)
  const [downloadSuccess, setDownloadSuccess] = useState(false)

  // Presets
  const presets = [
    {
      title: "Autonomous Developer Intelligence Platform",
      companyName: "Nexus AI",
      industry: "DevTools & Autonomous Agents",
      tagline: "Build, deploy, and inspect production web software with autonomous agent pair-programming.",
      aesthetic: "Obsidian Slate" as const,
      accent: "cyan",
    },
    {
      title: "Precision Space & Silicon Microelectronics",
      companyName: "AeroSilicon",
      industry: "Aerospace & Hardware",
      tagline: "Ultra-low-power radiation-hardened microcircuits engineered for deep orbit telemetry.",
      aesthetic: "Cyberpunk Neon" as const,
      accent: "emerald",
    },
    {
      title: "Spatial Interactive Design Laboratory",
      companyName: "Studio Kinesis",
      industry: "Creative Engineering",
      tagline: "Designing visceral, hardware-accelerated 3D interfaces and kinetic spatial typography.",
      aesthetic: "Apple Spatial Glass" as const,
      accent: "purple",
    }
  ]

  // Brief state
  const [brief, setBrief] = useState<DesignBrief>({
    title: presets[0].title,
    companyName: presets[0].companyName,
    industry: presets[0].industry,
    tagline: presets[0].tagline,
    targetAudience: "Frontend Architects, Senior Engineers, and AI Agents",
    visualAesthetic: "Obsidian Slate",
    primaryAccent: "#38bdf8",
    typography: "Inter + JetBrains Mono"
  })

  // Sections state
  const [sections, setSections] = useState<WebsiteSection[]>([
    {
      id: "sec-nav",
      name: "Floating Island Pill Navigation",
      sectionType: "navbar",
      componentId: "floating-pill-nav",
      enabled: true,
      headline: "Navigation",
      subheadline: "Frosted-glass floating pill with spring physics."
    },
    {
      id: "sec-hero",
      name: "Kinetic Glow Landing Hero",
      sectionType: "hero",
      componentId: "kinetic-hero",
      enabled: true,
      headline: brief.title,
      subheadline: brief.tagline,
      badgeText: "v2.0 Production Release"
    },
    {
      id: "sec-marquee",
      name: "Infinite Technology Marquee",
      sectionType: "ticker",
      componentId: "marquee-showcase",
      enabled: true,
      headline: "Powered by Modern Web Standards",
      subheadline: "Hardware-accelerated infinite ticker."
    },
    {
      id: "sec-demo",
      name: "Interactive Optical Zoom Lens",
      sectionType: "interactive-demo",
      componentId: "lens",
      enabled: true,
      headline: "Precision Hardware Architecture",
      subheadline: "Hover to activate real optical zoom magnification."
    },
    {
      id: "sec-bento",
      name: "Asymmetric Feature Bento Grid",
      sectionType: "bento",
      componentId: "bento-grid",
      enabled: true,
      headline: "Engineered for Velocity",
      subheadline: "Everything needed to scale high-performance interfaces."
    },
    {
      id: "sec-pricing",
      name: "Multi-Tier Pricing Section",
      sectionType: "pricing",
      componentId: "pricing-table",
      enabled: true,
      headline: "Predictable, Transparent Pricing",
      subheadline: "Self-hosted forever. Upgrade for enterprise team governance."
    },
    {
      id: "sec-footer",
      name: "Minimalist Dark Footer",
      sectionType: "footer",
      componentId: "clean-footer",
      enabled: true,
      headline: "Footer",
      subheadline: "Clean links, legal provenance, and newsletter form."
    }
  ])

  const applyPreset = (preset: typeof presets[0]) => {
    setBrief({
      ...brief,
      title: preset.title,
      companyName: preset.companyName,
      industry: preset.industry,
      tagline: preset.tagline,
      visualAesthetic: preset.aesthetic
    })
    setSections((prev) =>
      prev.map((s) => {
        if (s.sectionType === "hero") {
          return { ...s, headline: preset.title, subheadline: preset.tagline }
        }
        return s
      })
    )
  }

  const toggleSection = (id: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    )
  }

  // Generated Source Code
  const generatedCode = useMemo(() => {
    return `// ===================================================================
// Generated by ElementraUI: AI-Assisted Website Builder
// Project: ${brief.companyName} — ${brief.title}
// Stack: Next.js 15 (React 19) + Tailwind CSS v4 + Framer Motion
// ===================================================================

import React from "react"
import { motion } from "framer-motion"
import { ShieldCheck, Zap, Terminal, Sparkles, Check, ArrowRight } from "lucide-react"

export default function AssembledLandingPage() {
  return (
    <div className="min-h-screen bg-[#07080c] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
      {/* 1. Header Navigation */}
      <header className="sticky top-4 z-50 max-w-4xl mx-auto px-4">
        <nav className="flex items-center justify-between p-3 rounded-full bg-slate-900/70 border border-slate-800/80 backdrop-blur-md shadow-2xl">
          <div className="flex items-center gap-2 font-extrabold text-white text-sm tracking-tight px-3">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>${brief.companyName}</span>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-xs text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#demo" className="hover:text-white transition-colors">Technology</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
          <button className="px-4 py-1.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-semibold transition-all">
            Get Started
          </button>
        </nav>
      </header>

      {/* 2. Kinetic Hero Section */}
      <section className="relative pt-24 pb-20 px-6 text-center max-w-5xl mx-auto overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-gradient-to-tr from-cyan-600/15 via-indigo-600/15 to-purple-600/15 blur-[120px] pointer-events-none rounded-full" />
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-slate-900/80 border border-slate-800 text-cyan-300 mb-6 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span>v2.0 Production Release</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight mb-6">
          ${brief.title}
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8">
          ${brief.tagline}
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <button className="px-7 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-semibold tracking-wide uppercase transition-all shadow-lg shadow-cyan-500/20">
            Deploy Local Instance
          </button>
          <button className="px-7 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold tracking-wide uppercase transition-all">
            Inspect Architecture
          </button>
        </div>
      </section>

      {/* 3. Bento Features Grid */}
      <section id="features" className="py-20 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Engineered for Maximum Developer Velocity</h2>
          <p className="text-xs text-slate-400 max-w-lg mx-auto mt-2">Zero third-party telemetry, 100% self-hosted, modular components.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 md:col-span-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-800">Local-First</span>
            <h3 className="text-lg font-bold text-white mt-3 mb-1">Zero Telemetry Sovereign Execution</h3>
            <p className="text-xs text-slate-400 leading-relaxed">All component rendering and code inspection run locally on your hardware without external API reliance.</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-amber-300 border border-slate-800">60 FPS</span>
            <h3 className="text-lg font-bold text-white mt-3 mb-1">Sub-Millisecond Previews</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Hardware-accelerated Three.js WebGL and spring physics rendered natively in browser.</p>
          </div>
        </div>
      </section>

      {/* 4. Footer */}
      <footer className="border-t border-slate-900 py-12 px-6 max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <span>© 2026 ${brief.companyName}. Built with ElementraUI.</span>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-slate-300">Privacy</a>
          <a href="#" className="hover:text-slate-300">Terms</a>
          <a href="#" className="hover:text-slate-300">GitHub</a>
        </div>
      </footer>
    </div>
  )
}
`
  }, [brief, sections])

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const exportProject = () => {
    const blob = new Blob([generatedCode], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${brief.companyName.toLowerCase().replace(/\s+/g, "-")}-page.tsx`
    link.click()
    URL.revokeObjectURL(url)
    setDownloadSuccess(true)
    setTimeout(() => setDownloadSuccess(false), 2500)
  }

  const getViewportClass = () => {
    switch (viewportSize) {
      case "mobile":
        return "max-w-[375px]"
      case "tablet":
        return "max-w-[768px]"
      case "desktop":
      default:
        return "w-full"
    }
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#07080c] text-slate-100">
      {/* Top Workflow Stepper */}
      <div className="border-b border-slate-800 bg-slate-950/80 px-6 py-3.5 flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-extrabold text-white">AI-Assisted Website Generator</h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">
              Deterministic Assembly
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Assemble complete, production-ready websites using verified local components and design briefs.
          </p>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 gap-1 text-xs">
          <button
            onClick={() => setActiveStep(1)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
              activeStep === 1 ? "bg-cyan-500 text-black shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            <span>1. Design Brief</span>
          </button>
          <button
            onClick={() => setActiveStep(2)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
              activeStep === 2 ? "bg-cyan-500 text-black shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            <span>2. Component Plan</span>
          </button>
          <button
            onClick={() => setActiveStep(3)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
              activeStep === 3 ? "bg-cyan-500 text-black shadow-sm" : "text-slate-400 hover:text-white"
            }`}
          >
            <span>3. Live Preview & Code</span>
          </button>
        </div>
      </div>

      {/* Main Body per Step */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeStep === 1 && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-5">
              <div>
                <h3 className="text-base font-bold text-white">Select a Design Preset or Customize</h3>
                <p className="text-xs text-slate-400 mt-0.5">Quickly seed your structured brief from battle-tested archetypes.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {presets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className="p-3.5 text-left rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900/80 transition-all group"
                  >
                    <span className="text-[10px] font-mono text-cyan-400 block mb-1 uppercase font-bold">
                      {preset.aesthetic}
                    </span>
                    <h4 className="text-xs font-bold text-white group-hover:text-cyan-200 transition-colors">
                      {preset.companyName}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                      {preset.tagline}
                    </p>
                  </button>
                ))}
              </div>

              <div className="border-t border-slate-800 pt-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1">Company / Project Name</label>
                    <input
                      type="text"
                      value={brief.companyName}
                      onChange={(e) => setBrief({ ...brief, companyName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1">Industry & Domain</label>
                    <input
                      type="text"
                      value={brief.industry}
                      onChange={(e) => setBrief({ ...brief, industry: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1">Headline Objective</label>
                  <input
                    type="text"
                    value={brief.title}
                    onChange={(e) => setBrief({ ...brief, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-400 uppercase block mb-1">Value Proposition Tagline</label>
                  <textarea
                    value={brief.tagline}
                    onChange={(e) => setBrief({ ...brief, tagline: e.target.value })}
                    rows={3}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setActiveStep(2)}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <span>Proceed to Component Assembly Plan</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeStep === 2 && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Matched Component Architecture</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Toggle and customize the verified local components assembled into this page.</p>
                </div>
                <span className="text-xs font-mono text-emerald-400">
                  {sections.filter((s) => s.enabled).length} of {sections.length} Sections Active
                </span>
              </div>

              <div className="space-y-2.5">
                {sections.map((sec) => (
                  <div
                    key={sec.id}
                    className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-4 ${
                      sec.enabled
                        ? "bg-slate-950 border-cyan-900/60 text-slate-100"
                        : "bg-slate-950/40 border-slate-900 text-slate-500"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold">{sec.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-slate-900 text-cyan-400 border border-slate-800">
                          {sec.componentId}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{sec.subheadline}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleSection(sec.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                        sec.enabled
                          ? "bg-cyan-950 text-cyan-300 border-cyan-800"
                          : "bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300"
                      }`}
                    >
                      {sec.enabled ? "Enabled" : "Disabled"}
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  onClick={() => setActiveStep(1)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium transition-colors"
                >
                  ← Back to Brief
                </button>
                <button
                  onClick={() => setActiveStep(3)}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <span>Build Live Page & Inspect Code</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeStep === 3 && (
          <div className="flex flex-col gap-6 w-full">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/40 border border-slate-800 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-slate-400">
                  <button
                    onClick={() => setViewportSize("desktop")}
                    className={`p-1.5 rounded-md transition-colors ${
                      viewportSize === "desktop" ? "bg-slate-800 text-cyan-400" : "hover:text-slate-200"
                    }`}
                    title="Desktop"
                  >
                    <Laptop className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewportSize("tablet")}
                    className={`p-1.5 rounded-md transition-colors ${
                      viewportSize === "tablet" ? "bg-slate-800 text-cyan-400" : "hover:text-slate-200"
                    }`}
                    title="Tablet"
                  >
                    <Tablet className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewportSize("mobile")}
                    className={`p-1.5 rounded-md transition-colors ${
                      viewportSize === "mobile" ? "bg-slate-800 text-cyan-400" : "hover:text-slate-200"
                    }`}
                    title="Mobile"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-xs font-mono text-slate-400 hidden sm:inline">
                  Viewing: {viewportSize.toUpperCase()} Viewport
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={copyCode}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? "Copied" : "Copy Code"}</span>
                </button>
                <button
                  onClick={exportProject}
                  className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Project Files</span>
                </button>
              </div>
            </div>

            {/* Live Rendered Canvas Frame */}
            <div className="flex flex-col items-center w-full">
              <div
                className={`transition-all duration-300 w-full ${getViewportClass()} rounded-3xl border border-slate-800 bg-[#07080c] shadow-2xl overflow-hidden p-6 space-y-12`}
              >
                {/* 1. Navbar */}
                {sections.find((s) => s.id === "sec-nav")?.enabled && (
                  <div className="w-full">
                    <FloatingPillNav />
                  </div>
                )}

                {/* 2. Kinetic Hero */}
                {sections.find((s) => s.id === "sec-hero")?.enabled && (
                  <div className="w-full">
                    <KineticHero
                      badgeText="v2.0 Production Ready"
                      headline={brief.title}
                      description={brief.tagline}
                    />
                  </div>
                )}

                {/* 3. Ticker Marquee */}
                {sections.find((s) => s.id === "sec-marquee")?.enabled && (
                  <div className="w-full flex justify-center">
                    <MarqueeShowcase speed={20} />
                  </div>
                )}

                {/* 4. Optical Lens Showcase */}
                {sections.find((s) => s.id === "sec-demo")?.enabled && (
                  <div className="w-full flex flex-col items-center">
                    <LensDemo />
                  </div>
                )}

                {/* 5. Bento Grid */}
                {sections.find((s) => s.id === "sec-bento")?.enabled && (
                  <div className="w-full flex justify-center">
                    <BentoGrid />
                  </div>
                )}

                {/* 6. Pricing Section */}
                {sections.find((s) => s.id === "sec-pricing")?.enabled && (
                  <div className="w-full max-w-2xl mx-auto p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-center">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40">
                      Transparent Pricing
                    </span>
                    <h3 className="text-xl font-bold text-white">Simple, Predictable Tiers</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-left">
                      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-xs font-bold text-white">Self-Hosted Community</span>
                        <div className="text-2xl font-extrabold text-white my-1">$0 <span className="text-xs text-slate-400 font-normal">/ forever</span></div>
                        <p className="text-[11px] text-slate-400 mb-3">100% open source, run on your own infrastructure.</p>
                        <button className="w-full py-1.5 rounded-lg bg-slate-800 text-xs text-slate-200 font-medium">Download Stack</button>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-900 border border-cyan-500/40">
                        <span className="text-xs font-bold text-cyan-300">Enterprise Cloud</span>
                        <div className="text-2xl font-extrabold text-white my-1">$79 <span className="text-xs text-slate-400 font-normal">/ seat / mo</span></div>
                        <p className="text-[11px] text-slate-400 mb-3">SSO, private registry mirroring, team prompt vault.</p>
                        <button className="w-full py-1.5 rounded-lg bg-cyan-500 text-xs text-black font-semibold">Start Enterprise Trial</button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 7. Footer */}
                {sections.find((s) => s.id === "sec-footer")?.enabled && (
                  <footer className="border-t border-slate-900 pt-8 pb-4 text-center text-xs text-slate-500 font-mono">
                    <p>© 2026 {brief.companyName}. Built with ElementraUI Autonomous Generator.</p>
                  </footer>
                )}
              </div>
            </div>

            {/* Generated Code Inspection Panel */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-cyan-400" />
                  AssembledLandingPage.tsx (Production Ready)
                </span>
                <span>{brief.visualAesthetic} • React 19</span>
              </div>
              <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto max-h-[420px]">
                <code>{generatedCode}</code>
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
