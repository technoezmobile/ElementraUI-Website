import { ThemeItem } from "../types/marketplace"

export const verifiedThemesData: ThemeItem[] = [
  {
    id: "theme-zinc-modernist",
    name: "Zinc Modernist Neutral",
    slug: "zinc-modernist",
    description: "Architectural neutral design system with precise slate borders, low-glare dark surfaces, and high-legibility typographic hierarchy.",
    author: { name: "Elementra Design Studio", url: "https://github.com/elementraui" },
    license: "MIT",
    colorFamily: "neutral",
    appearance: "dual",
    designStyle: "Minimal",
    framework: "shadcn/ui",
    tokens: {
      dark: {
        background: "#09090b",
        foreground: "#fafafa",
        card: "#121215",
        cardForeground: "#fafafa",
        primary: "#fafafa",
        primaryForeground: "#18181b",
        secondary: "#27272a",
        secondaryForeground: "#fafafa",
        muted: "#27272a",
        mutedForeground: "#a1a1aa",
        accent: "#27272a",
        accentForeground: "#fafafa",
        destructive: "#7f1d1d",
        destructiveForeground: "#fef2f2",
        border: "#27272a",
        input: "#27272a",
        ring: "#d4d4d8"
      },
      light: {
        background: "#ffffff",
        foreground: "#09090b",
        card: "#ffffff",
        cardForeground: "#09090b",
        primary: "#18181b",
        primaryForeground: "#fafafa",
        secondary: "#f4f4f5",
        secondaryForeground: "#18181b",
        muted: "#f4f4f5",
        mutedForeground: "#71717a",
        accent: "#f4f4f5",
        accentForeground: "#18181b",
        destructive: "#ef4444",
        destructiveForeground: "#fafafa",
        border: "#e4e4e7",
        input: "#e4e4e7",
        ring: "#18181b"
      },
      radius: "0.5rem",
      fontSans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontMono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
    },
    cssVariables: `:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --card: 0 0% 100%;
  --card-foreground: 240 10% 3.9%;
  --primary: 240 5.9% 10%;
  --primary-foreground: 0 0% 98%;
  --secondary: 240 4.8% 95.9%;
  --secondary-foreground: 240 5.9% 10%;
  --muted: 240 4.8% 95.9%;
  --muted-foreground: 240 3.8% 46.1%;
  --accent: 240 4.8% 95.9%;
  --accent-foreground: 240 5.9% 10%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 98%;
  --border: 240 5.9% 90%;
  --input: 240 5.9% 90%;
  --ring: 240 5.9% 10%;
  --radius: 0.5rem;
}
.dark {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  --card: 240 10% 4.5%;
  --card-foreground: 0 0% 98%;
  --primary: 0 0% 98%;
  --primary-foreground: 240 5.9% 10%;
  --secondary: 240 3.7% 15.9%;
  --secondary-foreground: 0 0% 98%;
  --muted: 240 3.7% 15.9%;
  --muted-foreground: 240 5% 64.9%;
  --accent: 240 3.7% 15.9%;
  --accent-foreground: 0 0% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 0 0% 98%;
  --border: 240 3.7% 15.9%;
  --input: 240 3.7% 15.9%;
  --ring: 240 4.9% 83.9%;
}`,
    tailwindConfigSnippet: `// tailwind.config.js
module.exports = {
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
}`,
    provenance: {
      origin: "Elementra Design System Library",
      repository: "https://github.com/elementraui/themes"
    },
    tags: ["Minimal", "Zinc", "Monochrome", "shadcn", "Modernist"]
  },
  {
    id: "theme-cyber-neon-contrast",
    name: "Cyber Neon Electric",
    slug: "cyber-neon",
    description: "Ultra-vibrant developer theme pairing deep abyss slate with saturated cyan glow accents and high-visibility status indicators.",
    author: { name: "Neon Labs / Elementra", url: "https://github.com/elementraui" },
    license: "MIT",
    colorFamily: "cyber",
    appearance: "dark",
    designStyle: "Cyberpunk",
    framework: "Tailwind CSS v4",
    tokens: {
      dark: {
        background: "#05070e",
        foreground: "#f0fdfa",
        card: "#0b1120",
        cardForeground: "#f0fdfa",
        primary: "#06b6d4",
        primaryForeground: "#021219",
        secondary: "#164e63",
        secondaryForeground: "#cffafe",
        muted: "#0f172a",
        mutedForeground: "#94a3b8",
        accent: "#0891b2",
        accentForeground: "#ffffff",
        destructive: "#f43f5e",
        destructiveForeground: "#ffffff",
        border: "#155e75",
        input: "#0e2e3b",
        ring: "#22d3ee"
      },
      light: {
        background: "#f0fdfa",
        foreground: "#083344",
        card: "#ffffff",
        cardForeground: "#083344",
        primary: "#0891b2",
        primaryForeground: "#ffffff",
        secondary: "#cffafe",
        secondaryForeground: "#0e7490",
        muted: "#e0f2fe",
        mutedForeground: "#64748b",
        accent: "#06b6d4",
        accentForeground: "#ffffff",
        destructive: "#e11d48",
        destructiveForeground: "#ffffff",
        border: "#a5f3fc",
        input: "#cffafe",
        ring: "#0891b2"
      },
      radius: "0.75rem",
      fontSans: 'Plus Jakarta Sans, system-ui, sans-serif',
      fontMono: 'JetBrains Mono, SFMono-Regular, monospace'
    },
    cssVariables: `:root {
  --background: 180 100% 97%;
  --foreground: 198 80% 15%;
  --card: 0 0% 100%;
  --card-foreground: 198 80% 15%;
  --primary: 189 94% 43%;
  --primary-foreground: 0 0% 100%;
  --secondary: 186 100% 90%;
  --secondary-foreground: 191 82% 31%;
  --border: 186 94% 81%;
  --ring: 189 94% 43%;
  --radius: 0.75rem;
}
.dark {
  --background: 226 48% 4%;
  --foreground: 173 80% 97%;
  --card: 222 47% 9%;
  --card-foreground: 173 80% 97%;
  --primary: 189 94% 43%;
  --primary-foreground: 199 89% 5%;
  --secondary: 198 64% 24%;
  --secondary-foreground: 186 100% 90%;
  --border: 198 70% 28%;
  --ring: 187 92% 54%;
}`,
    tailwindConfigSnippet: `// Neon Theme Tokens
export default {
  theme: {
    extend: {
      colors: {
        cyan: { glow: "#06b6d4", deep: "#05070e" }
      }
    }
  }
}`,
    provenance: { origin: "Community Cyber Design Token Registry" },
    tags: ["Cyberpunk", "Neon", "Electric", "Cyan", "Futuristic"]
  },
  {
    id: "theme-midnight-obsidian",
    name: "Midnight Obsidian Violet",
    slug: "midnight-obsidian",
    description: "Deep luxury obsidian palette infused with cosmic violet undertones, radiant amber highlights, and soft frosted surfaces.",
    author: { name: "Obsidian Themes", url: "https://github.com/elementraui" },
    license: "MIT",
    colorFamily: "dark",
    appearance: "dark",
    designStyle: "Glassmorphic",
    framework: "shadcn/ui",
    tokens: {
      dark: {
        background: "#07060e",
        foreground: "#f5f3ff",
        card: "#0f0d1b",
        cardForeground: "#f5f3ff",
        primary: "#8b5cf6",
        primaryForeground: "#ffffff",
        secondary: "#2e1065",
        secondaryForeground: "#ddd6fe",
        muted: "#18142a",
        mutedForeground: "#a78bfa",
        accent: "#f59e0b",
        accentForeground: "#000000",
        destructive: "#ef4444",
        destructiveForeground: "#ffffff",
        border: "#2e2552",
        input: "#1d1738",
        ring: "#a855f7"
      },
      light: {
        background: "#faf5ff",
        foreground: "#1e1b4b",
        card: "#ffffff",
        cardForeground: "#1e1b4b",
        primary: "#7c3aed",
        primaryForeground: "#ffffff",
        secondary: "#ede9fe",
        secondaryForeground: "#5b21b6",
        muted: "#f3e8ff",
        mutedForeground: "#7c3aed",
        accent: "#d97706",
        accentForeground: "#ffffff",
        destructive: "#dc2626",
        destructiveForeground: "#ffffff",
        border: "#ddd6fe",
        input: "#ede9fe",
        ring: "#7c3aed"
      },
      radius: "1rem",
      fontSans: 'Inter, system-ui, sans-serif',
      fontMono: 'Fira Code, monospace'
    },
    cssVariables: `:root {
  --background: 270 100% 98%;
  --foreground: 243 47% 20%;
  --primary: 262 83% 58%;
  --primary-foreground: 0 0% 100%;
  --border: 256 89% 92%;
  --radius: 1rem;
}
.dark {
  --background: 250 50% 4%;
  --foreground: 255 100% 98%;
  --card: 250 35% 8%;
  --primary: 258 90% 66%;
  --secondary: 263 70% 23%;
  --border: 252 38% 24%;
  --ring: 271 91% 65%;
}`,
    tailwindConfigSnippet: `// Midnight Violet Theme`,
    provenance: { origin: "Elementra Obsidian System" },
    tags: ["Obsidian", "Violet", "Purple", "Glassmorphism", "Luxury"]
  },
  {
    id: "theme-emerald-clean",
    name: "Emerald SaaS Clarity",
    slug: "emerald-clean",
    description: "FinTech and high-trust SaaS theme with crisp emerald accents, cool slate neutrals, and exceptional data readability.",
    author: { name: "FinTech UI / Elementra", url: "https://github.com/elementraui" },
    license: "MIT",
    colorFamily: "cool",
    appearance: "dual",
    designStyle: "Corporate",
    framework: "shadcn/ui",
    tokens: {
      dark: {
        background: "#06100d",
        foreground: "#ecfdf5",
        card: "#0b1d17",
        cardForeground: "#ecfdf5",
        primary: "#10b981",
        primaryForeground: "#022c22",
        secondary: "#064e3b",
        secondaryForeground: "#a7f3d0",
        muted: "#0d2820",
        mutedForeground: "#6ee7b7",
        accent: "#34d399",
        accentForeground: "#064e3b",
        destructive: "#f43f5e",
        destructiveForeground: "#ffffff",
        border: "#134e3f",
        input: "#0e382e",
        ring: "#10b981"
      },
      light: {
        background: "#ffffff",
        foreground: "#064e3b",
        card: "#ffffff",
        cardForeground: "#064e3b",
        primary: "#059669",
        primaryForeground: "#ffffff",
        secondary: "#d1fae5",
        secondaryForeground: "#065f46",
        muted: "#ecfdf5",
        mutedForeground: "#047857",
        accent: "#10b981",
        accentForeground: "#ffffff",
        destructive: "#e11d48",
        destructiveForeground: "#ffffff",
        border: "#a7f3d0",
        input: "#d1fae5",
        ring: "#059669"
      },
      radius: "0.625rem",
      fontSans: 'Geist, system-ui, sans-serif',
      fontMono: 'Geist Mono, monospace'
    },
    cssVariables: `:root {
  --background: 0 0% 100%;
  --foreground: 161 85% 16%;
  --primary: 160 84% 39%;
  --border: 151 76% 80%;
  --radius: 0.625rem;
}
.dark {
  --background: 165 45% 4%;
  --foreground: 152 82% 96%;
  --card: 164 45% 8%;
  --primary: 158 64% 52%;
  --border: 166 61% 19%;
  --ring: 158 64% 52%;
}`,
    tailwindConfigSnippet: `// Emerald Tokens`,
    provenance: { origin: "FinTech UI Kit" },
    tags: ["Emerald", "FinTech", "SaaS", "Clean", "Green"]
  },
  {
    id: "theme-sunset-amber",
    name: "Sunset Amber Glow",
    slug: "sunset-amber",
    description: "Warm creator aesthetic featuring deep espresso browns, glowing gold/amber highlights, and welcoming organic tones.",
    author: { name: "Studio Sol", url: "https://github.com/elementraui" },
    license: "MIT",
    colorFamily: "warm",
    appearance: "dual",
    designStyle: "Minimal",
    framework: "shadcn/ui",
    tokens: {
      dark: {
        background: "#0c0a09",
        foreground: "#fef3c7",
        card: "#1c1917",
        cardForeground: "#fef3c7",
        primary: "#f59e0b",
        primaryForeground: "#451a03",
        secondary: "#451a03",
        secondaryForeground: "#fde68a",
        muted: "#292524",
        mutedForeground: "#d97706",
        accent: "#fbbf24",
        accentForeground: "#451a03",
        destructive: "#ef4444",
        destructiveForeground: "#ffffff",
        border: "#44403c",
        input: "#292524",
        ring: "#f59e0b"
      },
      light: {
        background: "#fffbeb",
        foreground: "#451a03",
        card: "#ffffff",
        cardForeground: "#451a03",
        primary: "#d97706",
        primaryForeground: "#ffffff",
        secondary: "#fef3c7",
        secondaryForeground: "#78350f",
        muted: "#fef9c3",
        mutedForeground: "#b45309",
        accent: "#f59e0b",
        accentForeground: "#ffffff",
        destructive: "#dc2626",
        destructiveForeground: "#ffffff",
        border: "#fde68a",
        input: "#fef3c7",
        ring: "#d97706"
      },
      radius: "0.75rem",
      fontSans: 'system-ui, sans-serif',
      fontMono: 'monospace'
    },
    cssVariables: `:root {
  --background: 48 100% 96%;
  --foreground: 24 84% 15%;
  --primary: 38 92% 50%;
  --border: 48 94% 77%;
  --radius: 0.75rem;
}
.dark {
  --background: 24 10% 4%;
  --foreground: 48 94% 89%;
  --card: 24 10% 10%;
  --primary: 38 92% 50%;
  --border: 24 6% 25%;
  --ring: 38 92% 50%;
}`,
    tailwindConfigSnippet: `// Sunset Amber Theme`,
    provenance: { origin: "Sol Studio Palette" },
    tags: ["Amber", "Warm", "Gold", "Sunset", "Creator"]
  },
  {
    id: "theme-nord-glacier",
    name: "Nord Glacier Arctic",
    slug: "nord-glacier",
    description: "Arctic-inspired palette honoring the official Nord specification with calm frost blues, muted polar slates, and restful ergonomics.",
    author: { name: "Arctic Ice Studio / Elementra", url: "https://www.nordtheme.com" },
    license: "MIT",
    colorFamily: "cool",
    appearance: "dark",
    designStyle: "Minimal",
    framework: "CSS Variables",
    tokens: {
      dark: {
        background: "#2e3440",
        foreground: "#eceff4",
        card: "#3b4252",
        cardForeground: "#eceff4",
        primary: "#88c0d0",
        primaryForeground: "#2e3440",
        secondary: "#4c566a",
        secondaryForeground: "#e5e9f0",
        muted: "#434c5e",
        mutedForeground: "#d8dee9",
        accent: "#81a1c1",
        accentForeground: "#2e3440",
        destructive: "#bf616a",
        destructiveForeground: "#eceff4",
        border: "#4c566a",
        input: "#3b4252",
        ring: "#88c0d0"
      },
      light: {
        background: "#eceff4",
        foreground: "#2e3440",
        card: "#ffffff",
        cardForeground: "#2e3440",
        primary: "#5e81ac",
        primaryForeground: "#ffffff",
        secondary: "#e5e9f0",
        secondaryForeground: "#2e3440",
        muted: "#d8dee9",
        mutedForeground: "#4c566a",
        accent: "#81a1c1",
        accentForeground: "#ffffff",
        destructive: "#bf616a",
        destructiveForeground: "#ffffff",
        border: "#d8dee9",
        input: "#e5e9f0",
        ring: "#5e81ac"
      },
      radius: "0.5rem",
      fontSans: 'Inter, system-ui, sans-serif',
      fontMono: 'Menlo, monospace'
    },
    cssVariables: `:root {
  --nord0: #2e3440;
  --nord1: #3b4252;
  --nord4: #d8dee9;
  --nord6: #eceff4;
  --nord8: #88c0d0;
  --nord9: #81a1c1;
  --nord10: #5e81ac;
}`,
    tailwindConfigSnippet: `// Nord Theme Config`,
    provenance: { origin: "Official Nord Open-Source Specification" },
    tags: ["Nord", "Arctic", "Frost", "Blue", "Calm"]
  },
  {
    id: "theme-retro-terminal",
    name: "Retro CRT Phosphor Terminal",
    slug: "retro-terminal",
    description: "Nostalgic green phosphor cathode-ray tube aesthetic with scanline contrast, glowing mono typography, and deep pitch-black backings.",
    author: { name: "RetroTech Lab", url: "https://github.com/elementraui" },
    license: "MIT",
    colorFamily: "dark",
    appearance: "dark",
    designStyle: "Cyberpunk",
    framework: "CSS Variables",
    tokens: {
      dark: {
        background: "#020804",
        foreground: "#4ade80",
        card: "#05160a",
        cardForeground: "#4ade80",
        primary: "#22c55e",
        primaryForeground: "#020804",
        secondary: "#14532d",
        secondaryForeground: "#86efac",
        muted: "#082411",
        mutedForeground: "#16a34a",
        accent: "#86efac",
        accentForeground: "#052e16",
        destructive: "#f87171",
        destructiveForeground: "#020804",
        border: "#166534",
        input: "#052e16",
        ring: "#22c55e"
      },
      light: {
        background: "#f0fdf4",
        foreground: "#14532d",
        card: "#ffffff",
        cardForeground: "#14532d",
        primary: "#16a34a",
        primaryForeground: "#ffffff",
        secondary: "#dcfce7",
        secondaryForeground: "#14532d",
        muted: "#bbf7d0",
        mutedForeground: "#15803d",
        accent: "#22c55e",
        accentForeground: "#ffffff",
        destructive: "#ef4444",
        destructiveForeground: "#ffffff",
        border: "#86efac",
        input: "#dcfce7",
        ring: "#16a34a"
      },
      radius: "0.25rem",
      fontSans: 'ui-monospace, SFMono-Regular, Menlo, monospace',
      fontMono: 'Courier Prime, Courier, monospace'
    },
    cssVariables: `:root {
  --terminal-green: #22c55e;
  --terminal-bg: #020804;
  --terminal-glow: 0 0 10px rgba(34, 197, 94, 0.4);
}`,
    tailwindConfigSnippet: `// Retro Terminal CRT`,
    provenance: { origin: "Hacker Terminal Preset" },
    tags: ["Terminal", "Retro", "Phosphor", "Green", "CRT", "CLI"]
  },
  {
    id: "theme-tokyo-night",
    name: "Tokyo Night Cyber Neon",
    slug: "tokyo-night",
    description: "Celebrated developer palette evoking vibrant Tokyo city lights against midnight sky with cyan, fuchsia, and indigo glows.",
    author: { name: "Enkimute / Folke", url: "https://github.com/folke/tokyonight.nvim" },
    license: "Apache-2.0",
    colorFamily: "cyber",
    appearance: "dark",
    designStyle: "Cyberpunk",
    framework: "shadcn/ui",
    tokens: {
      dark: {
        background: "#1a1b26",
        foreground: "#c0caf5",
        card: "#24283b",
        cardForeground: "#c0caf5",
        primary: "#7aa2f7",
        primaryForeground: "#15161e",
        secondary: "#414868",
        secondaryForeground: "#c0caf5",
        muted: "#292e42",
        mutedForeground: "#565f89",
        accent: "#bb9af7",
        accentForeground: "#15161e",
        destructive: "#f7768e",
        destructiveForeground: "#15161e",
        border: "#292e42",
        input: "#24283b",
        ring: "#7aa2f7"
      },
      light: {
        background: "#e1e2e7",
        foreground: "#3760bf",
        card: "#ffffff",
        cardForeground: "#3760bf",
        primary: "#2e7de9",
        primaryForeground: "#ffffff",
        secondary: "#d0d5e3",
        secondaryForeground: "#3760bf",
        muted: "#c4c8d7",
        mutedForeground: "#6172b0",
        accent: "#9854f1",
        accentForeground: "#ffffff",
        destructive: "#f52a65",
        destructiveForeground: "#ffffff",
        border: "#b4b8cb",
        input: "#d0d5e3",
        ring: "#2e7de9"
      },
      radius: "0.625rem",
      fontSans: 'Inter, system-ui, sans-serif',
      fontMono: 'JetBrains Mono, monospace'
    },
    cssVariables: `:root {
  --background: #1a1b26;
  --foreground: #c0caf5;
  --card: #24283b;
  --primary: #7aa2f7;
  --accent: #bb9af7;
  --destructive: #f7768e;
}`,
    tailwindConfigSnippet: `// Tokyo Night Theme`,
    provenance: { origin: "Tokyo Night Neovim / VSCode Spec" },
    tags: ["Tokyo Night", "Cyber", "Indigo", "Fuchsia", "Developer"]
  }
]
