# Contributing to ElementraUI

Thank you for your interest in contributing to **ElementraUI** (*Discover. Preview. Build.*).

ElementraUI is an open-source, community-driven UI component marketplace and developer resource library. We welcome contributions of all forms: new components, theme palettes, multi-page templates, runnable mini-apps, vector icons, motion loops, documentation improvements, and bug fixes.

---

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it to understand our community standards and expectations.

---

## Development Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ LTS recommended)
- **npm**: v9.0.0 or higher
- **Git**

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/elementraui/elementraui.git
   cd elementraui
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the local development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Contribution Workflow

1. **Fork and Branch:** Create a branch from `main` with a descriptive name:
   ```bash
   git checkout -b feature/add-glassmorphism-card
   ```
2. **Make Changes:** Follow our architecture and styling conventions:
   - Use TypeScript with strict types.
   - Use Tailwind CSS v4 design tokens.
   - For executable React components, place the source in `src/components/registry/` and register them in `src/data/fullCatalogue.json`.
   - See [docs/ADDING_RESOURCES.md](docs/ADDING_RESOURCES.md) for detailed instructions on adding components, themes, and templates.
3. **Verify Locally:** Run the verification test suites:
   ```bash
   # Type check
   npx tsc -b

   # Test marketplace core data
   npm run test:marketplace

   # Run browser verification suite
   npm run test:live

   # Production build test
   npm run build
   ```
4. **Commit:** Write clear, concise commit messages following the Conventional Commits specification:
   ```bash
   git commit -m "feat(components): add glassmorphism bento card component"
   ```
5. **Open Pull Request:** Push your branch to GitHub and open a Pull Request against `main`. Describe your changes, screenshot any visual additions, and reference related issues.

---

## Quality & Licensing Standards

- **Executable Code:** All executable React components must be self-contained or explicitly declare their dependencies in `package.json`.
- **License Integrity:** Only contribute code and assets that you have created or that have an open-source license compatible with MIT (e.g., Apache-2.0, MIT, ISC).
- **No Third-Party Cookies or Trackers:** Previews run in strict sandboxed iframes without third-party network beacons or cookies.

---

## Questions & Support

For questions, architectural discussions, or feature suggestions:
- Open a discussion or issue on GitHub.
- Consult the detailed documentation in [docs/](docs/).
