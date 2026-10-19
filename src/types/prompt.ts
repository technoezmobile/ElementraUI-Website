export type PromptCategory =
  | "Landing Pages"
  | "SaaS Websites"
  | "Portfolios"
  | "E-Commerce"
  | "Dashboards"
  | "Mobile Interfaces"
  | "3D & WebGL"
  | "Shaders & Effects"
  | "Animation & Motion"
  | "Typography"
  | "Refinement & Audits"
  | "Replication & References"
  | "Component Generation"

export type TargetAITool = "Cursor" | "Claude Code" | "Windsurf" | "Codex" | "v0"

export interface PromptTemplate {
  id: string
  title: string
  category: PromptCategory
  tool: TargetAITool
  framework: string
  designObjective: string
  constraints: string[]
  exclusions: string[]
  relevantComponents: string[]
  tags: string[]
  promptText: string
  isCustom?: boolean
  version?: number
  updatedAt: string
}
