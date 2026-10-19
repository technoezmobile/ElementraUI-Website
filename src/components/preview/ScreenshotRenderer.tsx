import React, { useState } from "react"
import { CatalogueItem } from "../../types/catalogue"
import { AlertTriangle, ImageIcon, ZoomIn, ZoomOut } from "lucide-react"
import { resolveAssetUrl } from "../../utils/assetUrl"

interface ScreenshotRendererProps {
  item: CatalogueItem
  overrideUrl?: string
  altText?: string
  notice?: string
}

export const ScreenshotRenderer: React.FC<ScreenshotRendererProps> = ({
  item,
  overrideUrl,
  altText,
  notice
}) => {
  const [hasError, setHasError] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(100)
  const rawImageUrl = overrideUrl || item.awesomeData?.screenshotUrl
  const imageUrl = rawImageUrl ? resolveAssetUrl(rawImageUrl) : null


  if (!imageUrl || hasError) {
    return (
      <div
        className="w-full max-w-lg p-8 rounded-3xl bg-slate-950 border border-slate-800 text-center space-y-4"
        data-testid="screenshot-unavailable"
        data-preview-kind="source-unavailable"
      >
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-950/40 border border-amber-800/30">
            Screenshot Unavailable
          </span>
          <h3 className="text-base font-bold text-slate-100 mt-2">{item.name}</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
            Reference screenshot could not be loaded from disk or local endpoint.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="w-full flex flex-col items-center space-y-3"
      data-testid="screenshot-renderer"
      data-preview-kind="screenshot-reference"
    >
      {notice && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-950/60 border border-amber-800/40 text-amber-300 text-xs">
          <ImageIcon className="w-3.5 h-3.5 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Toolbar for zoom */}
      <div className="flex items-center justify-between w-full max-w-2xl px-2 text-xs font-mono text-slate-400">
        <span className="text-cyan-400">Verified Reference Screenshot</span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setZoomLevel((z) => Math.max(50, z - 25))}
            className="p-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] w-12 text-center">{zoomLevel}%</span>
          <button
            onClick={() => setZoomLevel((z) => Math.min(200, z + 25))}
            className="p-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="w-full max-h-[600px] overflow-auto rounded-2xl bg-slate-950 border border-slate-800 p-3 flex items-center justify-center">
        <img
          src={imageUrl}
          alt={altText || `${item.name} Reference Screenshot`}
          onError={() => setHasError(true)}
          style={{ width: zoomLevel !== 100 ? `${zoomLevel}%` : undefined }}
          className="max-w-full max-h-[560px] object-contain rounded-xl shadow-2xl border border-slate-800"
        />
      </div>
    </div>
  )
}
