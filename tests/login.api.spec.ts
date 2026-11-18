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
