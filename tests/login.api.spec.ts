import net from 'node:net'
import { test, expect } from '@playwright/test'
import { credentials } from '../utils/credentials'

const { username, password } = credentials()

test.describe('POST /api/login', () => {
  test('accepts the Demo user credentials', async ({ request }) => {
    const response = await request.post('/api/login', {
      data: { username, password },
    })

    expect(response.status()).toBe(200)
  })

  test('rejects a wrong password', async ({ request }) => {
    const response = await request.post('/api/login', {
      data: { username, password: `${password}-wrong` },
    })

    expect(response.status()).toBe(401)
  })

  test('rejects a wrong username', async ({ request }) => {
    const response = await request.post('/api/login', {
      data: { username: `${username}-wrong`, password },
    })

    expect(response.status()).toBe(401)
  })

  test('rejects a body that is not JSON', async ({ request }) => {
    const response = await request.post('/api/login', {
      headers: { 'Content-Type': 'application/json' },
      data: 'not json',
    })

    expect(response.status()).toBe(400)
  })

  test('rejects a body without both fields', async ({ request }) => {
    const response = await request.post('/api/login', { data: { username } })

    expect(response.status()).toBe(400)
  })

  test('only allows POST', async ({ request }) => {
    const response = await request.get('/api/login')

    expect(response.status()).toBe(405)
  })
})

test.describe('security headers', () => {
  const paths = [
    { name: 'the page', method: 'GET', path: '/' },
    { name: 'a 404', method: 'GET', path: '/missing.js' },
    { name: 'an unknown API route', method: 'GET', path: '/api/nope' },
    { name: 'a 405', method: 'GET', path: '/api/login' },
    { name: 'a refused dotfile', method: 'GET', path: '/.env' },
    {
      name: 'an escape attempt',
      method: 'GET',
      path: '/%2e%2e%2fpackage.json',
    },
  ]

  for (const { name, path } of paths) {
    test(`are present on ${name}`, async ({ request }) => {
      const response = await request.get(path)
      const headers = response.headers()

      expect(headers['x-content-type-options']).toBe('nosniff')
      expect(headers['referrer-policy']).toBeTruthy()
      expect(headers['content-security-policy']).toContain("default-src 'self'")
      expect(headers['content-security-policy']).toContain(
        "frame-ancestors 'none'"
      )
    })
  }

  test('are present on a built asset', async ({ request }) => {
    const page = await request.get('/')
    const asset = (await page.text()).match(
      /(?:src|href)="(\/assets\/[^"]+)"/
    )![1]
    const response = await request.get(asset)

    expect(response.status()).toBe(200)
    expect(response.headers()['x-content-type-options']).toBe('nosniff')
    expect(response.headers()['content-security-policy']).toBeTruthy()
  })

  test('are present on login responses', async ({ request }) => {
    const ok = await request.post('/api/login', {
      data: { username, password },
    })
    const bad = await request.post('/api/login', {
      data: { username, password: `${password}-wrong` },
    })
    const malformed = await request.post('/api/login', { data: {} })

    for (const response of [ok, bad, malformed]) {
      expect(response.headers()['x-content-type-options']).toBe('nosniff')
      expect(response.headers()['content-security-policy']).toBeTruthy()
    }
  })
})

test.describe('error responses', () => {
  test('carry an explicit Content-Type', async ({ request }) => {
    for (const path of ['/missing.js', '/.env', '/%2e%2e%2fpackage.json']) {
      const response = await request.get(path)

      expect(response.status()).toBeGreaterThanOrEqual(400)
      expect(response.headers()['content-type']).toContain('charset=utf-8')
    }

    const notAllowed = await request.get('/api/login')
    expect(notAllowed.headers()['content-type']).toBeTruthy()
  })

  test('refuse a dotfile with 404', async ({ request }) => {
    const response = await request.get('/.env')

    expect(response.status()).toBe(404)
  })
})

test('accepts 256-character credentials and rejects 257', async ({
  request,
}) => {
  const at = await request.post('/api/login', {
    data: { username: 'a'.repeat(256), password: 'b'.repeat(256) },
  })
  const over = await request.post('/api/login', {
    data: { username: 'a'.repeat(257), password },
  })

  // Valid length but wrong credentials is a 401, not a 400.
  expect(at.status()).toBe(401)
  expect(over.status()).toBe(400)
})

test('keeps serving after a client aborts mid-request', async ({
  request,
  baseURL,
}) => {
  const { hostname, port } = new URL(baseURL!)

  // The request fixture cannot abort mid-body, so use a raw socket: promise
  // 100 bytes, send 6, then hang up.
  await new Promise<void>(resolve => {
    const socket = net.connect(Number(port), hostname, () => {
      socket.write(
        `POST /api/login HTTP/1.1\r\nHost: ${hostname}\r\n` +
          'Content-Type: application/json\r\nContent-Length: 100\r\n\r\n{"user',
        () => socket.destroy()
      )
    })
    socket.on('error', () => {})
    socket.on('close', () => resolve())
  })

  // Give the server time to notice the abort. A crash shows up within milliseconds.
  await new Promise(resolve => setTimeout(resolve, 300))

  const response = await request.post('/api/login', {
    data: { username, password },
  })
  expect(response.status()).toBe(200)
})

test('does not ship the password in the page or its scripts', async ({
  request,
}) => {
  const html = await (await request.get('/')).text()
  const scriptPaths = [...html.matchAll(/src="([^"]+\.js)"/g)].map(
    match => match[1]
  )
  const scripts = await Promise.all(
    scriptPaths.map(async path => (await request.get(path)).text())
  )

  expect(scriptPaths).not.toHaveLength(0)
  expect([html, ...scripts].join('\n')).not.toContain(password)
})
