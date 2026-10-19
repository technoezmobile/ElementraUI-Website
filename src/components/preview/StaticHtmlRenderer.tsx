import React, { useState, useEffect, useMemo } from "react"
import { CatalogueItem } from "../../types/catalogue"
import { AlertTriangle, Info, Image as ImageIcon } from "lucide-react"
import { resolveAssetUrl } from "../../utils/assetUrl"

export function buildSandboxedHtml(
  htmlContent: string,
  themeMode: "dark" | "light" = "dark",
  item?: CatalogueItem
): string {
  const isDark = themeMode === "dark"
  const itemId = item?.id || "unknown"

  // Derive baseDir for relative assets
  let baseDir = resolveAssetUrl("/")
  if (item?.awesomeData?.htmlUrl) {
    baseDir = resolveAssetUrl(item.awesomeData.htmlUrl.substring(0, item.awesomeData.htmlUrl.lastIndexOf("/") + 1))
  }

  const polyfill = `<script>
    try {
      var noop = function() {};
      var dummyStorage = { getItem: function() { return null; }, setItem: noop, removeItem: noop, clear: noop };
      Object.defineProperty(window, 'localStorage', { value: dummyStorage, writable: false });
      Object.defineProperty(window, 'sessionStorage', { value: dummyStorage, writable: false });
    } catch(e) {}
  </script>`

  // 100% Local offline Tailwind Play runtime (no external CDN call)
  const tailwindScript = `<script src="${resolveAssetUrl("vendor/tailwind-play.js")}"></script>

  <script>
    try {
      tailwind.config = {
        darkMode: 'class',
        theme: {
          extend: {
            colors: {
              background: '${isDark ? "#090d16" : "#ffffff"}',
              foreground: '${isDark ? "#f1f5f9" : "#0f172a"}',
              border: '${isDark ? "#1e293b" : "#e2e8f0"}',
              muted: '${isDark ? "#1e293b" : "#f1f5f9"}',
              card: '${isDark ? "#0f172a" : "#ffffff"}',
            }
          }
        }
      };
    } catch(e) {}
  </script>`

  // Quality of life & empty detection script
  const observerScript = `<script>
    window.addEventListener('load', function() {
      try {
        var root = document.getElementById('root') || document.body;
        var hasContent = root && (
          root.innerText.trim().length > 0 ||
          root.querySelectorAll('img, svg, canvas, button, input, a, p, h1, h2, h3, h4, span, div > *').length > 0
        );
        if (!hasContent) {
          window.parent.postMessage({ type: '21ST_PREVIEW_STATUS', id: '${itemId}', empty: true }, '*');
        }
      } catch(e) {}
    });
    window.addEventListener('error', function(err) {
      try {
        window.parent.postMessage({ type: '21ST_PREVIEW_STATUS', id: '${itemId}', error: err.message }, '*');
      } catch(e) {}
    });
  </script>`

  // Respect component's original flow while preventing horizontal canvas blowouts
  const embeddedCss = `<style>
    *, ::before, ::after { box-sizing: border-box; }
    html {
      color-scheme: ${isDark ? "dark" : "light"};
    }
    body {
      margin: 0;
      padding: 0;
      background-color: ${isDark ? "#090d16" : "#ffffff"};
      color: ${isDark ? "#f1f5f9" : "#0f172a"};
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      min-height: 100vh;
    }
    #root {
      width: 100%;
      min-height: 100vh;
    }
    img, svg {
      max-width: 100%;
    }
  </style>`

  const headInject = `<base href="${baseDir}">${polyfill}${tailwindScript}${observerScript}${embeddedCss}`

  const trimmed = htmlContent.trim()
  const isFullDoc = trimmed.toLowerCase().startsWith("<!doctype") || trimmed.toLowerCase().startsWith("<html")

  if (isFullDoc) {
    if (trimmed.includes("<head>")) {
      return trimmed.replace("<head>", `<head>${headInject}`)
    } else if (trimmed.includes("</head>")) {
      return trimmed.replace("</head>", `${headInject}</head>`)
    } else {
      return `${headInject}${trimmed}`
    }
  }

  return `<!DOCTYPE html>
<html class="${isDark ? "dark" : ""}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  ${headInject}
</head>
<body class="${isDark ? "dark" : ""}">
  ${trimmed}
</body>
</html>`
}

interface StaticHtmlRendererProps {
  item: CatalogueItem
  themeMode?: "dark" | "light"
}

export const StaticHtmlRenderer: React.FC<StaticHtmlRendererProps> = ({
  item,
  themeMode = "dark"
}) => {
  const [htmlContent, setHtmlContent] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [showScreenshotOverride, setShowScreenshotOverride] = useState<boolean>(false)
  const [emptyDetected, setEmptyDetected] = useState<boolean>(false)
  const [screenshotFailed, setScreenshotFailed] = useState<boolean>(false)

  useEffect(() => {
    let isMounted = true
    setIsLoading(true)
    setLoadError(null)
    setShowScreenshotOverride(false)
    setEmptyDetected(false)
    setScreenshotFailed(false)
    setHtmlContent("")

    if (!item.awesomeData?.htmlUrl) {
      setIsLoading(false)
      setLoadError("No HTML snapshot path provided")
      return
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
      controller.abort()
      if (isMounted) {
        setLoadError("Snapshot fetch timed out (5s limit)")
        setIsLoading(false)
      }
    }, 5000)

    fetch(resolveAssetUrl(item.awesomeData.htmlUrl), { signal: controller.signal })
      .then((res) => {
        clearTimeout(timeoutId)
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
        return res.text()
      })
      .then((text) => {
        if (isMounted) {
          if (!text || text.trim().length === 0) {
            throw new Error("HTML snapshot is empty (0 bytes)")
          }
          setHtmlContent(text)
          setIsLoading(false)
        }
      })
      .catch((err) => {
        clearTimeout(timeoutId)
        if (isMounted) {
          setLoadError(err.message)
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
      controller.abort()
      clearTimeout(timeoutId)
    }
  }, [item.id, item.awesomeData?.htmlUrl])

  // Listen for iframe empty or error message
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === "21ST_PREVIEW_STATUS" && e.data.id === item.id) {
        if (e.data.empty) {
          setEmptyDetected(true)
          if (item.awesomeData?.screenshotUrl) {
            setShowScreenshotOverride(true)
          }
        }
      }
    }
    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [item.id, item.awesomeData?.screenshotUrl])

  const wrappedDoc = useMemo(() => {
    if (!htmlContent) return ""
    return buildSandboxedHtml(htmlContent, themeMode, item)
  }, [htmlContent, themeMode, item])

  if (isLoading) {
    return (
      <div
        className="flex flex-col items-center justify-center p-12 text-center space-y-3"
        data-testid="preview-loading"
      >
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-mono text-slate-400">Loading interactive snapshot...</span>
      </div>
    )
  }

  if (loadError || !htmlContent || showScreenshotOverride) {
    if (item.awesomeData?.screenshotUrl && !screenshotFailed) {
      return (
        <div
          className="w-full flex flex-col items-center space-y-3"
          data-testid="screenshot-fallback-container"
          data-preview-kind="screenshot-reference"
        >
          {loadError && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-950/60 border border-amber-800/40 text-amber-300 text-xs">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span>HTML snapshot unavailable ({loadError}). Displaying verified reference screenshot.</span>
            </div>
          )}
          {emptyDetected && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-950/60 border border-amber-800/40 text-amber-300 text-xs">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span>HTML snapshot contained no visible DOM elements. Displaying reference screenshot.</span>
            </div>
          )}
          <div className="w-full max-h-[600px] overflow-auto rounded-2xl bg-slate-950 border border-slate-800 p-3 flex items-center justify-center">
            <img
              src={item.awesomeData.screenshotUrl}
              alt={`${item.name} Reference Screenshot`}
              onError={() => setScreenshotFailed(true)}
              className="max-w-full max-h-[560px] object-contain rounded-xl shadow-2xl border border-slate-800"
            />
          </div>
          {htmlContent && !emptyDetected && (
            <button
              onClick={() => setShowScreenshotOverride(false)}
              className="text-xs font-mono text-cyan-400 hover:underline cursor-pointer"
            >
              ← Switch to Interactive HTML Snapshot
            </button>
          )}
        </div>
      )
    }
  }

  if (loadError || !htmlContent || showScreenshotOverride || emptyDetected) {
    return (
      <div
        className="w-full max-w-lg p-8 rounded-3xl bg-slate-950 border border-slate-800 text-center space-y-4"
        data-testid="html-preview-unavailable"
        data-preview-kind="source-unavailable"
      >
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-950/40 border border-amber-800/30">
            Preview Unavailable
          </span>
          <h3 className="text-base font-bold text-slate-100 mt-2">{item.name}</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
            Neither a valid HTML snapshot nor a rendered reference screenshot is available on disk for this upstream component.
          </p>
        </div>
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-left font-mono text-[11px] text-slate-400">
          <span className="text-slate-500 block uppercase text-[9px] mb-0.5">Diagnostic Details</span>
          <span>
            {loadError ||
              (screenshotFailed
                ? "HTML snapshot is 0-byte and screenshot file is corrupt/0-byte"
                : "No visual artifacts found")}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div
      className="w-full flex flex-col items-center space-y-2"
      data-testid="interactive-html-container"
      data-preview-kind="html-snapshot"
    >
      <div className="w-full flex items-center justify-between px-1 text-[11px] font-mono text-slate-400">
        <span className="flex items-center gap-1.5 text-cyan-400">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          Interactive HTML Snapshot
        </span>
        {item.awesomeData?.screenshotUrl && (
          <button
            onClick={() => setShowScreenshotOverride(true)}
            className="text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>View Reference Screenshot</span>
          </button>
        )}
      </div>
      <iframe
        title={`${item.name} Interactive HTML Snapshot`}
        sandbox="allow-scripts"
        srcDoc={wrappedDoc}
        className="w-full min-h-[480px] max-h-[680px] rounded-2xl border border-slate-800 shadow-xl bg-transparent"
      />
    </div>
  )
}
