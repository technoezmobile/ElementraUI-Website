export interface DesignBrief {
  title: string
  companyName: string
  industry: string
  tagline: string
  targetAudience: string
  visualAesthetic: "Obsidian Slate" | "Cyberpunk Neon" | "Apple Spatial Glass" | "Minimalist Zinc"
  primaryAccent: string
  typography: string
}

export interface WebsiteSection {
  id: string
  name: string
  sectionType: "navbar" | "hero" | "features" | "interactive-demo" | "bento" | "ticker" | "pricing" | "footer"
  componentId: string
  enabled: boolean
  headline: string
  subheadline: string
  badgeText?: string
}

export interface GeneratedWebsiteProject {
  id: string
  name: string
  brief: DesignBrief
  sections: WebsiteSection[]
  generatedAt: string
}
