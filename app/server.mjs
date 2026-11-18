// Zero-dependency static server for the built Demo app. Binds to localhost only.
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

const HOST = '127.0.0.1'
const PORT = Number(process.env.PORT ?? 4173)
const DIST = fileURLToPath(new URL('./dist/', import.meta.url))

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.map': 'application/json; charset=utf-8',
}

async function serveFile(res, file) {
  const body = await readFile(file)
  res.writeHead(200, {
    'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream',
  })
  res.end(body)
}

createServer(async (req, res) => {
  let file
  let pathname
  try {
    pathname = new URL(req.url ?? '/', `http://${HOST}`).pathname
    file = normalize(join(DIST, decodeURIComponent(pathname)))
  } catch {
    res.writeHead(400).end('Bad request')
    return
  }

  if (!file.startsWith(DIST)) {
    res.writeHead(403).end('Forbidden')
    return
  }

  try {
    await serveFile(
      res,
      pathname.endsWith('/') ? join(file, 'index.html') : file
    )
  } catch {
    // Unknown paths fall back to the app shell so client-side routes keep working.
    try {
      await serveFile(res, join(DIST, 'index.html'))
    } catch {
      res.writeHead(503).end('Build missing: run `npm run build:app` first.')
    }
  }
}).listen(PORT, HOST, () => {
  console.log(`Demo app listening on http://${HOST}:${PORT}`)
})
