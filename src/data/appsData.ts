import { AppItem } from "../types/marketplace"

export const verifiedAppsData: AppItem[] = [
  {
    id: "app-kanban-board",
    name: "Interactive Agile Kanban Board",
    slug: "kanban-board",
    description: "Full-featured task management board with column creation, card priorities, tag filtering, and instant state persistence.",
    category: "Productivity",
    appType: "runnable-react",
    author: { name: "Elementra App Lab", url: "https://github.com/elementraui" },
    license: "MIT",
    version: "1.2.0",
    features: [
      "Three default columns: To Do, In Progress, Done",
      "Dynamic card creation with title, priority tag, and description",
      "Move cards between columns with single click or drag",
      "Real-time task counter and completion percentage",
      "Local storage persistence with zero backend dependencies"
    ],
    dependencies: ["react@19", "lucide-react"],
    tags: ["Kanban", "Productivity", "Agile", "Task Manager", "Runnable"],
    provenance: { origin: "Elementra Modular Mini-Apps" }
  },
  {
    id: "app-markdown-live-editor",
    name: "Markdown Live Editor & HTML Previewer",
    slug: "markdown-editor",
    description: "Split-pane markdown authoring workstation with real-time HTML compiling, word/character counter, and clean code export.",
    category: "Developer Tool",
    appType: "runnable-react",
    author: { name: "Elementra App Lab", url: "https://github.com/elementraui" },
    license: "MIT",
    version: "1.0.4",
    features: [
      "Simultaneous dual-pane split editor and compiled preview",
      "Live stats: Words, Characters, Estimated Reading Time",
      "Toolbar shortcuts for bold, italics, code blocks, lists, and links",
      "1-click Copy Raw Markdown or Copy Rendered HTML",
      "Sample markdown templates pre-loaded"
    ],
    dependencies: ["react@19", "lucide-react"],
    tags: ["Markdown", "Editor", "Previewer", "Writer", "Documentation"],
    provenance: { origin: "Elementra Modular Mini-Apps" }
  },
  {
    id: "app-pomodoro-timer",
    name: "Precision Pomodoro Focus Timer",
    slug: "pomodoro-timer",
    description: "Ergonomic interval timer for deep focus sessions with custom work/break intervals, round counter, and audio-visual completion alerts.",
    category: "Productivity",
    appType: "runnable-react",
    author: { name: "Elementra App Lab", url: "https://github.com/elementraui" },
    license: "MIT",
    version: "2.1.0",
    features: [
      "Customizable Focus (25m), Short Break (5m), and Long Break (15m)",
      "Animated circular progress gauge tracking elapsed seconds",
      "Session streak accumulator and total daily focus hours",
      "Play/Pause/Reset keyboard controls (Spacebar to toggle)",
      "Minimalist distraction-free dark UI"
    ],
    dependencies: ["react@19", "lucide-react"],
    tags: ["Pomodoro", "Timer", "Focus", "Productivity", "Clock"],
    provenance: { origin: "Elementra Modular Mini-Apps" }
  },
  {
    id: "app-dev-calculator",
    name: "Programmer Calculator & Base Converter",
    slug: "dev-calculator",
    description: "Multifunction developer calculator with standard arithmetic, real-time Binary/Octal/Hexadecimal base conversions, and byte unit converter.",
    category: "Developer Tool",
    appType: "runnable-react",
    author: { name: "Elementra App Lab", url: "https://github.com/elementraui" },
    license: "MIT",
    version: "1.1.0",
    features: [
      "Standard arithmetic keypad with history tape",
      "Simultaneous Decimal, Hexadecimal, Binary, and Octal display",
      "Bitwise operators (AND, OR, XOR, NOT, Shift Left/Right)",
      "Data size conversion (Bytes, KB, MB, GB, TB, KiB, MiB, GiB)",
      "Copy any numerical base with one click"
    ],
    dependencies: ["react@19", "lucide-react"],
    tags: ["Calculator", "Hexadecimal", "Binary", "Converter", "Math"],
    provenance: { origin: "Elementra Modular Mini-Apps" }
  },
  {
    id: "app-json-formatter",
    name: "JSON Formatter, Validator & Tree Visualizer",
    slug: "json-formatter",
    description: "High-speed JSON engineering utility with syntax error pinpointing, beautification/minification, and collapsible object tree.",
    category: "Developer Tool",
    appType: "runnable-react",
    author: { name: "Elementra App Lab", url: "https://github.com/elementraui" },
    license: "MIT",
    version: "1.3.0",
    features: [
      "Instant syntax validation with exact error line and column detection",
      "2-space, 4-space, or tab beautification",
      "1-click minification for compact payload production",
      "File upload and download support",
      "Key count, byte size, and depth level metrics"
    ],
    dependencies: ["react@19", "lucide-react"],
    tags: ["JSON", "Formatter", "Validator", "Minifier", "DevTool"],
    provenance: { origin: "Elementra Modular Mini-Apps" }
  },
  {
    id: "app-palette-generator",
    name: "Harmonic Color Palette Generator",
    slug: "palette-generator",
    description: "Procedural color harmony workstation generating complementary, triadic, and monochromatic schemes with contrast checks.",
    category: "Interactive Widget",
    appType: "runnable-react",
    author: { name: "Elementra App Lab", url: "https://github.com/elementraui" },
    license: "MIT",
    version: "1.0.1",
    features: [
      "Generate harmonic 5-color palettes with Spacebar",
      "Lock individual swatches while regenerating others",
      "WCAG 2.1 contrast ratio calculations against black and white",
      "Export as CSS Variables, Tailwind Config, or Hex array",
      "Shade generator for 50–950 tailwind levels"
    ],
    dependencies: ["react@19", "lucide-react"],
    tags: ["Color", "Palette", "Design", "CSS", "Generator"],
    provenance: { origin: "Elementra Modular Mini-Apps" }
  }
]
