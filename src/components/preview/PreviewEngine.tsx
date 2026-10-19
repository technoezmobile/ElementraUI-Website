import React from "react"
import { CatalogueItem } from "../../types/catalogue"
import { PreviewErrorBoundary } from "./PreviewErrorBoundary"
import { ReactComponentRenderer } from "./ReactComponentRenderer"
import { IsolatedReactRenderer } from "./IsolatedReactRenderer"
import { ThemeRenderer } from "./ThemeRenderer"
import { TemplateRenderer } from "./TemplateRenderer"
import { StaticHtmlRenderer } from "./StaticHtmlRenderer"
import { ScreenshotRenderer } from "./ScreenshotRenderer"
import { BlueprintRenderer } from "./BlueprintRenderer"
import { VideoRenderer } from "./VideoRenderer"

export interface PreviewEngineProps {
  item: CatalogueItem
  themeMode?: "dark" | "light"
  onSendToPromptStudio?: (prompt: string, title?: string) => void
  onSendToBuilder?: (prompt: string) => void
}

const VERIFIED_REACT_IDS = new Set([
  "magicui-lens",
  "lens",
  "magicui-magic-card",
  "magic-card",
  "floating-sphere-3d",
  "aurora-webgl-shader",
  "interactive-3d-card",
  "kinetic-hero-section",
  "blur-reveal-typography",
  "floating-pill-nav",
  "staggered-interactive-gallery",
  "shimmer-light-button",
  "magnetic-button",
  "magnetic-attraction-button",
  "bento-grid",
  "bento-showcase-grid",
  "particles-background",
  "particles-constellation",
  "marquee-showcase",
  "infinite-horizontal-marquee"
])

export const PreviewEngine: React.FC<PreviewEngineProps> = ({
  item,
  themeMode = "dark",
  onSendToPromptStudio,
  onSendToBuilder
}) => {
  // 1. Priority 1: Isolated Live React Component (TSX Compilation in Sandboxed Runner)
  if (item.componentCode && item.componentCode.trim().length > 0) {
    return (
      <PreviewErrorBoundary componentId={item.id} fallbackTitle={item.name}>
        <IsolatedReactRenderer item={item} themeMode={themeMode} />
      </PreviewErrorBoundary>
    )
  }

  // Fallback for built-in verified demos if componentCode was omitted
  if (VERIFIED_REACT_IDS.has(item.id)) {
    return (
      <PreviewErrorBoundary componentId={item.id} fallbackTitle={item.name}>
        <ReactComponentRenderer item={item} themeMode={themeMode} />
      </PreviewErrorBoundary>
    )
  }

  // 2. Priority 2: Theme Presets
  if (item.itemType === "theme") {
    return (
      <PreviewErrorBoundary componentId={item.id} fallbackTitle={item.name}>
        <ThemeRenderer item={item} themeMode={themeMode} />
      </PreviewErrorBoundary>
    )
  }

  // 3. Priority 3: Awesome Components Live Rendered HTML Snapshot with Resilient Screenshot Fallback
  if (item.sourceRepo === "awesome-components" && item.awesomeData) {
    return (
      <PreviewErrorBoundary componentId={item.id} fallbackTitle={item.name}>
        <StaticHtmlRenderer item={item} themeMode={themeMode} />
      </PreviewErrorBoundary>
    )
  }

  // 4. Priority 4: Full Multi-Page Template Scaffolding Wireframes (Core Templates)
  if (item.itemType === "template") {
    return (
      <PreviewErrorBoundary componentId={item.id} fallbackTitle={item.name}>
        <TemplateRenderer item={item} />
      </PreviewErrorBoundary>
    )
  }

  // 5. Priority 5: AI Prompt Blueprint Playground
  if (item.itemType === "prompt" && item.promptData) {
    return (
      <PreviewErrorBoundary componentId={item.id} fallbackTitle={item.name}>
        <BlueprintRenderer
          item={item}
          themeMode={themeMode}
          onSendToPromptStudio={onSendToPromptStudio}
          onSendToBuilder={onSendToBuilder}
        />
      </PreviewErrorBoundary>
    )
  }

  // 6. Priority 6: Curated Design Study Reference Showcase
  if (item.itemType === "design-reference" && item.referenceData) {
    return (
      <PreviewErrorBoundary componentId={item.id} fallbackTitle={item.name}>
        <BlueprintRenderer item={item} themeMode={themeMode} />
      </PreviewErrorBoundary>
    )
  }

  // 7. Priority 7: Pure Reference Screenshot (when item specifically requests screenshot)
  if (item.previewType === "reference-card" && item.awesomeData?.screenshotUrl) {
    return (
      <PreviewErrorBoundary componentId={item.id} fallbackTitle={item.name}>
        <ScreenshotRenderer item={item} />
      </PreviewErrorBoundary>
    )
  }

  // 8. Priority 8: Video Preview
  if ((item as any).videoUrl) {
    return (
      <PreviewErrorBoundary componentId={item.id} fallbackTitle={item.name}>
        <VideoRenderer item={item} />
      </PreviewErrorBoundary>
    )
  }

  // 9. Priority 9: Actionable Component Blueprint & Registry Spec for Ingested Items
  return (
    <PreviewErrorBoundary componentId={item.id} fallbackTitle={item.name}>
      <BlueprintRenderer
        item={item}
        themeMode={themeMode}
        onSendToPromptStudio={onSendToPromptStudio}
        onSendToBuilder={onSendToBuilder}
      />
    </PreviewErrorBoundary>
  )
}
