import React from "react"
import { CatalogueItem } from "../../types/catalogue"
import {
  FloatingSphere,
  AuroraShader,
  InteractiveCard,
  KineticHero,
  BlurRevealText,
  FloatingPillNav,
  StaggeredGallery,
  ShimmerButton,
  LensDemo,
  MagicCardDemo,
  MagneticButtonDemo,
  BentoGrid,
  ParticlesBackground,
  MarqueeShowcase
} from "../registry"
import { PreviewErrorBoundary } from "./PreviewErrorBoundary"

interface ReactComponentRendererProps {
  item: CatalogueItem
  themeMode?: "dark" | "light"
}

export const ReactComponentRenderer: React.FC<ReactComponentRendererProps> = ({ item }) => {
  const renderComponent = () => {
    switch (item.id) {
      case "magicui-lens":
      case "lens":
        return <LensDemo />
      case "magicui-magic-card":
      case "magic-card":
        return <MagicCardDemo />
      case "floating-sphere-3d":
        return <FloatingSphere />
      case "aurora-webgl-shader":
        return <AuroraShader />
      case "interactive-3d-card":
        return <InteractiveCard />
      case "kinetic-hero-section":
        return <KineticHero />
      case "blur-reveal-typography":
        return <BlurRevealText />
      case "floating-pill-nav":
        return <FloatingPillNav />
      case "staggered-interactive-gallery":
        return <StaggeredGallery />
      case "shimmer-light-button":
        return <ShimmerButton />
      case "magnetic-button":
      case "magnetic-attraction-button":
        return <MagneticButtonDemo />
      case "bento-grid":
      case "bento-showcase-grid":
        return <BentoGrid />
      case "particles-background":
      case "particles-constellation":
        return <ParticlesBackground />
      case "marquee-showcase":
      case "infinite-horizontal-marquee":
        return <MarqueeShowcase />
      default:
        return null
    }
  }

  const content = renderComponent()
  if (!content) return null

  return (
    <PreviewErrorBoundary componentId={item.id} fallbackTitle={item.name}>
      <div
        className="w-full flex items-center justify-center"
        data-testid="executable-react-canvas"
        data-preview-kind="executable-verified"
      >
        {content}
      </div>
    </PreviewErrorBoundary>
  )
}
