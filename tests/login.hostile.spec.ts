import { test, expect } from '@playwright/test'
import hostileData from '../data/hostileInputScenarios.json'
import { HostileInputTypes } from '../types/hostileInput'
import { credentials } from '../utils/credentials'

const hostile: HostileInputTypes = hostileData as HostileInputTypes
const { username, password } = credentials()

test.describe('hostile login payloads', () => {
  hostile.loginPayloads.forEach(scenario => {
    test(`${scenario.category}: ${scenario.name}`, async ({ request }) => {
      const response = await request.post('/api/login', {
        headers: { 'Content-Type': 'application/json' },
        data: scenario.rawBody,
      })

      // Rejected, never signed in.
      expect(response.status()).toBe(scenario.expectedStatus)

      // Nothing from the payload comes back, and no session is started.
      const text = await response.text()
      const headers = JSON.stringify(response.headersArray())
      for (const fragment of scenario.mustNotEcho) {
        expect(text).not.toContain(fragment)
        expect(headers).not.toContain(fragment)
      }
      expect(response.headers()['set-cookie']).toBeUndefined()

      // The server is still answering, and a valid login still works, so the
      // rejection above is not just a server that refuses everything.
      const valid = await request.post('/api/login', {
        data: { username, password },
      })
      expect(valid.status()).toBe(200)
    })
  })
})

test.describe('hostile static paths', () => {
  hostile.pathTraversal.forEach(scenario => {
    test(`${scenario.category}: ${scenario.name}`, async ({ request }) => {
      const response = await request.get(scenario.path)

      // Refused or answered with the app shell, never a server error.
      expect(response.status()).toBeLessThan(500)

      // No content from outside the build comes back.
      const text = await response.text()
      for (const fragment of scenario.mustNotContain) {
        expect(text).not.toContain(fragment)
      }

      const alive = await request.get('/')
      expect(alive.status()).toBe(200)
    })
  })
})
