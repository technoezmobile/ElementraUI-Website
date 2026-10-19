import fs from 'node:fs'
import path from 'node:path'

const components = [
  { name: 'floating-sphere', file: 'FloatingSphere.tsx', deps: ['three', '@types/three'] },
  { name: 'aurora-shader', file: 'AuroraShader.tsx', deps: [] },
  { name: 'interactive-card', file: 'InteractiveCard.tsx', deps: ['framer-motion'] },
  { name: 'kinetic-hero', file: 'KineticHero.tsx', deps: ['framer-motion', 'clsx', 'tailwind-merge'] },
  { name: 'blur-reveal-text', file: 'BlurRevealText.tsx', deps: ['framer-motion'] },
  { name: 'floating-pill-nav', file: 'FloatingPillNav.tsx', deps: ['framer-motion', 'lucide-react'] },
  { name: 'staggered-gallery', file: 'StaggeredGallery.tsx', deps: ['framer-motion'] },
  { name: 'shimmer-button', file: 'ShimmerButton.tsx', deps: ['framer-motion'] }
]

const outDir = path.resolve('public/r')
fs.mkdirSync(outDir, { recursive: true })

const registryIndex = []

components.forEach(c => {
  const filePath = path.resolve('src/components/registry', c.file)
  const code = fs.readFileSync(filePath, 'utf-8')
  const item = {
    $schema: 'https://ui.shadcn.com/schema.json',
    name: c.name,
    type: 'registry:ui',
    dependencies: c.deps,
    registryDependencies: [],
    files: [
      {
        path: `ui/${c.name}.tsx`,
        content: code,
        type: 'registry:ui'
      }
    ]
  }
  fs.writeFileSync(path.join(outDir, `${c.name}.json`), JSON.stringify(item, null, 2))
  registryIndex.push({
    name: c.name,
    type: 'registry:ui',
    dependencies: c.deps
  })
})

fs.writeFileSync(path.join(outDir, 'index.json'), JSON.stringify(registryIndex, null, 2))
console.log('Successfully generated public/r/*.json endpoints!')
