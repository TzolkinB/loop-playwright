import { describe, expect, it } from 'vitest'
import { resolveStaticPath } from '../app/lib/staticPath.mjs'

const ROOT = '/srv/app/dist/'

describe('resolveStaticPath', () => {
  describe('normal requests', () => {
    it.each([
      ['/', '/srv/app/dist/index.html'],
      ['/index.html', '/srv/app/dist/index.html'],
      ['/assets/app.js', '/srv/app/dist/assets/app.js'],
      ['/assets/', '/srv/app/dist/assets/index.html'],
      ['/unknown/route', '/srv/app/dist/unknown/route'],
      ['/assets/a%20b.js', '/srv/app/dist/assets/a b.js'],
    ])('%s resolves to %s', (pathname, file) => {
      expect(resolveStaticPath(ROOT, pathname)).toEqual({ file })
    })
  })

  describe('escape attempts are rejected with 403', () => {
    it.each([
      '/../package.json',
      '/..%2f..%2fpackage.json',
      '/%2e%2e/%2e%2e/package.json',
      '/%2E%2E%2F%2E%2E%2Fpackage.json',
      '/assets/../../package.json',
      '/assets/..%2f..%2f..%2fpackage.json',
      '/../../../../../../etc/passwd',
    ])('%s', pathname => {
      expect(resolveStaticPath(ROOT, pathname)).toEqual({ status: 403 })
    })

    it('does not mistake a sibling folder with the same prefix for the build folder', () => {
      const sibling = '/../dist-evil/secret.txt'

      expect(resolveStaticPath('/srv/app/dist', sibling)).toEqual({
        status: 403,
      })
      expect(resolveStaticPath('/srv/app/dist/', sibling)).toEqual({
        status: 403,
      })
    })
  })

  describe('malformed encoding is rejected with 400', () => {
    it.each(['/%E0%A4%A', '/%', '/%zz', '/%c0%ae%c0%ae/package.json'])(
      '%s',
      pathname => {
        expect(resolveStaticPath(ROOT, pathname)).toEqual({ status: 400 })
      }
    )
  })

  describe('hostile input never resolves outside the build folder', () => {
    it.each([
      '/..\\..\\package.json',
      '/%5c..%5c..%5cpackage.json',
      '//etc/passwd',
      '/%2fetc%2fpasswd',
      '/assets/..%00.js',
      '/%00',
      '/%00/../../package.json',
      '/..;/package.json',
      '/..%252f..%252fpackage.json',
      '/.env',
      '/%0d%0aSet-Cookie:%20pwn=1',
      `/${'a'.repeat(9000)}`,
    ])('%s', pathname => {
      const result = resolveStaticPath(ROOT, pathname)

      if ('file' in result) {
        expect(result.file.startsWith(ROOT)).toBe(true)
      } else {
        expect([400, 403]).toContain(result.status)
      }
    })
  })
})
