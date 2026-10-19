import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import fs from 'fs'

function serveAwesomeComponents(): Plugin {
  const communityDir = path.resolve(__dirname, 'community-assets/components')
  const legacyDir = path.resolve(__dirname, '.cache/awesome-components/components')
  const baseDir = fs.existsSync(communityDir) ? communityDir : legacyDir

  const handleRequest = (req: any, res: any, next: any) => {
    if (!req.url) return next()
    const cleanUrl = decodeURIComponent(req.url.split('?')[0])
    const targetPath = path.normalize(path.join(baseDir, cleanUrl))

    // Strict directory traversal prevention
    if (!targetPath.startsWith(baseDir)) {
      res.statusCode = 403
      res.end('Forbidden: Path traversal detected')
      return
    }

    if (fs.existsSync(targetPath) && fs.statSync(targetPath).isFile()) {
      const ext = path.extname(targetPath).toLowerCase()
      const mimeTypes: Record<string, string> = {
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.webp': 'image/webp',
        '.svg': 'image/svg+xml',
        '.html': 'text/html; charset=utf-8',
        '.md': 'text/markdown; charset=utf-8',
        '.json': 'application/json',
        '.css': 'text/css',
        '.js': 'application/javascript',
      }
      res.setHeader('Content-Type', mimeTypes[ext] || 'text/plain; charset=utf-8')
      res.setHeader('Cache-Control', 'public, max-age=3600')
      res.setHeader('Content-Length', fs.statSync(targetPath).size)
      if (req.method === 'HEAD') {
        res.end()
        return
      }
      fs.createReadStream(targetPath).pipe(res)
      return
    }
    next()
  }

  return {
    name: 'serve-awesome-components',
    configureServer(server) {
      server.middlewares.use('/awesome-components', handleRequest)
      server.middlewares.use('/community-assets', handleRequest)
      const basePath = (process.env.VITE_BASE_PATH || '').replace(/\/+$/, '')
      if (basePath) {
        server.middlewares.use(`${basePath}/awesome-components`, handleRequest)
        server.middlewares.use(`${basePath}/community-assets`, handleRequest)
      }
    },
    configurePreviewServer(server) {
      server.middlewares.use('/awesome-components', handleRequest)
      server.middlewares.use('/community-assets', handleRequest)
      const basePath = (process.env.VITE_BASE_PATH || '').replace(/\/+$/, '')
      if (basePath) {
        server.middlewares.use(`${basePath}/awesome-components`, handleRequest)
        server.middlewares.use(`${basePath}/community-assets`, handleRequest)
      }
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [serveAwesomeComponents(), react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})

