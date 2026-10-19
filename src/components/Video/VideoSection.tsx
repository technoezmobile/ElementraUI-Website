import React, { useState, useMemo } from "react"
import { VideoItem } from "../../types/marketplace"
import { verifiedVideoData } from "../../data/videoData"
import {
  Film,
  Search,
  Play,
  Pause,
  Bookmark,
  Sparkles,
  Code2,
  Copy,
  Check,
  RotateCcw,
  Clock,
  Layers,
  Wand2
} from "lucide-react"

interface VideoSectionProps {
  onToggleBookmark: (id: string, item: VideoItem) => void
  isBookmarked: (id: string) => boolean
}

export const VideoSection: React.FC<VideoSectionProps> = ({ onToggleBookmark, isBookmarked }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const categories = ["All", "Background Loops", "Hero Motion", "Transitions", "Device Mockups", "Data & Charts"]

  const filteredVideos = useMemo(() => {
    return verifiedVideoData.filter((v) => {
      if (selectedCategory !== "All" && v.category !== selectedCategory) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        return (
          v.name.toLowerCase().includes(q) ||
          v.description.toLowerCase().includes(q) ||
          v.tags.some((t) => t.toLowerCase().includes(q))
        )
      }
      return true
    })
  }, [searchQuery, selectedCategory])

  return (
    <div className="flex-1 flex flex-col p-4 lg:p-6 space-y-6 bg-surface-base">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-subtle">
        <div>
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-primary" />
            <h2 className="font-headline-lg text-xl sm:text-2xl font-bold tracking-tight text-text-primary">
              Video & Motion Engineering Assets
            </h2>
          </div>
          <p className="font-body-sm text-xs text-text-muted mt-1 leading-relaxed">
            Looping background canvas animations, 3D WebGL simulations, Remotion code blocks, and kinetic video presets.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-surface-subtle border border-border-subtle p-3 rounded-xl">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search motion assets, loops..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-surface-base border border-border-subtle text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-violet-deep font-body-md"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-accent-violet-deep text-white shadow-sm font-semibold"
                  : "bg-surface-base border border-border-subtle text-text-muted hover:text-text-primary hover:bg-surface-raised"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Video Assets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => {
          const isSaved = isBookmarked(video.id)
          const isHovered = hoveredId === video.id

          return (
            <div
              key={video.id}
              onClick={() => setSelectedVideo(video)}
              onMouseEnter={() => setHoveredId(video.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="rounded-3xl border border-slate-800 bg-slate-950/70 hover:border-cyan-500/50 hover:shadow-2xl transition-all cursor-pointer flex flex-col justify-between overflow-hidden group"
            >
              {/* Poster / Canvas Animation Stage */}
              <div
                className={`h-48 bg-gradient-to-br ${video.posterColor} relative p-4 flex flex-col justify-between overflow-hidden`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    {video.motionEngine}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleBookmark(video.id, video)
                    }}
                    className={`p-1.5 rounded-full border backdrop-blur-md transition-all ${
                      isSaved
                        ? "bg-rose-950/80 border-rose-800 text-rose-400"
                        : "bg-black/60 border-white/20 text-slate-300 hover:text-white"
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-rose-400" : ""}`} />
                  </button>
                </div>

                {/* Center Play Indicator */}
                <div className="self-center">
                  <div
                    className={`w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border border-white/30 flex items-center justify-center text-white transition-transform duration-200 ${
                      isHovered ? "scale-110 bg-cyan-500 text-black border-cyan-400" : ""
                    }`}
                  >
                    <Play className="w-5 h-5 ml-0.5 fill-current" />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-white/80 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {video.durationSeconds}s duration
                  </span>
                  <span>{video.fps} FPS</span>
                </div>
              </div>

              {/* Information Body */}
              <div className="p-5 flex flex-col justify-between flex-1 space-y-3">
                <div>
                  <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block mb-1">
                    {video.category}
                  </span>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {video.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {video.description}
                  </p>
                </div>

                {/* Footer */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono text-slate-500">By {video.author.name}</span>
                  <span className="text-cyan-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Inspect Code</span>
                    <span>→</span>
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Video Detail Modal */}
      {selectedVideo && <VideoDetailModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />}
    </div>
  )
}

interface VideoDetailModalProps {
  video: VideoItem
  onClose: () => void
}

const VideoDetailModal: React.FC<VideoDetailModalProps> = ({ video, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true)
  const [copiedCode, setCopiedCode] = useState(false)
  const [copiedRemotion, setCopiedRemotion] = useState(false)

  const copyAnimation = () => {
    if (video.animationCode) {
      navigator.clipboard.writeText(video.animationCode)
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
    }
  }

  const copyRemotion = () => {
    if (video.remotionSnippet) {
      navigator.clipboard.writeText(video.remotionSnippet)
      setCopiedRemotion(true)
      setTimeout(() => setCopiedRemotion(false), 2000)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[94vw] max-w-4xl h-[90vh] bg-[#090a10] border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col justify-between overflow-hidden"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">{video.name}</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 font-bold">
                {video.motionEngine}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{video.description}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white">
            ✕
          </button>
        </div>

        {/* Video Player Stage */}
        <div className="flex-1 overflow-y-auto py-4 space-y-5">
          <div
            className={`w-full h-80 rounded-2xl bg-gradient-to-br ${video.posterColor} border border-slate-800 flex flex-col items-center justify-center relative shadow-2xl overflow-hidden`}
          >
            {/* Visual play / pause toggle overlay */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-16 h-16 rounded-full bg-black/70 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:scale-105 transition-transform"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1 fill-white" />}
            </button>

            <div className="absolute bottom-3 inset-x-3 bg-black/60 backdrop-blur-md p-2.5 rounded-xl flex items-center justify-between text-xs font-mono text-white">
              <span>Timeline: 00:00 / 00:{video.durationSeconds.toString().padStart(2, "0")}</span>
              <span className="text-cyan-400 font-bold">{video.fps} FPS Hardware Acceleration</span>
            </div>
          </div>

          {/* Animation Code Block */}
          {video.animationCode && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5" />
                  Procedural Motion Algorithm / Implementation
                </span>
                <button
                  onClick={copyAnimation}
                  className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? "Copied" : "Copy Code"}</span>
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 max-h-48 overflow-y-auto leading-relaxed">
                <code>{video.animationCode}</code>
              </pre>
            </div>
          )}

          {/* Remotion Block if available */}
          {video.remotionSnippet && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="text-purple-400 font-bold flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5" />
                  Remotion Video Component
                </span>
                <button
                  onClick={copyRemotion}
                  className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
                >
                  {copiedRemotion ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedRemotion ? "Copied" : "Copy Remotion"}</span>
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 max-h-48 overflow-y-auto leading-relaxed">
                <code>{video.remotionSnippet}</code>
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-xs font-mono text-slate-500">License: {video.license}</span>
          <button
            onClick={copyAnimation}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs"
          >
            Copy Animation Source
          </button>
        </div>
      </div>
    </div>
  )
}
