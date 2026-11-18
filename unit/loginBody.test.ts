import { describe, expect, it } from 'vitest'
import { validateLoginBody } from '../app/lib/loginBody.mjs'

describe('validateLoginBody', () => {
  it('accepts string username and password', () => {
    expect(validateLoginBody({ username: 'demo', password: 'pw' })).toEqual({
      ok: true,
      username: 'demo',
      password: 'pw',
    })
  })

  it('returns only the two fields and ignores the rest', () => {
    const result = validateLoginBody({
      username: 'demo',
      password: 'pw',
      admin: true,
    })

    expect(result).toEqual({ ok: true, username: 'demo', password: 'pw' })
  })

  describe('rejects anything else', () => {
    it.each([
      ['missing username', { password: 'pw' }],
      ['missing password', { username: 'demo' }],
      ['empty object', {}],
      ['null', null],
      ['undefined', undefined],
      ['an array', ['demo', 'pw']],
      ['a string', 'demo'],
      ['a number', 42],
      ['numeric fields', { username: 1, password: 2 }],
      ['null fields', { username: null, password: null }],
      ['boolean fields', { username: true, password: true }],
      ['array fields', { username: ['demo'], password: ['pw'] }],
      [
        'operator objects',
        { username: { $ne: null }, password: { $ne: null } },
      ],
      [
        'nested objects',
        { username: { value: 'demo' }, password: { value: 'pw' } },
      ],
      [
        'credentials hidden under __proto__',
        JSON.parse('{"__proto__":{"username":"demo","password":"pw"}}'),
      ],
    ])('%s', (_label, body) => {
      expect(validateLoginBody(body)).toEqual({ ok: false })
    })
  })
})
