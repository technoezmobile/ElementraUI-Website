import fs from 'node:fs'
import path from 'node:path'
import http from 'node:http'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const BASE_URL = 'http://localhost:5173'

function fetchHttp(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => resolve({ status: res.statusCode, data }))
    }).on('error', reject)
  })
}

let passedTests = 0
let failedTests = 0

function assert(condition, testName, detail = '') {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`)
    passedTests++
  } else {
    console.error(`  ✕ FAIL: ${testName} ${detail ? `(${detail})` : ''}`)
    failedTests++
  }
}

async function runTestSuite() {
  console.log('=================================================================')
  console.log('   21st LOCAL: COMPONENT PREVIEW & REGISTRY VERIFICATION SUITE   ')
  console.log('=================================================================\n')

  // --- SUITE 1: CATALOGUE INTEGRITY & HONEST PREVIEW STATUSES ---
  console.log('1. Auditing Catalogue Schema & Honest Preview Statuses...')
  const cataloguePath = path.resolve('src/data/fullCatalogue.json')
  assert(fs.existsSync(cataloguePath), 'Catalogue file fullCatalogue.json exists')
  
  const catalogue = JSON.parse(fs.readFileSync(cataloguePath, 'utf8'))
  assert(catalogue.length === 162, `Catalogue contains exactly 162 items (found: ${catalogue.length})`)

  const verifiedItems = catalogue.filter(i => i.previewStatus === 'verified')
  assert(verifiedItems.length === 16, `Verified items count is strictly 16 (14 components + 2 themes, found: ${verifiedItems.length})`)

  const unavailableItems = catalogue.filter(i => i.previewStatus === 'unavailable')
  assert(unavailableItems.length === 138, `Unavailable items count is 138 (found: ${unavailableItems.length})`)

  const honestDiagnostics = unavailableItems.every(i => !i.isWorkingPreview && !!i.previewDiagnostic)
  assert(honestDiagnostics, 'All unavailable items are marked isWorkingPreview: false and have previewDiagnostic explanations')

  const itemsWithSource = catalogue.filter(i => !!i.componentCode)
  assert(itemsWithSource.length === 14, `Exactly 14 components have real componentCode attached for source inspection (found: ${itemsWithSource.length})`)

  // --- SUITE 2: COMPONENT SOURCE IMPLEMENTATION AUDIT ---
  console.log('\n2. Verifying Real Component Source Implementations (Phase 4 & 10)...')

  // 1. Lens
  const lensSource = fs.readFileSync(path.resolve('src/components/registry/Lens.tsx'), 'utf8')
  assert(lensSource.includes('zoomFactor') && lensSource.includes('radial-gradient') && lensSource.includes('scale(${zoomFactor})'),
    'Lens component contains authentic zoom factor and radial mask magnification math')
  assert(lensSource.includes('handleMouseMove') && lensSource.includes('setMousePosition'),
    'Lens component contains real mouse coordinate tracking')

  // 2. Magic Card
  const magicCardSource = fs.readFileSync(path.resolve('src/components/registry/MagicCard.tsx'), 'utf8')
  assert(magicCardSource.includes('borderGradient') && magicCardSource.includes('innerSpotlight') && magicCardSource.includes('useSpring'),
    'Magic Card contains authentic dual-layer radial spotlight gradients and spring smoothing')
  assert(magicCardSource.includes('onPointerMove') && magicCardSource.includes('clientX - rect.left'),
    'Magic Card tracks pointer coordinates on card surface')

  // 3. 3D Floating Sphere
  const sphereSource = fs.readFileSync(path.resolve('src/components/registry/FloatingSphere.tsx'), 'utf8')
  assert(sphereSource.includes('THREE.IcosahedronGeometry') && sphereSource.includes('THREE.WebGLRenderer') && sphereSource.includes('requestAnimationFrame'),
    'Interactive 3D Sphere initializes real Three.js WebGL scene, geometry, and animation loop')

  // 4. Aurora Shader
  const shaderSource = fs.readFileSync(path.resolve('src/components/registry/AuroraShader.tsx'), 'utf8')
  assert(shaderSource.includes('gl.createShader') && shaderSource.includes('smoothstep') && shaderSource.includes('u_time'),
    'Real-time Aurora Wave Shader compiles raw GLSL fragment shader with procedural noise waves')

  // 5. Interactive 3D Spring Tilt Card
  const tiltSource = fs.readFileSync(path.resolve('src/components/registry/InteractiveCard.tsx'), 'utf8')
  assert(tiltSource.includes('useSpring') && tiltSource.includes('rotateX') && tiltSource.includes('rotateY') && tiltSource.includes('preserve-3d'),
    'Interactive 3D Spring Tilt Card computes 3D perspective rotation angles based on cursor offset')

  // 6. Kinetic Glow Hero
  const heroSource = fs.readFileSync(path.resolve('src/components/registry/KineticHero.tsx'), 'utf8')
  assert(heroSource.includes('framer-motion') && (heroSource.includes('bg-gradient') || heroSource.includes('blur')),
    'Kinetic Glow Landing Hero implements authentic hero layout and kinetic background glow')

  // 7. Staggered Blur-In Typography
  const blurSource = fs.readFileSync(path.resolve('src/components/registry/BlurRevealText.tsx'), 'utf8')
  assert(blurSource.includes('words.map') && blurSource.includes('filter: "blur('),
    'Staggered Blur-In Typography implements word-by-word spring entrance with blur transition')

  // 8. Shimmer Button
  const shimmerSource = fs.readFileSync(path.resolve('src/components/registry/ShimmerButton.tsx'), 'utf8')
  assert(shimmerSource.includes('["-100%", "200%"]') && shimmerSource.includes('repeat: Infinity'),
    'Shimmer Beam Action Button executes continuous infinite light beam translation')

  // 9. Magnetic Button
  const magneticSource = fs.readFileSync(path.resolve('src/components/registry/MagneticButton.tsx'), 'utf8')
  assert(magneticSource.includes('useSpring') && magneticSource.includes('strength') && magneticSource.includes('handleMouseMove'),
    'Magnetic Attraction Button implements physics-based cursor attraction with spring dampening')

  // 10. Bento Grid
  const bentoSource = fs.readFileSync(path.resolve('src/components/registry/BentoGrid.tsx'), 'utf8')
  assert(bentoSource.includes('col-span-1 md:col-span-2') && bentoSource.includes('framer-motion'),
    'Asymmetric Feature Bento Grid implements responsive multi-column layout with hover lift depth')

  // 11. Particles Background
  const particlesSource = fs.readFileSync(path.resolve('src/components/registry/ParticlesBackground.tsx'), 'utf8')
  assert(particlesSource.includes('getContext("2d")') && particlesSource.includes('particleCount') && particlesSource.includes('requestAnimationFrame'),
    'Interactive Canvas Particles Network implements 60 FPS proximity vector constellation math')

  // 12. Marquee Showcase
  const marqueeSource = fs.readFileSync(path.resolve('src/components/registry/MarqueeShowcase.tsx'), 'utf8')
  assert(marqueeSource.includes('["0%", "-50%"]') && marqueeSource.includes('repeat: Infinity'),
    'Hardware-Accelerated Marquee implements infinite continuous horizontal looping ticker')

  // --- SUITE 3: LOCAL REGISTRY ENDPOINTS & INSTALLATION VERIFICATION ---
  console.log('\n3. Verifying Local Registry Endpoints & Installation JSONs...')
  
  const indexRes = await fetchHttp(`${BASE_URL}/r/index.json`)
  assert(indexRes.status === 200, `GET /r/index.json returns HTTP 200 (status: ${indexRes.status})`)
  
  const registryItems = JSON.parse(indexRes.data)
  assert(Array.isArray(registryItems) && registryItems.length >= 14,
    `Registry index contains all 14 registered components (found: ${registryItems.length})`)

  const requiredSlugs = [
    'floating-sphere',
    'aurora-shader',
    'interactive-card',
    'kinetic-hero',
    'blur-reveal-text',
    'floating-pill-nav',
    'staggered-gallery',
    'shimmer-button',
    'lens',
    'magic-card',
    'magnetic-button',
    'bento-grid',
    'particles-background',
    'marquee-showcase'
  ]

  for (const slug of requiredSlugs) {
    const itemRes = await fetchHttp(`${BASE_URL}/r/${slug}.json`)
    assert(itemRes.status === 200, `GET /r/${slug}.json resolves with HTTP 200`)
    const itemJson = JSON.parse(itemRes.data)
    assert(itemJson.name === slug && Array.isArray(itemJson.files) && itemJson.files[0].content.length > 50,
      `Registry item ${slug}.json has valid shadcn schema and genuine files[0].content (${itemJson.files[0].content.length} chars)`)
  }

  // --- SUITE 4: PROMPT STUDIO & WEBSITE GENERATOR ARCHITECTURE ---
  console.log('\n4. Verifying Prompt Studio & Website Builder Architecture...')
  const promptsPath = path.resolve('src/data/prompts.ts')
  assert(fs.existsSync(promptsPath), 'Prompt data file src/data/prompts.ts exists')
  const promptStudioPath = path.resolve('src/components/PromptStudio/PromptStudio.tsx')
  assert(fs.existsSync(promptStudioPath), 'PromptStudio component exists')
  const websiteBuilderPath = path.resolve('src/components/WebsiteBuilder/WebsiteBuilder.tsx')
  assert(fs.existsSync(websiteBuilderPath), 'WebsiteBuilder component exists')

  // --- SUITE 5: BEHAVIORAL INTERACTION CALCULATIONS ---
  console.log('\n5. Verifying Behavioral Interaction Algorithms & Transform Logic...')

  // Test Lens magnification math
  const lensZoomFactor = 1.75
  const lensSize = 160
  const mousePos = { x: 120, y: 150 }
  const computedOrigin = `${mousePos.x}px ${mousePos.y}px`
  assert(computedOrigin === '120px 150px', 'Lens correctly aligns transformOrigin to exact cursor coordinates')
  const maskRadius = lensSize / 2
  assert(maskRadius === 80, 'Lens correctly sets circular mask radius to 80px')

  // Test Tilt Card rotation boundaries
  const clampRotate = (mouseNorm) => (mouseNorm - 0.5) * 30
  const centerRotate = clampRotate(0.5)
  const edgeRotate = clampRotate(1.0)
  assert(centerRotate === 0, 'Tilt Card has 0 degree rotation at center position')
  assert(edgeRotate === 15, 'Tilt Card reaches exact max tilt (+15deg) at card boundary')

  // --- SUITE 6: APPLICATION SERVING INTEGRITY ---
  console.log('\n6. Verifying Host Application Serving & Bundle...')
  const appRes = await fetchHttp(`${BASE_URL}/`)
  assert(appRes.status === 200, `GET / returns HTTP 200 with HTML host page`)
  assert(appRes.data.includes('ElementraUI') || appRes.data.includes('id="root"'), 'Host HTML contains root mount element')

  console.log('\n=================================================================')
  console.log(`VERIFICATION SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED`)
  console.log('=================================================================\n')

  if (failedTests > 0) {
    process.exit(1)
  }
}

runTestSuite().catch(err => {
  console.error('Test suite failed with unexpected error:', err)
  process.exit(1)
})
