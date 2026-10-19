import React, { useState, useEffect, useMemo, useRef } from "react"
import { CatalogueItem } from "../../types/catalogue"
import { transform } from "sucrase"
import { AlertCircle, Terminal, PackageCheck, RotateCcw, AlertTriangle } from "lucide-react"

interface IsolatedReactRendererProps {
  item: CatalogueItem
  themeMode?: "dark" | "light"
}

interface CompilationState {
  isCompiled: boolean
  compiledCode: string | null
  error: string | null
  unresolvedDeps: string[]
}

const AVAILABLE_PACKAGES = new Set([
  "react",
  "react/jsx-runtime",
  "react-dom",
  "react-dom/client",
  "framer-motion",
  "lucide-react",
  "three",
  "clsx",
  "tailwind-merge",
  "tailwindcss"
])

export const IsolatedReactRenderer: React.FC<IsolatedReactRendererProps> = ({
  item,
  themeMode = "dark"
}) => {
  const [stageKey, setStageKey] = useState(0)
  const [runtimeError, setRuntimeError] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState<boolean>(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // 1. Compile TSX/JSX Source in Browser
  const compilation: CompilationState = useMemo(() => {
    const rawCode = item.componentCode || ""
    if (!rawCode.trim()) {
      return {
        isCompiled: false,
        compiledCode: null,
        error: "Component source code is empty (0 bytes).",
        unresolvedDeps: []
      }
    }

    // Inspect imports for unresolved external dependencies
    const unresolved: string[] = []
    const importRegex = /from\s+['"]([^'"]+)['"]/g
    let match: RegExpExecArray | null
    while ((match = importRegex.exec(rawCode)) !== null) {
      const pkg = match[1]
      if (
        !pkg.startsWith(".") &&
        !pkg.startsWith("/") &&
        !AVAILABLE_PACKAGES.has(pkg) &&
        !pkg.startsWith("lucide-react") &&
        !pkg.startsWith("three")
      ) {
        if (!unresolved.includes(pkg)) {
          unresolved.push(pkg)
        }
      }
    }

    if (unresolved.length > 0) {
      return {
        isCompiled: false,
        compiledCode: null,
        error: `Unresolved external dependencies: ${unresolved.join(", ")}`,
        unresolvedDeps: unresolved
      }
    }

    try {
      const result = transform(rawCode, {
        transforms: ["typescript", "jsx", "imports"],
        jsxRuntime: "classic"
      })

      return {
        isCompiled: true,
        compiledCode: result.code,
        error: null,
        unresolvedDeps: []
      }
    } catch (compileErr: any) {
      return {
        isCompiled: false,
        compiledCode: null,
        error: compileErr.message || String(compileErr),
        unresolvedDeps: []
      }
    }
  }, [item.componentCode, item.id])

  // 2. Listen to iframe communication
  useEffect(() => {
    setIsMounted(false)
    setRuntimeError(null)

    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === "21ST_REACT_PREVIEW_STATUS" && e.data.id === item.id) {
        if (e.data.status === "mounted") {
          setIsMounted(true)
          setRuntimeError(null)
        } else if (e.data.status === "error") {
          setRuntimeError(e.data.error || "Runtime exception in isolated preview")
        }
      }
    }

    window.addEventListener("message", handleMessage)
    return () => {
      window.removeEventListener("message", handleMessage)
    }
  }, [item.id, stageKey])

  // 3. Build Sandboxed Isolated Execution Document
  const sandboxDoc = useMemo(() => {
    if (!compilation.isCompiled || !compilation.compiledCode) return ""

    const isDark = themeMode === "dark"
    const itemId = item.id

    // Escape compiled code safely for embedding in script
    const serializedCode = JSON.stringify(compilation.compiledCode)

    return `<!DOCTYPE html>
<html class="${isDark ? "dark" : ""}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script>
    // Storage isolation polyfill
    try {
      var noop = function() {};
      var dummyStorage = { getItem: function() { return null; }, setItem: noop, removeItem: noop, clear: noop };
      Object.defineProperty(window, 'localStorage', { value: dummyStorage, writable: false });
      Object.defineProperty(window, 'sessionStorage', { value: dummyStorage, writable: false });
    } catch(e) {}
  </script>
  <script src="/vendor/tailwind-play.js"></script>
  <script src="/vendor/isolated-react-runtime.js"></script>
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
  </script>
  <style>
    *, ::before, ::after { box-sizing: border-box; }
    html {
      color-scheme: ${isDark ? "dark" : "light"};
      background-color: transparent;
    }
    body {
      margin: 0;
      padding: 1.5rem;
      background-color: transparent;
      color: ${isDark ? "#f1f5f9" : "#0f172a"};
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow-x: hidden;
    }
    #preview-root {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  </style>
</head>
<body>
  <div id="preview-root"></div>

  <script>
    window.addEventListener('error', function(err) {
      try {
        window.parent.postMessage({
          type: '21ST_REACT_PREVIEW_STATUS',
          id: '${itemId}',
          status: 'error',
          error: err.message
        }, '*');
      } catch(e) {}
    });

    try {
      if (!window.__21ST_MODULES__) {
        throw new Error("Isolated React runtime failed to load.");
      }

      // Safe module resolver
      function require(modName) {
        if (window.__21ST_MODULES__[modName]) {
          return window.__21ST_MODULES__[modName];
        }
        if (modName.startsWith('lucide-react')) {
          return window.__21ST_MODULES__['lucide-react'];
        }
        if (modName.startsWith('three')) {
          return window.__21ST_MODULES__['three'];
        }
        throw new Error("UNRESOLVED_DEPENDENCY: " + modName);
      }

      var code = ${serializedCode};
      var exports = {};
      var fn = new Function('exports', 'require', 'React', 'useState', 'useEffect', 'useRef', 'useMemo', 'useCallback', code);
      fn(exports, require, window.React, window.React.useState, window.React.useEffect, window.React.useRef, window.React.useMemo, window.React.useCallback);

      var Component = exports.default || exports[Object.keys(exports)[0]];
      if (!Component) {
        throw new Error("Source code did not export a default or named React component.");
      }

      // In-iframe React Error Boundary
      class SandboxErrorBoundary extends window.React.Component {
        constructor(props) {
          super(props);
          this.state = { error: null };
        }
        static getDerivedStateFromError(error) {
          return { error: error };
        }
        componentDidCatch(error) {
          window.parent.postMessage({
            type: '21ST_REACT_PREVIEW_STATUS',
            id: '${itemId}',
            status: 'error',
            error: error.message
          }, '*');
        }
        render() {
          if (this.state.error) {
            return window.React.createElement('div', {
              style: {
                padding: '1rem',
                borderRadius: '0.75rem',
                border: '1px solid rgba(244, 63, 94, 0.4)',
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                color: '#f43f5e',
                fontFamily: 'monospace',
                fontSize: '12px'
              }
            }, 'Runtime Error: ' + this.state.error.message);
          }
          return this.props.children;
        }
      }

      var rootNode = document.getElementById('preview-root');
      var root = window.ReactDOM.createRoot(rootNode);
      root.render(window.React.createElement(SandboxErrorBoundary, null, window.React.createElement(Component)));

      // Notify parent of successful mount
      setTimeout(function() {
        var rect = rootNode.getBoundingClientRect();
        window.parent.postMessage({
          type: '21ST_REACT_PREVIEW_STATUS',
          id: '${itemId}',
          status: 'mounted',
          dimensions: { width: Math.round(rect.width), height: Math.round(rect.height) }
        }, '*');
      }, 100);

    } catch (runtimeErr) {
      window.parent.postMessage({
        type: '21ST_REACT_PREVIEW_STATUS',
        id: '${itemId}',
        status: 'error',
        error: runtimeErr.message
      }, '*');
      var root = document.getElementById('preview-root');
      if (root) {
        root.innerHTML = '<div style="color: #f43f5e; font-family: monospace; font-size: 12px; padding: 1rem;">Runtime Error: ' + runtimeErr.message + '</div>';
      }
    }
  </script>
</body>
</html>`
  }, [compilation, themeMode, item.id])

  // Handle Unresolved Dependencies View
  if (compilation.unresolvedDeps.length > 0) {
    return (
      <div
        className="w-full max-w-xl p-6 rounded-2xl bg-slate-950 border border-amber-800/40 text-slate-100 flex flex-col items-center text-center space-y-4"
        data-testid="react-unresolved-dependencies"
        data-preview-kind="source-unavailable"
      >
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <PackageCheck className="w-6 h-6" />
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-950/40 border border-amber-800/30">
            Unresolved Dependencies
          </span>
          <h3 className="text-base font-bold text-white mt-1.5">{item.name}</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
            This component requires external npm packages not present in the isolated client sandbox:
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 justify-center max-w-md">
          {compilation.unresolvedDeps.map((dep) => (
            <span
              key={dep}
              className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 font-mono text-xs text-amber-300"
            >
              {dep}
            </span>
          ))}
        </div>

        {item.installCommand && (
          <div className="w-full p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-left font-mono text-xs text-slate-300 space-y-1">
            <span className="text-[10px] text-slate-500 block uppercase">To install and use in project:</span>
            <code className="text-cyan-300 select-all block">{item.installCommand}</code>
          </div>
        )}
      </div>
    )
  }

  // Handle Compilation Error View
  if (compilation.error) {
    return (
      <div
        className="w-full max-w-xl p-6 rounded-2xl bg-slate-950 border border-rose-900/50 text-slate-100 flex flex-col items-center text-center space-y-4"
        data-testid="react-compilation-error"
        data-preview-kind="preview-error"
      >
        <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 font-bold px-2 py-0.5 rounded bg-rose-950/40 border border-rose-800/30">
            TSX Compilation Error
          </span>
          <h3 className="text-base font-bold text-white mt-1.5">{item.name}</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
            The component source code contains syntax or JSX parsing errors that prevented compilation.
          </p>
        </div>

        <div className="w-full p-3.5 rounded-xl bg-slate-900 border border-rose-950 text-left font-mono text-[11px] text-rose-300 max-h-40 overflow-auto">
          <code>{compilation.error}</code>
        </div>
      </div>
    )
  }

  // Handle In-Iframe Runtime Error View
  if (runtimeError) {
    return (
      <div
        className="w-full max-w-xl p-6 rounded-2xl bg-slate-950 border border-rose-900/50 text-slate-100 flex flex-col items-center text-center space-y-4"
        data-testid="react-runtime-error"
        data-preview-kind="preview-error"
      >
        <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 font-bold px-2 py-0.5 rounded bg-rose-950/40 border border-rose-800/30">
            Runtime Exception
          </span>
          <h3 className="text-base font-bold text-white mt-1.5">{item.name}</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
            An unhandled runtime error occurred when mounting the component inside the isolated sandbox.
          </p>
        </div>

        <div className="w-full p-3.5 rounded-xl bg-slate-900 border border-rose-950 text-left font-mono text-[11px] text-rose-300 max-h-32 overflow-auto">
          <code>{runtimeError}</code>
        </div>

        <button
          onClick={() => setStageKey((k) => k + 1)}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Retry Execution</span>
        </button>
      </div>
    )
  }

  // Render Sandboxed Live React Component
  return (
    <div
      className="w-full flex flex-col items-center space-y-2"
      data-testid="isolated-react-container"
      data-preview-kind="executable-verified"
    >
      <div className="w-full flex items-center justify-between px-1 text-[11px] font-mono text-slate-400">
        <span className="flex items-center gap-1.5 text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Isolated Live React Component (TSX Compiled)
        </span>
        <span className="text-slate-500 text-[10px]">
          React 19 & Sandboxed Runner
        </span>
      </div>

      <iframe
        key={stageKey}
        ref={iframeRef}
        title={`${item.name} Isolated React Component`}
        sandbox="allow-scripts"
        srcDoc={sandboxDoc}
        className="w-full min-h-[480px] max-h-[680px] rounded-2xl border border-slate-800 shadow-xl bg-transparent"
      />
    </div>
  )
}
