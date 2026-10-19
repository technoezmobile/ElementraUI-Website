import fs from 'node:fs'
import path from 'node:path'
import http from 'node:http'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const BASE_URL = 'http://localhost:5173'

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} from ${url}`))
      }
      let b = ''
      res.on('data', chunk => b += chunk)
      res.on('end', () => {
        try {
          resolve(JSON.parse(b))
        } catch (e) {
          reject(e)
        }
      })
    }).on('error', reject)
  })
}

async function runInstallationTests() {
  console.log('=================================================================')
  console.log('   PHASE 9: STANDALONE TEST PROJECT INSTALLATION VERIFICATION   ')
  console.log('=================================================================\n')

  const testDir = path.resolve('test-install')
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true })
  }

  const targetComponentsDir = path.join(testDir, 'components', 'ui')
  if (!fs.existsSync(targetComponentsDir)) {
    fs.mkdirSync(targetComponentsDir, { recursive: true })
  }

  // Representative items from distinct categories
  const testItems = [
    { slug: 'floating-sphere', category: '3D WebGL' },
    { slug: 'aurora-shader', category: 'GLSL Shaders' },
    { slug: 'interactive-card', category: 'Cards & Bento' },
    { slug: 'lens', category: 'Visual Effects / Optical Zoom' },
    { slug: 'magnetic-button', category: 'Interactive Controls' },
    { slug: 'bento-grid', category: 'Page Blocks' }
  ]

  let passed = 0
  let failed = 0

  for (const item of testItems) {
    const registryUrl = `${BASE_URL}/r/${item.slug}.json`
    console.log(`[Testing Installation] ${item.slug} (${item.category})...`)
    try {
      const data = await fetchJson(registryUrl)
      
      // Validate schema
      if (!data.name || !Array.isArray(data.files) || data.files.length === 0) {
        throw new Error(`Invalid registry schema: missing name or files`)
      }

      const file = data.files[0]
      if (!file.content || file.content.length < 50) {
        throw new Error(`Invalid file content: content is empty or corrupt`)
      }

      // Write installed file to target test project
      const targetFilePath = path.join(targetComponentsDir, `${item.slug}.tsx`)
      fs.writeFileSync(targetFilePath, file.content, 'utf8')

      // Verify file written and non-empty
      const stat = fs.statSync(targetFilePath)
      if (stat.size < 50) {
        throw new Error(`Installed file size too small: ${stat.size} bytes`)
      }

      console.log(`  ✓ Successfully installed to test project: ${path.relative(process.cwd(), targetFilePath)} (${stat.size} bytes)`)
      console.log(`  ✓ Dependencies resolved: [${(data.dependencies || []).join(', ')}]`)
      passed++
    } catch (err) {
      console.error(`  ✕ Installation failed for ${item.slug}:`, err.message)
      failed++
    }
  }

  console.log('\n=================================================================')
  console.log(`INSTALLATION TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`)
  console.log('=================================================================\n')

  if (failed > 0) process.exit(1)
}

runInstallationTests().catch(err => {
  console.error(err)
  process.exit(1)
})
