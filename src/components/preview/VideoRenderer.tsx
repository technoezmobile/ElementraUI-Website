import React, { useState } from "react"
import { CatalogueItem } from "../../types/catalogue"
import { AlertTriangle, Play } from "lucide-react"

interface VideoRendererProps {
  item: CatalogueItem
  videoUrl?: string
}

export const VideoRenderer: React.FC<VideoRendererProps> = ({ item, videoUrl }) => {
  const [hasError, setHasError] = useState(false)
  const url = videoUrl || (item as any).videoUrl

  if (!url || hasError) {
    return (
      <div
        className="w-full max-w-lg p-8 rounded-3xl bg-slate-950 border border-slate-800 text-center space-y-4"
        data-testid="video-unavailable"
        data-preview-kind="source-unavailable"
      >
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-950/40 border border-amber-800/30">
            Video Unavailable
          </span>
          <h3 className="text-base font-bold text-slate-100 mt-2">{item.name}</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
            Video stream or file is not accessible for this item.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="w-full flex flex-col items-center space-y-3"
      data-testid="video-renderer"
      data-preview-kind="video-preview"
    >
      <div className="w-full max-w-2xl flex items-center justify-between px-2 text-xs font-mono text-slate-400">
        <span className="flex items-center gap-1.5 text-cyan-400">
          <Play className="w-3.5 h-3.5 fill-cyan-400" />
          <span>Interactive Motion Video</span>
        </span>
        <span>Autoplay / Looped</span>
      </div>

      <div className="w-full max-h-[600px] overflow-hidden rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center p-2 shadow-2xl">
        <video
          src={url}
          autoPlay
          loop
          muted
          playsInline
          controls
          onError={() => setHasError(true)}
          className="max-w-full max-h-[560px] rounded-xl object-contain"
        />
      </div>
    </div>
  )
}
