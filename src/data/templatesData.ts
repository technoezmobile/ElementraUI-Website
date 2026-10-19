import { TemplateItem } from "../types/marketplace"

export const verifiedTemplatesData: TemplateItem[] = [
  {
    id: "template-devtool-saas-starter",
    name: "DevTool Platform SaaS Starter",
    slug: "devtool-saas",
    description: "Production-ready developer tools SaaS website with hero glow, feature matrices, interactive pricing slider, auth modals, and docs.",
    category: "SaaS",
    framework: "Next.js 15",
    author: { name: "Elementra Architecture Lab", url: "https://github.com/elementraui" },
    license: "MIT",
    pageCount: 5,
    pages: [
      { name: "Landing Hero & Features", path: "/", description: "High-conversion product landing page with animated metrics." },
      { name: "Pricing & Billing Plans", path: "/pricing", description: "Interactive monthly/annual billing switch with feature comparison." },
      { name: "Documentation Hub", path: "/docs", description: "Multi-level sidebar with search and code syntax blocks." },
      { name: "Changelog & Releases", path: "/changelog", description: "Chronological release feed with git commit badges." },
      { name: "Sign In / Sign Up Modal", path: "/auth", description: "OAuth buttons and email magic link verification." }
    ],
    dependencies: ["next@15", "react@19", "framer-motion", "lucide-react", "tailwind-merge", "clsx"],
    setupInstructions: [
      "npx create-next-app@latest my-devtool-saas --typescript --tailwind --app",
      "npm install framer-motion lucide-react clsx tailwind-merge",
      "Copy template /app and /components directories into your project",
      "Configure NEXT_PUBLIC_APP_URL in your .env.local file",
      "Run npm run dev and inspect at http://localhost:3000"
    ],
    scaffoldFiles: [
      {
        path: "app/page.tsx",
        content: `export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl text-center space-y-6">
        <span className="px-3 py-1 rounded-full text-xs font-mono bg-cyan-950 text-cyan-400 border border-cyan-800">Next.js 15 Starter</span>
        <h1 className="text-5xl font-extrabold tracking-tight">The Modern Developer Platform</h1>
        <p className="text-slate-400 text-lg">Build, test, and ship component-driven interfaces at scale with zero configuration.</p>
        <div className="flex justify-center gap-4 pt-4">
          <button className="px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400">Get Started Free</button>
          <button className="px-6 py-3 rounded-xl border border-slate-800 hover:bg-slate-900">Explore Documentation</button>
        </div>
      </div>
    </main>
  );
}`
      }
    ],
    provenance: {
      origin: "Elementra Official Template Archive",
      repository: "https://github.com/elementraui/templates"
    },
    tags: ["Next.js", "SaaS", "DevTool", "Landing", "Pricing", "Docs"],
    previewType: "full-page"
  },
  {
    id: "template-bento-engineer-portfolio",
    name: "Minimalist Bento Engineer Portfolio",
    slug: "bento-portfolio",
    description: "Personal engineering portfolio built with responsive asymmetric Bento cards, live GitHub streak indicator, and project showcases.",
    category: "Portfolio",
    framework: "React 19 + Vite",
    author: { name: "Studio Minimal", url: "https://github.com/elementraui" },
    license: "MIT",
    pageCount: 3,
    pages: [
      { name: "Bento Grid Bio", path: "/", description: "Asymmetric 4-column overview with bio, timezone widget, and tools." },
      { name: "Selected Works", path: "/projects", description: "Deep-dive case studies with live deployment links and source code." },
      { name: "Writing & Thoughts", path: "/writing", description: "Clean typography essays with reading time estimates." }
    ],
    dependencies: ["react@19", "framer-motion", "lucide-react", "tailwindcss"],
    setupInstructions: [
      "npm create vite@latest my-bento-portfolio -- --template react-ts",
      "npm install framer-motion lucide-react",
      "Run npm run dev to start the local preview"
    ],
    scaffoldFiles: [
      {
        path: "src/App.tsx",
        content: `export function App() {
  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-200 p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8">Developer Portfolio & Bento Grid</h1>
    </div>
  );
}`
      }
    ],
    provenance: { origin: "Minimal Portfolio Kit" },
    tags: ["Portfolio", "Bento Grid", "Vite", "Minimal", "Resume"],
    previewType: "full-page"
  },
  {
    id: "template-cloud-analytics-dashboard",
    name: "Cloud Fleet & Analytics Dashboard",
    slug: "analytics-dashboard",
    description: "High-density infrastructure monitoring dashboard with metric counters, latency sparklines, server node health, and audit logs.",
    category: "Dashboard",
    framework: "Next.js 15",
    author: { name: "CloudFleet UI", url: "https://github.com/elementraui" },
    license: "MIT",
    pageCount: 6,
    pages: [
      { name: "Fleet Overview", path: "/dashboard", description: "Real-time cluster CPU, memory, and ingress telemetry." },
      { name: "Nodes & Deployments", path: "/nodes", description: "Status table of Kubernetes pods and edge workers." },
      { name: "Latency & APM Metrics", path: "/telemetry", description: "P95, P99 request latency histograms and error rates." },
      { name: "Security Audit Logs", path: "/security", description: "IAM authentication events and anomalous traffic alerts." },
      { name: "API Token Manager", path: "/settings/tokens", description: "Revocable scoped API keys with rate-limiting quotas." },
      { name: "Team Permissions", path: "/settings/team", description: "Role-based access controls (RBAC) member matrix." }
    ],
    dependencies: ["next@15", "react@19", "lucide-react", "tailwindcss"],
    setupInstructions: [
      "git clone https://github.com/elementraui/cloud-dashboard-starter.git",
      "npm install",
      "npm run dev"
    ],
    scaffoldFiles: [],
    provenance: { origin: "CloudFleet Open Architecture" },
    tags: ["Dashboard", "Analytics", "Telemetry", "Admin", "Monitoring"],
    previewType: "full-page"
  },
  {
    id: "template-agency-creative-studio",
    name: "Aura Creative Agency Showcase",
    slug: "agency-studio",
    description: "Award-winning editorial agency website featuring horizontal kinetic scroll, fullscreen media galleries, and contact drawer.",
    category: "Agency",
    framework: "React 19 + Vite",
    author: { name: "Aura Studio", url: "https://github.com/elementraui" },
    license: "MIT",
    pageCount: 4,
    pages: [
      { name: "Studio Manifesto", path: "/", description: "Full-bleed typography with staggered reveal animations." },
      { name: "Case Studies Archive", path: "/work", description: "Filterable client portfolio across branding and web applications." },
      { name: "Agency Capabilities", path: "/services", description: "Disciplines, engineering stack, and sprint pricing." },
      { name: "Project Inquiry", path: "/contact", description: "Multi-step discovery questionnaire and booking calendar." }
    ],
    dependencies: ["react@19", "framer-motion", "lucide-react"],
    setupInstructions: ["npm create vite@latest aura-agency", "npm install", "npm run dev"],
    scaffoldFiles: [],
    provenance: { origin: "Aura Design Network" },
    tags: ["Agency", "Editorial", "Creative", "Showcase", "Kinetic"],
    previewType: "full-page"
  },
  {
    id: "template-ai-agent-canvas",
    name: "Cognitive AI Agent Workflow Canvas",
    slug: "ai-agent-canvas",
    description: "Full-featured interface for building and running autonomous AI workflows with prompt graph nodes, tool logs, and chat sidebar.",
    category: "AI Application",
    framework: "Next.js 15",
    author: { name: "Agentic AI Labs", url: "https://github.com/elementraui" },
    license: "MIT",
    pageCount: 4,
    pages: [
      { name: "Workflow Node Canvas", path: "/canvas", description: "Interactive node editor linking agents, models, and tools." },
      { name: "Live Execution Inspector", path: "/execution", description: "Real-time streaming agent thought loops and tool call logs." },
      { name: "Model Key Manager", path: "/settings/models", description: "Bring-your-own API key interface with token usage stats." },
      { name: "Workflow Templates", path: "/templates", description: "Pre-built chains for code review, web scraping, and summaries." }
    ],
    dependencies: ["next@15", "react@19", "framer-motion", "lucide-react"],
    setupInstructions: ["npx create-next-app@latest ai-canvas", "npm install", "npm run dev"],
    scaffoldFiles: [],
    provenance: { origin: "Open Agent Framework" },
    tags: ["AI", "Agent", "Workflow", "Canvas", "LLM", "Prompt"],
    previewType: "full-page"
  },
  {
    id: "template-developer-docs-hub",
    name: "Architectural Technical Docs Hub",
    slug: "technical-docs",
    description: "Nextra-inspired high-speed documentation template with keyboard search, collapsible sidebar, and interactive code copy blocks.",
    category: "Docs",
    framework: "Next.js 15",
    author: { name: "DocsEngine", url: "https://github.com/elementraui" },
    license: "MIT",
    pageCount: 8,
    pages: [
      { name: "Quickstart Guide", path: "/docs/quickstart", description: "5-minute installation and environment bootstrap." },
      { name: "Core Architecture", path: "/docs/architecture", description: "Data flow diagrams and lifecycle state machines." },
      { name: "API Reference", path: "/docs/api", description: "Auto-generated endpoint contracts with curl and TS examples." },
      { name: "SDK Documentation", path: "/docs/sdk", description: "Client libraries for Node, Python, and Go." }
    ],
    dependencies: ["next@15", "react@19", "lucide-react"],
    setupInstructions: ["npx create-next-app@latest my-docs", "npm install", "npm run dev"],
    scaffoldFiles: [],
    provenance: { origin: "DocsEngine Open System" },
    tags: ["Documentation", "Docs", "Markdown", "Nextra", "Knowledge Base"],
    previewType: "full-page"
  }
]
