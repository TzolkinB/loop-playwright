// Zero-dependency static server for the built Demo app. Binds to localhost only.
import { createHash, timingSafeEqual } from 'node:crypto'
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

const HOST = '127.0.0.1'
const PORT = Number(process.env.PORT ?? 4173)

if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
  console.error(
    `Invalid PORT "${process.env.PORT}": expected an integer from 1 to 65535.`
  )
  process.exit(1)
}
const DIST = fileURLToPath(new URL('./dist/', import.meta.url))

// The Demo user's credentials come from the environment and are never written in source.
const { USER_NAME, PASSWORD } = process.env
if (!USER_NAME || !PASSWORD) {
  console.error(
    'Missing USER_NAME or PASSWORD. Copy .env.example to .env and set both values.'
  )
  process.exit(1)
}

// Hash first so both sides are the same length, then compare in constant time.
const digest = value => createHash('sha256').update(value).digest()
const matches = (given, expected) =>
  timingSafeEqual(digest(given), digest(expected))

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

function sendJson(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  })
  res.end(JSON.stringify(body))
}

async function readJson(req, limit = 4096) {
  const chunks = []
  let size = 0
  for await (const chunk of req) {
    size += chunk.length
    if (size > limit) return undefined
    chunks.push(chunk)
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    return undefined
  }
}

async function handleLogin(req, res) {
  if (req.method !== 'POST') {
    res.writeHead(405, { Allow: 'POST' }).end()
    return
  }

  const body = await readJson(req)
  if (
    typeof body?.username !== 'string' ||
    typeof body?.password !== 'string'
  ) {
    sendJson(res, 400, {
      error: 'Expected a JSON body with a username and a password.',
    })
    return
  }

  // Check both fields every time so timing does not reveal which one was wrong.
  const userOk = matches(body.username, USER_NAME)
  const passwordOk = matches(body.password, PASSWORD)
  if (!(userOk && passwordOk)) {
    sendJson(res, 401, { error: 'Invalid username or password.' })
    return
  }

  sendJson(res, 200, { ok: true })
}

async function handleRequest(req, res) {
  let file
  let pathname
  try {
    pathname = new URL(req.url ?? '/', `http://${HOST}`).pathname
    file = normalize(join(DIST, decodeURIComponent(pathname)))
  } catch {
    res.writeHead(400).end('Bad request')
    return
  }

  if (pathname === '/api/login') {
    await handleLogin(req, res)
    return
  }
  if (pathname.startsWith('/api/')) {
    sendJson(res, 404, { error: 'Not found' })
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
    // A missing file with an extension is a real 404, so broken asset links stay visible.
    // Extensionless paths fall back to the app shell so client-side routes keep working.
    if (extname(pathname)) {
      res.writeHead(404).end('Not found')
      return
    }
    try {
      await serveFile(res, join(DIST, 'index.html'))
    } catch {
      res.writeHead(503).end('Build missing: run `npm run build:app` first.')
    }
  }
}

createServer((req, res) => {
  // A failure while handling one request, such as a client hanging up mid-body,
  // must never take the whole server down.
  handleRequest(req, res).catch(error => {
    console.error(`Request failed: ${error.message}`)
    if (!res.headersSent) res.writeHead(500)
    res.end()
  })
}).listen(PORT, HOST, () => {
  console.log(`Demo app listening on http://${HOST}:${PORT}`)
})
