import React, { Component, ErrorInfo, ReactNode } from "react"
import { AlertTriangle, RotateCcw } from "lucide-react"

interface Props {
  children: ReactNode
  componentId?: string
  fallbackTitle?: string
  onReset?: () => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class PreviewErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[PreviewErrorBoundary] Caught component error:", error, errorInfo)
    this.setState({ errorInfo })
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    if (this.props.onReset) {
      this.props.onReset()
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div
          className="w-full max-w-lg p-6 rounded-2xl bg-slate-950/90 border border-rose-900/50 text-slate-100 flex flex-col items-center text-center space-y-4 shadow-2xl"
          data-testid="preview-error-boundary"
          data-preview-kind="preview-error"
        >
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 font-bold px-2 py-0.5 rounded bg-rose-950/40 border border-rose-800/30">
              Preview Isolated Exception
            </span>
            <h3 className="text-base font-bold text-white pt-1">
              {this.props.fallbackTitle || "Component Rendering Failed"}
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              A runtime exception was caught safely inside the preview sandbox. The host application remains fully stable.
            </p>
          </div>

          <div className="w-full p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-left font-mono text-[11px] text-rose-300 max-h-32 overflow-auto">
            <span className="text-[10px] text-slate-500 block uppercase mb-1">
              Component: {this.props.componentId || "unknown"}
            </span>
            <code>{this.state.error?.message || "Unknown runtime exception"}</code>
          </div>

          <button
            onClick={this.handleReset}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-medium text-xs flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Preview Canvas</span>
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
